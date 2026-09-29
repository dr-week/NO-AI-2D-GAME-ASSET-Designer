# UI-08 · Animation discovery and feedback

Status: Partially implemented. Existing presets have a Calm/Playful/Entrance/Transition filter; this mixes mood and purpose and should be normalized as the library grows.

## Navigation

Follow [workflow groups](../workflow-groups.md) for the two-stage Create/Animate structure.
Do not add a Library destination until a usable shared asset browser exists.

## Motion discovery

Classify presets on separate axes: purpose (Loop, Entrance, Emphasis, Transition), target
(Character, Scene, Layer, Text), and visual style (Retro, Soft, Playful). Keep style tags only
when the actual motion or palette supports them. Each preset needs name, target, duration,
loop mode, and preview. Add search when the library grows beyond quick scanning.

## Feedback

Keep thumbs beside the generated preview. Ratings stay local and do not train or modify the
generator. Keep one rating action per result and one clear export path for feedback records.

## Acceptance

- Create/Animate remains clear at narrow widths; keep existing tools accessible.
- Motion presets identify target and playback behavior before application.
- Rating status and local storage behavior are visible and keyboard accessible.

## Research

- [Krita timeline](https://docs.krita.org/en/reference_manual/dockers/animation_timeline.html) — groups transport, layers, frames, and settings.
- [OpenToonz Xsheet](https://opentoonz.readthedocs.io/en/latest/working_in_xsheet.html) — separates scene assets from timed exposure.
- [Krita workspaces](https://docs.krita.org/en/reference_manual/resource_management/resource_workspace.html) — supports focused layouts by workflow.
- [After Effects presets](https://helpx.adobe.com/after-effects/desktop/apply-effects-and-animation-presets/effects-and-animation-presets/effects-animation-presets-overview.html) — searchable categories and apply-to-selection behavior.
- [Rive editor](https://rive.app/docs/auth) — separates artboard design from animation/state-machine behavior.
- [Reddit: Krita timeline learning friction](https://www.reddit.com/r/krita/comments/1h9joct/the_animation_tools_made_me_hitandquit_krita_big/) — user-reported terminology and discoverability pain.
- [Reddit: 2D animation UI workflows](https://www.reddit.com/r/learnanimation/comments/1woxnbt/what_is_a_good_free_2d_animation_software_with/) — anecdotal comparisons of timeline clarity and learning curve.
