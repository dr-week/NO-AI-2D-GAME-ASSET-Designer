# UI animation and project integration

Status: implemented for image-layer templates and project flow; character timeline remains
planned.

## Changes

- Added bounded Breathe, Drift, and Pulse data templates; randomized trials now use the
  same seeded recipe helper as template application.
- Added image-project JSON validation/open/save, one size-limited browser storage snapshot
  with restore, and animated SVG export with embedded source art.
- Updated UI-04, UI-05, UI-06, requirements, and design status.

## Backend scope

Persistence uses browser `localStorage`; there is no remote backend. This follows the
documented local-first/no-required-backend constraint. Large projects may exceed the
browser snapshot limit; downloaded JSON remains available as a durable backup.

## Limits

- Templates target separated image layers, not the character skeleton. Character artwork
  still lacks independent parts and pivots.
- Moving a cutout duplicates it over the source image; no clean-plate reconstruction.
- SVG export supports the current transform presets only. No timeline, PNG, or sequence
  export.

## Checks

- `npm run check`: pass.
- `npm run build`: pass.
