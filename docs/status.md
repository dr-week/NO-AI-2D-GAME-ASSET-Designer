# Project status

Current implementation snapshot. Product scope lives in [requirements](requirements.md),
next work in [the task queue](tasks/README.md), and unresolved evidence in [issues](issues.md).

| Area | Current state | Not yet delivered |
|---|---|---|
| Workspace | Character, Landscape, and Animation sections in the collapsible left drawer; animation presets grouped by Calm, Playful, Entrance, and Transition. | Saved-item library and shared feedback export. |
| Character | T-pose, bounded pose/proportion/bone-length controls, SVG export, deterministic commands, five bounded body profiles, local brief rules, and review-first optional System 1 suggestions. | Evaluate art-domain model quality and resource use; add editable clips/timeline and visual joint-quality review. |
| Landscape | Deterministic SVG generation with smooth seeded ridges; Contemporary, Warli-inspired geometry, and Mithila-inspired botanical style profiles; flat/grain/ripple materials; local template database and validated JSON backup. | More curated regional styles; in-app per-layer editing and landscape project save/restore. |
| Animation | Polygon/color masks (worker with native fallback), text and image layers, theme-filtered motion previews, versioned JSON, one 1.5 MB local restore slot, animated SVG export, local feedback. | Editable paths, mask correction, frame export, and worker/browser compatibility verification. |
| Runtime | Static browser app with no bundled model or persistent backend. Optional CPU Laya service runs separately on loopback, launched only by the user and proxied in Vite development. | Measure held-out agreement, cold/warm latency, memory, and model storage before any production/default use. |

Technology triggers: [technology register](roadmap/technology-register.md).
Verification commands: `npm run verify`; browser gaps: [issues](issues.md).
