# 0074 · Character design profile decisions
Status: complete
Owner: Codex

## Files
- `src/features/laya/model/characterProfiles.ts` — define bounded, named character-shape profiles.
- `src/features/laya/model/localCharacterDecision.ts`, `characterDecision.ts` — map explicit cues and profile choices to existing controls.
- `src/features/laya/io/systemOneClient.ts` — call local System-One API and validate stable profile IDs.
- `src/features/laya/ui/CharacterCommandPanel.svelte` — expose profile, rule, and review/apply flow.
- `vite.config.ts`, `scripts/start-laya-system-one.ps1` — add development proxy and opt-in, version-pinned service command.
- `docs/tasks/2026-09-28-laya-character-decisions.md`, `docs/issues.md`, `docs/status.md`, `research/laya-integration.md`, `research/laya-design-decisions.md`, `scripts/README.md` — record scope, research, setup, and limits. Root README excluded.

## Checks
- `npm run check` — pass, zero errors/warnings.
- `npm run build` — pass; 3D workspace chunk is 569.91 kB.

## Limits
- Model/runtime is opt-in and was not downloaded or run. First use needs roughly 324 MB of model storage. Quality and target-device resources remain unmeasured; see issue I-001.
