# Laya integration

## Scope

Laya is a non-autoregressive typed decision model (`choice`, `score`, `noul`), not an image generator. 2D Maker uses it only to choose from existing bounded design IDs; deterministic SVG generation remains owned by each workspace.

## Current implementation

- Character catalog: Balanced, Chibi, Heroic, Sturdy, Slender; short local rules also map explicit size cues.
- Landscape catalog: contemporary and region-specific, tagged themes.
- Optional `systemOneClient.ts` sends a short brief through `/api/laya/v1/systemone`; it validates the returned ID. The Character UI shows a profile proposal and requires an explicit apply action. Landscape inference remains unconnected.
- `scripts/start-laya-system-one.ps1` starts the separate native CPU service. Vite proxies only in development. Rules, dropdowns, and manual controls remain usable without it.
- No model/runtime dependency or model weights are bundled in 2D Maker.

## Quality and resource limits

Upstream Laya reports base checkpoints near chance on its typed-decision benchmark (0.35–0.36 versus 0.318 random), while the reported 0.766 checkpoint was fine-tuned on that benchmark's training split. This is not evidence of quality on art briefs. Do not auto-apply results or treat confidence as accuracy; collect reviewed examples and measure held-out agreement first.

The community Node runtime reports a ~324 MB model and CPU-native inference, with a much slower WASM fallback. Its measurements are not project benchmarks. First model use downloads weights; this is disclosed and opt-in. No inference service has been installed or run in this project.

## Design decisions

Catalog owns stable IDs, category, region/tags, and a short description. Model picks only among those IDs; it cannot invent geometry, colors, clothing, or new styles. Preview before apply, preserve manual controls, and keep a failed/offline model path recoverable. Material 3 is used as design guidance—tokens, hierarchy, accessibility, and interaction feedback—not as a new UI dependency. See [decision-design research](laya-design-decisions.md).

## Sources

- [Laya upstream model and benchmark notes](https://github.com/NandhaKishorM/laya)
- [Laya System-One Node/browser runtime](https://github.com/italoalmeida0/laya-system-one)
- [Material Design 3 foundations](https://m3.material.io/foundations/)

## Implementation audit (2026-09-29)

- **Wired, not deployed here:** Character calls `systemOneClient.ts`; the pinned `laya-system-one@1.3.3` service is optional and starts separately. Port 8081 had no listener during this audit, so end-to-end inference was unavailable. Vite's proxy is development-only; production needs a separately configured API host/proxy.
- **Two decision paths:** character quick design is deterministic rules; model suggestion selects one of five profiles. Landscape suggestion selects one catalog theme. The nine-question proportion resolver is validated by unit tests but is not called by either production UI.
- **Safe boundary:** model cannot write artwork directly; client restricts answer to catalog IDs and UI requires apply. However low probability is only checked for numeric validity, not gated or shown to users. Do not treat it as reliable confidence or enable automatic application.
- **Research update:** current upstream docs describe `laya-ts` as an in-repository TypeScript/browser package, but its npm publication is still an open issue. The selected community Node service is distinct from the model's upstream repository. Keep the current pin until a measured, reproducible replacement is ready.
- **Quality gate before rollout:** create reviewed character briefs; compare against deterministic rules and a simple majority baseline; keep a held-out set; report exact-match agreement, abstention, calibration, cold/warm latency, peak memory, install/cache size, and offline fallback. Upstream typed-decision results are not art-domain validation; base checkpoints score near chance, while 0.766 is the fine-tuned checkpoint on its benchmark's training split.

Research references: [upstream README and runtime options](https://github.com/NandhaKishorM/laya), [upstream benchmark limits](https://github.com/NandhaKishorM/laya/blob/main/BENCHMARKS.md), [published/community TypeScript runtime](https://github.com/italoalmeida0/laya-system-one), and [open `laya-ts` npm publication issue](https://github.com/NandhaKishorM/laya/issues/288).
