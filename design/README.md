# Design source

Every board from the Claude Design canvas, stored as files:
https://claude.ai/artifact/3UMYM7pwGLoYf2UDnKUrtV

- `canvas.json` — board layout and titles
- `Main.dc.html` — Home; all presets/formats are props (preset, nav, header, corners, panels, headingFont, colors, ground)
- `Theme*.dc.html` — each preset rendered from Main
- `Category`, `Ranks`, `Package`, `Login`, `Checkout`, `Page` — desktop pages
- `Mobile`, `M*.dc.html` — phone pages
- `Anatomy` — how a Tebex store works; `Settings` — buyer settings

These are Claude Design component files (they need the canvas runtime to render). The shippable theme lives in `templates/`, `assets/` and `schema.json`.
