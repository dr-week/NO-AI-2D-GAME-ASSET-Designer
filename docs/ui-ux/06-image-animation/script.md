# UI-06 · Layered illustration animation

Status: polygon/color masks, native text layers, basic motion, theme-filtered templates, randomized animation trials,
local like/dislike feedback, project JSON, browser save/restore, and animated SVG export
implemented; editable paths, pattern-tile authoring, and wave motion planned. See
[workflow](../../workflows/layered-illustration-animation.md).

## Purpose
Import simple artwork, separate useful regions into layers, then preview lightweight motion. The workspace is labeled Animation in navigation.

## Controls
The side panel separates four workflows: Project actions; Themes & motion; New region and
Text authoring; and layer selection and editing. Image import sits above them. Each workflow
has its own UI component and shares the panel's drawer and control styles. Future: mask
correction, editable paths, and wave tools.

## Flow
Import image → select or outline a region, or add centered text → apply a template or set
motion → preview → save JSON or export animated SVG.
Generate a random motion trial → preview → rate it → save ratings in bounded localStorage;
optionally append animation ratings to a user-selected folder or export all categories to
one JSONL log. Ratings do not change
generation rules automatically. Save a clean plate when motion needs to expose previously
hidden background.

## States
Empty, image loaded, drawing mask, color mask preview, layer selected, invalid image,
mask limit reached, unrated trial, rated trial, feedback saved locally, folder unavailable,
folder write failure.
Retain imported artwork and existing layers after recoverable errors. Keyboard arrows
move the mask cursor; Enter adds a point or selects a color region. Honor reduced-motion preference.
