# UI-04 · Animation

Status: image and text layers support looped float/drift/pulse/rock plus one-shot fade/rise/
scale/shared-axis-inspired entrances. Character workspace includes one looping Wave clip with
play, pause, and scrub. Clip authoring and timeline editor remain planned.

## Purpose
Create repeatable category-based motions and let a visual theme shape their timing and feel.

## Controls
Image workspace: choose a template and apply it to an image or text layer; set loop duration;
randomize motions. Character workspace: tune rig, play/pause Wave, or scrub its position.

## Flow
Add/import a layer → choose a bounded template → apply and preview. Text can be typed into
a native SVG layer. In Character, manual pose edits pause the Wave clip; scrub and playback
share one bounded clip sampler. Random variation seeds are not yet editable or saved.

## States
Character workspace, clip playing/paused/scrubbed, template available, image layer selected,
invalid target.
Shared-axis presets are single-layer entrances inspired by Material motion, not paired
destination transitions. Character motion is limited to the single built-in Wave clip.
