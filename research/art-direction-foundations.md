# Art direction foundations

## Scope

Material Design governs interface surfaces and motion; it is not a required illustration
style. Use its motion principles for the editor UI. Let users choose an illustration style
for exported art instead of forcing Material-like shapes onto every scene.

## Repeatable artist workflow

1. Pick intent: mood, subject, focal point, and viewing scale.
2. Block composition and large silhouettes; test in one color and at thumbnail size.
3. Separate foreground, middle ground, and background with overlap, size, value, and color.
4. Lock light direction and a small palette; check grayscale and focal contrast.
5. Add secondary shapes, edges, and texture only where they support the focal point.
6. Check the result at export scale and revise the recipe, not individual random marks.

## Landscape rules

- Define a horizon or framing device, focal region, and empty space before decoration.
- Keep near shapes larger and more contrasted; simplify and soften distant layers.
- Use coherent ridge shapes, varied spacing, overlap, and asymmetry; avoid equal waves or
  independent point noise.
- Keep texture below silhouette contrast. Seed it separately so changing material does not
  unexpectedly move the composition.
- Add optional authored foreground objects (trees, rocks, buildings) only after a layout rule
  makes their scale and placement readable.

## Character rules

- Judge the outer silhouette first; verify head, torso, limbs, hands, and feet remain distinct
  at thumbnail scale and against light and dark backgrounds.
- Design gesture and weight before detail. The rig pose is a construction aid, not the final
  silhouette; a straight T-pose should remain an editing pose.
- Use a small shape vocabulary and consistent contour/edge treatment. Change proportions with
  anatomy-aware contours, not only wider strokes and ellipses.
- Preserve clear limb overlap and attachment during poses. Keep art contours separate from
  joints, bones, and rig metadata so either can evolve without duplicating pose rules.
- Defer faces, clothing, shading, and deformation until silhouette and pose read well.

## Shared style recipe

Future recipe fields should be bounded and serializable: `styleId`, composition/layout,
silhouette parameters, palette, light direction, edge/outline treatment, texture level, and
seed. Keep the current preset defaults stable; add fields through versioned migrations. Do not
add a style engine until one style parameter is shared by at least two templates.

## Current code gap

- Landscape already has three depth bands, seeded smooth ridges, palettes, and separate SVG
  material patterns. It lacks editable focal/layout controls and foreground object rules.
- Character has a validated joint skeleton and proportion controls, but renders limbs as thick
  strokes with ellipse hands/feet. It lacks authored contour shapes and a silhouette check.
- Neither editor provides grayscale/thumbnail review. These are the next low-cost quality
  checks; adding more random detail is not.

## Sources

- [Material Design: understanding motion](https://m2.material.io/design/motion/understanding-motion/) — informative, focused, expressive motion and hierarchy.
- [Material Design: duration and easing](https://m1.material.io/motion/duration-easing.html) — short, purpose-driven UI movement and context-sensitive timing.
- [Open University illustration guidelines](https://brand.open.ac.uk/designer-brand-guidelines/creating-illustrations.php) — simple shapes, consistent visual rules, and legibility.
- [Creative Bloq: shape in character art](https://www.creativebloq.com/art/digital-art/how-shape-can-make-or-break-your-character-art) — silhouette, spacing, and flow before detail; one artist's process, not a universal rule.
- [Creative Bloq: structuring matte paintings](https://www.creativebloq.com/art/digital-art/how-to-structure-a-matte-painting-to-create-a-cinematic-environment-game-concept-or-personal-illustration) — composition/value block-in and depth separation before texture.
- [Procedural 2D art notes](procedural-2d-art.md) — local generation, seed, and SVG constraints.
