# Site රෙඩී — Demo Website

A trilingual (Sinhala / Tamil / English) landing page for a Sri Lankan web
design agency. Plain HTML, CSS and JavaScript — no build step, no framework,
no server required.

---

## Quick start

Open `index.html` in any browser. That's it — it works straight from disk.

To put it online, upload the whole folder to any host (Netlify, Vercel,
cPanel, GitHub Pages). There is nothing to compile.

---

## Go live in 4 edits

Everything you must change to launch is in **`assets/js/config.js`**:

```js
phone:    '+94770000000',   // your phone number
whatsapp: '94770000000',    // country code first, no + and no spaces
email:    'hello@siteredi.lk',
```

Those three values generate every WhatsApp button, call button, email link
and footer link on the page. Change them once.

The fourth edit is `showDemoBadges` — see **Placeholder content** below.

---

## Folder structure

```
siteredi/
├── index.html                  the page — structure only, no text
├── README.md                   this file
└── assets/
    ├── css/
    │   └── styles.css          all styling, sectioned and commented
    └── js/
        ├── config.js           ►  contact details + language list
        ├── i18n.js             the language engine (rarely edited)
        ├── main.js             nav, scroll reveal, counters
        └── lang/
            ├── si.js           ►  every Sinhala string
            ├── ta.js           ►  every Tamil string
            └── en.js           ►  every English string
```

Files marked ► are the ones you will actually edit.

---

## How the language system works

No text is written into `index.html`. Every visible string sits in a language
file and is pulled in by a key:

```html
<h2 data-i18n="why.h2"></h2>
```

```js
why: { h2: 'ඔබේ ව්‍යාපාරයට Website එකක් අවශ්‍ය ඇයි?' }
```

Three attributes are available:

| Attribute | Sets | Use for |
|---|---|---|
| `data-i18n` | `textContent` | ordinary text |
| `data-i18n-html` | `innerHTML` | strings containing `<strong>` |
| `data-i18n-aria` | `aria-label` | icon buttons, screen-reader labels |

**Behaviour**

- First visit → Sinhala, always. Not the browser's language — this is
  deliberate, because the audience is Sri Lankan and the default should be
  predictable.
- The choice is saved to `localStorage` and restored on the next visit.
- Switching does not reload the page; the content cross-fades.
- The `<html lang>` attribute changes with the language, which drives the
  font stack and tells screen readers and search engines what they're reading.
- A missing key falls back to Sinhala, then to the key name. A half-finished
  translation still renders a complete, working page.

### To change wording

Edit the relevant language file. Nothing else.

### To add a language (example: Malayalam, `ml`)

1. Copy `assets/js/lang/en.js` → `ml.js`, translate the values, and change
   the last line to `window.SITEREDI_I18N['ml'] = {...}`.
2. Add a row in `config.js`:
   ```js
   { code: 'ml', native: 'മലയാളം' }
   ```
   Write `native` in the language's own script — that is how it appears in
   the switcher.
3. Add one line in `index.html` beside the other language scripts:
   ```html
   <script src="assets/js/lang/ml.js"></script>
   ```
4. If it needs a different font, add a block in `styles.css` under
   *"2. PER-LANGUAGE TYPOGRAPHY"*.

The switcher menu builds itself from `config.js`, so there is no menu markup
to update.

---

## Placeholder content — read before launching

Three things on this site are **invented** and must be replaced:

1. **Portfolio projects** (section 06) — Sarukema, Nimal Hardware, Sithum
   Villa and the rest are not real clients.
2. **Testimonials** (section 08) — the three customers and their quotes are
   made up.
3. **Trust bar figures** — "50+ projects", "98% satisfaction".

While the first two are placeholders, both sections display a visible
**නියැදි / மாதிரி / Demo** badge so no visitor mistakes them for real
clients. Once you have swapped in genuine work and genuine feedback, hide
the badges:

```js
showDemoBadges: false   // in config.js
```

Real reviews convert better than invented ones, and the honest version is
the one that survives a client asking to call a reference.

---

## Design notes

**Colour.** Navy and gold carry the site; Redi Orange is reserved for
actions — every button that starts something is orange, nothing else is.
That keeps the call to action findable on a long page. Tokens are at the top
of `styles.css`.

**Typography.** Noto Sans Sinhala and Noto Sans Tamil for the two local
scripts, Manrope for Latin, Baloo 2 for the logo. Sinhala and Tamil glyphs
carry more vertical detail than Latin, so headings use looser line-height in
those languages and tighten automatically for English — see `--h1-leading`.

**Layout and text length.** The same sentence is a different length in each
language. Buttons wrap instead of clipping, cards stretch to the tallest in
their row, and the floating stat chips are capped in width and pulled clear
of the phone mockup, because a chip sized for Sinhala covered the mockup in
Tamil.

**Motion.** Scroll-reveal starts *visible* and is only hidden once JavaScript
confirms it is running, with a 1.5-second failsafe that forces everything
visible. A site selling trust to non-technical people must never show blank
sections if a script fails on a slow connection. All motion respects
`prefers-reduced-motion`.

**No full-screen loader.** A thin bar sweeps across the top instead. A
full-screen loader is the first thing a link preview captures, which would
make the site look like a blank spinner everywhere it gets shared.

**Accessibility.** Keyboard-navigable switcher with `Escape` to close, visible
focus rings, `aria-selected` on the active language, real `<details>` elements
for the FAQ so it works without JavaScript.

---

## Still to add

- **A pricing section.** The hero's "View packages" button currently jumps to
  Services because no pricing section exists yet. Fixed, visible pricing is
  one of the strongest trust signals for this audience — the fear is usually
  hidden costs rather than the price itself.
- **A contact form.** All calls to action currently go to WhatsApp, phone or
  email. A form needs a backend or a service like Formspree.
- **Real images.** Every visual is drawn in CSS and SVG, so the site has no
  image dependencies at all. Photographs of real work will do more for
  conversion than any amount of styling.

---

## Browser support

Current Chrome, Firefox, Safari and Edge, mobile and desktop. Degrades
sensibly on older browsers: no `IntersectionObserver` means content simply
appears without animating, and a blocked `localStorage` means the language
choice is not remembered but everything else still works.
