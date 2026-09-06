/* ============================================================
   SITE රෙඩී — INTERFACE BEHAVIOUR
   ------------------------------------------------------------
   Sticky navigation, mobile menu, scroll reveal, animated
   counters and the footer year. Language handling lives in
   i18n.js; contact details live in config.js.
   ============================================================ */

(function (window, document) {
  'use strict';

  /* --------------------------------------------------------
     Sticky nav shadow + mobile menu
     -------------------------------------------------------- */
  (function nav() {
    var el     = document.getElementById('nav');
    var burger = document.getElementById('burger');
    var links  = document.getElementById('navLinks');
    if (!el || !burger || !links) return;

    function onScroll() { el.classList.toggle('scrolled', window.scrollY > 8); }
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    burger.addEventListener('click', function () {
      var open = el.classList.toggle('open');
      burger.setAttribute('aria-expanded', String(open));
    });

    // Close the mobile menu after tapping a link.
    links.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        el.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
      }
    });
  })();

  /* --------------------------------------------------------
     Scroll reveal
     Falls back to "everything visible" if IntersectionObserver
     is missing, and force-reveals after 1.5s as a safety net so
     content can never stay stuck hidden.
     -------------------------------------------------------- */
  (function reveal() {
    var items = document.querySelectorAll('.reveal');
    if (!items.length) return;

    function showAll() {
      for (var i = 0; i < items.length; i++) items[i].classList.add('in');
    }

    if (!('IntersectionObserver' in window)) { showAll(); return; }

    var io = new IntersectionObserver(function (entries) {
      for (var i = 0; i < entries.length; i++) {
        if (entries[i].isIntersecting) {
          entries[i].target.classList.add('in');
          io.unobserve(entries[i].target);
        }
      }
    }, { rootMargin: '0px 0px -60px 0px', threshold: 0.08 });

    for (var i = 0; i < items.length; i++) io.observe(items[i]);
    window.setTimeout(showAll, 1500);
  })();

  /* --------------------------------------------------------
     Animated counters in the trust bar
     -------------------------------------------------------- */
  (function counters() {
    var nums = document.querySelectorAll('.count');
    if (!nums.length) return;

    var reduced = window.matchMedia &&
                  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function fill(el) { el.textContent = el.getAttribute('data-to'); }

    function run(el) {
      var target = parseInt(el.getAttribute('data-to'), 10);
      var dur = 1400;
      var start = window.performance ? performance.now() : Date.now();

      (function tick(now) {
        var p = Math.min(((now || Date.now()) - start) / dur, 1);
        var eased = 1 - Math.pow(1 - p, 3);            // ease-out cubic
        el.textContent = String(Math.round(target * eased));
        if (p < 1) window.requestAnimationFrame(tick);
      })(start);
    }

    if (reduced || !('IntersectionObserver' in window)) {
      for (var i = 0; i < nums.length; i++) fill(nums[i]);
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      for (var i = 0; i < entries.length; i++) {
        if (entries[i].isIntersecting) { run(entries[i].target); io.unobserve(entries[i].target); }
      }
    }, { threshold: 0.5 });

    for (var j = 0; j < nums.length; j++) io.observe(nums[j]);
  })();

  /* --------------------------------------------------------
     Footer year + demo badges
     -------------------------------------------------------- */
  (function chrome() {
    var yr = document.getElementById('yr');
    if (yr) yr.textContent = String(new Date().getFullYear());

    // Hide the "this is placeholder content" badges once the owner
    // has swapped in real work (set showDemoBadges:false in config.js).
    if (window.SITE_CONFIG && window.SITE_CONFIG.showDemoBadges === false) {
      var badges = document.querySelectorAll('.demo-tag');
      for (var i = 0; i < badges.length; i++) badges[i].hidden = true;
    }
  })();

})(window, document);
