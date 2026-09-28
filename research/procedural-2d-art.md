# Procedural 2D art

Art-direction foundations are in [art-direction-foundations.md](art-direction-foundations.md).

## Product model

- Generate scenes from bounded recipes: composition, silhouettes, palette, material, and seed.
- Keep geometry editable as SVG; render material separately as a reusable SVG pattern.
- Use seeded randomness for repeatable variations; change recipe parameters, not structure.
- Animate normalized phase `p = (time mod duration) / duration`; match start and end states.
- Keep generation, material rendering, animation sampling, and UI controls in separate modules.

## Method selection

- Use templates/shape rules for recognizable scenes and characters; constrain where parts can go.
- Use seeded distributions/noise for organic variation such as ridges, clouds, and surface marks.
- Use coherent, low-frequency variation for silhouettes; independent per-point random heights look jagged.
- Use grammars or cellular rules for branching/repeating structures; defer until a real scene needs them.
- Use SVG patterns for repeatable surface materials; avoid embedding texture marks into base geometry.
- Vary a small set of authored parameters. Unbounded randomness weakens composition and style consistency.

## Preset workflow patterns

- Material Maker exposes reusable graphs and a community library; Krita organizes reusable resources and bundles.
- Both separate creation controls from saved resources. Keep our form fields in the Landscape tool drawer and saved recipes in a collapsible list.
- Show the generated preview while parameters change; save the recipe, not flattened output.
- Provide local save/load/delete and portable validated JSON backup before adding accounts or shared libraries.
- Test the whole user path: edit → preview → save → reload/apply → export → import → verify seed/settings → delete.

## UI and animation workflow findings

- Krita keeps the canvas, layer list, frame table, and transport in one animation workspace; infrequent settings sit in menus. OpenToonz separates reusable scene assets from their timed placement. Rive separates artboard editing, timelines, and state-machine behavior.
- After Effects groups searchable presets in one panel and supports category/folder/alphabetical views. Apply presets to selected layers; avoid duplicating apply actions elsewhere.
- Use a progressive flow: choose workspace → make or select asset → edit with only relevant controls → preview → save/export. Keep canvas visible while changing properties; collapse secondary controls.
- Taxonomy must separate axes: preset purpose (Loop, Entrance, Emphasis, Transition), target (Character, Scene, Layer, Text), and visual style (Retro, Soft, Playful). Don’t mix mood and purpose in one filter. Only expose style tags backed by actual behavior/palette rules.
- Current drawer should stay Character, Landscape, Animation. Add Library when saved projects and recipes have a real browse/apply flow; do not add placeholder destinations.
- Community threads repeatedly report terminology, timeline, and layer concepts as learning barriers. Treat these as anecdotal signals: use plain labels, empty-state guidance, and one action per step; validate with task-based user sessions before claiming usability.
- Feedback already has thumbs across generated character, landscape, and animation trials. A unified local JSONL export should capture category, settings snapshot, seed where present, rating, and timestamp; ratings remain human-review data, not automatic training.

## Visual style catalog

- Keep visual styles separate from animation motion presets. A landscape style record owns a stable ID, category, region/context, tags, short attribution note, and renderer ID.
- Keep the catalog code-owned and versioned; store only theme IDs and scene parameters in IndexedDB. This avoids duplicated style definitions in each saved artwork and needs no remote database.
- Seed procedural details from the scene seed. Theme switch changes ornament rules; “Vary” changes only the seed. Same style + scene + seed must reproduce the same SVG.
- Indian traditions are regional and internally varied. Name a specific inspiration (Warli, Maharashtra; Mithila, Bihar), describe the limited visual reference, and avoid labeling generated output as authentic or reproducing sacred/story content without a researched brief.
- Initial catalog uses one contemporary baseline plus geometric and botanical inspiration profiles. It is a procedural style demonstration, not a substitute for living artists or documented regional craft.
- Saved template card metadata should expose style, region/category, scene type, palette, and seed. Add a separate full asset library only when it supports browsing across feature types.

## Material and loop rules

- Start with low-cost vector marks and SVG `<pattern>` fills. Use `feTurbulence` only for optional
  noise; filters can cost more and render differently across browsers.
- Seamless pattern loops translate by exactly one tile over one duration, then repeat.
- For a loop of duration `T`, derive state from `p = (t mod T) / T`; ensure `state(0) = state(T)`.
- Use fixed time samples for export; do not use wall-clock time to render frames.
- Store recipe, seed, palette, and material settings; derive SVG for preview/export.
- Keep material motion opt-in and respect reduced-motion preferences.

## Current slice

Landscape supports flat, seeded grain, and seeded ripple. Optional motion translates one tile
over eight seconds. Ridge silhouettes now use seeded smooth value noise, limited detail noise,
and cubic SVG paths. No new dependency. Extend recipes to other features only when a second
caller needs the same model.

## Sources

- [MDN SVG patterns](https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorials/SVG_from_scratch/Patterns) — reusable tiled vector fills.
- [Apple coherent noise source](https://developer.apple.com/documentation/gameplaykit/gkcoherentnoisesource) — seeded noise where nearby samples vary smoothly, suited to terrain-like forms.
- [MDN SVG paths](https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorials/SVG_from_scratch/Paths) — cubic Bézier curves for smooth vector silhouettes.
- [Terrain generation survey](https://odr.chalmers.se/server/api/core/bitstreams/0af53ed4-c966-4620-a947-867f1b5c9d96/content) — compares procedural terrain methods and smooth noise-based heights.
- [MDN `feTurbulence`](https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Element/feTurbulence) and [`seed`](https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Attribute/seed) — procedural noise and seeded output.
- [MDN `requestAnimationFrame`](https://developer.mozilla.org/en-US/docs/Web/API/Window/requestAnimationFrame) — browser-synchronized preview loops.
- [MDN Web Animations API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API/Using_the_Web_Animations_API) — playback controls and timing.
- [MDN SVG `animateTransform`](https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Element/animateTransform) — declarative SVG transforms; `repeatCount="indefinite"` supports continuous loops.
- [SalamiVG](https://github.com/ericyd/salamivg) — TypeScript SVG example using seeded randomness and noise.
- [Noise Maker](https://github.com/ChrisMBarr/noise-maker) — browser SVG noise-pattern workflow; project notes describe complexity growth as features accumulated.
- [Material Maker](https://www.materialmaker.org/) — reusable material graphs and community library demonstrate preset reuse; our product uses bounded forms instead of a graph editor.
- [Krita resource management](https://docs.krita.org/en/reference_manual/resource_management.html) — tagged local resources and portable bundles.
- [Krita brush editor changes](https://krita.org/en/posts/2018/krita-4-0-release-notes/) — live preview and collapsible editor sections.
- [Krita animation timeline](https://docs.krita.org/en/reference_manual/dockers/animation_timeline.html) — transport, frame table, layer list, and secondary settings grouped in one timeline panel.
- [OpenToonz Xsheet/Timeline](https://opentoonz.readthedocs.io/en/latest/working_in_xsheet.html) — scene assets remain organized in the cast and are exposed as ordered animation layers.
- [Krita workspaces](https://docs.krita.org/en/reference_manual/resource_management/resource_workspace.html) — save panel layouts by workflow rather than showing every tool at once.
- [After Effects preset browser](https://helpx.adobe.com/after-effects/desktop/apply-effects-and-animation-presets/effects-and-animation-presets/effects-animation-presets-overview.html) — searchable presets, browsable by category, with selected-layer application.
- [Rive editor introduction](https://rive.app/docs/auth) — artboard design and animation/state-machine behavior are distinct workflow stages.
- [National Crafts Museum: Warli painting](https://nationalcraftsmuseum.nic.in/artifacts-detail/32162) — describes Maharashtra provenance, geometric forms, and earth/white materials.
- [Government of India handicrafts portal: Warli](https://handicrafts.nic.in/crafts/All_Crafts/Craft_Categories/Miscellaneous/Folk_Painting/Warli_Painting/Warli_Paintingwebpage.html) — describes geometric visual vocabulary and cultural context.
- [Government of Bihar: Madhubani/Mithila painting](https://madhubani.nic.in/handicraft/) — describes linework, patterned fills, bright earthy colors, and nature/mythology motifs.
- [V&A: Indian textiles and contemporary practice](https://www.vam.ac.uk/articles/indian-textiles/) — emphasizes regional technique differences and contemporary adaptation by designers.
- [V&A: Indian embroidery and contemporary designers](https://www.vam.ac.uk/articles/indian-embroidery) — example of tradition-specific techniques adapted by contemporary artists.
- [Reddit: Krita animation learning friction](https://www.reddit.com/r/krita/comments/1h9joct/the_animation_tools_made_me_hitandquit_krita_big/) — anecdotal feedback on timeline terminology and discoverability.
- [Reddit: animation UI comparison](https://www.reddit.com/r/learnanimation/comments/1woxnbt/what_is_a_good_free_2d_animation_software_with/) — recent user discussion comparing timeline clarity and learning curve across tools.
- [Procedural 2D animation discussion](https://www.reddit.com/r/IndieDev/comments/totiip/simple_guide_for_procedural_2d_aim_animation/) — community example of rule-based motion.
- [2D asset pipeline discussion](https://www.reddit.com/r/aigamedev/comments/1um3dar/how_do_you_turn_aigenerated_2d_tiles_into/) — community reports generated output still needs consistency and cleanup.
