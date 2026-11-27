// Capture campaign parameters before third-party scripts can change the URL.
(() => {
  const keys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];
  const storageKey = 'qgis_utm';
  const retentionMs = 30 * 24 * 60 * 60 * 1000;
  let attribution = {};

  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) || '{}');
    if (saved && Date.now() - saved.saved_at < retentionMs) {
      attribution = saved.values || {};
    }
  } catch { /* Attribution still works when storage is unavailable. */ }
  try {
    const saved = JSON.parse(sessionStorage.getItem(storageKey) || '{}');
    for (const key of keys) {
      if (typeof saved?.[key] === 'string' && saved[key].trim()) {
        attribution[key] = saved[key];
      }
    }
  } catch { /* Keep the values already recovered. */ }

  window.getQgisAttribution = () => {
    const params = new URLSearchParams(window.location.search);
    for (const [name, value] of params) {
      const key = name.toLowerCase().replace(/^wkqgispratica_/, '');
      if (keys.includes(key) && value.trim()) {
        attribution[key] = value.trim().slice(0, 254);
      }
    }
    const values = Object.fromEntries(keys.map(key => [key,
      typeof attribution[key] === 'string' ? attribution[key] : ''
    ]));
    if (Object.values(values).some(Boolean)) {
      try {
        sessionStorage.setItem(storageKey, JSON.stringify(values));
      } catch { /* Values remain available in memory. */ }
      try {
        localStorage.setItem(storageKey, JSON.stringify({ values, saved_at: Date.now() }));
      } catch { /* Session storage and memory remain available. */ }
    }
    return values;
  };

  window.getQgisAttribution();
})();
