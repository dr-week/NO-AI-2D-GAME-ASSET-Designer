# UI-02 · Character

Status: Front-facing rig, full joint controls, four shape-proportion controls, five symmetric bone-length controls, transparent SVG export, and bounded Laya commands implemented. Silhouette drawing, asymmetrical rigging, and clothing remain planned.

## Purpose
Build a front-facing character from connected shapes and a T-pose skeleton.

## Controls
Show bones/joints; adjust every joint, head/body widths, and torso/arm/leg bone lengths; randomize or mirror a pose; select Breathe, Reach, or Wave; step between key poses, play/pause/restart, scrub, and adjust speed; apply Laya commands; reset each control group independently; export the current character as SVG. Bone scales range from 70% to 130% and keep left/right limbs matched.

## Flow
Open the front-facing rig → adjust shape widths or bone lengths → pose, randomize, or mirror joints → choose a clip and inspect key poses → set speed and preview/restart/scrub → export SVG or reset pose, widths, or lengths independently.

Commands: `pose left elbow 45°`, `proportion head 110%`, `length upper arm 110%`,
`reset pose`, `reset proportions`, or `reset lengths`. Angles and percentages outside model
bounds are rejected.

## States
Default pose, adjusted shape widths/lengths, bones hidden, joints hidden. Length changes
remain attached to the skeleton; detailed silhouette editing is not available. Invalid
commands and values outside the supported ranges show an error without changing the rig.
