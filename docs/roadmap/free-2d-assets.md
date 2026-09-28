# Free 2D asset sources

## Preferred sources

Use assets as examples, starter content, or user imports. A source being free to download does not establish a redistribution license. Check each asset's page and included license before adding files to this repository or shipping them in the app.

| Source | Useful for | License notes |
|---|---|---|
| [Kenney](https://kenney.nl/assets) | 2D characters, modular sprites, landscapes, backgrounds, UI packs | Kenney states asset packs are CC0. Confirm the individual page/readme; retain source record. |
| [itch.io CC0 game assets](https://itch.io/game-assets/assets-cc0/free) | Broad character, landscape, sprite, tile, icon and UI discovery | Use the CC0 filter, then confirm the creator’s asset page and downloaded license file. Platform free status alone is not a license. |
| [OpenGameArt](https://opengameart.org/) | Community characters, tiles, backgrounds, icons and animation frames | Multiple licenses per item. CC0 easiest; CC-BY/OGA-BY require attribution; SA/GPL terms require compatibility review. Item preview may have different terms from download. |
| [Google Material Symbols](https://fonts.google.com/icons) | UI symbols in Material style | Apache-2.0. Prefer selected local SVGs to a full icon font or remote font request. |
| [Lucide](https://lucide.dev/) | Consistent outline UI icons, including editor actions | ISC license. Project already has an app-owned icon wrapper; reuse it and avoid adding a second icon system. |
| [OpenMoji](https://openmoji.org/) | Colorful character-like pictograms and emoji-style graphics | CC BY-SA 4.0. Attribution and ShareAlike obligations apply; do not bundle casually. |

### Verified examples

- [Kenney Platformer Characters](https://kenney.nl/assets/platformer-characters) is a 2D CC0 pack; Kenney states assets on asset pages are CC0, including commercial use. Candidate for licensed starter characters; inspect included files and keep only what a template needs.
- itch.io [Free CC0 Modular Animated Vector Characters 2D](https://rgsdev.itch.io/free-cc0-modular-animated-vector-characters-2d) lists separated, recolorable body parts and idle/walk/roll/jump/hit/death poses under CC0. The archive is 69 MB. Useful for testing sprite-part/layer import; not a good default bundle.
- itch.io [City Landscape V2 Parallax Background](https://karsiori.itch.io/free-pixel-art-city-landscape-version-2-parralax) lists nine individual PNG layers (77 kB total) and CC0. Small candidate for landscape layer/parallax import experiments.
- OpenGameArt [Characters Pack](https://opengameart.org/content/characters-11) lists CC0 and a 879.6 kB PNG archive. Confirm archive contents and keep the source page with the selected files.
- Material 3 is the current Google design system. Use its [official guidance](https://m3.material.io/) for interaction, motion, and component principles; use [Material Symbols](https://github.com/google/material-design-icons) only where an icon fills a real UI gap. Material Symbols are Apache-2.0. The existing app-owned icon wrapper remains the integration point.
- The older [Material motion fundamentals](https://m1.material.io/motion/material-motion.html) remain useful for principles: motion should clarify hierarchy, remain responsive, and avoid excess. Check current Material 3 pages for current patterns.

These pages identify candidate assets and list their terms. They do not independently verify ownership or clear unrelated third-party content.

## Asset intake

Before bundling or modifying an asset, add one row to [asset-catalog.csv](asset-catalog.csv):

`id,filename,source_url,creator,license,license_url,modified,format,category,notes`

Rules:

1. Prefer CC0 for bundled starter assets. Keep the license/readme and source URL.
2. For BY licenses, record required credit and changes; include them in app credits and redistributed packages.
3. Do not bundle NC assets in this commercial-capable product. Do not modify or redistribute ND assets. Review SA/GPL terms before distribution.
4. Download and retain only selected files; do not mirror whole packs or marketplaces.
5. Keep source and edited files distinct. Record edits; retain required notices.
6. Check third-party characters, brands, and marks; CC0 does not clear rights the uploader does not own.
7. If source, rights, or license are unclear, link the page; do not bundle.

## Fit with this project

- Current Character is generated from app-owned SVG geometry and bounded rig controls. Imported sprite packs can be references or image-animation layers; they cannot be fed into that rig without a separate rig/asset conversion workflow.
- Current Landscape workspace generates seeded SVG scenes. Vector packs can seed reusable SVG templates after layer/ID validation; raster tile sheets remain references until a tile editor exists.
- UI uses a shared icon wrapper. Reuse it; only add a library after checking dependency size and render behavior.
- Keep artwork-source packs outside the shipped app until selected templates or an import flow need them. Prefer source links and small, individually selected CC0 files over bulk downloads.
- Treat spritesheets, raster layers, and vector limbs as different input formats. Do not assume an asset can use the existing SVG rig; prove one selected character through the current image-layer workflow before proposing a shared importer.
- Use the current locally installed Lucide wrapper for ordinary controls. Do not introduce Material Web or a second icon package just to follow Material guidance; guidelines are not a dependency requirement.
- Keep asset metadata outside rendering models. Catalog records own license/provenance; renderers receive validated scene/template data only.

## Catalog boundaries

No remote asset browser or download service is implemented. Consider one only for a demonstrated user need; require opt-in, source/license metadata, allowed hosts, and file type/size checks. Never infer licenses automatically.
