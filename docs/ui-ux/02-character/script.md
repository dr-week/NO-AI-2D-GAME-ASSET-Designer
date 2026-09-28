# UI-02 · Character

Status: Front-facing rig, bounded controls, five body profiles, local brief rules, optional reviewable Laya suggestions, and transparent SVG export implemented. Silhouette drawing, asymmetrical rigging, and clothing remain planned.

## Purpose
Build a front-facing character from connected shapes and a T-pose skeleton.

## Controls
Select Balanced, Chibi, Heroic, Sturdy, or Slender body profile; refine it with explicit brief cues or an optional local Laya suggestion. Review model suggestions before applying. Manual controls remain available. Show bones/joints; pose or mirror joints; preview Breathe, Reach, or Wave; export SVG. Bone scales stay bounded at 70–130% and match left/right limbs.

## Flow
Open the front-facing rig → adjust shape widths or bone lengths → pose, randomize, or mirror joints → choose a clip and inspect key poses → set speed and preview/restart/scrub → export SVG or reset pose, widths, or lengths independently.

Commands: `pose left elbow 45°`, `proportion head 110%`, `length upper arm 110%`,
`reset pose`, `reset proportions`, or `reset lengths`. Angles and percentages outside model
bounds are rejected.

## States
Default pose, adjusted shape widths/lengths, bones hidden, joints hidden. Length changes
remain attached to the skeleton; detailed silhouette editing is not available. Invalid
commands and values outside the supported ranges show an error without changing the rig.
