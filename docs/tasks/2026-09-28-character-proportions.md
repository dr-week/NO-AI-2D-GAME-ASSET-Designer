# Character proportion controls

Status: implemented.

- Added independent head, torso, arm, and leg scale controls (70–130%).
- Kept proportion data in `character/model/`; canvas renders shapes from the existing skeleton.
- Updated UI-02, requirements, and design map.
- Checks: `npm run check`, `npm run build`.
- Limits: no bone-length, silhouette, clothing, or landscape authoring tools.

Architecture: [design](../design.md). UI: [UI-02](../ui-ux/02-character/script.md).
