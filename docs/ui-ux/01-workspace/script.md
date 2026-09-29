# UI-01 · Workspace

Status: Implemented; workflow guidance in [workflow groups](../workflow-groups.md). Left drawer groups Character and Landscape under Create, and Image animation under Animate. Toggle collapses it to an icon rail.

## Layout

1. Header: app name and drawer toggle.
2. Left drawer: grouped software sections; active workspace is highlighted.
3. Main area: selected workspace and its controls.
4. Narrow screens: drawer becomes an icon rail; labels remain available as tooltips.

## Workflows

| Group | Sections |
|---|---|
| Create | Character · Landscape |
| Animate | Image animation |

Keep workflow controls separate. Show only controls supported by the active mode.

## Flow

Choose a section → edit in that workspace → preview or export. Add navigation only when a usable workspace exists.

## States

Character edits a T-pose SVG; Landscape creates SVG scenes; Animation edits layered
images and text. Keep visible focus, section labels, and reduced motion. Do not list planned
sections as active navigation.
