# Project status

Current implementation snapshot. Product scope lives in [requirements](requirements.md),
next work in [the task queue](tasks/README.md), and unresolved evidence in [issues](issues.md).

| Area | Current state | Not yet delivered |
|---|---|---|
| Workspace | Character, Landscape, Tile Backgrounds, 3D artwork, and Animation have separate sections in the collapsible left drawer; 3D feature lazy-loads on selection. | Saved-item library. |
| Character | T-pose, bounded controls, SVG export, local rule-based brief mapping, five body profiles, and reviewable optional local Laya profile suggestions. | Fine-tuned/validated model quality; editable clips/timeline and visual joint-quality review. |
| Landscape | Seeded SVG generation with three landforms, six composition grammars, six environment profiles, four lighting states, categorized style catalog, reviewable optional local Laya style suggestions, and templates that preserve scene axes. | Artist review, sourced regional profiles, richer authored scene assets, per-layer editing, and project save/restore. |
| 3D artwork | Five starter groups with procedural forms, orbit camera, perspective and orthographic projections, standard view presets, clear scene, and PNG preview export. Three.js loads only when selected. | Transform tools, scene save/restore, model import, and deeper category libraries. |
| Animation | Polygon/color masks (worker with native fallback), text and image layers, theme-filtered motion previews, versioned JSON, one 1.5 MB local restore slot, animated SVG export, local feedback. | Editable paths, mask correction, frame export, and worker/browser compatibility verification. |
| Runtime | Browser-first app; optional loopback Node API now provides SQLite template routes. Current template UI still uses IndexedDB. Laya model runs separately and is proxied in development. | Connect template UI to API with a safe IndexedDB migration/offline fallback; measure model quality and target-device costs. |

Technology triggers: [technology register](roadmap/technology-register.md).
Verification commands: `npm run verify`; browser gaps: [issues](issues.md).
