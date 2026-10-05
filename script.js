
const COUNTER_ID = 'YOUR_METRICA_COUNTER_ID';
// Analytics event names used by HTML data-event attributes:
// phone_click
// estimate_cta_click
// repair_estimate_submit
// location_click
// Replace YOUR_METRICA_COUNTER_ID with the real Yandex Metrica counter ID before measurement.
// If GA4 is added, replace the placeholder Measurement ID in the gtag setup you insert in <head>.

document.addEventListener('DOMContentLoaded', () => {
  const navToggle = document.querySelector('[data-nav-toggle]');
  const navMenu = document.querySelector('[data-nav-menu]');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const expanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!expanded));
      navMenu.classList.toggle('is-open', !expanded);
    });

    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navToggle.setAttribute('aria-expanded', 'false');
        navMenu.classList.remove('is-open');
      });
    });
  }

  document.querySelectorAll('a[href="#estimate-form"]').forEach(link => {
    link.addEventListener('click', () => {
      const form = document.querySelector('#estimate-form');
      if (form) {
        setTimeout(() => form.querySelector('input,select,textarea')?.focus(), 350);
      }
    });
  });

  function trackEvent(name, gaName = name) {
    if (typeof ym === 'function') {
      ym(COUNTER_ID, 'reachGoal', name);
    }
    if (typeof gtag === 'function') {
      gtag('event', gaName);
    }
  }

  document.querySelectorAll('[data-event]').forEach(element => {
    element.addEventListener('click', () => {
      const eventName = element.dataset.event;
      if (eventName) trackEvent(eventName);
    });
  });

  const form = document.querySelector('#estimate-form');
  const errorSummary = document.querySelector('#form-error-summary');

  if (form) {
    form.addEventListener('submit', event => {
      event.preventDefault();

      const requiredFields = [...form.querySelectorAll('[required]')];
      const invalid = requiredFields.filter(field => !field.checkValidity());
      const privacy = form.querySelector('#privacy-consent');

      if (privacy && !privacy.checked) invalid.push(privacy);

      if (invalid.length) {
        if (errorSummary) {
          errorSummary.textContent = 'Please complete all required fields and accept the Privacy Policy before submitting.';
          errorSummary.style.display = 'block';
        }
        invalid[0].focus();
        return;
      }

      if (errorSummary) errorSummary.style.display = 'none';
      trackEvent('repair_estimate_submit');
      window.location.href = 'thank-you.html';
    });
  }

  const range = document.querySelector('#before-after-range');
  const afterLayer = document.querySelector('.compare-after');
  if (range && afterLayer) {
    const updateCompare = () => {
      afterLayer.style.width = `${range.value}%`;
    };
    range.addEventListener('input', updateCompare);
    updateCompare();
  }

  // Optional keyboard-friendly closing of the mobile menu with Escape.
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && navToggle && navMenu?.classList.contains('is-open')) {
      navToggle.setAttribute('aria-expanded', 'false');
      navMenu.classList.remove('is-open');
      navToggle.focus();
    }
  });
});
