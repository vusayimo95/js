/* Monson Savings Bank – main.js */
(function () {
  'use strict';

  /* ─── Navigation ─────────────────────────────────────── */
  function initNav() {
    function isDesktopNav() {
      return window.matchMedia('(min-width: 768px)').matches;
    }

    function setExpanded(btn, open) {
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      var icon = btn.querySelector('svg');
      if (icon) {
        icon.style.transform = open ? 'rotate(180deg)' : 'rotate(0deg)';
      }
    }

    var mobileBtn = document.getElementById('mobile-menu-btn');
    var mobileMenu = document.getElementById('mobile-menu');
    var mobileIcon = document.getElementById('mobile-menu-icon');
    var navbar = document.querySelector('nav[data-section="navbar"]');
    var navCard = navbar ? navbar.firstElementChild : null;
    var navLinks = navbar ? navbar.querySelector('.hidden.md\\:flex') : null;

    if (navCard) {
      navCard.style.overflow = 'visible';
    }

    if ((!mobileBtn || !mobileMenu) && navLinks && navLinks.parentElement) {
      if (!navLinks.id) navLinks.id = 'mobile-menu';
      mobileMenu = navLinks;

      if (!mobileBtn) {
        mobileBtn = document.createElement('button');
        mobileBtn.id = 'mobile-menu-btn';
        mobileBtn.type = 'button';
        mobileBtn.setAttribute('aria-label', 'Toggle navigation menu');
        mobileBtn.setAttribute('aria-expanded', 'false');
        mobileBtn.className =
          'md:hidden flex items-center justify-center shrink-0 size-9 rounded cursor-pointer primary-button';
        mobileBtn.innerHTML =
          '<svg id="mobile-menu-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary-cta-text" aria-hidden="true" style="transition:transform 0.3s"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>';
        navLinks.parentElement.appendChild(mobileBtn);
      }

      mobileIcon = document.getElementById('mobile-menu-icon');
    }

    if (mobileBtn && mobileMenu) {
      mobileBtn.addEventListener('click', function () {
        var open = mobileMenu.classList.toggle('hidden') === false;
        mobileBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
        mobileMenu.classList.toggle('flex-col', open);
        mobileMenu.classList.toggle('items-stretch', open);
        mobileMenu.classList.toggle('w-full', open);
        mobileMenu.classList.toggle('pt-2', open);
        if (!open) closeAllDropdowns();
        if (mobileIcon) {
          mobileIcon.style.transform = open ? 'rotate(45deg)' : 'rotate(0deg)';
        }
      });
    }

    // Desktop dropdown menus
    var dropdownToggles = document.querySelectorAll('[data-dropdown-toggle]');
    dropdownToggles.forEach(function (btn) {
      var id = btn.getAttribute('data-dropdown-toggle');
      var menu = document.getElementById(id);
      if (!menu) return;

      // Toggle on click (accessible)
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        var isOpen = !menu.classList.contains('hidden');
        closeAllDropdowns();
        if (!isOpen) {
          menu.classList.remove('hidden');
          setExpanded(btn, true);
        }
      });

      // Open on hover for desktop
      var parent = btn.parentElement;
      parent.addEventListener('mouseenter', function () {
        if (!isDesktopNav()) return;
        closeAllDropdowns();
        menu.classList.remove('hidden');
        setExpanded(btn, true);
      });
      parent.addEventListener('mouseleave', function () {
        if (!isDesktopNav()) return;
        menu.classList.add('hidden');
        setExpanded(btn, false);
      });
    });

    // Close dropdowns when clicking outside
    document.addEventListener('click', closeAllDropdowns);

    // Mobile accordion sub-menus
    var mobileAccordionBtns = document.querySelectorAll('[data-mobile-accordion]');
    mobileAccordionBtns.forEach(function (btn) {
      var id = btn.getAttribute('data-mobile-accordion');
      var panel = document.getElementById(id);
      if (!panel) return;
      btn.addEventListener('click', function () {
        var open = panel.classList.toggle('hidden') === false;
        var icon = btn.querySelector('[data-accordion-icon]');
        if (icon) {
          icon.style.transform = open ? 'rotate(180deg)' : 'rotate(0deg)';
        }
      });
    });

    function syncDropdownLayout() {
      var desktop = isDesktopNav();
      dropdownToggles.forEach(function (btn) {
        var id = btn.getAttribute('data-dropdown-toggle');
        var menu = document.getElementById(id);
        if (!menu) return;
        var parent = btn.parentElement;

        if (desktop) {
          if (parent) parent.style.width = '';
          btn.style.width = '';
          btn.style.justifyContent = '';
          menu.style.position = '';
          menu.style.marginTop = '';
          menu.style.width = '';
        } else {
          if (parent) parent.style.width = '100%';
          btn.style.width = '100%';
          btn.style.justifyContent = 'space-between';
          menu.style.position = 'static';
          menu.style.marginTop = '0.25rem';
          menu.style.width = '100%';
        }
      });
    }

    function syncMobileNavState() {
      if (!mobileMenu || !mobileBtn) return;
      if (isDesktopNav()) {
        closeAllDropdowns();
        mobileMenu.classList.add('hidden');
        mobileMenu.classList.remove('flex-col', 'items-stretch', 'w-full', 'pt-2');
        mobileBtn.setAttribute('aria-expanded', 'false');
        if (mobileIcon) mobileIcon.style.transform = 'rotate(0deg)';
      }
      syncDropdownLayout();
    }

    syncMobileNavState();
    window.addEventListener('resize', syncMobileNavState);
  }

  function closeAllDropdowns() {
    document.querySelectorAll('[data-dropdown-menu]').forEach(function (menu) {
      menu.classList.add('hidden');
    });
    document.querySelectorAll('[data-dropdown-toggle]').forEach(function (btn) {
      btn.setAttribute('aria-expanded', 'false');
      var icon = btn.querySelector('svg');
      if (icon) icon.style.transform = 'rotate(0deg)';
    });
  }

  /* ─── Scroll-reveal (lightweight fade-in on scroll) ──── */
  function initScrollReveal() {
    if (!('IntersectionObserver' in window)) return;
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'none';
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    document.querySelectorAll('[data-reveal]').forEach(function (el) {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      observer.observe(el);
    });
  }

  /* ─── Smooth scroll for anchor links ────────────────── */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        var hash = a.getAttribute('href');
        if (hash === '#') return;
        var target = document.querySelector(hash);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          // close mobile menu if open
          var mobileMenu = document.getElementById('mobile-menu');
          if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
            mobileMenu.classList.add('hidden');
          }
        }
      });
    });
  }

  /* ─── Active nav link highlight ─────────────────────── */
  function initActiveLink() {
    var path = window.location.pathname.replace(/\/$/, '') || '/';
    document.querySelectorAll('[data-nav-link]').forEach(function (a) {
      var href = a.getAttribute('href').replace(/\/$/, '') || '/';
      if (path === href || (href !== '/' && path.startsWith(href))) {
        a.classList.add('opacity-100');
        a.classList.remove('opacity-60');
      }
    });
  }

  /* ─── FAQ accordion ─────────────────────────────────── */
  function initFaq() {
    document.querySelectorAll('[data-faq-question]').forEach(function (btn, index) {
      var answer = btn.nextElementSibling;
      if (!answer) return;

      if (!answer.id) answer.id = 'faq-answer-' + index;
      btn.setAttribute('aria-controls', answer.id);
      btn.setAttribute('aria-expanded', 'false');
      answer.setAttribute('hidden', '');
      answer.classList.add('hidden');

      btn.addEventListener('click', function () {
        var open = btn.getAttribute('aria-expanded') !== 'true';

        document.querySelectorAll('[data-faq-question]').forEach(function (otherBtn) {
          var otherAnswer = otherBtn.nextElementSibling;
          if (!otherAnswer) return;
          otherBtn.setAttribute('aria-expanded', 'false');
          otherAnswer.setAttribute('hidden', '');
          otherAnswer.classList.add('hidden');
          var otherIcon = otherBtn.querySelector('[data-faq-icon]');
          if (otherIcon) otherIcon.style.transform = 'rotate(0deg)';
        });

        if (open) {
          answer.removeAttribute('hidden');
          answer.classList.remove('hidden');
        } else {
          answer.setAttribute('hidden', '');
          answer.classList.add('hidden');
        }

        btn.setAttribute('aria-expanded', open ? 'true' : 'false');
        var icon = btn.querySelector('[data-faq-icon]');
        if (icon) icon.style.transform = open ? 'rotate(45deg)' : 'rotate(0deg)';
      });
    });
  }

  /* ─── Init ───────────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', function () {
    initNav();
    initScrollReveal();
    initSmoothScroll();
    initActiveLink();
    initFaq();
  });
})();
