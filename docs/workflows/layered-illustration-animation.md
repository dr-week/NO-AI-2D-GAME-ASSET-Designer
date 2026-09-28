# Layered illustration animation

Non-AI workflow for flat motion-graphic scenes: colored sky bands, mountains, waves,
city silhouettes, moons, clouds, boats, balloons, and simple characters. The supplied
references range from clean vector regions to gradients, line art, and textured water.

Repeating geometric references (scallops, quarter-circles, leaves, and bars) should be
treated as a tile plus repeat rule, not as hundreds of independently segmented copies.
Material Design is a UI design system; its motion guidance can inform interface feedback,
but it is not a general-purpose illustration or scene-animation library.

## Reference classes

- Flat shoe, lighthouse, and mask-like character art: good first color-region tests;
  group laces, facial marks, and other small details by hand instead of tracing noise.
- Detailed clocktower: separate large light/shadow masses, retain ornamental detail as
  raster or grouped source art; tracing every edge would create needless paths.
- Candle glow/smoke and shoreline: preserve grain, glow, foam, and water texture as
  raster layers. Animate one smoke contour or broad surf edge rather than every ripple.
- Simple skyline and mountain scenes: ideal parallax layers; move each depth band at
  a different speed and keep the sky gradient as one background layer.
- Indian flat illustration references: the Hanuman and Durga portraits have distinct
  silhouette, face, ornament, and backdrop groups. Their clean fills help, but dense
  jewelry, facial linework, and lettering still need deliberate grouping and careful
  manual correction; color connectivity alone will split or merge meaningful details.
- Radial mandala: model as concentric bands and a small set of repeated motifs, using
  one motif per ring sector and rotational repetition. Avoid tracing every copy.
- Cookie/animal packaging illustration: separate foreground silhouette, landscape
  bands, decorative lines, and repeated plants; keep fine linework as grouped vector or
  raster detail instead of forcing it into large color regions.
- Textile/paisley wallpaper: first find a seamless tile and repeat spacing; animate the
  tile or one motif. Do not segment every repeated instance.
- Elephant poster: treat the animal, bamboo, and line-pattern field as grouped layers;
  the stripe field is a repeatable motif, while the illustration needs hand-authored
  overlap order and pivots.

These are flat-color references, but “no gradients” does not guarantee easy automatic
segmentation. Thin outlines, touching same-color shapes, decorative detail, and occlusion
still require human grouping and correction. Religious iconography should be preserved
respectfully; provide user-controlled edits rather than automatic reinterpretation.

## Workflow

### Repeating pattern branch

1. Identify the smallest repeating tile and its horizontal/vertical repeat distances.
2. Rebuild the motif as a few SVG paths and fills when edges are clean; otherwise keep
   one raster tile. Use SVG `<pattern>` to repeat it across the scene.
3. Animate the tile offset or a small number of motif transforms for a loop. Avoid
   duplicating every visible motif as a separate animated DOM element.
4. Check that tile edges join without seams at multiple zoom levels. Preserve a static
   fallback and honor `prefers-reduced-motion`.

This applies to the supplied geometric swatches. Photo textures and irregular shore foam
remain raster or a small set of edited paths; they are not useful SVG pattern tiles.

1. Import a local raster image; retain the source as a locked reference layer.
2. Identify candidate regions with user clicks and color-distance tolerance. Read
   pixels with Canvas `getImageData`; exact RGB equality is too brittle for antialiasing.
3. Group connected pixels of similar color; let the user add/remove points or draw a
   polygon correction. A region mask describes visible pixels, not a semantic object.
4. For flat shapes, trace the mask boundary and simplify redundant points before
   storing an editable SVG path. Preserve gradients, grain, and water texture as raster
   layers instead of tracing every pixel. OpenCV `findContours` and `approxPolyDP` are
   browser-capable options if native code does not meet quality needs.
5. Set layer order and pivot, then preview independent transforms. Build missing
   background (a clean plate) manually when motion reveals occluded pixels; masks do
   not recover hidden content.
6. Animate distant and near layers at different speeds for parallax. Animate rolling
   water or hills by moving a small fixed set of Bézier control points periodically;
   drift clouds, pulse stars, or bob a boat/balloon with simple loops. No fluid solver.

## Technology

Current choices and adoption triggers are maintained in the [technology register](../roadmap/technology-register.md).
Today, Canvas creates bounded masks through a feature-detected Worker/`OffscreenCanvas` path
with a synchronous fallback; CSS/SVG plays shared presets; `localStorage` holds
feedback with optional folder append and JSONL download. Folder access is optional, browser
storage is best-effort, and ratings do not train the application.

## Limits and performance

Flat, high-contrast regions are easiest. Gradients, antialiasing, thin outlines, and
texture create fragmented masks; use guided correction or retain them as raster. A
single image cannot supply occluded pixels. Segment once, cache masks/paths, animate a
few transforms or curve points, and measure memory/frame time on representative images.
Respect reduced motion.

CSS animation of SVG path `d` is not broadly available, so do not make it the core
path-editing mechanism. Keep path geometry as control-point data and compute the SVG
path string from that data during preview.

For this style, Material Design means restrained duration, clear state changes, and
consistent easing. It is motion guidance, not a scene-animation engine. Keep art motion in
SVG/CSS/WAAPI and measure paint, frame time, memory, and bundle cost.

## Reference material

- [Canvas `getImageData`](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/getImageData)
- [OpenCV.js in the browser](https://docs.opencv.org/5.0/js_tutorials/js_setup/js_usage/js_usage.html)
- [OpenCV.js contours](https://docs.opencv.org/4.5.5/d5/daa/tutorial_js_contours_begin.html)
- [Contour simplification with `approxPolyDP`](https://docs.opencv.org/5.0/js_tutorials/js_imgproc/js_contours/js_contour_features/js_contour_features.html)
- [SVG `animateTransform`](https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Element/animateTransform)
- [Web Animations API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API/Using_the_Web_Animations_API)
- [`requestAnimationFrame`](https://developer.mozilla.org/en-US/docs/Web/API/Window/requestAnimationFrame)
- [Reduced-motion preference](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion)
- [Material Design 3](https://m3.material.io/)
- [IndexedDB API](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)
- [Storage quotas and eviction](https://developer.mozilla.org/en-US/docs/Web/API/Storage_API/Storage_quotas_and_eviction_criteria)
- [Directory picker compatibility and security](https://developer.mozilla.org/en-US/docs/Web/API/Window/showDirectoryPicker)
- [High-performance CSS animations](https://web.dev/articles/animations-guide)
- [SVG path `d` CSS support](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/d)
