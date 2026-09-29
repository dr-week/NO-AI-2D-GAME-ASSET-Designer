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

## Design decision flow

Resolve a brief into **intent → composition → silhouette → palette/light → detail → motion**.
Keep these as separate bounded choices; apply a named recipe, preview it, then let the artist
adjust individual controls. Seeded variation changes placement inside the recipe, never its
hierarchy. For motion, use soft symmetric easing for looping idle movement and a quick settle
for entrances; keep scale/translation small and preserve a still/reduced-motion outcome.

## Landscape rules

- Build each scene on four independent axes: landform, environment, lighting, and illustration
  style. Palette and material are finishing controls; they must not replace those axes.
- Block foreground, middle ground, and background first. Separate them with overlap, scale,
  contrast, and softer/lighter distant values. Keep a focal area and intentional empty space.
- Shape geology and plant silhouettes to the environment: dunes/cacti, forest tree masses,
  tropical palms, alpine peaks/pines, arctic ice, or alien forms. Keep object placement in
  asymmetric edge groups so the center can stay open for a focal subject.
- Use a coherent horizon, light direction, and time-of-day sky. Day, warm low sun, and night
  should change sky values and celestial elements, not only hue. Keep biome and lighting
  combinations readable.
- Stage night skies with a few legible constellation groups, sparse supporting stars, and a
  seed-selected moon phase. Reserve aurora/nebula accents for matching environments; avoid an
  even field of same-size dots.
- Use seeded variation inside these art-directed bounds. Avoid evenly scattered dots,
  repeated equal waves, or independent point noise. Reuse one seed for repeatable previews,
  saves, and exports.
- Generate composition before dressing: open panorama, framed valley, overlook, island chain,
  canyon passage, or dune sweep. Each grammar controls depth layers, silhouette framing, water,
  and the focal/negative-space region; environment props follow that layout.
- Keep light and world palette coordinated. Night shifts the full value structure; water and
  foreground must not be hidden by opaque terrain fills. Test the layer stack at thumbnail size.
- Keep texture below silhouette contrast. Add decoration only after large value shapes read
  at thumbnail size and in grayscale.
- Treat geographic or cultural style profiles as researched art direction, separate from
  biome. Verify region-specific landforms and flora; do not use cultural motifs as generic
  decoration.

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

## Current landscape system

- Landscape now has three landforms, six seeded composition grammars, six environment profiles,
  four lighting states, three color moods, three illustration profiles, and SVG material patterns.
  Scene recipes keep axes separate and deterministic. Legacy recipes derive a stable composition.
- SVG output remains authored starter art. It is not professional concept art or a claim of
  geographic accuracy. Next: artist-reviewed CC0 asset/template intake, regional reference
  sheets, and visual review at thumbnail/export scale. Do not add random detail as a quality proxy.
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
- [Getty: foreground, middle ground, and background](https://www.getty.edu/education/for_teachers/curricula/landscapes/lesson02.html) — landscape depth and compositional planes.
- [NASA: vegetation indices](https://science.nasa.gov/earth/earth-observatory/measuring-vegetation-ndvi-evi/) — vegetation density varies with environmental conditions; use as ecological reference, not a palette formula.
- [Disney Animation: visual development](https://www.disneyanimation.com/process/visual-development/) and [lighting](https://www.disneyanimation.com/process/lighting/) — composition, color keys, light, and story mood.
- [Disney Animation: Layout](https://www.disneyanimation.com/process/layout/) — block staging, framing, and visual clarity before polish.
- [Disney Animation SIGGRAPH: Myth, a Frozen Tale](https://media.disneyanimation.com/technology/publications/2020/myth_siggraph_2020.pdf) — depth-coded color ramps, silhouette framing, and restrained graphic texture for a stylized environment.
- [Disney Animation SIGGRAPH: The Atmosphere of Raya and the Last Dragon](https://media.disneyanimation.com/technology/publications/2021/the-atmosphere-of-raya-and-the-last-dragon.pdf) — art-directed atmosphere, silhouettes, tonal masses, and a reusable artist-controlled asset library.
- [OpenGameArt CC0 background collection](https://opengameart.org/content/cc0-backgrounds) and [CC0 vector landscape example](https://opengameart.org/content/flat-game-bg) — candidate artist-authored starter assets; verify item-level source, file, and license before bundling.
- [Disney Animation: look development](https://disneyanimation.com/process/look-development/) — develop material and surface appearance from defined shapes; supports solving silhouette before finish detail.
- [MDN: animation performance](https://developer.mozilla.org/en-US/docs/Web/Performance/Guides/Animation_performance_and_frame_rate) and [reduced motion](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/%40media/prefers-reduced-motion) — favor efficient properties and respect reduced-motion preference.
- [Disney Animation: Discover Kumandra](https://www.disneyanimation.com/kumandra/) — distinct landforms and environments support place and story identity.
- [Pixar in a Box: color scripts](https://www.khanacademy.org/computing/pixar/art-of-lighting/introduction-to-virtual-lighting/v/colorscripts) — plan color and light across scenes as a coherent sequence.
- [Procedural 2D art notes](procedural-2d-art.md) — local generation, seed, and SVG constraints.
