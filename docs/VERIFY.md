# Tebex compatibility

`npm test` runs `tools/tebex-lint.js` first. It fails the build if any template uses a Twig tag, filter or function that Tebex's sandbox does not list, or a store URL known to be wrong.

## Twig sandbox (enforced by `npm run lint`)

Tebex runs Twig "in a sandboxed and safe environment" and lists what is available:

- **Filters:** `escape`, `length`, `raw`, `money`, `slice`, `number_format`, `date`, `nl2br`, `replace`, `split`, `upper`, `lower`
- **Functions:** `__`, `_p`, `config`, `asset`, `path`, `query`, `range`
- **Tags:** `if`, `for`, `block`, `extends`, `include`, `set`

Sources: https://docs.tebex.io/developers/templates/twig/filters, /functions, /tags. The theme uses nothing else, so no `default`, `trim`, `merge`, `first`, `last`, `join`, `json_encode`, `url_encode`, `round` or `min`. Fallbacks are written as `config('x') ? config('x') : 'y'`, names are compared with `|replace({' ': ''})|lower`, and JSON is written by hand with `|escape('js')`.

## Store URLs

✅ = confirmed on a live Tebex store (requests from a real store's own template script, and HTTP checks), ⚠️ = not confirmed yet.

| Feature | URL / field | Status |
|---|---|---|
| Add to basket | `/checkout/packages/add/{id}/single` (also `/subscription`) | ✅ |
| Remove from basket | `/checkout/packages/remove/{id}` | ✅ |
| Basket / checkout page | `/checkout/basket` | ✅ |
| Basket ident for Tebex.js | `GET /checkout/ident` | ✅ |
| Quantity update | `POST /checkout/update` (form-encoded) | ✅ route exists; theme adds N times instead |
| Log in | `/login` | ✅ |
| Log out | `/checkout/logout` (`/logout` is a 404) | ✅ fixed |
| Category / package pages | `/category/{id or slug}`, `/package/{id}` | ✅ |
| Gift card module | form `method="post"` `action="#giftcardbalance"`, field `card_number` | ✅ fixed (was `card`) |
| Tebex.js checkout | `https://js.tebex.io/v/1.js`, `Tebex.checkout.init({ident}).launch()` | ✅ docs + live store |
| Currency switch | `/currency/{CODE}` returns 404 | ⚠️ picker only shows when the `currencies` setting is filled — leave it empty until the route is confirmed |
| Options form | fields `price`, `variables[{id}]`, posted to the same URL | ⚠️ |
| Subcategories | `category.subcategories` | ⚠️ falls back to no dropdown |
| CMS page fields | `title` / `metaData.content` or `page.title` / `page.metaData.content` | ⚠️ both handled |
| Custom pages list | `store.pages` (id, name, slug) | ⚠️ |
| Policy pages | `/terms/checkout`, `/terms/privacy` | ⚠️ |
| Login error | `store.userMessage` | ⚠️ |
| Settings syntax | `config('id')` (documented) | ✅ docs |
| Basket item image | `item.image.url` (falls back to an icon) | ⚠️ |
| Skins | mc-heads.net by username; Bedrock / unknown → Steve | external service |

## Still to test on a Tebex store (developer plan, free)

1. Paste `schema.json` into **Change schema**: Tebex must accept it (it validates option types).
2. Every page loads without a Twig error (sandbox confirmed in practice).
3. The ⚠️ rows above.
4. Tebex.js checkout opens with a real basket.

If anything differs, search the listed file and replace the string — each is plain text.
