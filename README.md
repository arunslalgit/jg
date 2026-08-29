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

Edit `assets/products.js` — each entry is `{id, name, price, unit, cat}` and the
photo lives at `images/<id>.webp`. To add a product, drop in a photo and add an
entry; categories are: Earrings, Necklaces & Sets, Bangles & Bracelets,
Anklets, Rings, Head Jewelry.
