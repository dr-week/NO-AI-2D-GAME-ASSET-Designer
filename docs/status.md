# Project status

Current implementation snapshot. Product scope lives in [requirements](requirements.md),
next work in [the task queue](tasks/README.md), and unresolved evidence in [issues](issues.md).

| Area | Current state | Not yet delivered |
|---|---|---|
| Workspace | Character, Landscape, and Animation sections in the collapsible left drawer; animation presets grouped by Calm, Playful, Entrance, and Transition. | Saved-item library and shared feedback export. |
| Character | T-pose geometry, bounded posing/proportions/bone lengths, SVG export, deterministic local Laya commands, and one looping Wave clip with play/pause/scrub. Manual posing pauses playback. The nine-question decision resolver is fixture-tested but has no provider or production caller. | Editable clips/timeline, visual joint-quality review, and optional non-LLM decision-provider integration. |
| Landscape | Deterministic SVG generation with smooth seeded ridges; Contemporary, Warli-inspired geometry, and Mithila-inspired botanical style profiles; flat/grain/ripple materials; local template database and validated JSON backup. | More curated regional styles; in-app per-layer editing and landscape project save/restore. |
| Animation | Polygon/color masks (worker with native fallback), text and image layers, theme-filtered motion previews, versioned JSON, one 1.5 MB local restore slot, animated SVG export, local feedback. | Editable paths, mask correction, frame export, and worker/browser compatibility verification. |
| Runtime | Static browser app; no application server, remote database, or Laya inference runtime. Node.js 24+ is declared and GitHub Actions runs the verification suite on pushes and pull requests. | Add a server only when product scope requires shared accounts or remote sync. |

Technology triggers: [technology register](roadmap/technology-register.md).
Verification commands: `npm run verify`; browser gaps: [issues](issues.md).
