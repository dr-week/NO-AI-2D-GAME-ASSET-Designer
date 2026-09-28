# Animation systems: concepts and fit

Reviewed: 2026-09-28. This is a design comparison, not a benchmark or a claim of
feature parity. The linked documentation is authoritative for each project. No upstream
source code is copied into this application.

## What these systems do

| System | Main job | Technology / format | Useful concepts | Fit here |
|---|---|---|---|---|
| [SVGator](https://www.svgator.com/) | Visual SVG animator and exporter | Browser editor; exports animated SVG with CSS or JavaScript | Target SVG elements, author property animation, configure playback/export | Product reference for a later visual timeline; not needed to implement first templates |
| [Anime.js](https://animejs.com/documentation/) | General JS animation engine, including SVG | JavaScript/TypeScript library; targets DOM/SVG and offers timelines, easing, callbacks, playback controls | Timeline is ordered clips with offsets/labels; seek/play/pause/reverse; compose animations | Useful design reference; native WAAPI is enough for the first bounded templates |
| [Web Animations API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API/Using_the_Web_Animations_API) | Browser playback/control API | Built-in browser API; `Element.animate()` and `Animation` | Keyframes + timing are separate; playback state can be controlled and queried | Use for controlled DOM effects; model-driven character poses currently use `requestAnimationFrame` |
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

## Theme and template fundamentals

Keep two meanings separate:

- A **visual theme** is a small set of semantic design tokens: color roles, typography,
  spacing, shape, and (if needed) motion character. Components consume tokens instead of
  repeating raw values. CSS custom properties already provide the scoped, reusable token
  mechanism; do not add a theme framework until the app needs selectable themes.
- An **animation template** is a versioned recipe for a specific visual purpose. Keep artwork
  separate. A recipe names eligible stable targets and typed channels, bounded values, timing,
  easing, loop/trigger behavior, and a reduced-motion outcome. Validate the recipe before
  playback or import; seeded variation stays inside declared bounds.

Use one flow: template data → validation → target binding → playback/export adapter. Preview
and export must interpret the same recipe. Do not store executable CSS or script in projects.
For this app, keep `animation/themeEngine.ts` as the existing canonical motion owner for now;
it currently owns motion presets and duration variants, not the visual theme tokens. Add typed
easing or per-target timing only when a template needs them, and keep the simple CSS loop path
for simple loops.

Start with a small purpose-led set: idle (breathe/float), entrance (fade/rise), emphasis
(brief pulse), and directional transition. Keep direction and distance modest, duration tied
to travel and emphasis, and easing consistent by motion purpose. Treat reduced motion as an
explicit alternate outcome, not an afterthought. The image preview already disables motion
for `prefers-reduced-motion`; keep exported/runtime behavior aligned as animation support
grows.

This follows design-system token practice (one semantic source for repeated visual values),
Material's informative/focused motion and duration/easing guidance, and browser guidance to
prefer CSS for simple effects, animate efficient properties, and honor reduced-motion
preferences. Sources: [USWDS design tokens](https://designsystem.digital.gov/design-tokens/),
[MDN CSS custom properties](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Cascading_variables/Using_custom_properties),
[Material motion principles](https://m2.material.io/design/motion/understanding-motion/),
[Material duration and easing](https://m1.material.io/motion/duration-easing.html),
[MDN CSS animation performance](https://developer.mozilla.org/en-US/docs/Web/Performance/Guides/Animation_performance_and_frame_rate),
[MDN reduced motion](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/%40media/prefers-reduced-motion),
and [MDN Web Animations API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API/Using_the_Web_Animations_API).

## Reference fit

- `profile.svg`: rotate a form, animate its corner radius, and fade a separate detail group.
  Current presets cover rotation and opacity; `rx` needs a typed shape track.
- `approach.svg`: combine a floating illustration with five timed text cards and a progress
  marker. Current presets cover float and text entrance; per-target delays and slide timing
  need a small sequenced clip model.
- Keep artwork grouped by target. Add only typed SVG properties and timing fields; never
  execute CSS or scripts loaded from project files.

## Proposed 2D Maker architecture

Keep the app-owned model small and specific to needed features:

```text
Artwork (SVG groups / raster layers)
  └── Rig (stable target IDs, parent, pivot, allowed channels/ranges)
        └── Clip (tracks, keyframes, timing, easing, loop)
              └── Playback (CSS for simple loops; rAF for model-driven poses; WAAPI if DOM controls need it)
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

## Character rig foundation

- Keep bone lengths and joint positions in the skeleton model; render body shapes from the
  resolved joints. Scaling a parent bone moves its descendants through the existing hierarchy.
- Use native SVG groups and explicit joint pivots when animated art parts are introduced.
  SVG transforms apply within nested coordinate systems; make pivots explicit instead of
  relying on implicit CSS transform origins.
- Defer mesh-weight deformation. It adds influence regions and subdivision controls that
  simple connected shapes do not need. See [SVG transforms](https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorials/SVG_from_scratch/Basic_transformations),
  [SVG transform origins](https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Attribute/transform-origin),
  and [Synfig skeleton deformation](https://wiki.synfig.org/Skeleton_Deformation_Layer) for
  the distinction between hierarchy and weighted deformation.

## Implementation path

### 1. Foundation: bounded clips

- Image/text recipes currently drive CSS motion; the character Wave clip uses typed joint
  keyframes, bounded sampling, and requestAnimationFrame playback/scrubbing.
- Keep those owners separate until a shared clip contract has more than one real caller.
- Validate joint limits and keyframe positions. Add target IDs/pivots only when character
  parts animate independently.
- Add other hand-authored clips only after the Wave flow is verified and prioritized.

### 2. Save and export

- Store character clips with artwork references, rig, and version in JSON when character
  project files are implemented; validate on load.
- Wave already supports play, pause, and scrubbing. Add a timeline only after multiple clips
  and persisted timing become user requirements.
- Character still SVG and image/text animated SVG export exist. Add self-contained character
  animation export only for supported tracks and test independently in target browsers.
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

- Current implementation and adoption triggers: `docs/status.md`,
  `docs/roadmap/technology-register.md`. Product boundaries: `docs/requirements.md`,
  `docs/design.md`, and the image/animation UI scripts.
- Upstream references: Anime.js Timeline and playback docs; MDN Web Animations API, SVG
  `animateTransform`, and transform-origin docs; SVGator export help; Rive editor overview;
  dotLottie JS player docs; Inochi2D overview; Iki README; Synfig artwork import docs.

## References

- [MDN SVG transform-origin](https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Attribute/transform-origin) documents native transform pivots. [OpenToonz Plastic docs](https://opentoonz.readthedocs.io/en/latest/create_animations_using_plastic_tool.html) describe deformable rigs; community reports point to added complexity and occasional performance cost ([OpenToonz issue #2248](https://github.com/opentoonz/opentoonz/issues/2248), [Reddit rigging discussion](https://www.reddit.com/r/2DAnimation/comments/1gvfto1/)).
- Product implication: keep our first character editor on deterministic SVG geometry and rigid joints; defer deformation/mesh rigs until demonstrated need. Exporting current SVG enables use in other tools while project format and animation remain unfinished.

- [Anime.js timeline](https://animejs.com/documentation/timeline/) · [timeline controls](https://animejs.com/documentation/timeline/timeline-methods/)
- [MDN Web Animations API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API/Using_the_Web_Animations_API) · [Animation interface](https://developer.mozilla.org/en-US/docs/Web/API/Animation)
- [MDN SVG `animateTransform`](https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Element/animateTransform) · [SVG transform origin](https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Attribute/transform-origin)
- [SVGator export](https://www.svgator.com/tutorials/export-options-explained) · [Rive editor](https://rive.app/editor)
- [dotLottie web player](https://docs.lottiefiles.com/en/runtimes/distributions/js) · [Lottie format specification](https://github.com/lottie/lottie-spec)
- [Inochi2D docs](https://docs.inochi2d.com/en/latest/) · [Iki project](https://github.com/zeikar/iki)
- [Synfig SVG import](https://synfig.readthedocs.io/en/stable/artwork_import.html)
