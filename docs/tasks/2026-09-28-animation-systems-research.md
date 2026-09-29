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

Research record: [animation systems](../../research/animation-systems.md). Current behavior:
[status](../status.md). Future adoption decisions: [technology register](../roadmap/technology-register.md).
