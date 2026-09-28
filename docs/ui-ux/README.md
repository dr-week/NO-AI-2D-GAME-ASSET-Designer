# UI/UX scripts

Text specifications for user journeys, screen copy, and interactions.
These are design nodes, not a runtime node graph.

## Nodes
| Tag | Folder | Section |
|---|---|---|
| UI-01 | [01-workspace](01-workspace/script.md) | Shell and canvas |
| UI-02 | [02-character](02-character/script.md) | Character and skeleton |
| UI-03 | [03-appearance](03-appearance/script.md) | Clothing and styling |
| UI-04 | [04-animation](04-animation/script.md) | Poses and timeline |
| UI-05 | [05-project](05-project/script.md) | Save, load, export |
| UI-06 | [06-image-animation](06-image-animation/script.md) | Image layers and motion |

## Format

Each script records tag, status, purpose, controls, flow, and key states. Keep tags stable
when folders move. Add a child tag (for example UI-02.01) only when a distinct interaction
needs its own specification. Status is a snapshot: distinguish implemented, partial, and
planned behavior. Planned controls describe intent; they are not implementation evidence.


