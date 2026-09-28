# UI-04 · Animation

Status: image and text layers support looped float/drift/pulse/rock plus one-shot fade/rise/
scale/shared-axis-inspired entrances. Character playback and timeline editor planned.

## Purpose
Create repeatable category-based motions and let a visual theme shape their timing and feel.

## Controls
Image workspace: choose a template and apply it to an image or text layer; set loop duration;
randomize motions. Character category, theme, seed, timeline, and playback controls planned.

## Flow
Add/import a layer → choose a bounded template → apply and preview. Text can be typed into
a native SVG layer. Random variation seeds are not yet editable or saved.

## States
No drawable character rig, template available, image layer selected, invalid target.
Shared-axis presets are single-layer entrances inspired by Material motion, not paired
destination transitions. Character recipes remain non-playable until SVG parts have pivots.
