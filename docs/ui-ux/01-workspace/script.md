# UI-01 · Workspace

Status: Character and Image Animation selector implemented as a labelled radio group; drawer layout and canvas presets planned.

## Layout

1. Header: Character / Scene workflow switch.
2. Left drawer: workflow controls.
3. Center: canvas and preview.
4. Canvas toolbar: 9:16 Story (default), 16:9 Landscape.
5. Right drawer: selected layer or object settings; collapsible.
6. Narrow screens: drawers open as accessible sheets above the canvas.

## Workflows

| Workflow | Left drawer sections |
|---|---|
| Character | Character · Rig · Motion |
| Scene | Background · Layers · Motion |

Keep workflow controls separate. Show only controls supported by the active mode.

## Flow

Choose workflow → choose canvas ratio → edit in its drawer → preview on canvas.
Keep the selected ratio when switching sections. Let users change it later.

## States

Character currently shows a T-pose SVG with bone/joint toggles and reset. Image Animation
edits imported layers. Workflow drawers, 9:16/16:9 presets, and mobile drawer sheets are
planned. Native radios provide single-choice and arrow-key selection. Keep visible focus,
labels, and reduced motion. See [W3C radio group guidance](https://www.w3.org/WAI/ARIA/apg/patterns/radio/).
