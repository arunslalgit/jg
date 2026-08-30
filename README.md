# Jewel Ghar Amsterdam — website

Static website for [jewelghar.com](https://www.jewelghar.com/): a handcrafted
Indian jewelry catalog with WhatsApp ordering. Built as a plain static site
(no build step) so it can be hosted on GitHub Pages.

## Structure

```
index.html            the whole site (shop, about, contact)
assets/style.css      styles
assets/app.js         filtering, search, sort, product modal
assets/products.js    product data (name, price, category, image id)
images/*.webp         one photo per product (900px WebP)
```

## Hosting on GitHub Pages

Repo → **Settings → Pages** → "Deploy from a branch" → pick this branch, `/ (root)` folder.
The site appears at `https://<user>.github.io/jg/` within a minute or two.

To use the custom domain: add `jewelghar.com` in the same Pages settings screen
(this creates a `CNAME` file), then point the domain's DNS at GitHub Pages
(apex `A` records 185.199.108.153 / .109 / .110 / .111, `www` CNAME to
`<user>.github.io`).

## Updating products

Edit `assets/products.js` — each entry is `{num, id, name, price, unit, cat}`
plus optional `photos` (gallery count; files `images/<id>-2.webp`…) and
`sold: true`. The photo lives at `images/<id>.webp`. Categories: Earrings,
Necklaces & Sets, Bangles & Bracelets, Anklets, Rings, Head Jewelry.

`num` is the permanent catalog number (goes into WhatsApp order messages,
e.g. "#076 Handcuff Bracelet (€15)"). Never renumber existing pieces — give
a new product the next free number.

After any product change, regenerate the per-product pages and sitemap:

```bash
python3 tools/gen_pages.py
```

That rebuilds `p/<id>.html` (shareable link per piece, with OG preview and
schema.org Product markup), `sitemap.xml`, and `robots.txt`. Each piece is
linkable two ways: `https://www.jewelghar.com/p/<id>.html` (best for sharing —
proper preview image) and `https://www.jewelghar.com/#p=<id>` (opens the
piece directly on the main page).
