# Landscape template library

Status: complete

## Scope

Provide local save, load, delete, JSON import, and JSON export for validated landscape recipes.

## Workflow

Set scene options → preview → save a named recipe → load it later or transfer a JSON backup.

## Research notes

- [Material Maker](https://www.materialmaker.org/) demonstrates reusable material graphs and shared presets; defer graph complexity.
- [Krita resources](https://docs.krita.org/en/reference_manual/resource_management.html) use local tagged assets and portable bundles.
- [Krita preset editor](https://krita.org/en/posts/2018/krita-4-0-release-notes/) emphasizes live preview and collapsible controls.
- Product fit: bounded scene form, live SVG preview, named local recipes, validated JSON backup.

## Verification

- Browser at `http://127.0.0.1:5175/`: save `QA Template 2026-09-29`; change preset; load; Coast restored.
- Export action displayed `Exported 1 template`; browser download automation timed out. Import not browser-verified.
- `npm run verify`: pass; six landscape template contract tests included.

## Limits

Local IndexedDB only. Browser backup import/export covered by validated serialization tests; full file chooser round trip remains to verify in browser.
