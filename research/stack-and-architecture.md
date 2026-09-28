# Animation technology

Reviewed 2026-09-28. Goal: small, local-first 2D motion graphics with no LLM, generative
AI service, backend, or game engine.

## Stack check

Installed versions checked against npm's current stable tags:

| Package | Installed | Current choice |
|---|---:|---|
| Svelte | 5.57.1 | Keep; current major and compact UI framework |
| Vite | 8.3.1 | Keep; current major, fast static build tool |
| TypeScript | 6.0.3 | Keep for Svelte tool support |
| Sass | 1.105.0 | Keep; SCSS is build-time styling |
| `@sveltejs/vite-plugin-svelte` | 7.3.1 | Keep; matching official integration |

TypeScript 7.0.2 is newer and generally released, but Microsoft currently recommends
TypeScript 6 for Svelte and other embedded-language workflows until their tooling supports
TypeScript 7's compiler API. Upgrade only after Svelte tooling compatibility and checks are
confirmed. “Latest” is not a reason to destabilize the editor.

The stack fits the task: Svelte owns controls and local state, TypeScript validates scene
data, SVG draws scalable flat artwork, CSS animates current simple loops, and Vite builds
static browser assets. Material Design is Google's interface design system; our art goal is
flat vector motion inspired by its simplicity, not a Google animation library.

The local Laya command parser uses native `String.prototype.normalize('NFKC')` to accept
compatibility forms such as full-width keyboard input before applying its existing strict
grammar. It maps Unicode minus variants explicitly. No internationalization dependency is
needed. [MDN reference](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/normalize).

## Additional languages and real limits · reviewed 2026-09-28

Do not add a language to replace the current UI. Add one only behind a measured, coarse-grained
boundary when browser APIs or TypeScript cannot meet a concrete requirement.

| Option | What it could improve | Cost and fit here |
|---|---|---|
| TypeScript + Web Worker / `OffscreenCanvas` | Color masks use a feature-detected worker path with a synchronous fallback. | Keep this as the first compute boundary; measure compatibility and latency. No new language or server. |
| Rust → WebAssembly | Predictable ownership for a CPU-heavy kernel; reuse Rust algorithms in browser and possibly native tools. Good candidates only after profiling: segmentation, vectorization, or frame rasterization. | Keep Svelte/TypeScript as host. Wasm cannot directly own the DOM; glue, separate linear memory, copying, serialization, binary size, and debugging add complexity. Use a worker and exchange large typed buffers in few calls. |
| Rust native host (for example Tauri) | Desktop-only filesystem/process access, packaged app, app-scoped logs, and single-instance behavior. Could consolidate a Windows launcher if the product becomes a desktop application. | Adds a Rust app shell, installer/update path, capability/security configuration, and native release work. It changes deployment from a static website; it does not simplify the browser version. |
| C++ → WebAssembly / OpenCV.js | Broad image-processing algorithms if guided masks prove insufficient and an existing OpenCV operator solves the measured failure. | Larger runtime and C++/JS ownership boundary; OpenCV.js is an Emscripten-compiled subset. Prototype one operation and load it only in the image workflow. |
| Python (native tool or service) | Fast experiments, batch asset preparation, offline evaluation, or a separately justified computer-vision service. | A service breaks the current local-first/no-backend shape. Pyodide brings CPython into the browser, but adds runtime/package download and has WebAssembly-specific limits; it is not a simpler front end. |

### Current stack limits and staged response

- **Image processing:** color masks use a TypeScript Worker and `OffscreenCanvas` where supported,
  with a synchronous fallback. Measure representative sizes and browser behavior. Reach for Rust/Wasm
  only if the current path misses a recorded latency or memory target.
- **Pixel-mask quality:** the current guided mask is intentionally bounded and simple. Compare flat,
  gradient, and textured images under I-004. If errors are algorithmic, evaluate one OpenCV.js or
  Rust/Wasm operator against the same cases; a language switch alone does not improve segmentation.
- **Desktop filesystem, process locks, and crash logs:** a website cannot silently take broad OS
  access. Keep browser permission/download fallbacks for the web build. If a supported native desktop
  build becomes a requirement, evaluate a Tauri/Rust shell with narrow capabilities and app log paths.
- **Animation and rendering:** CSS/SVG and the Web Animations API already cover current 2D motion.
  Rust or a game engine would add no current capability. Consider a worker or GPU API only after a
  measured rendering bottleneck or a concrete frame-export requirement.

### Community signal

Treat community benchmarks as anecdotes, not performance guarantees. Reddit's recent Rust/Wasm image
library discussion describes a worker-backed TypeScript API and lazy loading, but its performance
claims are project-specific ([discussion](https://www.reddit.com/r/rust/comments/1pjfecv/rust_webassembly_image_processing_library_for_the/)).
Other threads report both faster kernels and cases where JavaScript wins; a recent parser rewrite
discussion attributes a slowdown to frequent JS/Wasm crossings and serialization ([parser
discussion](https://www.reddit.com/r/rust/comments/1rz64ug/we_replaced_our_rustwasm_parser_with_typescript/));
an older image-kernel thread reports different relative results across runs and browsers
([Photon discussion](https://www.reddit.com/r/rust/comments/gvvlz3)).
The practical lesson is to benchmark the actual kernel and minimize boundary crossings. Reddit
threads about browser image editors also describe keeping the UI in JavaScript and moving only heavy
operations to Wasm ([editor discussion](https://www.reddit.com/r/rust/comments/1iaoz5n)).

### Recommendation

Keep the current stack. Profile the existing color-mask Worker and large-image editing against an
agreed target. If it misses, prototype one isolated Rust/Wasm kernel against the same fixtures and
compare end-to-end latency, peak memory, startup cost, and bundle size. Consider Tauri/Rust only for
a desktop edition; keep Python for offline tooling with a clear owner. Do not port UI, project
contracts, or animation templates.

Primary references: [MDN WebAssembly concepts](https://developer.mozilla.org/en-US/docs/WebAssembly/Guides/Concepts),
[MDN Web Workers](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers),
[MDN OffscreenCanvas](https://developer.mozilla.org/en-US/docs/Web/API/OffscreenCanvas),
[OpenCV.js overview](https://docs.opencv.org/5.0/js_tutorials/js_setup/js_intro/js_intro.html),
[Pyodide browser usage](https://pyodide.org/en/stable/usage/index.html),
[Tauri logging](https://v2.tauri.app/plugin/logging/),
[Tauri filesystem permissions](https://v2.tauri.app/plugin/file-system/), and
[Tauri plugin catalog](https://v2.tauri.app/plugin/).

## Adoption triggers

The [technology register](../docs/roadmap/technology-register.md) is the decision index for
current and future browser/runtime choices. Keep simple motion in CSS/SVG, profile before
adding workers or libraries, and use fixed timestamps for deterministic frame export.
Respect reduced motion; feedback remains local and does not train the app.

## 3D web technology check · 2026-09-28

- The editor now includes a separate, lazy-loaded Three.js workspace for true 3D artwork.
  Use CSS perspective/transforms only for lightweight interface depth.
- Use `WebGLRenderer` as the current stable renderer. `WebGPURenderer` has a WebGL 2 fallback,
  but the upstream guide still describes it as experimental.
- Keep SVG/Canvas features independent so the 3D scene model stays out of character, image,
  and 2D project data.

References: [CSS 3D transforms](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Transforms),
[Three.js renderer guidance](https://threejs.org/manual/pages/webgpurenderer),
[WebGPU API](https://developer.mozilla.org/en-US/docs/Web/API/WebGPU_API).

### Scope update · 2026-09-29

The first 3D editor slice now lives in `src/features/three-d/`, lazy-loaded from workspace
navigation. It groups starter assets into Forms, Products, Architecture, Nature, and Abstract;
camera controls offer perspective or orthographic projection and 3/4, front, side, and top
views. Geometry and UI remain separate from existing 2D models. It uses Three.js 0.186.0
(`WebGLRenderer`) and the official `OrbitControls` addon, with community TypeScript declarations.
The WebGL renderer remains the stable choice for WebGL 2; WebGPU is deferred because the
upstream guide still describes it as experimental. The initial 3D code is code-split; build
output measured about 142.6 kB gzip for its chunk, separate from the 50.9 kB main chunk.

Upstream implementation source: [Three.js GitHub](https://github.com/mrdoob/three.js),
[OrbitControls source](https://github.com/mrdoob/three.js/blob/dev/examples/jsm/controls/OrbitControls.js),
licensed MIT. Use package imports instead of copying examples. Camera design follows the
official [PerspectiveCamera](https://threejs.org/docs/pages/PerspectiveCamera.html) and
[OrthographicCamera](https://threejs.org/docs/pages/OrthographicCamera.html) APIs.

## Code ownership

Current feature boundaries are defined in [design](../docs/design.md); change coordination
and file ownership are defined in [Contributing](../docs/contributing.md). This review does
not recommend a language or runtime migration.

## Official references

- [Svelte 5 documentation](https://svelte.dev/docs/svelte/overview)
- [Vite 8 release and support](https://vite.dev/blog/announcing-vite8)
- [TypeScript 7: Svelte tool compatibility guidance](https://devblogs.microsoft.com/typescript/announcing-typescript-7-0/)
- [Web Animations API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API/Using_the_Web_Animations_API)
- [SVG repeating patterns](https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorials/SVG_from_scratch/Patterns)
- [Browser animation performance](https://web.dev/articles/animations-guide)
- [Vite npm releases](https://www.npmjs.com/package/vite), [Svelte npm releases](https://www.npmjs.com/package/svelte), [TypeScript npm releases](https://www.npmjs.com/package/typescript)
