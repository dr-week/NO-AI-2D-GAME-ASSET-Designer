# Animation systems: concepts and fit

Reviewed: 2026-09-28. This is a design comparison, not a benchmark or a claim of
feature parity. The linked documentation is authoritative for each project. No upstream
source code is copied into this application.

## What these systems do

| System | Main job | Technology / format | Useful concepts | Fit here |
|---|---|---|---|---|
| [SVGator](https://www.svgator.com/) | Visual SVG animator and exporter | Browser editor; exports animated SVG with CSS or JavaScript | Target SVG elements, author property animation, configure playback/export | Product reference for a later visual timeline; not needed to implement first templates |
| [Anime.js](https://animejs.com/documentation/) | General JS animation engine, including SVG | JavaScript/TypeScript library; targets DOM/SVG and offers timelines, easing, callbacks, playback controls | Timeline is ordered clips with offsets/labels; seek/play/pause/reverse; compose animations | Useful design reference; native WAAPI is enough for the first bounded templates |
| [Web Animations API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API/Using_the_Web_Animations_API) | Browser playback/control API | Built-in browser API; `Element.animate()` and `Animation` | Keyframes + timing are separate; playback state can be controlled and queried | Best initial playback layer; no added dependency |
| [SVG animation](https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Element/animateTransform) | Self-contained declarative SVG motion | SVG `<animate>`, `<animateTransform>` elements | SVG can encode transform and attribute interpolation in the file | Possible simple loop export; validate target browser behavior and export constraints |
| [Rive](https://rive.app/editor) | Interactive real-time graphics authoring/runtime | Rive editor and `.riv` runtime format | State machines connect named inputs/events to animation states | Reference for future interactive clips; a separate format/runtime is beyond current scope |
| [Lottie / dotLottie](https://docs.lottiefiles.com/en/runtimes/distributions/js) | Playback of authored vector animation | JSON or `.lottie`, rendered by player runtime | Art/animation asset is distinct from playback host; playback, theme, layout, states | Potential import/playback compatibility later, not a native authoring model |
| [Inochi2D](https://docs.inochi2d.com/en/latest/) | Parameter-driven 2D puppet deformation | Layered art, mesh deformation, parameterized runtime | Parameters drive mesh/texture parts; deforms layered art to suggest depth | Relevant to advanced character rigs, but heavier than current SVG scope |
| [Iki](https://github.com/zeikar/iki) | Early web-native 2D puppet engine/editor | TypeScript, WebGL2 runtime, JSON `.iki` model | Parts bind parameters to transform channels; format + validator separated from runtime/editor | Architecture reference only; early project and WebGL2 add cost we do not need yet |
| [Synfig](https://synfig.readthedocs.io/en/stable/) | Desktop 2D vector animation authoring | Native desktop timeline/layers; imports SVG with limitations | Keyframes, interpolation/tweening, layers | Reference for animator concepts; not a browser runtime dependency |

## Shared concepts

1. **Addressable artwork:** elements have stable names/IDs and clear draw order. A motion
   clip targets these IDs instead of duplicating artwork or embedding selectors everywhere.
2. **Rig/pivots:** a part has a local transform and pivot. Child parts inherit parent
   transforms; rotating an arm group around its shoulder gives coherent rigid motion.
3. **Parameters and bindings:** named values (for example `armRaise`, `blink`, `sway`)
   map a bounded input range to one or more transform channels. Input meaning stays in
   the rig; playback need not know user-interface details.
4. **Keyframes and interpolation:** keyframes map time to property values. Easing controls
   how a value travels between keys. A timeline schedules tracks by start time, duration,
   and loop settings.
5. **Separation of data and playback:** a validated clip/recipe describes intent; a
   renderer or playback adapter applies it. This makes deterministic preview, save/load,
   and export possible without embedding behavior across components.
6. **Validation and versioning:** loaded projects and imported animation data are
   untrusted input. Validate target IDs, property names, numeric ranges, durations, and
   version before rendering.

These concepts do not require an LLM. Templates can be hand-authored data and generated
variations can use a seed plus bounded numeric ranges.

## Proposed 2D Maker architecture

Keep the app-owned model small and specific to needed features:

```text
Artwork (SVG groups / raster layers)
  └── Rig (stable target IDs, parent, pivot, allowed channels/ranges)
        └── Clip (tracks, keyframes, timing, easing, loop)
              └── Playback adapter (WAAPI now; other renderer only if justified)
```

- `character/` owns the skeleton and joint constraints.
- `animation/` owns clip/track types, template recipes, validation, deterministic
  variation, easing mapping, and playback lifecycle.
- Feature components pass selected targets and user settings to animation helpers; they
  do not each implement their own timing or randomization rules.
- Keep SVG rendering app-owned. For image layers, apply motion to one wrapper `<g>` per
  layer; keep source image and mask geometry separate from animated transform state.
- Expose a narrow controller (`play`, `pause`, `seek`, `stop`/`dispose`) when playback
  becomes shared. Do not introduce a generic plugin/engine interface before a second
  renderer is actually required.
- A template is data, not a second animation implementation. It selects eligible targets,
  allowed channels, default ranges, timing, easing, and loop behavior. User variation
  stays within those bounds.

## Implementation path

### 1. Foundation: clips on current SVG

- Align existing `AnimationTemplate`/`AnimationVariant` types with what can actually be
  rendered. Current recipes are data only; do not label them playable yet.
- Add stable SVG target IDs and explicit pivots for the first character parts.
- Implement only transform/opacity tracks first. Reject missing targets, unsupported
  channels, non-finite values, and values outside the rig/template bounds.
- Use Web Animations API for preview control; retain CSS for existing simple image loops.
- Add a small template picker with a handful of hand-authored clips (breathe, sway, wave,
  bounce). Keep seeded variations optional and repeatable.

### 2. Save and export

- Store project artwork references, rig, clips, and version in JSON; validate on load.
- Add pause/seek/reset before building a timeline UI.
- Export still SVG first. Add self-contained animated SVG only for supported tracks and
  test the exported file independently in supported browsers.
- If offline frame rendering or video export arrives, evaluate fixed-time sampling and
  PNG sequence before adding a rendering dependency.

### 3. Advanced animation only after evidence

- Add path deformation or mesh skinning only when transform-based joints cannot meet the
  character acceptance criteria. Measure mesh complexity and CPU/GPU needs first.
- Consider Anime.js if native WAAPI cannot meet demonstrated timeline composition needs.
- Consider Inochi2D/Iki/Rive/Lottie interoperability only with a concrete import/export or
  runtime requirement, format-compatibility review, license review, and prototype.
- A full keyframe editor is its own scope: timeline tracks, selection, drag editing,
  snapping, undo/redo, and project persistence. Do not hide that cost inside “templates.”

## Guardrails

- No model or LLM is needed for template selection, random variation, or playback.
- Do not copy vendor source or formats piecemeal. Follow upstream license and attribution
  requirements if a dependency or code is ever adopted.
- Avoid arbitrary SVG selectors, arbitrary JavaScript in project files, and unbounded
  values. A template should only animate validated IDs and channels.
- Respect reduced motion and provide pause/stop where loops run in the editor.
- Keep the first release browser-native and CPU-friendly. Profile before adding WebGL,
  workers, or animation libraries.

## Documentation read

- Existing product and implementation docs: `docs/requirements.md`, `docs/design.md`,
  `docs/workflows/layered-illustration-animation.md`, `docs/ui-ux/04-animation/script.md`,
  `docs/ui-ux/06-image-animation/script.md`, `research/animation-sdk-scan.md`.
- Upstream references: Anime.js Timeline and playback docs; MDN Web Animations API, SVG
  `animateTransform`, and transform-origin docs; SVGator export help; Rive editor overview;
  dotLottie JS player docs; Inochi2D overview; Iki README; Synfig artwork import docs.

## References

- [Anime.js timeline](https://animejs.com/documentation/timeline/) · [timeline controls](https://animejs.com/documentation/timeline/timeline-methods/)
- [MDN Web Animations API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API/Using_the_Web_Animations_API) · [Animation interface](https://developer.mozilla.org/en-US/docs/Web/API/Animation)
- [MDN SVG `animateTransform`](https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Element/animateTransform) · [SVG transform origin](https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Attribute/transform-origin)
- [SVGator export](https://www.svgator.com/tutorials/export-options-explained) · [Rive editor](https://rive.app/editor)
- [dotLottie web player](https://docs.lottiefiles.com/en/runtimes/distributions/js) · [Lottie format specification](https://github.com/lottie/lottie-spec)
- [Inochi2D docs](https://docs.inochi2d.com/en/latest/) · [Iki project](https://github.com/zeikar/iki)
- [Synfig SVG import](https://synfig.readthedocs.io/en/stable/artwork_import.html)
