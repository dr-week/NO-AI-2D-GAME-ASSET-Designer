# Animation systems research

Status: complete (research and architecture proposal; no runtime implementation).

## Scope

Compared documented animation authoring tools, browser playback APIs, puppet systems,
and formats. Read `docs/requirements.md`, `docs/design.md`, relevant animation/image
workflow docs, and `research/animation-sdk-scan.md` before writing the comparison.

## Result

- Findings and references: [Animation systems](../../research/animation-systems.md).
- Recommendation: keep an app-owned, validated clip/template model; use browser-native
  WAAPI for controlled preview after target IDs and pivots exist.
- No package or upstream source added. No LLM required.
- No files downloaded: authoritative online documentation is linked in the research note;
  upstream docs/source trees change independently and should not be copied as a snapshot
  without a specific offline/audit requirement.

## Implementation status

Research only. Existing templates in `src/features/animation/themeEngine.ts` are data
recipes and are not currently connected to character playback. Implementation should
follow the phases in the research note and update requirements/UI status as each slice
lands.

## Checks

Documentation-only change; application checks not run.
