# Feature map & add-on plan

Every feature is an **add-on**: a self-contained JS/CSS module switched on, off and tuned from the template settings (`schema.json`). Nothing is hard-coded per store.

Legend: ✅ built · 🟡 next wave · 🔒 paid add-on candidate · ⛔ not possible with Tebex template data (would require fake numbers or undocumented data — we don't ship fake social proof)

Source of truth for what Tebex exposes: https://docs.tebex.io/developers/templates/overview (globals `store`, `basket`, `page`; per-page variables; 8 sidebar modules; `config()`; Tebex.js checkout). The Tebex legal footer must stay visible — style it only with its `--tebex-legal-footer-*` CSS variables.

## Header & nav
| Feature | Status | Setting |
|---|---|---|
| Sticky header (compact bar on scroll) | ✅ | `fx-sticky-header` |
| Logo hover animation | ✅ | always (respects reduced motion) |
| Copy-IP button + toast | ✅ | `server-ip` |
| Live player count / Discord count | ✅ | `show-player-count`, `discord-id` |
| Basket badge + bounce on add | ✅ | `fx-fly-to-cart` |
| Skin-head login chip, logout / switch | ✅ | — |
| Announcement bar: dismissible, marquee | ✅ | `announcement-*` |
| Search with instant results + `/` / Ctrl+K | ✅ (categories + packages on page) | `search` |
| Breadcrumbs | ✅ | — |
| Mobile bottom bar | ✅ | — |
| Theme toggle | ✅ | `color-mode = Player` |
| Page load progress bar | ✅ | `fx-page-loader` |
| Mega menu, dropdown subcategories | 🟡 (dropdowns ✅) | |
| Server / currency / language switcher | ⛔ no store list exposed to templates | |

## Homepage
| Hero, parallax, particles (snow/fireflies/embers) | ✅ | `fx-particles` |
| Animated title | ✅ | |
| Category tiles, goal bar, top donator | ✅ | |
| Server stats counters (count-up) | ✅ count-up on any `[data-oz-count]` | |
| Video background, trailer, gallery+lightbox, testimonials, staff, vote, news | 🟡 🔒 (content from settings) | |
| Best sellers / new arrivals rows | ⛔ index.html has no package list (use Featured module) | |

## Category & cards
| Grid/list (Tebex `displayType`) | ✅ | |
| Sort + price filter + search filter (client-side) | ✅ | `category-tools` |
| Skeleton loaders | ✅ images + popup | |
| Hover lift, 3D tilt, shine sweep | ✅ | `fx-card-tilt`, `fx-card-shine` |
| Discount badge, sale strike | ✅ | |
| Custom badges (POPULAR, NEW, LIMITED, GIFTABLE…) | ✅ | `package-badges` (Name=BADGE) |
| Fly-to-cart animation | ✅ | `fx-fly-to-cart` |
| In-basket state | ✅ | |
| Wishlist heart (localStorage) | 🟡 | |
| Owned state, stock left, "X bought today" | ⛔ not exposed / would be fake | |

## Package & rank pages
| Big product layout | ✅ | `product-layout` |
| Live 3D skin preview (drag/rotate, walk/idle/run) with rank nametag | ✅ skinview3d | `preview-3d`, `preview-animation` |
| Chat / nametag / tab-list preview tabs | ✅ | `rank-styles`, `preview-tabs` |
| Gallery + YouTube | ✅ | |
| Sticky buy bar | ✅ | `sticky-buy-bar` |
| Delivery info box | ✅ | `fact-*` |
| Rank ladder visual | ✅ | `rank-ladder` |
| Inventory GUI grid with MC tooltips | 🟡 🔒 | |
| Sub vs one-time toggle | 🟡 needs tier guide endpoints | |
| Related / frequently bought together | ⛔ package page has no siblings list | |

## Basket & checkout
| Slide-out drawer, full basket page | ✅ | |
| Tebex.js checkout popup (themed colors) | ✅ | `checkout-theme` |
| Terms checkboxes gate checkout | ✅ | `checkout-terms` |
| Confetti on payment complete | ✅ | `fx-confetti` |
| Free-gift progress bar | ✅ | `basket-goal-amount` |
| Coupon / gift card / creator code inputs | ⛔ in template (Tebex checkout handles them) | |

## Social proof & marketing
| Live purchase popups (from real Recent Payments module) | ✅ | `social-popups` |
| Snow / seasonal effects | ✅ | `fx-particles`, `fx-season` |
| Flash sale banner + countdown | ✅ (announcement) | |
| Exit-intent / welcome modal, spin wheel, scratch card | 🟡 🔒 | |
| Reviews, testimonials | 🟡 content from settings only | |

## Design / FX / tech
| Scroll reveal, page transitions, loading screen | ✅ | `fx-*` |
| Toast system (incl. Tebex `page.message`) | ✅ | |
| Click / hover sounds with mute | ✅ (off by default) | `fx-sounds` |
| Pixel cursor | ✅ | `fx-cursor` |
| Themed scrollbar, focus styles, ARIA, reduced motion | ✅ | |
| Lazy images, cached API calls (sessionStorage) | ✅ | |
| OG / SEO meta | ✅ | `seo-*` |
| Custom 404 / maintenance | ⛔ no such template pages | |

## Selling it
- **Base theme**: everything ✅ above.
- **Add-on packs (🔒)** ship as extra `.twig` assets + a CSS/JS file and a schema section, so buyers drop them in: *Showcase pack* (gallery, trailer, staff, vote, news), *Marketing pack* (welcome modal, spin wheel, scratch card, exit intent), *Inventory GUI pack* (Minecraft chest UI for crates/kits with tooltips).
