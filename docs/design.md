# Design

## Runtime

2D Maker is a local-first Svelte 5, TypeScript, SCSS, and Vite browser app. UI input flows
through feature-owned state and validation into SVG/Canvas preview and export. Production
has no application API, server database, or required model runtime. Prefer browser APIs;
add dependencies only for a demonstrated requirement.

## Ownership

| Area | Owns |
|---|---|
| `src/app/` | Workspace navigation, shared character state, feature composition. |
| `src/platform/` | Browser utilities shared by multiple features, such as downloads. |
| `src/features/character/model/` | Skeleton, geometry, proportions, bone scales, and clip sampling. |
| `src/features/character/ui/` | Character controls and SVG preview. |
| `src/features/character/io/` | Standalone SVG export. |
| `src/features/laya/model/` | Deterministic command parsing and validated decision contracts; no inference runtime. |
| `src/features/animation/` | Shared image/text motion definitions and seeded template recipes. |
| `src/features/image-animation/` | Image/text layers, masks, editor UI, project/feedback IO, SVG export. |
| `src/features/landscape/` | Deterministic scene generation, template contract, local template storage, controls/export. |
| `src/features/landscape/model/materials.ts` | Seeded SVG material patterns and optional tile-loop timing. |
| `src/features/landscape/model/themes.ts` | Curated style metadata, category, region, and stable theme IDs. |
| `src/features/landscape/model/themeArtwork.ts` | Bounded seeded SVG accents for each landscape style. |
| `src/features/landscape/model/ridge.ts` | Seeded smooth value-noise samples and SVG cubic ridge paths. |
| `src/features/three-d/` | Lazy-loaded Three.js editor, categorized primitive builders, camera projection and views, PNG preview export. |
| `src/styles/` | Global tokens and shared base styles. |

`app/` composes features; it does not own feature rules. A feature exposes typed helpers or
component props. Put file, browser storage, and export operations in that feature's `io/`;
put pure data rules in `model/`; keep Svelte rendering and interaction in `ui/`. Add a shared
module only when multiple real callers need one owner.

## Data flow and boundaries

- Imported project JSON and browser-stored values enter as `unknown`; validate and migrate
  before replacing active state. `image-animation/io/projectFile.ts` owns image project schema.
- Persist serializable values only. DOM nodes, canvases, object URLs, and editor drafts remain
  session state.
- Versioned templates store recipes; derive SVG when previewing or exporting.
- Procedural art stores bounded recipes and seeds; material fills remain separate from scene geometry.
- Ridge profiles use low-frequency seeded variation with small detail noise; cubic SVG paths smooth silhouettes without a runtime dependency.
- Motion definitions have one owner. Preview and SVG export use the same values.
- Stable IDs, numeric limits, and schema versions are validated at file/storage boundaries.
- Save/export receives a feature snapshot; rendering does not mutate saved data.

## Current storage and motion

- Landscape themes are a code-owned catalog; user templates persist only stable style IDs and bounded scene settings in IndexedDB. Validated JSON backups remain portable across catalog additions.
- Image projects: versioned JSON plus one bounded 1.5 MB `localStorage` restore snapshot.
- Feedback: bounded local/browser records, optional user-selected folder append, JSONL download.
- Remote sync stays out of scope until accounts, sharing, or multi-device access is required.
- Image/text motion uses CSS presets and seeded recipe data. Character Wave motion uses a
  bounded keyframe clip sampled by a cancellable `requestAnimationFrame` loop for playback
  and scrubbing; WAAPI remains suitable for DOM-only effects.
- Profile before adding more workers or dependencies; use fixed timestamps for deterministic frame export.
- Raster masks describe visible pixels and cannot restore occluded backgrounds.

## Documentation owners

| File | Source of truth |
|---|---|
| [Requirements](requirements.md) | Product behavior and acceptance scope. |
| [Status](status.md) | What code currently delivers. |
| [Task queue](tasks/README.md) | Prioritized future implementation. |
| [Issues](issues.md) | Unresolved evidence and decisions. |
| [Contribution log](contributions/README.md) | File ownership, checks, and handoffs. |
| [Technology register](roadmap/technology-register.md) | Future technologies, triggers, and research links. |
| [VisActor architecture fit](../research/visactor-architecture.md) | Scene tree, declarative model, rendering boundary, and adoption trigger. |
| [UI/UX scripts](ui-ux/README.md) | Screen flows and behavior states. |
| [Workflow groups](ui-ux/workflow-groups.md) | Create/Animate sections, random entry, and phased simplification. |
| [Workflow](workflows/layered-illustration-animation.md) | Image segmentation and motion limits. |
| [Procedural 2D art](../research/procedural-2d-art.md) | Seeded scene, material, and seamless-loop rules. |
| [Art direction](../research/art-direction-foundations.md) | Composition, landscape depth, character silhouette, and shared style rules. |

See [Contributing](contributing.md) for the flexible change workflow and [technology research](../research/stack-and-architecture.md) for stack evidence.
