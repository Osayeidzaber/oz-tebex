# AGENT.md — OZ Tebex Theme

Read this first. It is the single source of context for anyone (human or AI agent) working on this repo.

## 1. Goal

Build and sell a **premium Minecraft-style Tebex webstore theme** on **BuiltByBit**.
- One base theme + optional paid **add-on packs**.
- It must look and feel hand-made, game-like and polished (motion, loading states, sound, 3D skin preview) — not generic "AI" UI.
- Everything must be **customizable from the Tebex panel with no code** (presets, layouts, every text, every feature on/off).
- Every feature must be **real**: built only on data Tebex actually exposes. No fake numbers, fake reviews or fake "X bought today".

## 2. Context & constraints

- **Platform:** Tebex "Templates" (Twig). Docs: https://docs.tebex.io/developers/templates/overview
  - Globals: `store`, `basket`, `page`. Page variables per template (see `docs/FEATURES.md`).
  - Pages: `layout.html`, `index.html`, `category.html`, `package.html`, `username.html`, `options.html`, `checkout.html`, `cms/page.html`, 8 × `module.*.html`.
  - Settings: `schema.json` (types: `select`, `colour-picker`, `image-uploader`, `file`, `slider`, `textarea`, `url`) read with `{{ config('id') }}`.
  - Assets: CSS / JS / images / `.twig` partials uploaded in the template editor, referenced with `{{ asset('name') }}` / `{% include "name.twig" %}`.
  - Checkout runs through **Tebex.js** (`https://js.tebex.io/v/1.js`, `Tebex.checkout.init({ident}) → launch()`; events `open`, `close`, `payment:complete`, `payment:error`). Ident = `basket.ident` or `GET /checkout/ident`.
  - **The Tebex legal footer must never be hidden** (only restyled with `--tebex-legal-footer-*` vars).
- **Undocumented but used** (must be verified on a live store — see `docs/VERIFY.md`): `/checkout/packages/add/{id}/single`, `/checkout/packages/remove/{id}`, `/checkout/basket`, `/login`, `/logout`, `category.subcategories`, options form field names, gift-card module form.
- **Third-party services:** mc-heads.net (skins/avatars), api.mcsrvstat.us (player count), Discord widget API (member count), skinview3d from jsDelivr (3D preview). All have graceful fallbacks.

## 3. Repo map

```
templates/          Twig pages + module.*.html + oz-preview.twig (shared partial)
assets/oz.css       Design system: tokens, 9 presets, formats, components, add-on styles, all UI states
assets/oz.js        Core: basket drawer, popup, copy IP, live counts, countdown, quantity, gallery, login prefix
assets/oz-fx.js     Add-ons: toasts, loader, transitions, sticky header, reveal, tilt/shine, fly-to-cart, confetti,
                    particles, parallax, count-up, search (/ Ctrl+K), category sort/filter, skeletons, social popups, sounds, buy bar
assets/oz-preview.js Live 3D skin preview (skinview3d) + chat / tab-list tabs + rank switcher
assets/oz-checkout.js Tebex.js checkout with every state
schema.json         All buyer settings (docs/SETTINGS.md is generated from it)
design/             Claude Design boards (source of truth for the look) — https://claude.ai/artifact/3UMYM7pwGLoYf2UDnKUrtV
docs/               FEATURES.md (feature map), SETTINGS.md (generated), VERIFY.md (live-store checklist)
tools/              render.js (twig.js test renderer with mock store), serve.js, settings-doc.js
dist/               Release zip (npm run package)
```

## 4. How it works

- `layout.html` reads every setting once, sets `data-*` attributes on `<html>` (preset, mode, corners, panels, font, header, cursor) and passes add-on switches to JS as `window.OZ.fx`.
- CSS does the heavy lifting through tokens (`--a`, `--b`, `--bg`, `--panel`, `--slot`, `--sky-*`, `--g1/--g2`, `--r`, `--font-pixel`) overridden per `data-*` attribute → one stylesheet, unlimited combinations.
- JS add-ons are independent IIFEs; each checks its own switch, respects `prefers-reduced-motion`, and fails silently to a working non-JS page.
- Every interactive feature has explicit **states**: idle · loading · empty · error/offline · disabled · success. (See §7.)

## 5. Design language (keep it)

Pixel/Minecraft UI: Pixelify Sans headings, square 3px dark outlines, sunken inventory **slots**, bevelled panels, blocky buttons with a pressable bottom edge, hotbar categories, XP-bar goals, ground-block strip under a pixel-art sky. Accent lime + lilac (Frost), 9 presets. Avoid: soft glassmorphism, generic gradients, emoji icons, rounded "SaaS" cards (unless buyer picks Round corners).

## 6. Plan / roadmap

**Done**
- Research (8 premium themes, Tebex docs, player complaints) → `design/Anatomy.dc.html`
- Full design on canvas: desktop + phone pages, 9 presets, settings board
- Base theme: all pages, 8 modules, 9 presets, 4 layout formats, light/dark, rank table, quantity buttons, popup, Java/Bedrock login, player skin card, rank preview
- Add-on system wave 1 (code written, being wired/tested): motion & effects, loaders, toasts, search, category tools, 3D preview, Tebex.js checkout

**In progress (current task)**
- [ ] Rewrite `package.html` to the big product layout using `oz-preview.twig`
- [ ] Use `oz-preview.twig` on the rank category page (with rank picker + buy button)
- [ ] Wire `oz-checkout.js` into `checkout.html` (terms gate, empty / login / blocked / success states)
- [ ] Category tools bar (filter, sort, count, filtered-empty state), package badges from settings
- [ ] Add all new settings to `schema.json` (fx-*, preview-*, search, announcement-style/dismissible, basket-goal-*, seo-*, social-popups, package-badges)
- [ ] Extend `tools/render.js` mocks + test every page & state in the browser; fix bugs
- [ ] Update README / SETTINGS / VERIFY / CHANGELOG; rebuild zip; sync designs

**Next waves**
- Wishlist (localStorage), mega menu, rank ladder + monthly/lifetime toggle (tiers guide endpoints)
- Showcase pack 🔒: gallery+lightbox, trailer, staff, vote links, news/patch notes, testimonials (content from settings)
- Marketing pack 🔒: welcome modal, exit intent, spin wheel, scratch-card coupon, seasonal recolor
- Inventory GUI pack 🔒: Minecraft chest UI for crates/kits with MC tooltips and drop chances
- BuiltByBit listing: banner, screenshots of each preset, feature list, install video, support Discord
- Live verification on a Tebex developer-plan store (free for designers; can't take real payments)

## 7. Quality bar / definition of done

- Works with JS disabled (links still add/remove/checkout via Tebex URLs).
- States covered for: add-to-basket (loading), popup (loading/error→navigate), 3D preview (loading/fallback-2D/skin-error→Steve), live counts (offline), search (no results), category (empty, filtered-empty), basket (empty), checkout (empty, terms not ticked, needs login, library blocked, open, success, payment error).
- Keyboard: focus styles, Esc closes overlays, `/` & Ctrl+K search, arrow keys on tabs; ARIA labels on icon buttons.
- Reduced motion respected everywhere; sounds off by default with mute.
- `npm test` renders every page with zero Twig errors; browser check shows no console errors.
- No hidden Tebex footer, no fake social proof, currency always shown with price.

## 8. Commands

```bash
npm install
npm test          # render all templates with mock data (fails on Twig errors)
npm run preview   # render + serve at http://localhost:5173
npm run docs      # regenerate docs/SETTINGS.md from schema.json
npm run package   # test + docs + dist/oz-theme-vX.zip
```

## 9. Working agreements

- Design first on the canvas, then code; keep `design/` synced with the canvas after every design change.
- Every new feature = setting in `schema.json` + default that looks good + graceful fallback + entry in `docs/FEATURES.md`.
- Never ship unverified Tebex URLs without listing them in `docs/VERIFY.md`.
