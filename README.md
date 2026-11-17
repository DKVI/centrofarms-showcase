# CentroFarms™ Showcase

This private repository is the collaborative development copy of the CentroFarms™ website.

- Live production demo: https://centrofarms-showcase-demo.vercel.app/
- Main source file: [index.html](./index.html)
- Vietnamese home: [vi/index.html](./vi/index.html)
- Development: open `index.html` in a browser or static HTTP server.

## Showcase pages

Each page has its own directory and HTML document. Content is present in the HTML; shared styling and browser interactions live in `assets/`.

| Page | English path | Vietnamese path |
| --- | --- | --- |
| Home | `/` | `/vi/` |
| Specialty Coffee | `/coffee/` | `/vi/coffee/` |
| Poultry & Farmland | `/poultry/` | `/vi/poultry/` |
| Contact | `/contact/` | `/vi/contact/` |
| AgriSolutions | `/agrisolutions/` | `/vi/agrisolutions/` |
| Enviroflight | `/agrisolutions/enviroflight/` | `/vi/agrisolutions/enviroflight/` |
| EnviroPro | `/agrisolutions/enviroflight/enviropro/` | `/vi/agrisolutions/enviroflight/enviropro/` |
| EnviroFeed | `/agrisolutions/enviroflight/envirofeed/` | `/vi/agrisolutions/enviroflight/envirofeed/` |
| EnviroOil | `/agrisolutions/enviroflight/envirooil/` | `/vi/agrisolutions/enviroflight/envirooil/` |
| EnviroMeal | `/agrisolutions/enviroflight/enviromeal/` | `/vi/agrisolutions/enviroflight/enviromeal/` |
| EnviroBug | `/agrisolutions/enviroflight/envirobug/` | `/vi/agrisolutions/enviroflight/envirobug/` |
| Equipment Systems | `/agrisolutions/equipment-systems/` | `/vi/agrisolutions/equipment-systems/` |

Every directory contains an `index.html`. AgriSolutions is temporarily empty. Enviroflight contains the product overview, and its EnviroPro card opens the dedicated product detail page. The language menu switches to the corresponding page in the other language.

Legacy `#/...` links redirect to the matching directory. `vi/index.vi.html` and the old `agrisolutions/enviproflight/` spelling remain as redirects for existing links.

Product facts, application rates, certification, and performance claims remain limited to the supplied content. The HTML files inside `img/` are historical copies and are not part of the active navigation.

## Image assets

All image assets used by the English and Vietnamese pages are stored locally in `img/`. The HTML references these files with relative paths, so the images are available when previewing the site locally.

## Workflow

Changes should be made on a feature branch and proposed through pull requests for review. Do not assume pushing to this repository deploys to production: Vercel is not currently linked to this GitHub repository.

## Access

Owner: KVI (production)
Contributor:Phong
## Shared assets

- `assets/site.css`: English styles.
- `assets/site-vi.css`: Vietnamese styles.
- `assets/site.js`: menus, section scrolling, dialogs, galleries, email copying, and legacy URL redirects.

Each page declares a relative `<base>` URL so navigation and images work from nested directories and when the repository is served from a subdirectory. Preview with a static HTTP server for directory URLs.
