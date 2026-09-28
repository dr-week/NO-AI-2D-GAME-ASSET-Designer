# Workflow groups

## Goal

Make the first choice clear: create artwork or animate artwork. Keep the canvas central,
show common actions first, and reveal advanced controls only when relevant.

## Current state

The drawer already has two groups: `CREATE` (Character, Landscape) and `ANIMATE` (Image
animation). These labels do not yet map cleanly to actual tasks:

- Image animation also creates a composition by importing images and adding text.
- Character Wave playback is inside Character.
- Landscape material motion is inside Landscape.
- Character and landscape do not yet share a saved project/library flow.

Do not imply that assets can move between these tools until a shared project contract exists.

## Recommended two-stage workflow

1. **Create** — Character, Landscape, Image & text composition. Start from blank, a template,
   or a random starting point. Keep each tool's canvas and local controls.
2. **Animate** — Character pose/clip, image/text motion, landscape material loops. Select an
   available asset or stay in its current editor; show only controls supported by that asset.
3. **Export** — Keep export beside the asset preview in both stages. Use the same label and
   confirmation pattern. Do not add an export-only drawer destination.

The two groups describe work stages, not new backend services. Until cross-feature project
storage exists, animation opens from each feature's own editor; do not show a fake shared
asset picker.

## Random creation

- Keep `Random character`, `Random scene`, and `Random animation` in their matching editors.
- Add one optional `Surprise me` action to the Create landing only when that landing can show
  the generated asset type and let the user reroll, keep, or edit it.
- Randomize bounded recipe fields with a recorded seed. Never replace current work without a
  visible result and a keep/discard decision.
- Keep thumbs up/down next to the generated preview; show that feedback is local.

## Screen hierarchy

- Drawer: only the two top-level stages and current tools. Preserve selection when collapsed.
- Stage screen: page title, one primary action, canvas, then task controls.
- Common controls: random/start, undo/reset, preview, export; only expose actions the tool
  actually supports.
- Advanced controls: templates, material details, bones/joints, and import options behind a
  labeled disclosure; keep frequently used controls visible.
- Mobile: drawer becomes a dismissible navigation sheet; tools and canvas stack, primary
  actions stay reachable.

## Delivery order

1. Align copy and drawer grouping with the actual create/animate stages; keep three current
   editors and their ownership boundaries.
2. Move character and landscape animation controls into clearly labeled `Animate` subsections
   without splitting shared state prematurely.
3. Add a Create landing and cross-feature random entry after instrumenting the current
   per-tool random actions and defining keep/reroll behavior.
4. Add shared asset selection only with a versioned project contract, persistence, and
   restore/export tests.

## Success checks

- A new user can find a blank, template, or random starting path without reading docs.
- The user can identify the current stage and active tool after drawer collapse/restore.
- Every random action states what it changes and can be rerolled without losing kept work.
- No button promises cross-feature transfer, save, or export that the current tool cannot do.
- Keyboard navigation, labels, focus, and reduced-motion behavior work in both stages.

## Research

- [Apple design principles](https://developer.apple.com/design/human-interface-guidelines/design-principles) — clear organization, direct task access, recovery, hierarchy, concise labels.
- [Apple layout guidance](https://developer.apple.com/design/human-interface-guidelines/layout) — group related controls, align them, and progressively reveal secondary choices.
- [Apple sidebar guidance](https://developer.apple.com/design/human-interface-guidelines/sidebars) — group hierarchy, hide/show sidebar, use recognizable destinations.
- [Apple disclosure controls](https://developer.apple.com/design/human-interface-guidelines/disclosure-controls) — keep likely actions visible and hide less-used detail behind clear disclosure.
- [Material Design motion principles](https://m2.material.io/design/motion/understanding-motion/) — motion should explain relationships and focus attention.
