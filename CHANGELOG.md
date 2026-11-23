# Changelog

## 1.1.0 (unreleased)
- Add-ons: page loader, transitions, sticky header, scroll reveal, card tilt/shine, fly-to-cart, confetti, particles, parallax, sounds, back-to-top
- Live 3D skin preview with chat / tab-list tabs on package and rank pages
- Search (`/`, Ctrl+K), category filter/sort/count, package badges
- Tebex.js checkout with terms gate and every state
- Sale banner with countdown, homepage image/video slider, discount pop-up, currency picker in basket
- Staff, Vote, FAQ (accordion) and Patrons pages, filled from settings via the CMS page slug
- Cleanup: shared link partial, no duplicate icon map, ~45 inline styles moved to CSS classes, consistent focus rings
- Setup page (Tebex page titled "Setup", setting `setup-page`): checklist of every key setting and an admin panel with row editors for staff, vote, FAQ, patrons, slider, rank table and header links that output paste-ready text
- Info pages are now found by page title too, so they work at Tebex's numeric `/pages/{id}` addresses
- CMS pages read `page.title` / `page.metaData` as well as root fields; footer lists custom pages; terms/privacy default to Tebex's built-in pages; login shows Tebex error messages; new quote.html
- Motion: block-wipe pixel page transition (new default), reveal styles Drop / Rise / Pop, hotbar selection + icon hop, basket items slide in, goal bars fill when seen, button press squash — all respect reduced motion
- Loading states: spinner on every form submit and basket action, pulsing live counts with online/offline marker, skeletons for slider media, videos and staff skins, dimmed basket during currency switch, offline/back-online toasts
- Rules and News pages; category/tiered.html; email templates (abandoned cart, purchase follow-up, download)
- Dev workbench at http://localhost:5173/ (`npm run preview`): every page, device sizes, live preset/mode/corner/font/reveal switches, keyboard shortcuts
- 290 pixel icons: 162 new distinct Minecraft-style designs (tool and armor tiers, ores, ingots, gems, potions, keys, crates, crowns, medals, food, blocks, mobs, world, interface) plus color variants and the 11 classic icons
- Owners pick icons per category (`category-icons`) and per package (`package-icons`, `package-icon-default`); an image URL works too. Setup page gains icon editors with live previews and a searchable icon browser; `npm run preview` adds an icon gallery at /icons.html
- Motion: icon motion setting (Hover / Idle with sparkles on rare items / Off), logo drop-in, icons spin into their slots, popup and search pixel zoom, slot glow, price nudge on hover
- "Your current rank" picker on the rank page: logged-in players pick the rank they own (Tebex can't tell the theme), saved per username on their device; the preview opens on it, shows upgrades like "VIP → MVP+", and the ladder and comparison table mark the owned and lower ranks. Buying stays unrestricted
- Hero logo: upload a hero icon or pick one from the icon set, icon-only mode, editable subtitle, Small / Medium / Large, and new animations (icon pop + letters drop in one by one, then Float, Bounce or Glow; letters jump on hover)
- Fix: the rank heading next to the preview now updates when another rank is picked
- Fix: preview renderer now ships all asset files

## 1.0.0
- Player skin card when logged in; rank preview with nametag and chat line
- First release: 9 presets, 4 layout formats, light/dark, rank table, quantity buttons, package popup, Java/Bedrock login, 8 sidebar modules.
