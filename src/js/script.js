(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', init);

  function init() {
    initHeaderScroll();
    initFooterYear();
    initRevealAnimations();
    initTrustCounters();
    initFaqAccordion();
    initMobileNavActive();
    initAbrirConta();
  }

  function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function initHeaderScroll() {
    const header = document.getElementById('siteHeader');
    if (!header) return;

    const updateShadow = () => {
      header.classList.toggle('is-scrolled', window.scrollY > 8);
    };

    updateShadow();
    window.addEventListener('scroll', updateShadow, { passive: true });
  }

  function initFooterYear() {
    const el = document.getElementById('anoAtual');
    if (el) el.textContent = new Date().getFullYear();
  }

  function initRevealAnimations() {
    const items = document.querySelectorAll('.reveal');
    if (!items.length) return;

    if (prefersReducedMotion() || !('IntersectionObserver' in window)) {
      items.forEach((el) => el.classList.add('is-visible'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );

    items.forEach((el) => observer.observe(el));
  }

  function initTrustCounters() {
    const counters = document.querySelectorAll('.trust-number[data-count-to]');
    if (!counters.length) return;

    const renderValue = (el, value, decimals, suffix) => {
      el.textContent =
        value.toLocaleString('pt-BR', {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals
        }) + suffix;
    };

    const animateCounter = (el) => {
      const target = parseFloat(el.dataset.countTo);
      const decimals = parseInt(el.dataset.decimals || '0', 10);
      const suffix = el.dataset.suffix || '';

      if (Number.isNaN(target)) return;

      if (prefersReducedMotion()) {
        renderValue(el, target, decimals, suffix);
        return;
      }

      const duration = 1400;
      const start = performance.now();
      const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

      const step = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const current = target * easeOutCubic(progress);
        renderValue(el, current, decimals, suffix);
        if (progress < 1) requestAnimationFrame(step);
      };

      requestAnimationFrame(step);
    };

    if (!('IntersectionObserver' in window)) {
      counters.forEach(animateCounter);
      return;
    }

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 }
    );

    counters.forEach((el) => observer.observe(el));
  }

  function initFaqAccordion() {
    const questions = document.querySelectorAll('.faq-question');
    if (!questions.length) return;

    const closeItem = (button) => {
      button.setAttribute('aria-expanded', 'false');
      const answer = button.closest('.faq-item')?.querySelector('.faq-answer');
      if (answer) answer.style.maxHeight = '';
    };

    const openItem = (button) => {
      button.setAttribute('aria-expanded', 'true');
      const answer = button.closest('.faq-item')?.querySelector('.faq-answer');
      if (answer) answer.style.maxHeight = `${answer.scrollHeight}px`;
    };

    questions.forEach((button) => {
      button.addEventListener('click', () => {
        const isOpen = button.getAttribute('aria-expanded') === 'true';

        questions.forEach((other) => {
          if (other !== button) closeItem(other);
        });

        isOpen ? closeItem(button) : openItem(button);
      });
    });

    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        const openButton = document.querySelector('.faq-question[aria-expanded="true"]');
        if (openButton) openItem(openButton);
      }, 150);
    });
  }

  function initMobileNavActive() {
    const links = Array.from(document.querySelectorAll('.nav-mobile a[data-target]'));
    if (!links.length) return;

    const sections = links
      .map((link) => document.getElementById(link.dataset.target))
      .filter(Boolean);
    if (!sections.length) return;

    const setActive = (id) => {
      links.forEach((link) => {
        link.classList.toggle('is-active', link.dataset.target === id);
      });
    };

    if (!('IntersectionObserver' in window)) {
      setActive(sections[0].id);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: '-40% 0px -50% 0px', threshold: 0 }
    );

    sections.forEach((section) => observer.observe(section));
  }

  function initAbrirConta() {
    const btnAbrirConta = document.getElementById('btnAbrirConta');
    const btnHeroAbrirConta = document.getElementById('btnHeroAbrirConta');

    const irParaProdutos = (event) => {
      event.preventDefault();
      document.getElementById('produtos')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    btnAbrirConta?.addEventListener('click', irParaProdutos);
    btnHeroAbrirConta?.addEventListener('click', irParaProdutos);
  }
})();