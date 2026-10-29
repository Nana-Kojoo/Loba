/* ==========================================================================
   Laws of Beauty Academy – site scripts
   Every feature checks that its elements exist, so this one file is safe
   to load on every page.
   ========================================================================== */

const WHATSAPP_NUMBER = '233244545945';
const ACADEMY = { lat: 5.5975005, lng: -0.2749825 };

/* --------------------------------------------------------------------------
   Header shadow on scroll
   -------------------------------------------------------------------------- */
const header = document.getElementById('site-header');
if (header) {
  const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 10);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* --------------------------------------------------------------------------
   Mobile navigation
   -------------------------------------------------------------------------- */
const menuToggle = document.getElementById('menu-toggle');
const mobileNav = document.getElementById('mobile-nav');

if (menuToggle && mobileNav) {
  const setMenuOpen = (open) => {
    menuToggle.setAttribute('aria-expanded', open);
    menuToggle.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
    mobileNav.classList.toggle('is-open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  };

  menuToggle.addEventListener('click', () => {
    setMenuOpen(menuToggle.getAttribute('aria-expanded') !== 'true');
  });

  mobileNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => setMenuOpen(false));
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileNav.classList.contains('is-open')) {
      setMenuOpen(false);
      menuToggle.focus();
    }
  });

  // Close the menu when resizing up to the desktop layout
  window.matchMedia('(min-width: 901px)').addEventListener('change', (e) => {
    if (e.matches) setMenuOpen(false);
  });
}

/* --------------------------------------------------------------------------
   FAQ accordion
   -------------------------------------------------------------------------- */
const faqButtons = document.querySelectorAll('.faq-question');

faqButtons.forEach((btn, i) => {
  const answer = btn.nextElementSibling;
  answer.id = answer.id || `faq-answer-${i + 1}`;
  btn.setAttribute('aria-controls', answer.id);

  btn.addEventListener('click', () => {
    const willOpen = btn.getAttribute('aria-expanded') !== 'true';

    faqButtons.forEach((other) => {
      other.setAttribute('aria-expanded', 'false');
      other.nextElementSibling.style.maxHeight = '';
    });

    if (willOpen) {
      btn.setAttribute('aria-expanded', 'true');
      answer.style.maxHeight = `${answer.scrollHeight}px`;
    }
  });
});

/* --------------------------------------------------------------------------
   Category filters (courses page and gallery)
   <div data-filter-bar="target-id"> with .filter-btn[data-filter] buttons;
   the target's children carry data-category.
   -------------------------------------------------------------------------- */
document.querySelectorAll('[data-filter-bar]').forEach((bar) => {
  const target = document.getElementById(bar.dataset.filterBar);
  if (!target) return;
  const buttons = bar.querySelectorAll('.filter-btn');
  const items = target.querySelectorAll('[data-category]');

  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      buttons.forEach((b) => {
        b.classList.toggle('is-active', b === btn);
        b.setAttribute('aria-pressed', b === btn);
      });

      const filter = btn.dataset.filter;
      items.forEach((item) => {
        item.hidden = filter !== 'all' && item.dataset.category !== filter;
      });
    });
  });
});

/* --------------------------------------------------------------------------
   Gallery lightbox
   -------------------------------------------------------------------------- */
const lightbox = document.getElementById('lightbox');

if (lightbox) {
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxClose = document.getElementById('lightbox-close');
  let lastFocused = null;

  const closeLightbox = () => {
    lightbox.classList.remove('is-open');
    document.body.style.overflow = '';
    lightboxImg.removeAttribute('src');
    if (lastFocused) lastFocused.focus();
  };

  document.querySelectorAll('.masonry-item').forEach((item) => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      lastFocused = item;
      lightboxImg.src = img.src.replace(/w=\d+/, 'w=1600');
      lightboxImg.alt = img.alt;
      lightboxCaption.textContent = item.querySelector('.masonry-item__title').textContent;
      lightbox.classList.add('is-open');
      document.body.style.overflow = 'hidden';
      lightboxClose.focus();
    });
  });

  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('is-open')) closeLightbox();
  });
}

/* --------------------------------------------------------------------------
   Enquiry forms – there is no backend, so each form hands its details to
   WhatsApp. Fields with data-label become "Label: value" lines.
   -------------------------------------------------------------------------- */
document.querySelectorAll('form[data-whatsapp-form]').forEach((form) => {
  const message = form.querySelector('.form-message');

  // Preselect a course passed from a course card (apply.html?course=barbering)
  const requested = new URLSearchParams(window.location.search).get('course');
  const courseSelect = form.querySelector('select[name="course"]');
  if (requested && courseSelect && [...courseSelect.options].some((o) => o.value === requested)) {
    courseSelect.value = requested;
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const lines = [form.dataset.whatsappForm];

    form.querySelectorAll('[data-label]').forEach((field) => {
      const value = field.tagName === 'SELECT'
        ? field.options[field.selectedIndex].text
        : field.value.trim();
      if (value) lines.push(`${field.dataset.label}: ${value}`);
    });

    const text = encodeURIComponent(lines.join('\n'));
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${text}`, '_blank', 'noopener');
    if (message) message.classList.add('is-visible');
    form.reset();
  });
});

/* --------------------------------------------------------------------------
   Location finder – swap the map to a route from the visitor's position
   -------------------------------------------------------------------------- */
const locationMap = document.getElementById('location-map');
const locateBtn = document.getElementById('locate-btn');

if (locationMap && locateBtn) {
  const locateLabel = document.getElementById('locate-label');
  const locateStatus = document.getElementById('locate-status');
  const placeMapSrc = locationMap.getAttribute('src');

  const distanceKm = (a, b) => {
    const rad = (deg) => (deg * Math.PI) / 180;
    const h = Math.sin(rad(b.lat - a.lat) / 2) ** 2
      + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(rad(b.lng - a.lng) / 2) ** 2;
    return 12742 * Math.asin(Math.sqrt(h));
  };

  const resetLocator = (status = '') => {
    locateBtn.disabled = false;
    locateBtn.dataset.state = '';
    locateLabel.textContent = 'Show route from my location';
    locateStatus.textContent = status;
  };

  locateBtn.addEventListener('click', () => {
    if (locateBtn.dataset.state === 'route') {
      locationMap.src = placeMapSrc;
      resetLocator();
      return;
    }

    if (!navigator.geolocation) {
      resetLocator('Your browser cannot share your location. Use Get Directions instead.');
      return;
    }

    locateBtn.disabled = true;
    locateLabel.textContent = 'Finding you…';
    locateStatus.textContent = '';

    navigator.geolocation.getCurrentPosition((pos) => {
      const me = { lat: pos.coords.latitude, lng: pos.coords.longitude };
      locationMap.src = `https://www.google.com/maps?saddr=${me.lat},${me.lng}&daddr=${ACADEMY.lat},${ACADEMY.lng}&output=embed`;
      locateBtn.disabled = false;
      locateBtn.dataset.state = 'route';
      locateLabel.textContent = 'Show academy only';
      locateStatus.textContent = `You are about ${distanceKm(me, ACADEMY).toFixed(1)} km away. Your route is on the map.`;
    }, (err) => {
      resetLocator(err.code === err.PERMISSION_DENIED
        ? 'Location access was blocked. Allow it in your browser, or use Get Directions.'
        : 'We could not find your location. Please try again, or use Get Directions.');
    }, { enableHighAccuracy: true, timeout: 15000, maximumAge: 60000 });
  });
}

/* --------------------------------------------------------------------------
   Footer year
   -------------------------------------------------------------------------- */
const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();
