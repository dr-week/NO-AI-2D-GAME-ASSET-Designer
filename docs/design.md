# Design

## Product shape

2D Maker is a local-first browser editor for procedural 2D characters and layered
motion graphics. Runtime needs no backend or LLM. Features use explicit controls,
validated data, and deterministic recipes.

## Stack and flow

- Svelte 5, TypeScript, SCSS, Vite, inline SVG.
- UI input → feature-owned state and validation → SVG rendering and playback.
- Browser APIs first; add dependencies only for a demonstrated need.

## Code boundaries

```text
src/
  app/                           workspace shell and feature composition
  features/
    animation/themeEngine.ts     shared motion templates and recipes
    character/
      model/                     skeleton and geometry rules
      ui/                        character controls and SVG canvas
    image-animation/
      io/                        image/project import and local persistence
      model/                     layer types, masks, and mask geometry
      ui/                        editor, layer controls, canvas, feedback
  styles/                        global tokens and shared base styles
  main.ts                        browser entry point
```

- Each feature folder owns its behavior. `ui/` contains Svelte views, `model/` contains
  data and pure rules, and `io/` contains browser file/storage boundaries. Create a
  category folder only when it groups real files.
- `character/model/` owns skeleton, geometry, and bounded proportion data; `character/ui/` owns controls/rendering.
- `animation/themeEngine.ts` owns shared motion definitions, templates, and recipes.
- `image-animation/` owns raster import, masks, layer controls/rendering, projects, and
  feedback. Keep files within their role folders.
- A feature owns its data model and rules. Other code calls its public helpers or
  component props; it does not copy the logic or reach into internal state.
- `app/` composes features. Keep feature behavior out of the shell.
- Add a shared module only when at least two real callers need the same behavior and
  the abstraction has one clear owner. Otherwise keep code with its feature.
- Create new folders when implementation needs them; planned features do not need
  placeholder directories.

## Data and animation

- Validate user files and persisted data at their boundary. Keep IDs stable where data
  refers to SVG targets or saved records.
- Keep motion definitions and templates in one owner. Preview and export read the same
  transform, opacity, loop, and duration data. Seeded inputs produce repeatable variations.
- Use SVG groups and explicit pivots for rigid part motion. Use path/control-point data
  for deliberate shape deformation; transforms alone do not reshape a limb.
- Use CSS for simple loops. Use Web Animations API when pause, seek, reverse, or runtime
  composition is needed. Use fixed timestamps for deterministic frame export.
- Raster masks describe visible pixels; they cannot restore occluded backgrounds.
- Keep user projects and feedback local unless a separately scoped feature adds transfer.
  Ratings do not train or change generation rules.

Current image motion uses CSS presets selected through bounded templates. Image projects
can be downloaded as versioned JSON or saved as one size-limited browser-local snapshot.
SVG image and text layers share motion definitions for CSS preview and SVG export. Material-
inspired fade/slide entrances are single-layer effects, not the full Material transition
system. This is not remote backend sync. Feedback uses bounded `localStorage`, optional
user-selected folder append, and JSONL download. Adopt WAAPI when pause, seek, or runtime
composition is needed. Profile before adding dependencies or workers. Validate imported
and persisted values. See
[Web Animations API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API/Using_the_Web_Animations_API)
and [animation performance](https://web.dev/articles/animations-guide).

## Change documentation

- `requirements.md` is the product scope and acceptance criteria.
- `docs/ui-ux/` describes intended user flows and labels each node's implementation
  status. It is not proof that behavior exists.
- `workflows/` describes domain workflows and their limits.
- `issues.md` tracks unresolved questions that need evidence or a decision.
- Update only the docs affected by a change. Keep planned work labeled as planned and
  avoid copying the same full specification into multiple files.
- Keep one numbered handoff record per nontrivial change in `docs/contributions/`; record
  exact active files and checks, not copied specifications.

See [Contributing](contributing.md) for the collaboration workflow.
For the stack review, see [technology and architecture](../research/stack-and-architecture.md).
For animation-system comparisons and a phased implementation path, see
[Animation systems](../research/animation-systems.md).
