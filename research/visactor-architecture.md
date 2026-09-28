# VisActor architecture fit

## What it is

VisActor separates visualization into three layers: **VRender** draws and groups graphical
primitives; **VGrammar** maps data/state into marks and coordinates transitions; **VChart**
packages chart types and chart-specific interactions. The stack targets data visualization,
not general illustration editing.

## What fits 2D Maker

| Concept | Current equivalent | Gap / action |
|---|---|---|
| Scene tree: nodes, groups, transforms | Image editor has layers; character has joints; landscape emits one SVG string. | Add a shared tree only when grouping, cross-feature documents, or object selection are required. |
| Declarative visual recipe | Landscape preset/seed and image motion definitions. | Keep bounded, typed recipes; validate persisted input. Don’t serialize executable callbacks. |
| Data/visual mapping | Feature models derive SVG from validated inputs. | Keep model output independent of Svelte controls and renderer markup where editing is required. |
| Animation lifecycle | Image CSS motion and character requestAnimationFrame clip. | Future common track schema should target stable node IDs and sample a fixed time for export. |
| Rendering backend | SVG DOM and SVG string export. | Keep SVG canonical for current vector outputs; Canvas is a measured preview optimization, not a required rewrite. |
| High-level presets/components | Character, Landscape, and Image tools. | Keep these feature-owned. A chart component layer has no current product role. |

## Minimum architecture requirements

1. Versioned, validated artwork document with stable IDs and explicit asset kinds.
2. Tree only if layers need nesting: group, shape/path, text, and image nodes with bounded
   attributes and local transforms.
3. One model-to-SVG rendering boundary; preview and export consume the same document snapshot.
4. Animation references target IDs, has bounded timing/easing/loop settings, and samples from
   explicit time. Keep preview clock separate from deterministic export time.
5. Keep selection, hit testing, undo, and editor events outside pure geometry/generation rules.
6. Add migrations and contract checks at JSON/import boundaries before changing stored schema.

These are adoption criteria, not a request to build a general graphics engine now. Current
feature models already validate recipes and derive deterministic SVG. First unify the document
only when project/library or editing workflows need to move assets across feature boundaries.

## Decision

Do not add VChart, VGrammar, or VRender as dependencies now. VChart is chart-specific; adopting
all three would duplicate existing SVG and feature logic. Revisit a renderer package only if
measured scene size, hit testing, or interaction performance exceeds the current browser-native
SVG approach. Borrow the separation of document/spec, scene representation, renderer, and
feature-level tools without copying the full stack.

This architecture does not require an LLM. Do not add VisActor's separate intelligent modules
to the deterministic rendering or Laya path.

## Sources

- [VisActor architecture overview](https://visactor.io/vchart/contributing/sourcecode/1-vchart-basic-principles) — VRender → VGrammar → VChart layering and module responsibilities.
- [VRender graphic tree](https://visactor.io/vrender/guide/asd/Basic_Tutorial/Graphic) — node/group structure and primitive attributes.
- [VRender stage and layers](https://visactor.io/vrender/guide/asd/Basic_Tutorial/Create_Instance) — stage lifecycle and graphics layers.
- [VGrammar project](https://github.com/VisActor/VGrammar) — visual specs, transforms, scales, marks, and interactions.
- [VisActor animation design](https://www.visactor.io/blog/magic-frame) — animation separated from data flow with enter/update/exit/state phases.
- [VChart project](https://github.com/VisActor/VChart) — chart layer built over VGrammar and VRender.
