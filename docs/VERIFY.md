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
| Skins | mc-heads.net body renders by username (Java). Bedrock / unknown names fall back to Steve | layout.html, category.html, package.html |
| Skins | mc-heads.net body render by username (Java); Bedrock or unknown names fall back to Steve | layout.html, category.html, package.html |
| Basket item image | `item.image.url` (falls back to an icon) | layout.html |

If any URL differs on your store, search the listed files and replace it — each is a plain string.
