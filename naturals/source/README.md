# Naturals source provenance

Source: https://centrofarms.com/en/

Downloaded on 2026-11-16 at the owner's request. `home.html` is the source homepage snapshot. `shop.html` is the complete https://centrofarms.com/en/shop/ catalogue snapshot with nine products. Product snapshots cover all nine products, alongside three linked articles. `content.json` records the catalogue and homepage data, `details.json` records detail-page provenance, and `assets.json` maps the source images to local assets. The original six homepage products remain separately recorded as `featuredProducts`.

The source page for Himalayan Pink Salt Fine Grain Bulk Size 2.27 kg (5 lb) has Additional information but no Description section. The local page preserves that source state without inventing a description.

The local presentation changes layout and navigation, while retaining the source wording. English source copy remains English in both overview entry points; it has not been translated. Site-wide navigation and contact links use this repository's existing pages. WordPress account, wishlist, checkout, and comparison controls have not been recreated for this presentation draft.

The hero uses all three English source banners, with the original `Artboard-2-8.png` transparent salt artwork the original second-banner photograph, and the original bowl-of-salt artwork for the third banner. Both use the repository's green and cream palette and typography. They crossfade every three seconds, with manual selection and pause controls. Partner appears last; Follow Us and post bylines are omitted as requested.

Regenerate from saved snapshots with an available Node.js executable:

```
node scripts/build-naturals-details.cjs
```

This rebuilds both overview entry points, the nine-product catalogue and twelve detail pages (nine products and three articles). No network access is needed after the snapshots and assets have been downloaded.
