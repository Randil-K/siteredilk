/* ============================================================
   SITE රෙඩී — SITE CONFIGURATION
   ------------------------------------------------------------
   ►►► EDIT THIS FILE FIRST. It is the only file you must change
       to put the site live with your own details. ◄◄◄
   ============================================================ */

window.SITE_CONFIG = {

  /* ---- Contact details -----------------------------------
     Every WhatsApp button, call button, email link and footer
     link on the site is generated from these three values.
     ---------------------------------------------------------- */
  phone:    '+94770000000',   // shown/dialled on "call" buttons
  whatsapp: '94770000000',    // country code first, NO + and NO spaces
  email:    'hello@siteredi.lk',

  /* ---- Language ------------------------------------------
     defaultLang  the language a first-time visitor sees.
     languages    the list shown in the switcher, in order.
                  `native` is how the language names ITSELF —
                  always write it in its own script.

     TO ADD A LANGUAGE:
       1. add a row here,
       2. create assets/js/lang/<code>.js,
       3. add its <script> tag in index.html,
       4. if it needs a different font, add a rule in styles.css
          under "2. PER-LANGUAGE TYPOGRAPHY".
     ---------------------------------------------------------- */
  defaultLang: 'si',
  languages: [
    { code: 'si', native: 'සිංහල'   },
    { code: 'ta', native: 'தமிழ்'    },
    { code: 'en', native: 'English' }
  ],

  /* Key used to remember the visitor's choice in their browser. */
  storageKey: 'siteredi.lang',

  /* ---- Demo content flag ---------------------------------
     The portfolio and testimonials on this site are PLACEHOLDERS.
     While this is true, both sections show a visible "demo" badge
     so nobody mistakes them for real clients. Set it to false only
     once you have replaced them with genuine work and genuine
     customer feedback.
     ---------------------------------------------------------- */
  showDemoBadges: true
};
