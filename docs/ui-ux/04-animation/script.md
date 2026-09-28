# UI-04 · Animation

Status: bounded image-layer templates and randomized deterministic variations implemented;
character playback and timeline editor planned.

## Purpose
Create repeatable category-based motions and let a visual theme shape their timing and feel.

## Controls
Image workspace: choose Breathe, Drift, or Pulse and apply it to the selected layer;
randomize layer motions. Planned for characters: category, theme, seed control, timeline,
play/pause, scrub, and reset.

## Flow
Select an image layer → choose a bounded template → apply and preview. Random variations
use a seed internally; the seed is not yet editable or saved. Character clips are future work.

## States
No drawable character rig, template available, image layer selected, invalid target.
Character breathing/wave/bounce recipes remain non-playable data until character artwork
has addressable SVG parts and pivots.
