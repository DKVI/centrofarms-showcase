# Centrofarms™ Showcase

This private repository is the collaborative development copy of the Centrofarms website.

- Live production demo: https://centrofarms-showcase-demo.vercel.app/
- Main source file: [index.html](./index.html)
- Vietnamese page: [vi/index.vi.html](./vi/index.vi.html)
- Development: open `index.html` in a browser or static HTTP server.

## Showcase pages

The English and Vietnamese showcases share hash routes for Home, Specialty Coffee, Poultry, Agrisolution, and Contact. The Agrisolution page presents EnviroPro 3-2-1 product facts and application rates from the supplied product data sheet; certification and performance claims are intentionally limited to the wording supported by that source.

## Image assets

**Current limitation:** The repository's HTML file references the production demo's `/assets/*.webp` images by absolute URLs. The original asset bundle has **not yet been committed** here. Do not delete/change the Vercel production project until the assets have been migrated to this repository.

To make the repository fully standalone, upload the assets directory from the local `centrofarms_github_ready.zip` source bundle and change absolute production asset URLs back to relative `/assets/` URLs (or `assets/` for local preview).

## Workflow

Changes should be made on a feature branch and proposed through pull requests for review. Do not assume pushing to this repository deploys to production: Vercel is not currently linked to this GitHub repository.

## Access

Owner: KVI (clone-ver)
