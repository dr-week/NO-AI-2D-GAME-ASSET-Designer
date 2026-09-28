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

## Runtime choices and fallbacks

| Task | Use first | Fallback or next step |
|---|---|---|
| Flat motifs and repeated ornament | SVG paths and one `<pattern>` tile | One raster tile repeated as an image |
| Import segmentation | Canvas 2D pixel sampling and guided color/polygon masks | Manual polygon selection; evaluate OpenCV.js only if measured quality needs it |
| Simple repeating motion | CSS keyframes on a few SVG groups | Leave artwork still when motion is disabled |
| Pause, seek, reverse, or composition | Native Web Animations API | Keep CSS preset playback; no polyfill by default |
| Local feedback | Current bounded localStorage prototype | JSONL download; adopt IndexedDB if log size or sync cost warrants it |
| Save into a chosen folder | Optional File System Access API | JSONL download because folder picker support varies |
| Heavy image processing | Main-thread Canvas, measured first | Worker only if profiling shows visible stalls |

Use transforms and opacity when their visual result fits, but verify actual SVG paint and
compositing with browser profiling. Avoid animating every repeated motif separately. Use
fixed timestamps when deterministic frame export is implemented. Respect reduced-motion
settings. Keep feedback local and manually reviewed; ratings do not adapt or train the app.

## 3D web technology check · 2026-09-28

- Product scope remains 2D. Use CSS perspective/transforms only for lightweight interface
  depth; they need no 3D scene engine.
- Do not add a 3D runtime to the editor. If true 3D scenes become a requirement, evaluate
  Three.js behind a separate, lazy-loaded feature. Its WebGPU renderer can fall back to
  WebGL 2, but Three.js still documents it as evolving; its WebGL renderer remains supported.
- Keep current SVG/Canvas layers independent so a future 3D preview cannot spread through
  character, image, or project data models.

References: [CSS 3D transforms](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Transforms),
[Three.js renderer guidance](https://threejs.org/manual/pages/webgpurenderer),
[WebGPU API](https://developer.mozilla.org/en-US/docs/Web/API/WebGPU_API).

## Manageable code ownership

```text
src/
  app/                         composition and workspace coordination
  features/
    character/                 skeleton and character editing
    animation/                 reusable recipes/playback only when shared
    image-animation/           image import, masks, layers, feedback
  styles/                      global tokens and resets
```

Think of `app/` as coordinator and each feature directory as a small work team. Components
and helpers are child tasks with one owner and a narrow interface. Assign work by feature or
non-overlapping files; avoid literal manager/worker folders, duplicate logic, and shared-file
editing. See [Contributing](../docs/contributing.md) for task ownership and handoff.

## Official references

- [Svelte 5 documentation](https://svelte.dev/docs/svelte/overview)
- [Vite 8 release and support](https://vite.dev/blog/announcing-vite8)
- [TypeScript 7: Svelte tool compatibility guidance](https://devblogs.microsoft.com/typescript/announcing-typescript-7-0/)
- [Web Animations API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API/Using_the_Web_Animations_API)
- [SVG repeating patterns](https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorials/SVG_from_scratch/Patterns)
- [Browser animation performance](https://web.dev/articles/animations-guide)
- [Vite npm releases](https://www.npmjs.com/package/vite), [Svelte npm releases](https://www.npmjs.com/package/svelte), [TypeScript npm releases](https://www.npmjs.com/package/typescript)
