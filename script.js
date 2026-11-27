// Initialize Lucide Icons
document.addEventListener('DOMContentLoaded', () => {
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  initHeader();
  initMobileMenu();
  initCurriculumAccordion();
  initFaqAccordion();
  initScrollReveal();
  initEnrollmentForm();
  initEducationToggle();
  initTestimonialsCarousel();
  initLightbox();
  initPhoneValidation();
  initEnrollmentModal();

  // Track ViewContent with the Meta Pixel
  trackMeta('ViewContent', {
    content_name: 'Workshop WebGIS',
    content_category: 'workshop'
  });
});

// Meta Pixel events
function trackMeta(eventName, customData) {
  if (typeof window.fbq !== 'function') return;

  const method = eventName === 'lead_qualificado' ? 'trackCustom' : 'track';
  try {
    window.fbq(method, eventName, customData);
  } catch (error) {
    console.warn('Pixel tracking notice (non-fatal):', error);
  }
}

// Sticky Header behavior
function initHeader() {
  const header = document.getElementById('main-header');
  if (!header) return;

  let ticking = false;
  const handleScroll = () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        if (window.scrollY > 50) {
          header.classList.add('scrolled');
        } else {
          header.classList.remove('scrolled');
        }
        ticking = false;
      });
      ticking = true;
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  // Run once on load in case page is refreshed while scrolled
  handleScroll();
}

// Mobile navigation menu toggle
function initMobileMenu() {
  const toggleBtn = document.getElementById('mobile-menu-btn');
  const navMenu = document.getElementById('site-nav');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!toggleBtn || !navMenu) return;

  const toggleMenu = () => {
    const isOpen = navMenu.classList.toggle('open');
    const icon = toggleBtn.querySelector('i');
    
    // Update icon between menu and x
    if (icon && typeof lucide !== 'undefined') {
      if (isOpen) {
        toggleBtn.innerHTML = '<i data-lucide="x"></i>';
      } else {
        toggleBtn.innerHTML = '<i data-lucide="menu"></i>';
      }
      lucide.createIcons();
    }
  };

  toggleBtn.addEventListener('click', toggleMenu);

  // Close menu when clicking a nav link
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navMenu.classList.contains('open')) {
        toggleMenu();
      }
    });
  });
}

// Curriculum Accordion logic
function initCurriculumAccordion() {
  const items = document.querySelectorAll('.accordion-item');
  if (items.length === 0) return;

  items.forEach(item => {
    const toggle = item.querySelector('.accordion-toggle');
    const content = item.querySelector('.accordion-content');

    if (!toggle || !content) return;

    toggle.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Collapse all other curriculum items
      items.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
          const otherToggle = otherItem.querySelector('.accordion-toggle');
          const otherContent = otherItem.querySelector('.accordion-content');
          if (otherToggle) otherToggle.setAttribute('aria-expanded', 'false');
          if (otherContent) {
            otherContent.setAttribute('aria-hidden', 'true');
            otherContent.style.maxHeight = '0px';
          }
        }
      });

      if (isActive) {
        item.classList.remove('active');
        toggle.setAttribute('aria-expanded', 'false');
        content.setAttribute('aria-hidden', 'true');
        content.style.maxHeight = '0px';
      } else {
        item.classList.add('active');
        toggle.setAttribute('aria-expanded', 'true');
        content.setAttribute('aria-hidden', 'false');
        content.style.maxHeight = content.scrollHeight + 'px';
      }
    });
  });
}

// FAQ Accordion logic
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  if (faqItems.length === 0) return;

  faqItems.forEach(item => {
    const toggle = item.querySelector('.faq-toggle');
    const content = item.querySelector('.faq-content');

    if (!toggle || !content) return;

    toggle.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Collapse all other FAQ items
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
          const otherToggle = otherItem.querySelector('.faq-toggle');
          const otherContent = otherItem.querySelector('.faq-content');
          if (otherToggle) otherToggle.setAttribute('aria-expanded', 'false');
          if (otherContent) {
            otherContent.setAttribute('aria-hidden', 'true');
            otherContent.style.maxHeight = '0px';
          }
        }
      });

      if (isActive) {
        item.classList.remove('active');
        toggle.setAttribute('aria-expanded', 'false');
        content.setAttribute('aria-hidden', 'true');
        content.style.maxHeight = '0px';
      } else {
        item.classList.add('active');
        toggle.setAttribute('aria-expanded', 'true');
        content.setAttribute('aria-hidden', 'false');
        content.style.maxHeight = content.scrollHeight + 'px';
      }
    });
  });
}

// Scroll reveal animations using IntersectionObserver
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');
  if (reveals.length === 0) return;

  const observerOptions = {
    root: null, // Viewport
    rootMargin: '0px',
    threshold: 0.15 // Trigger when 15% of the element is visible
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        // Once animated, we don't need to observe it anymore
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  reveals.forEach(element => {
    observer.observe(element);
  });
}

// Enrollment form and pre-checkout questionnaire redirect
function initEnrollmentForm() {
  const forms = document.querySelectorAll('#enrollment-form, #hero-enrollment-form');
  if (forms.length === 0) return;

  const QUESTIONNAIRE_URL = 'https://tally.so/r/OQGjoA';
  const utmKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];

  forms.forEach(form => {
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const submitBtn = form.querySelector('button[type="submit"]');
      if (!submitBtn || submitBtn.disabled) return;
      const buttonLabel = submitBtn.innerHTML;
      let status = form.querySelector('[role="status"]');
      if (!status) {
        status = document.createElement('p');
        status.setAttribute('role', 'status');
        form.appendChild(status);
      }
      status.textContent = '';
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i data-lucide="loader" class="animate-spin"></i> Enviando...';
      if (typeof lucide !== 'undefined') lucide.createIcons();

      const formData = new FormData(form);
      const education = formData.get('education');
      const attribution = window.getQgisAttribution();
      const payload = {
        nome: String(formData.get('name') || '').trim(),
        email: String(formData.get('email') || '').trim(),
        telefone: String(formData.get('whatsapp') || '').replace(/\D/g, ''),
        graduacao: education,
        page_url: window.location.href,
        area: education === 'sim' ? String(formData.get('education_area') || '').trim() : '',
        ...Object.fromEntries(utmKeys.map(key => [key, typeof attribution[key] === 'string' ? attribution[key] : '']))
      };
      const questionnaire = new URL(QUESTIONNAIRE_URL);
      utmKeys.forEach(key => {
        if (payload[key]) questionnaire.searchParams.set(key, payload[key]);
      });

      try {
        const response = await fetch('/api/interesse', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const result = await response.json();
        if (!response.ok || !result.ok) {
          throw new Error(result.error || 'Não foi possível concluir o cadastro. Tente novamente.');
        }
        const metaCustomData = {
          content_name: 'Workshop QGIS do Zero ao Mapa Profissional + IA',
          content_category: 'workshop'
        };
        trackMeta('Lead', metaCustomData);
        if (education === 'sim') {
          window.dataLayer = window.dataLayer || [];
          window.dataLayer.push({ event: 'lead_qualificado' });
          trackMeta('lead_qualificado', metaCustomData);
        }
        submitBtn.textContent = 'Redirecionando...';
        window.location.href = questionnaire.toString();
      } catch (error) {
        status.textContent = error.message === 'Failed to fetch'
          ? 'Não foi possível enviar seus dados. Confira sua conexão e tente novamente.'
          : error.message;
        submitBtn.disabled = false;
        submitBtn.innerHTML = buttonLabel;
      }
    });
  });
}

// Add simple animation styles for loader and success
const customStyle = document.createElement('style');
customStyle.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  .animate-spin {
    animation: spin 1s linear infinite;
  }
  @keyframes scaleUp {
    0% { transform: scale(0.6); opacity: 0; }
    100% { transform: scale(1); opacity: 1; }
  }
`;
document.head.appendChild(customStyle);

// Toggle education area field based on degree select
function initEducationToggle() {
  const setupToggle = (selectId, groupId, inputId) => {
    const selectEl = document.getElementById(selectId);
    const groupEl = document.getElementById(groupId);
    const inputEl = document.getElementById(inputId);

    if (!selectEl || !groupEl) return;

    selectEl.addEventListener('change', () => {
      if (selectEl.value === 'sim') {
        groupEl.classList.remove('hidden');
        if (inputEl) inputEl.setAttribute('required', 'required');
      } else {
        groupEl.classList.add('hidden');
        if (inputEl) {
          inputEl.removeAttribute('required');
          inputEl.value = ''; // Clean field
        }
      }
    });
  };

  setupToggle('hero-user-education', 'hero-education-area-group', 'hero-user-education-area');
  setupToggle('user-education', 'education-area-group', 'user-education-area');
}

// Lightbox for Vibecoding screenshot
// Lightbox for enlarging images (Vibecoding screenshot, Certificate mockup, etc.)
function initLightbox() {
  const lightbox = document.getElementById('image-lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const closeBtn = document.querySelector('.lightbox-close');
  const triggers = document.querySelectorAll('.lightbox-trigger, .vibecoding-visual .vibe-card');

  if (!lightbox || !lightboxImg || triggers.length === 0) return;

  const openLightbox = (imgSrc) => {
    lightboxImg.src = imgSrc;
    lightbox.style.display = 'flex';
    // Force reflow
    lightbox.offsetHeight;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden'; // Stop page scroll
  };

  const closeLightbox = () => {
    lightbox.classList.remove('active');
    document.body.style.overflow = ''; // Restore page scroll
    setTimeout(() => {
      if (!lightbox.classList.contains('active')) {
        lightbox.style.display = 'none';
      }
    }, 300); // Match transition speed
  };

  triggers.forEach(trigger => {
    trigger.style.cursor = 'pointer';
    trigger.addEventListener('click', () => {
      const img = trigger.tagName === 'IMG' ? trigger : trigger.querySelector('img');
      if (img) {
        openLightbox(img.src);
      }
    });
  });
  
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox || e.target === closeBtn) {
      closeLightbox();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
      closeLightbox();
    }
  });
}

// Phone input validation and visual formatting: (XX) XXXXX-XXXX
function formatPhoneBR(raw) {
  const digits = raw.replace(/\D/g, '').slice(0, 11);
  if (digits.length === 0) return '';
  if (digits.length <= 2) return `(${digits}`;
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

function initPhoneValidation() {
  const phoneInputs = document.querySelectorAll('input[type="tel"]');
  
  phoneInputs.forEach(input => {
    input.addEventListener('input', (e) => {
      const cursorAtEnd = e.target.selectionStart === e.target.value.length;
      e.target.value = formatPhoneBR(e.target.value);
      if (cursorAtEnd) {
        e.target.setSelectionRange(e.target.value.length, e.target.value.length);
      }
    });

    input.addEventListener('blur', (e) => {
      e.target.value = formatPhoneBR(e.target.value);
    });
  });
}

// Enrollment Modal logic
function initEnrollmentModal() {
  const modal = document.getElementById('enrollment-modal');
  const openButtons = document.querySelectorAll('.open-modal-btn, .hero-mockup-container');
  const closeButton = modal ? modal.querySelector('.modal-close') : null;
  const overlay = modal ? modal.querySelector('.modal-overlay') : null;

  if (!modal) return;

  const openModal = () => {
    modal.style.display = 'flex';
    // Force reflow
    modal.offsetHeight;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Stop page scroll
  };

  const closeModal = () => {
    modal.classList.remove('active');
    document.body.style.overflow = ''; // Restore page scroll
    setTimeout(() => {
      if (!modal.classList.contains('active')) {
        modal.style.display = 'none';
      }
    }, 300); // Match transition duration
  };

  openButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal();
    });
  });

  if (closeButton) {
    closeButton.addEventListener('click', closeModal);
  }

  if (overlay) {
    overlay.addEventListener('click', closeModal);
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
}

// Student Testimonials Carousel logic (Infinite Transform Loop)
function initTestimonialsCarousel() {
  const container = document.getElementById('testimonials-carousel');
  const track = document.getElementById('testimonials-track');

  if (!container || !track) return;

  const originalCards = Array.from(track.children);
  const totalOriginal = originalCards.length;
  if (totalOriginal === 0) return;

  // Clona os cards originais para permitir loop infinito contínuo em ambas as direções
  originalCards.forEach((card) => {
    const clone = card.cloneNode(true);
    clone.classList.add('testimonial-clone');
    track.appendChild(clone);
  });
  [...originalCards].reverse().forEach((card) => {
    const clone = card.cloneNode(true);
    clone.classList.add('testimonial-clone');
    track.insertBefore(clone, track.firstChild);
  });

  const allCards = Array.from(track.children);

  // Re-inicializa triggers de lightbox nos clones adicionados dinamicamente
  track.querySelectorAll('.testimonial-clone.lightbox-trigger').forEach(trigger => {
    trigger.addEventListener('click', () => {
      const img = trigger.querySelector('img');
      const lightboxModal = document.getElementById('image-lightbox');
      const lightboxImg = document.getElementById('lightbox-img');
      if (img && lightboxModal && lightboxImg) {
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt || '';
        lightboxModal.style.display = 'flex';
        lightboxModal.offsetHeight;
        lightboxModal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  let currentIndex = totalOriginal; // Começa no primeiro card original
  let position = 0;
  let previousFrame = null;
  let activeIndex = -1;

  const getCardOffset = (index) => {
    const card = allCards[index];
    if (!card) return 0;
    // Posição para centralizar exatamente o card no meio do viewport do container
    const cardCenter = card.offsetLeft + (card.offsetWidth / 2);
    const containerCenter = container.clientWidth / 2;
    return -(cardCenter - containerCenter);
  };

  const updateActiveCards = (activeIdx) => {
    // Normaliza para o índice correspondente no set original (0 a totalOriginal - 1)
    const activeMod = ((activeIdx - totalOriginal) % totalOriginal + totalOriginal) % totalOriginal;
    
    // Todos os cards (originais e clones) que correspondem ao activeMod recebem is-active
    allCards.forEach((card, idx) => {
      const cardMod = ((idx - totalOriginal) % totalOriginal + totalOriginal) % totalOriginal;
      if (cardMod === activeMod) {
        card.classList.add('is-active');
      } else {
        card.classList.remove('is-active');
      }
    });
  };

  const applyPosition = (index) => {
    currentIndex = totalOriginal + ((index - totalOriginal) % totalOriginal + totalOriginal) % totalOriginal;
    position = getCardOffset(currentIndex);
    track.style.transform = `translate3d(${position}px, 0, 0)`;
    updateActiveCards(currentIndex);
  };

  // Posicionamento inicial sem animação com resize otimizado (debounce)
  let resizeTimeout;
  const initPosition = () => {
    applyPosition(currentIndex, false);
  };
  setTimeout(initPosition, 50);
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(initPosition, 100);
  }, { passive: true });

  const nextSlide = () => applyPosition(currentIndex + 1);
  const prevSlide = () => applyPosition(currentIndex - 1);


  // Suporte a swipe por toque (touch)
  let touchStartX = 0;
  let touchDeltaX = 0;
  container.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    touchDeltaX = 0;
  }, { passive: true });

  container.addEventListener('touchmove', (e) => {
    touchDeltaX = e.touches[0].clientX - touchStartX;
  }, { passive: true });

  container.addEventListener('touchend', () => {
    if (Math.abs(touchDeltaX) > 50) {
      if (touchDeltaX < 0) nextSlide();
      else prevSlide();
    }
  }, { passive: true });

  // Move at a constant speed and wrap between identical sets of cards.
  track.style.transition = 'none';
  const animate = (timestamp) => {
    const elapsed = previousFrame === null ? 0 : Math.min(timestamp - previousFrame, 50);
    previousFrame = timestamp;
    const start = getCardOffset(totalOriginal);
    const end = getCardOffset(totalOriginal * 2);
    const cycleWidth = start - end;

    if (cycleWidth > 0) {
      position -= 56 * elapsed / 1000;
      position = start - ((start - position) % cycleWidth + cycleWidth) % cycleWidth;
      track.style.transform = `translate3d(${position}px, 0, 0)`;

      const step = cycleWidth / totalOriginal;
      const nearestIndex = totalOriginal + Math.round((start - position) / step);
      if (nearestIndex !== activeIndex) {
        activeIndex = nearestIndex;
        currentIndex = nearestIndex;
        updateActiveCards(nearestIndex);
          }
    }
    requestAnimationFrame(animate);
  };
  applyPosition(totalOriginal);
  requestAnimationFrame(animate);
}
