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
- Torso and matching left/right arm and leg bone lengths have bounded 70–130% controls.
- Export the current character pose as standalone transparent SVG; omit editor-only overlays.
- Provide a separate Landscape workspace that generates editable starter scenes locally as SVG,
  with coast, hills, and mountain presets and no required image import.
- Landscape supports flat, seeded grain, and seeded ripple materials; optional material motion
  repeats seamlessly and keeps the scene seed reproducible.
- Landscape exposes a curated art-style catalog with category, region, tags, and seeded SVG accents. New user scenes and saved templates reference stable style IDs; imported template records are validated.
- Seeded landscape ridges use smooth, bounded profiles and reproduce exactly for the same seed.
- Landscape recipes can be saved locally, reloaded, deleted, and transferred through validated JSON backup files.
- Provide image and text layers, basic motion preview, versioned image-project JSON, and SVG export.
- Laya accepts deterministic pose, proportion, bone-length, and reset commands. Validate
  commands locally against the existing character limits; keep manual controls available.

## Later phases
1. Extend the built-in Wave clip with additional bounded clips and editable timing; add a timeline
   only after playback needs are measured.
2. Add character templates/projects with versioned JSON and a clear backup/import path.
3. Add editable image paths, mask correction, pattern tiles, and wave motion as separate slices.
4. Add PNG and frame-sequence export when prioritized; use deterministic frame timing.
5. Optional non-LLM Laya System 1 inference may map typed choices and scores to validated
   controls. Keep manual controls; no inference runtime is included.
6. Clothing, colors, gradients, and shadows remain later character styling work.

Image-animation trials and local like/dislike logs are implemented. Ratings never train or
modify the app; users can download the log.

## Constraints
- TypeScript and SCSS; no Python or game engine.
- Small-team maintainability; browser application with no required backend.
- Target ordinary CPUs; minimum hardware remains unmeasured.
- Accessible labels, keyboard controls, visible focus, and recoverable errors.

## First character acceptance
T-pose fits the canvas, limbs connect at defined joints, background stays
transparent, and body shapes follow the skeleton during limited shoulder, elbow,
hip, and knee rotations. Proportion controls resize visible shapes without moving
joints. Symmetric bone-length controls resize the rig; pose, bone lengths, and shape
proportions reset independently.
The built-in Wave clip loops within joint limits. Play, pause, and scrub update the same pose;
manual posing and reset pause playback.

For the image-animation workflow and limits, see
[Layered illustration animation](workflows/layered-illustration-animation.md).
