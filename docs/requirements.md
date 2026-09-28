# Requirements

## Product
Create editable 2D characters and simple layered motion-graphic scenes for small
animation studios.

## Initial scope
- Front-facing T-pose; transparent background.
- Scalable proportions; 1080 × 1920 portrait preset, not a fixed character size.
- Connected head, neck, torso, arms, hands, waist, and legs.
- Skeleton defines joints, bone lengths, and rotation limits.
- Body shapes follow the skeleton; invalid geometry is rejected.
- Head size and torso, arm, and leg widths have bounded controls; current edit range is 70–130%.

## Later phases
1. Clothing, colors, gradients, and shadows.
2. Reusable poses and keyframe animation.
3. Project files and exports. The image-animation workspace has versioned JSON
   save/open, one size-limited browser save/restore slot, and animated SVG export.
   Automatic autosave, character projects, PNG export, and frame sequences remain planned.
4. Laya maps text requests to validated, predefined character decisions.
5. Extend image scenes with editable paths, pattern tiles, and wave motion. Current tools
   support raster masks, editable SVG text layers, basic transforms/entrances, JSON projects,
   and SVG export.

Image-animation trials and local like/dislike logs are implemented. Ratings never train or
modify the app; users can download the log.

## Constraints
- TypeScript and SCSS; no Python or game engine.
- Single-maintainer scope; browser application with no required backend.
- Target ordinary CPUs; minimum hardware remains unmeasured.
- Accessible labels, keyboard controls, visible focus, and recoverable errors.

## First character acceptance
T-pose fits the canvas, limbs connect at defined joints, background stays
transparent, and body shapes follow the skeleton during limited shoulder, elbow,
hip, and knee rotations. Proportion controls resize visible shapes without moving
joints; pose and proportions reset independently.

For the image-animation workflow and limits, see
[Layered illustration animation](workflows/layered-illustration-animation.md).
