# Theme settings

All settings live in **Tebex → Webstore → Templates → your OZ template → Change schema / settings**. This file is generated from `schema.json`.

## 1. Look & feel

| Setting | ID | Type | Default | Choices |
|---|---|---|---|---|
| Color preset | `preset` | select | Frost | Frost, Overworld, Nether, End, Ocean, Cherry, Desert, Deep Dark, Jungle, Custom |
| Accent color (Custom preset only) | `color-accent` | colour-picker | #D4FF3A | — |
| Secondary color (Custom preset only) | `color-secondary` | colour-picker | #B9A6FF | — |
| Background color (Custom preset only) | `color-background` | colour-picker | #0B1020 | — |
| Light / dark mode | `color-mode` | select | Dark | Dark, Light, Player |
| Ground blocks under the header | `ground` | select | Preset | Preset, Snow, Grass, Sand, Nether, End, Cherry, Sculk, None |
| Header background image (optional, replaces the pixel sky) | `header-banner` | image-uploader | — | — |
| Header style | `header-style` | select | Scene | Scene, Compact, Minimal |
| Corners | `corners` | select | Square | Square, Soft, Round |
| Panel style | `panel-style` | select | Bevel | Bevel, Flat, Outline |
| Heading font | `heading-font` | select | Pixel | Pixel, Blocky, Tech, Clean |

## 2. Branding

| Setting | ID | Type | Default | Choices |
|---|---|---|---|---|
| Full logo image (replaces icon + text completely) | `logo-image` | image-uploader | — | — |
| Text logo / server name | `logo-text` | textarea | Frostvale | — |
| Hero icon: upload an image shown above your server name (e.g. your server icon) | `logo-icon-image` | image-uploader | — | — |
| Hero icon from the icon set (used if no icon image is uploaded): icon name like crown-gold, or an image URL | `logo-icon` | textarea | — | — |
| Show only the hero icon (hide the server name text) | `logo-icon-only` | select | Off | On, Off |
| Text under the logo (empty = hide) | `logo-subtitle` | textarea | Official store | — |
| Hero logo size | `logo-size` | select | Medium | Small, Medium, Large |
| Hero logo animation: Float (gentle bob), Bounce (letter wave), Glow (light sweep), None | `logo-animation` | select | Float | Float, Bounce, Glow, None |
| Header links — Label|URL, comma separated | `header-links` | textarea | Rules|/rules, Vote|/vote | — |
| Footer community links — Label|URL, comma separated | `footer-links` | textarea | — | — |

## 3. Server & Discord

| Setting | ID | Type | Default | Choices |
|---|---|---|---|---|
| Server IP (shown + copy button) | `server-ip` | textarea | play.example.com | — |
| Live player count (Minecraft Java/Bedrock only) | `show-player-count` | select | Show | Show, Hide |
| Discord invite link | `discord-invite` | url | — | — |
| Discord button text | `discord-label` | textarea | Join Discord | — |
| Discord server ID (for live member count — enable the server widget) | `discord-id` | textarea | — | — |
| Login editions | `editions` | select | Java + Bedrock | Java + Bedrock, Java only, Bedrock only |
| Bedrock username prefix (Geyser/Floodgate) | `bedrock-prefix` | textarea | . | — |
| Show logged-in player skin card | `player-card` | select | Show | Show, Hide |

## 4. Announcement bar

| Setting | ID | Type | Default | Choices |
|---|---|---|---|---|
| Show announcement bar | `announcement` | select | Hide | Show, Hide |
| Announcement text | `announcement-text` | textarea | Winter sale — 20% off all ranks | — |
| Announcement link (optional) | `announcement-link` | url | — | — |
| Countdown end, e.g. 2026-12-31T23:59:00Z (optional) | `announcement-end` | textarea | — | — |
| Announcement style | `announcement-style` | select | Static | Static, Marquee |
| Visitors can close the announcement | `announcement-dismissible` | select | On | On, Off |

## 5. Categories & packages

| Setting | ID | Type | Default | Choices |
|---|---|---|---|---|
| Category navigation | `category-style` | select | Hotbar | Hotbar, Tabs, Sidebar, None |
| Category icons: Category name=icon, comma separated (e.g. Ranks=crown-gold, Keys=key-diamond). Use any of 290 icon names (see the setup page Icons tab) or an image URL | `category-icons` | textarea | Ranks=crown, Keys=key, Coins=coin | — |
| Package icons (for packages without an image): Package name=icon, one per line or comma separated (e.g. MVP=crown-gold). Icon name or image URL | `package-icons` | textarea | — | — |
| Default icon for packages without an image | `package-icon-default` | textarea | chest | — |
| Icon animation: Hover (hop on hover), Idle (gentle float + sparkle on rare items), Off | `fx-icon-motion` | select | Hover | Hover, Idle, Off |
| Packages per row (desktop) | `packages-per-row` | select | 3 | 2, 3, 4 |
| Clicking a package opens | `package-click` | select | Popup | Popup, Page |
| Quantity buttons in these categories — names or IDs, comma separated, * for all | `quantity-categories` | textarea | — | — |
| Quantity choices | `quantity-options` | textarea | 1,5,10,15 | — |
| Show 3 info tiles on package pages | `package-facts` | select | Show | Show, Hide |
| Package tile 1 title | `fact-1-title` | textarea | Instant | — |
| Package tile 1 text | `fact-1-text` | textarea | Delivered in-game | — |
| Package tile 2 title | `fact-2-title` | textarea | Secure | — |
| Package tile 2 text | `fact-2-text` | textarea | Checkout by Tebex | — |
| Package tile 3 title | `fact-3-title` | textarea | Fair play | — |
| Package tile 3 text | `fact-3-text` | textarea | No pay-to-win | — |
| Note under the buy button | `package-note` | textarea | Be online in-game to receive your items. Buying for a friend? Log in with their username. | — |
| Filter & sort bar on categories (4+ packages) | `category-tools` | select | On | On, Off |
| Package badges — one per line: Package name=BADGE, BADGE (POPULAR, BEST VALUE, NEW, LIMITED, SUBSCRIPTION, GIFTABLE or your own) | `package-badges` | textarea | MVP=POPULAR<br>Mythic crate=BEST VALUE | — |

## 6. Rank comparison table

| Setting | ID | Type | Default | Choices |
|---|---|---|---|---|
| Category that shows the rank table (name or ID) | `rank-category` | textarea | — | — |
| Highlighted rank (package name) | `rank-highlight` | textarea | — | — |
| Rows — one per line: Perk | value for 1st package | 2nd | … (yes / no or any text) | `rank-table` | textarea | Chat prefix | [VIP] | [VIP+] | [MVP]<br>Homes | 2 | 4 | 6<br>No chat cooldown | no | yes | yes<br>Rank cosmetics | no | no | yes | — |
| Show rank preview (skin + nametag + chat) | `rank-preview` | select | Show | Show, Hide |
| "Your current rank" picker on the rank page (logged-in players pick the rank they own; saved on their device; ranks listed lowest to highest) | `rank-current-picker` | select | On | On, Off |
| Rank styles — one per line: Package name | chat prefix | color | `rank-styles` | textarea | VIP | [VIP] | #C9CED6<br>VIP+ | [VIP+] | #7AA2FF<br>MVP | [MVP] | #F2C94C<br>MVP+ | [MVP+] | #5BE0E6 | — |
| Example chat message in the preview | `preview-chat` | textarea | gg! just ranked up | — |
| Skin shown to logged-out visitors (Minecraft username) | `preview-skin` | textarea | MHF_Steve | — |

## 7. Homepage

| Setting | ID | Type | Default | Choices |
|---|---|---|---|---|
| Show category grid on homepage | `home-categories` | select | Show | Show, Hide |
| Category grid title | `home-categories-title` | textarea | Browse the store | — |
| Welcome title (store description is set in Tebex) | `welcome-title` | textarea | — | — |
| Show 3 info cards | `info-cards` | select | Show | Show, Hide |
| Card 1 title | `info-1-title` | textarea | Fast delivery | — |
| Card 1 text | `info-1-text` | textarea | Items arrive in-game within a few minutes. Make sure you are online. | — |
| Card 2 title | `info-2-title` | textarea | Refund policy | — |
| Card 2 text | `info-2-text` | textarea | All digital purchases are final. Chargebacks result in a permanent ban. | — |
| Card 3 title | `info-3-title` | textarea | Need help? | — |
| Card 3 text | `info-3-text` | textarea | Open a ticket on our Discord with your transaction ID. | — |

## 8. Checkout & legal

| Setting | ID | Type | Default | Choices |
|---|---|---|---|---|
| Show agreement checkboxes on checkout | `checkout-terms` | select | Show | Show, Hide |
| Terms of sale URL | `terms-url` | url | — | — |
| Refund policy URL | `refund-url` | url | — | — |
| FAQ URL | `faq-url` | url | — | — |
| Footer disclaimer | `disclaimer-game` | select | Minecraft | Minecraft, FiveM, Rust, Hytale, Custom, None |
| Custom disclaimer text | `disclaimer-text` | textarea | — | — |

## 9. Motion & effects

| Setting | ID | Type | Default | Choices |
|---|---|---|---|---|
| Page loading indicator | `fx-page-loader` | select | Bar | Bar, Screen, Off |
| Page transitions: Blocks (pixel wipe), Fade, or Off | `fx-page-transitions` | select | Blocks | Blocks, Fade, Off |
| How items appear on scroll: Drop (fall into slot), Rise, Pop | `fx-reveal-style` | select | Drop | Drop, Rise, Pop |
| Loading spinners on buttons, forms and basket actions | `fx-loading-states` | select | On | On, Off |
| Reveal sections on scroll | `fx-scroll-reveal` | select | On | On, Off |
| 3D tilt on package cards | `fx-card-tilt` | select | On | On, Off |
| Shine sweep on hover | `fx-card-shine` | select | On | On, Off |
| Item flies to basket on add | `fx-fly-to-cart` | select | On | On, Off |
| Confetti | `fx-confetti` | select | Checkout | Checkout, Add, Off |
| Header particles | `fx-particles` | select | Auto | Auto, Snow, Fireflies, Embers, Off |
| Parallax header | `fx-parallax` | select | On | On, Off |
| Compact header when scrolling | `fx-sticky-header` | select | On | On, Off |
| Back-to-top button | `fx-back-to-top` | select | On | On, Off |
| Retro click sounds (with mute button) | `fx-sounds` | select | Off | On, Off |
| Cursor | `fx-cursor` | select | Default | Default, Pixel |

## 10. Product & rank pages

| Setting | ID | Type | Default | Choices |
|---|---|---|---|---|
| Package page layout | `product-layout` | select | Big | Big, Compact |
| Live 3D skin preview (falls back to 2D) | `preview-3d` | select | On | On, Off |
| Preview animation | `preview-animation` | select | Walk | Walk, Run, Idle, None |
| Auto-rotate preview | `preview-autorotate` | select | On | On, Off |
| Preview tabs, in order (3d, chat, tab, media) | `preview-tabs` | textarea | 3d,chat,tab,media | — |
| Rank ladder above the rank table | `rank-ladder` | select | On | On, Off |
| Sticky buy bar on package pages | `sticky-buy-bar` | select | On | On, Off |

## 11. Search, basket & social

| Setting | ID | Type | Default | Choices |
|---|---|---|---|---|
| Store search (press / or Ctrl+K) | `search` | select | On | On, Off |
| Free-gift goal amount (empty = off) | `basket-goal-amount` | textarea | — | — |
| Free-gift text (:amount = amount left) | `basket-goal-text` | textarea | Spend :amount more for a free gift! | — |
| Free-gift unlocked text | `basket-goal-done` | textarea | Free gift unlocked! | — |
| Show recent real purchases as small popups | `social-popups` | select | Off | On, Off |
| Tebex checkout window theme | `checkout-theme` | select | Auto | Auto, Dark, Light, Default |
| Redirect after payment (optional URL) | `checkout-redirect` | url | — | — |

## 12. SEO & sharing

| Setting | ID | Type | Default | Choices |
|---|---|---|---|---|
| Search & share description | `seo-description` | textarea | — | — |
| Share image (1200×630) | `seo-image` | image-uploader | — | — |

## 13. Homepage extras

| Setting | ID | Type | Default | Choices |
|---|---|---|---|---|
| Sale banner on homepage | `sale` | select | Hide | Show, Hide |
| Sale badge (e.g. 50% SALE) | `sale-badge` | textarea | 50% SALE | — |
| Sale title | `sale-title` | textarea | Black Friday | — |
| Sale ends (ISO date, e.g. 2026-11-30T23:59:00Z). Countdown hides when it ends | `sale-end` | textarea | — | — |
| Sale banner link (optional) | `sale-link` | url | — | — |
| Slider: one slide per line — image or YouTube URL | title | link | `slides` | textarea | — | — |
| Slider autoplay seconds (0 = off) | `slides-autoplay` | textarea | 6 | — |
| Currency picker in basket: codes separated by commas (e.g. USD,EUR,GBP). Leave empty to hide | `currencies` | textarea | — | — |

## 14. Discount pop-up

| Setting | ID | Type | Default | Choices |
|---|---|---|---|---|
| Show discount pop-up (once per visitor) | `promo` | select | Off | On, Off |
| Pop-up title | `promo-title` | textarea | 10% off your first order | — |
| Pop-up text | `promo-text` | textarea | Use this code at checkout. | — |
| Coupon / creator code to show | `promo-code` | textarea | — | — |
| Delay before showing (seconds) | `promo-delay` | textarea | 4 | — |
| Button text | `promo-button` | textarea | Start shopping | — |

## 15. Info pages (Staff, Vote, FAQ, Patrons, Rules, News)

| Setting | ID | Type | Default | Choices |
|---|---|---|---|---|
| Staff: one per line — Name | Role | Minecraft name | `staff-list` | textarea | — | — |
| Vote sites: one per line — Site name | URL | `vote-list` | textarea | — | — |
| FAQ: one per line — Question | Answer | `faq-list` | textarea | — | — |
| Patrons: one per line — Minecraft name | Tier | `patrons-list` | textarea | — | — |
| Text under the patrons list | `patrons-note` | textarea | Thank you for keeping the server running. | — |
| Rules: one per line — Section | Rule (lines with the same section are grouped) | `rules-list` | textarea | — | — |
| News: one per line — Date | Title | Text | Image URL (optional) | `news-list` | textarea | — | — |
| URL slug of your Staff page | `page-slug-staff` | textarea | staff | — |
| URL slug of your Vote page | `page-slug-vote` | textarea | vote | — |
| URL slug of your FAQ page | `page-slug-faq` | textarea | faq | — |
| URL slug of your Patrons page | `page-slug-patrons` | textarea | patrons | — |
| URL slug or title of your Rules page | `page-slug-rules` | textarea | rules | — |
| URL slug or title of your News page | `page-slug-news` | textarea | news | — |
| Setup page (checklist + admin editors on your Tebex page titled "Setup"). Turn Off before launch: it is public | `setup-page` | select | Off | On, Off |
| URL slug or title of your Setup page | `page-slug-setup` | textarea | setup | — |
