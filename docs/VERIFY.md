# Verify on a live store

Tebex's public docs confirm the template variables, settings and modules used by this theme. These store URLs follow Tebex's default template behaviour but are **not** in the public docs, so check each one on a test store before release:

| Feature | URL / field used | File |
|---|---|---|
| Add to basket | `/checkout/packages/add/{id}/single` | category.html, package.html, module.featuredpackage.html |
| Remove from basket | `/checkout/packages/remove/{id}` | layout.html, category.html, package.html, checkout.html |
| Checkout page | `/checkout/basket` | layout.html |
| Log in / log out | `/login`, `/logout` | layout.html |
| Category / package pages | `/category/{id}`, `/package/{id}` | everywhere |
| Quantity buttons | calls the add URL N times, then reloads | assets/oz.js |
| Options form | fields `price`, `variables[{id}]`, posted to the same URL | options.html |
| Gift card module | form posts `card` to the same URL | module.giftcardbalance.html |
| Subcategories | `category.subcategories` | layout.html |
| Skins | mc-heads.net body render by username (Java); Bedrock or unknown names fall back to Steve | layout.html, category.html, package.html |
| Currency switch | `/currency/{CODE}?redirect={path}` (picker only shows when `currencies` is set) | assets/oz-extras.js |
| CMS page slug | last part of `path()` on a CMS page picks the Staff / Vote / FAQ / Patrons layout | cms/page.html |
| Custom pages list | `store.pages` (id, name, slug) linked as `/pages/{id}` | layout.html |
| CMS page fields | root `title` / `metaData.content` **or** `page.title` / `page.metaData.content` (both handled) | cms/page.html |
| Policy pages | `/terms/checkout`, `/terms/privacy` used when terms/refund URLs are empty | layout.html, checkout.html |
| Login error | `store.userMessage` | username.html |
| Quote page | `quote.html` receives `content` | quote.html |
| Settings syntax | theme reads settings as `config('id')`; some newer Tebex themes use `config.id` — confirm which your store uses | all templates |
| Tiered category | `category/tiered.html` receives `category` and `content` | category/tiered.html |
| Email templates | `email/*.html` extend `email/layout.html`; body read from `content` if Tebex provides it | email/ |
| Basket item image | `item.image.url` (falls back to an icon) | layout.html |

If any URL differs on your store, search the listed files and replace it — each is a plain string.
