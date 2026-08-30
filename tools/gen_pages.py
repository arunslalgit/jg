#!/usr/bin/env python3
"""Generate /p/<id>.html product pages, sitemap.xml and robots.txt.

Run from the repo root after editing assets/products.js:  python3 tools/gen_pages.py
"""
import json, re, os, html, urllib.parse

SITE = 'https://www.jewelghar.com'
WA = '31616311063'
INSTAGRAM = 'https://www.instagram.com/jewelghar_amsterdam'

raw = open('assets/products.js', encoding='utf-8').read()
prods = json.loads(re.search(r'const PRODUCTS = (\[.*\]);', raw, re.S).group(1))
os.makedirs('p', exist_ok=True)

TEMPLATE = """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{name} — Jewel Ghar Amsterdam</title>
<meta name="description" content="{desc}">
<link rel="canonical" href="{url}">
<meta property="og:type" content="product">
<meta property="og:title" content="{name} — Jewel Ghar Amsterdam">
<meta property="og:description" content="{desc}">
<meta property="og:url" content="{url}">
<meta property="og:image" content="{img}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:image" content="{img}">
<link rel="icon" type="image/png" href="/images/brand/favicon-192.png">
<link rel="apple-touch-icon" href="/images/brand/apple-touch-icon.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=Jost:wght@300;400;500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/assets/style.css">
<script type="application/ld+json">
{schema}
</script>
<style>
  .pp {{ max-width: 460px; margin: 0 auto; padding: 26px 18px 60px; text-align: center; }}
  .pp img.photo {{ width: 100%; border-radius: 16px; box-shadow: var(--shadow); }}
  .pp .modal-num {{ margin-top: 18px; }}
  .pp h1 {{ font-size: 30px; font-weight: 600; margin: 2px 0 6px; }}
  .pp .price {{ font-size: 20px; margin-bottom: 20px; }}
  .pp .back {{ display: inline-block; margin-top: 26px; font-size: 14px; letter-spacing: 1px;
               text-transform: uppercase; border-bottom: 1px solid var(--gold); padding-bottom: 2px; }}
  .pp .ship-note {{ font-size: 13px; color: var(--muted); margin: -10px 0 20px; }}
  .pp .ship-note a {{ color: var(--gold-dark); border-bottom: 1px solid var(--gold); }}
  .pp .sold-note {{ display: inline-block; background: #cfc6b6; color: #6d6355;
                    padding: 12px 26px; border-radius: 100px; font-size: 15px; }}
</style>
</head>
<body>
<header class="site-header">
  <a class="brand" href="/">
    <img class="brand-mark" src="/images/brand/emblem-160.png" alt="Jewel Ghar emblem" width="44" height="44">
    <span class="brand-name">Jewel <em>Ghar</em><small>Amsterdam</small></span>
  </a>
  <nav class="site-nav"><a class="btn-wa" href="https://wa.me/{wa}" target="_blank" rel="noopener">WhatsApp</a></nav>
</header>
<main class="pp">
  <img class="photo" src="/images/{id}.webp" alt="{name}">
  <p class="modal-num">#{num} · {cat}</p>
  <h1>{name}</h1>
  <p class="price">{price_html}</p>
  <p class="ship-note">Fast shipping · €4.95 (NL) · Free on orders over €50<br>
  Outside NL? <a href="https://wa.me/{wa}?text={shipmsg}" target="_blank" rel="noopener">Ask us for a shipping quote</a></p>
  {cta}
  <br><a class="back" href="/#p={id}">Browse the full collection</a>
</main>
<footer class="site-footer">
  <p class="fine">© Jewel Ghar Amsterdam · <a href="{ig}" target="_blank" rel="noopener">Instagram</a> · <a href="mailto:jewelghar27@gmail.com">jewelghar27@gmail.com</a></p>
</footer>
</body>
</html>
"""

urls = [SITE + '/']
for p in prods:
    price_txt = f"€{p['price']}" + (f" {p['unit']}" if p.get('unit') else '')
    desc = f"{p['name']} — handcrafted {p['cat'].lower().rstrip('s')} from Jewel Ghar Amsterdam, {price_txt}. Order via WhatsApp."
    url = f"{SITE}/p/{p['id']}.html"
    img = f"{SITE}/images/{p['id']}.webp"
    msg = urllib.parse.quote(f"Hi Jewelghar, I want to order #{p['num']} {p['name']} ({price_txt})")
    shipmsg = urllib.parse.quote(f"Hi Jewelghar, what would shipping to my country cost for #{p['num']} {p['name']}?")
    if p.get('sold'):
        cta = '<span class="sold-note">Sold out</span>'
    else:
        cta = f'<a class="btn-wa big" href="https://wa.me/{WA}?text={msg}" target="_blank" rel="noopener">Order via WhatsApp</a>'
    schema = json.dumps({
        "@context": "https://schema.org",
        "@type": "Product",
        "sku": p['num'],
        "name": p['name'],
        "image": img,
        "description": desc,
        "brand": {"@type": "Brand", "name": "Jewel Ghar Amsterdam"},
        "offers": {
            "@type": "Offer",
            "url": url,
            "priceCurrency": "EUR",
            "price": str(p['price']),
            "availability": "https://schema.org/" + ("OutOfStock" if p.get('sold') else "InStock"),
            "shippingDetails": {
                "@type": "OfferShippingDetails",
                "shippingRate": {"@type": "MonetaryAmount", "value": "4.95", "currency": "EUR"},
                "shippingDestination": {"@type": "DefinedRegion", "addressCountry": "NL"},
            },
        },
    }, ensure_ascii=False, indent=1)
    page = TEMPLATE.format(
        name=html.escape(p['name']), desc=html.escape(desc), url=url, img=img,
        id=p['id'], num=p['num'], cat=html.escape(p['cat']),
        price_html=html.escape(price_txt), cta=cta, schema=schema, wa=WA, ig=INSTAGRAM, shipmsg=shipmsg,
    )
    open(f"p/{p['id']}.html", 'w', encoding='utf-8').write(page)
    urls.append(url)

with open('sitemap.xml', 'w') as f:
    f.write('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n')
    for u in urls:
        f.write(f'  <url><loc>{u}</loc></url>\n')
    f.write('</urlset>\n')

open('robots.txt', 'w').write(f"User-agent: *\nAllow: /\nSitemap: {SITE}/sitemap.xml\n")
print(f"generated {len(prods)} pages, sitemap ({len(urls)} urls), robots.txt")
