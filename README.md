# OZ — Minecraft-style Tebex Theme

A pixel-art webstore theme for Tebex. 9 one-click presets, 4 layout formats, light/dark mode, and every text, color and section editable from the Tebex panel — no code.

## Install (5 minutes)

1. **Tebex panel → Webstore → Templates → Create template** (base it on any template).
2. **Assets** tab: upload `assets/oz.css` and `assets/oz.js`.
3. **Pages** tab: open each page below and replace its contents with the file of the same name from `templates/`:
   `layout.html`, `index.html`, `category.html`, `package.html`, `username.html`, `options.html`, `checkout.html`, `cms/page.html`, and the 8 `module.*.html` sidebar modules.
4. **Change schema**: paste the contents of `schema.json` and save.
5. Open the template **settings** and fill in at least: server IP, Discord invite, preset.
6. Activate the template.

## Make it yours

Everything is in the template settings — see [docs/SETTINGS.md](docs/SETTINGS.md).

- **Presets:** Frost, Overworld, Nether, End, Ocean, Cherry, Desert, Deep Dark, Jungle, or Custom colors
- **Formats:** category hotbar / tabs / sidebar / none · header scene / compact / minimal · square / soft / round corners · bevel / flat / outline panels · Pixel / Blocky / Tech / Clean heading font
- **Header:** text or image logo, your own banner image, ground blocks (snow, grass, sand, nether, end, cherry, sculk)
- **Store features:** copy-IP with live player count, Discord member count, announcement bar with countdown, quantity buttons, rank comparison table, package popup with image/video gallery, basket drawer, Java/Bedrock login with Geyser prefix, checkout agreement boxes, 8 styled sidebar modules
- **Player & rank preview:** logged-in players see their own Minecraft skin in the sidebar; rank pages and rank packages show the skin with the rank's nametag and a chat line (set prefixes + colors in *Rank styles*)
- **Player & rank preview:** logged-in players see their own Minecraft skin in the sidebar; the rank table and rank packages show the skin with the rank's nametag and a sample chat line (prefixes and colors set in *Rank styles*)
- **Text:** every label passes through Tebex translations (`__()`), so the store follows your language settings

### Rank table
Set **Rank table category** to your ranks category name, then write one line per perk:
```
Chat prefix | [VIP] | [VIP+] | [MVP]
Homes | 2 | 4 | 6
No chat cooldown | no | yes | yes
```
Columns follow the order of packages in that category. `yes`/`no` become ✓ / ✕.

### Category icons
`Ranks=crown, Keys=key, Coins=coin` — icons: crown, key, coin, gem, chest, pet, gift, sword, star, potion. Package images you upload in Tebex are used automatically.

## Live counts
- **Players:** uses the public mcsrvstat.us API (Minecraft only). Turn off with *Live player count → Hide*.
- **Discord:** enable *Server Settings → Widget* in Discord and paste the server ID.

## Before you go live
Test the items in [docs/VERIFY.md](docs/VERIFY.md) once on your own store.

## For developers
```bash
npm install
npm run preview   # renders every page with mock data → http://localhost:5173
npm test          # renders all templates and fails on any Twig error
npm run package   # builds dist/oz-theme-vX.zip for upload
```
Design source (Claude Design boards) lives in `design/`.
