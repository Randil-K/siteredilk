/* ============================================================
   SITE රෙඩී — INTERNATIONALISATION ENGINE
   ------------------------------------------------------------
   You should not need to edit this file to change wording or to
   add a language. Text lives in assets/js/lang/<code>.js and the
   language list lives in config.js.

   HOW THE MARKUP OPTS IN
     data-i18n="path.to.key"        → sets element.textContent
     data-i18n-html="path.to.key"   → sets element.innerHTML
                                      (for strings with <strong>)
     data-i18n-aria="path.to.key"   → sets the aria-label

   The dot-path is looked up in the active language, then falls
   back to the default language, then to the key itself — so a
   missing translation degrades to readable text, never to blank.
   ============================================================ */

(function (window, document) {
  'use strict';

  var CFG    = window.SITE_CONFIG;
  var BUNDLE = window.SITEREDI_I18N || {};

  var DEFAULT_LANG = CFG.defaultLang;
  var STORAGE_KEY  = CFG.storageKey;

  /* --------------------------------------------------------
     Storage — wrapped because private browsing, blocked
     cookies and locked-down corporate browsers all make
     localStorage throw rather than return null.
     -------------------------------------------------------- */
  function readStored() {
    try {
      var v = window.localStorage.getItem(STORAGE_KEY);
      return isSupported(v) ? v : null;
    } catch (e) { return null; }
  }

  function writeStored(lang) {
    try { window.localStorage.setItem(STORAGE_KEY, lang); }
    catch (e) { /* the site still works, the choice just won't persist */ }
  }

  function isSupported(code) {
    if (!code) return false;
    for (var i = 0; i < CFG.languages.length; i++) {
      if (CFG.languages[i].code === code) return true;
    }
    return false;
  }

  /* --------------------------------------------------------
     Lookup: "hero.h1a" → BUNDLE[lang].hero.h1a
     -------------------------------------------------------- */
  function lookup(path, lang) {
    var node = BUNDLE[lang];
    var parts = path.split('.');
    for (var i = 0; i < parts.length; i++) {
      if (node === null || typeof node !== 'object') return null;
      node = node[parts[i]];
    }
    return typeof node === 'string' ? node : null;
  }

  function t(path, lang) {
    var hit = lookup(path, lang);
    if (hit !== null) return hit;
    if (lang !== DEFAULT_LANG) {
      hit = lookup(path, DEFAULT_LANG);
      if (hit !== null) return hit;
    }
    // Last resort: show the key. Visible in development, never blank.
    return path;
  }

  /* --------------------------------------------------------
     Contact links are rebuilt on every language change so the
     pre-filled WhatsApp message arrives in the visitor's own
     language.
     -------------------------------------------------------- */
  function wireContacts(lang) {
    var wa = 'https://wa.me/' + CFG.whatsapp +
             '?text=' + encodeURIComponent(t('wa.prefill', lang));

    each('[data-cta="whatsapp"]', function (el) {
      el.setAttribute('href', wa);
      el.setAttribute('target', '_blank');
      el.setAttribute('rel', 'noopener');
    });
    each('[data-cta="call"]',  function (el) { el.setAttribute('href', 'tel:' + CFG.phone); });
    each('[data-cta="email"]', function (el) { el.setAttribute('href', 'mailto:' + CFG.email); });
  }

  function each(sel, fn) {
    var list = document.querySelectorAll(sel);
    for (var i = 0; i < list.length; i++) fn(list[i]);
  }

  /* --------------------------------------------------------
     Apply a language to the whole document.
     -------------------------------------------------------- */
  function apply(lang) {
    // Drives the per-language font stack in styles.css, and tells
    // screen readers and search engines what language this is.
    document.documentElement.setAttribute('lang', lang);

    each('[data-i18n]',      function (el) { el.textContent = t(el.getAttribute('data-i18n'), lang); });
    each('[data-i18n-html]', function (el) { el.innerHTML   = t(el.getAttribute('data-i18n-html'), lang); });
    each('[data-i18n-aria]', function (el) { el.setAttribute('aria-label', t(el.getAttribute('data-i18n-aria'), lang)); });

    document.title = t('meta.title', lang);
    wireContacts(lang);
    paintSwitcher(lang);
  }

  /* --------------------------------------------------------
     Switcher UI — built from config.languages, so adding a
     language needs no markup change.
     -------------------------------------------------------- */
  var elLang, elBtn, elMenu, elCurrent;

  function buildSwitcher() {
    elLang    = document.getElementById('lang');
    elBtn     = document.getElementById('langBtn');
    elMenu    = document.getElementById('langMenu');
    elCurrent = document.getElementById('langCurrent');
    if (!elLang) return;

    var html = '';
    for (var i = 0; i < CFG.languages.length; i++) {
      var l = CFG.languages[i];
      html += '<li role="none">' +
                '<button type="button" class="lang-opt" role="option"' +
                ' data-lang="' + l.code + '" aria-selected="false"' +
                ' lang="' + l.code + '">' +
                  '<span>' + l.native + '</span>' +
                  '<span class="tick" aria-hidden="true">&#10003;</span>' +
                '</button>' +
              '</li>';
    }
    elMenu.innerHTML = html;

    elBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      toggleMenu(!elLang.classList.contains('open'));
    });

    elMenu.addEventListener('click', function (e) {
      var btn = e.target.closest ? e.target.closest('.lang-opt') : null;
      if (!btn) return;
      setLanguage(btn.getAttribute('data-lang'), true);
      toggleMenu(false);
      elBtn.focus();
    });

    // Close on outside click and on Escape.
    document.addEventListener('click', function () { toggleMenu(false); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && elLang.classList.contains('open')) {
        toggleMenu(false);
        elBtn.focus();
      }
    });
  }

  function toggleMenu(open) {
    if (!elLang) return;
    elLang.classList.toggle('open', open);
    elBtn.setAttribute('aria-expanded', String(open));
  }

  function paintSwitcher(lang) {
    if (!elLang) return;
    for (var i = 0; i < CFG.languages.length; i++) {
      if (CFG.languages[i].code === lang) elCurrent.textContent = CFG.languages[i].native;
    }
    each('.lang-opt', function (el) {
      el.setAttribute('aria-selected', String(el.getAttribute('data-lang') === lang));
    });
  }

  /* --------------------------------------------------------
     Public: change language. `animate` cross-fades the page so
     the swap reads as a transition rather than a flicker.
     -------------------------------------------------------- */
  var current = DEFAULT_LANG;

  function setLanguage(lang, animate) {
    if (!isSupported(lang) || lang === current) {
      if (lang === current) paintSwitcher(lang);
      return;
    }
    current = lang;
    writeStored(lang);

    var reduced = window.matchMedia &&
                  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!animate || reduced) { apply(lang); return; }

    document.body.classList.add('lang-switching');
    window.setTimeout(function () {
      apply(lang);
      // Next frame, so the browser paints the new text before fading back in.
      window.requestAnimationFrame(function () {
        document.body.classList.remove('lang-switching');
      });
    }, 180);
  }

  /* --------------------------------------------------------
     Boot
     -------------------------------------------------------- */
  function init() {
    buildSwitcher();
    // A returning visitor gets their saved choice; everyone else
    // gets Sinhala, per the brief — deliberately NOT navigator.language.
    current = readStored() || DEFAULT_LANG;
    apply(current);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Exposed for debugging and for any future language links in content.
  window.SiteRediI18n = { set: setLanguage, t: t, get current() { return current; } };

})(window, document);
