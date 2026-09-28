# UI-06 · Layered illustration animation

Status: polygon/color masks, basic motion, bounded templates, randomized animation trials,
local like/dislike feedback, project JSON, browser save/restore, and animated SVG export
implemented; editable paths, pattern-tile authoring, and wave motion planned. See
[workflow](../../workflows/layered-illustration-animation.md).

## Purpose
Import simple artwork, separate useful regions into layers, then preview lightweight motion.

## Controls
Local image picker, polygon/color selection mode, color tolerance, text overlay content,
color and size, layer name/list, motion template, project JSON, browser restore, SVG export,
random trials, and feedback controls. Future: mask correction, editable paths, and wave tools.

## Flow
Import image → select or outline a region, or add centered text → apply a template or set
motion → preview → save JSON or export animated SVG.
Generate a random motion trial → preview → rate it → save ratings in bounded localStorage;
optionally append to a user-selected folder or download a JSONL log. Ratings do not change
generation rules automatically. Save a clean plate when motion needs to expose previously
hidden background.

## States
Empty, image loaded, drawing mask, color mask preview, layer selected, invalid image,
mask limit reached, unrated trial, rated trial, feedback saved locally, folder unavailable,
folder write failure.
Retain imported artwork and existing layers after recoverable errors. Keyboard arrows
move the mask cursor; Enter adds a point or selects a color region. Honor reduced-motion preference.
