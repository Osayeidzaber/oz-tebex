# Installing OZ on Tebex

How a Tebex template is put together, and the exact steps to get OZ onto a store.
Source: https://docs.tebex.io/developers/templates/overview

## How Tebex templates work

A Tebex template is **not a file you upload**. It lives inside the Tebex panel and is made of three parts:

| Part | What it is | Where OZ keeps it |
| --- | --- | --- |
| **Pages** | Fixed Twig files Tebex renders. They can't be added or deleted, only edited. | `templates/*.html`, `templates/cms/`, `templates/category/`, `templates/email/` |
| **Assets** | CSS, JS, images and extra `.twig` partials you upload. Pages load them with `{{ asset('oz.css') }}` and `{% include "oz-links.twig" %}`. | `assets/*`, `templates/*.twig` |
| **Schema** | JSON that defines the settings form store owners fill in. Pages read the values with `{{ config('id') }}`. | `schema.json` |

Tebex doesn't import a template from a zip or a JSON file. Two upload buttons look like they would, but neither works for OZ:

- **Storefront → Create Storefront → Upload** only takes a Webstore Builder export. That's an encrypted `.json` (`ciphertext` / `iv`) that only Tebex can produce.
- **Project → Logo → Upload** is only for the store logo image.

> **Classic templates only.** OZ needs a project that serves classic templates. On projects that use the Webstore Builder, the store address shows the Builder storefront instead, and a custom template stays invisible even when it's marked *Activated*.

## schema.json format

```json
{
  "author": "OZ Themes",
  "support_email": "support@example.com",
  "config": [
    {
      "header": "1. Look & feel",
      "options": [
        { "id": "preset", "name": "Color preset", "type": "select",
          "description": "Color preset. Options: Frost, Overworld, …",
          "default": "Frost", "values": ["Frost", "Overworld", "…"] }
      ]
    }
  ]
}
```

Required properties for each option type. Tebex rejects the whole schema if any one is missing:

| type | required |
| --- | --- |
| `select` | id, name, type, description, default, values (default must be one of the values) |
| `colour-picker` | id, name, type, description, default (`#RRGGBB`) |
| `textarea`, `url` | id, name, type, description, default |
| `image-uploader`, `file` | id, name, type, description |
| `slider` | id, name, type, description, default, min, max |

`npm test` runs `tools/schema-check.js`. It checks every rule above, and it checks that every `config('…')` used in `templates/` exists in the schema. To fill in missing descriptions and defaults automatically, run `node tools/schema-check.js --fix`.

## Install steps

1. **Tebex panel → Templates → Create Custom Template.** Name it `OZ` and base it on **Exo**.
2. **Pages.** In the editor's left list, open each page, replace everything with the file of the same name, then **Save As Draft**:
   - `layout.html`, `index.html`, `category.html`, `package.html`, `username.html`, `options.html`, `checkout.html`, `quote.html`
   - `cms/page.html`, `category/tiered.html`
   - `module.communitygoal.html`, `module.featuredpackage.html`, `module.giftcardbalance.html`, `module.goal.html`, `module.payments.html`, `module.serverstatus.html`, `module.textbox.html`, `module.topdonator.html`
   - `email/layout.html`, `email/abandonedcart.html`, `email/downloadablepackage.html`, `email/purchasefollowup.html`
3. **Assets.** Click **+**, choose **Upload**, pick the type, then select the files:
   - **Twig:** `oz-icon.twig`, `oz-links.twig`, `oz-preview.twig`, `oz-setup.twig` (from `templates/`)
   - **CSS:** `oz.css`, `oz-icons.css` (from `assets/`)
   - **JavaScript:** `oz.js`, `oz-fx.js`, `oz-preview.js`, `oz-checkout.js`, `oz-extras.js`, `oz-setup.js`, `oz-motion.js` (from `assets/`)
4. **Change Schema.** Paste in all of `schema.json` and save. If Tebex shows "Each … option must contain …", run `npm test` to find the option that's missing a field.
5. **Publish**, then **Templates → OZ → Activate**.
6. **Settings.** Open the template settings and fill in at least the server IP, Discord invite and preset.

## Testing on a store

1. Use a test project on classic templates. Until the store is approved, checkout only accepts test payments.
2. Add a few categories and packages, for example *Ranks*, *Keys* and *Coins*. OZ shows empty states without them.
3. Open the store address and check, at a minimum:
   - Home, category and package pages render, with no Twig error page
   - The basket drawer opens and checkout launches Tebex.js
   - The username login works
   - Changing the preset in settings changes the colours
4. Locally, `npm run preview` renders every page with sample data at http://localhost:5173, without needing Tebex.
