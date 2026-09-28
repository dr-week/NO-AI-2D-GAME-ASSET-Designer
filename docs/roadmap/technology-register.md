# Technology register

Decision index for current and future technologies. Research notes hold details; this
register holds status, trigger, and next action.

| ID | Area | Technology or concept | Status | Add or advance when | Research |
|---|---|---|---|---|---|
| F-01 | Character motion | Typed clip sampling with `requestAnimationFrame` | Implemented | Extend after more than the bounded Wave clip is prioritized; keep manual pose state and playback synchronized. | [Animation systems](../../research/animation-systems.md) |
| F-02 | Timeline | App-owned keyframes; WAAPI for DOM-only playback | Later | Users need authored timing, multiple clips, or composition. | [Animation systems](../../research/animation-systems.md) |
| F-03 | Project storage | IndexedDB for image projects and larger feedback logs | Conditional | Current 1.5 MB project snapshot or feedback latency/quota becomes a demonstrated limit. Keep JSON backup. | [Stack review](../../research/stack-and-architecture.md) |
| F-04 | Image processing | Feature-detected Web Worker, `ImageBitmap`, and `OffscreenCanvas` with sync fallback | Implemented | Measure performance and browser compatibility under I-004; retain fallback. | [Stack review](../../research/stack-and-architecture.md) |
| F-05 | Editable contours | OpenCV.js contour extraction and simplification | Deferred | Guided masks and manual correction cannot meet a measured path-editing requirement; prototype bundle and quality cost first. | [Layered workflow](../workflows/layered-illustration-animation.md) |
| F-06 | Image-path motion | Bézier control-point sampling for waves | Later | Editable image paths and wave motion enter scope; profile representative scenes. Landscape material loops are already implemented separately. | [Layered workflow](../workflows/layered-illustration-animation.md) |
| F-07 | Raster/video export | Fixed-time sampling and Canvas frame rendering | Later | PNG or frame-sequence export is prioritized. Keep deterministic timestamps. | [Animation systems](../../research/animation-systems.md) |
| F-08 | Remote service | API and shared database | Out of scope | Accounts, collaboration, or cross-device sync becomes a requirement. No server is needed for current local workflows. | [Design](../design.md) |
| F-09 | Character deformation | Mesh rig or puppet runtime | Deferred | SVG joint geometry fails recorded character acceptance checks. Compare integration cost and licenses before a prototype. | [Animation systems](../../research/animation-systems.md) |
| F-10 | Laya inference | Optional local CPU System 1 service | Pilot | Validate character-profile agreement on held-out briefs and measure target-device latency, memory, install size, and first-run download before default use. | [Laya integration](../../research/laya-integration.md) |
| F-11 | 3D | Lazy Three.js workspace with WebGLRenderer and OrbitControls | Prototype | Grow categories, scene editing, and save/load after this lightweight camera-and-primitive editor is evaluated. Keep 2D feature data independent. | [Stack review](../../research/stack-and-architecture.md) |
| F-12 | Heavy compute | Rust compiled to WebAssembly | Conditional | A TypeScript Worker misses an agreed latency or memory target; compare end-to-end cost and boundary copies first. | [Stack review](../../research/stack-and-architecture.md) |
| F-13 | Desktop edition | Tauri with a small Rust host | Conditional | Product requires a packaged desktop app, native file access, or OS-level process control. | [Stack review](../../research/stack-and-architecture.md) |
| F-14 | Offline tools | Python | Out of runtime scope | A separate asset-preparation or evaluation tool has a clear owner; do not add it to the browser runtime. | [Stack review](../../research/stack-and-architecture.md) |
| F-15 | Procedural materials | Seeded SVG recipes and tile-periodic motion | Implemented for Landscape | Extend to another feature only when a second caller needs the same material contract. | [Procedural 2D art](../../research/procedural-2d-art.md) |
| F-16 | Shared artwork model | Versioned scene document, stable node IDs, renderer boundary | Conditional | Cross-feature projects, nested grouping, or object-level editing become committed scope; prototype against SVG export first. | [VisActor fit](../../research/visactor-architecture.md) |

## Rules

- No dependency from a future row enters the app without its trigger and a small prototype.
- Prefer browser-native APIs while they meet the requirement.
- Before adoption: verify current upstream docs, browser support, license, bundle size, and target-device performance.
- Update this table when status or trigger changes; do not duplicate full research here.
