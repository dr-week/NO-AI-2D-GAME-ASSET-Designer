# Laya integration

## Finding

Laya is a non-generative System 1 model. It answers typed `choice`, `score`, and `noul` questions; it does not draw characters or produce free text. The app must translate accepted answers into its own bounded SVG controls.

## Upstream and runtime options

- Upstream `NandhaKishorM/laya` documents a non-autoregressive decision model. It accepts state plus typed `choice`, `score`, and `noul` questions and returns constrained typed answers in one forward pass. It is a decision engine, not an animation engine.
- `@receptron/laya` runs the model from Node/TypeScript with ONNX Runtime Node and Hugging Face tokenizers. It is a Node runtime, not a direct browser integration.
- `laya-system-one` documents Node/Bun native and browser WASM runtimes. Its README states that the multilingual model is fetched on first use and cached (~324 MB on disk); browser use loads model/tokenizer/WASM resources over HTTP. These are upstream claims, not measurements in this project.

## Decision

Keep core UI and rendering deterministic. Two paths currently exist:

- `commands.ts` parses bounded local text commands. `CharacterCommandPanel.svelte` sends accepted commands to `App.svelte`, which updates character state. This path is integrated; it does not call a model or backend.
- `characterQuestions.ts` defines nine bounded questions and `characterDecision.ts` validates a structured result, rejects confidence below 0.55, and maps accepted choices to character controls. Contract tests use fixtures; production code has no caller for `resolveCharacterDecision`.

No Laya provider, inference runtime, or remote backend is installed. The resolver is a tested adapter contract, not a working decision-model integration. The existing nine questions infer proportions from descriptions, but do not represent animation requests; there is no scene/animation output contract. Do not connect a model until product behavior, browser/server runtime, model download consent/cache, and target-device budgets are chosen. Keep controls and rendering deterministic.

If adding it later, isolate one provider behind a small `predict(state, questions)` adapter. Validate the typed response with `resolveCharacterDecision`, then apply through the existing character state owner. Add a separate animation decision contract only when its input and output are defined. Benchmark quality, latency, and memory on supported devices before enabling it by default.

## Verification (2026-09-29)

- `npm run test:laya`: passed, 6 tests.
- Browser check: valid proportion command applied; out-of-range command rejected without changing state; reset restored defaults.
- `npm run check`: blocked by missing `three` and `three/addons/controls/OrbitControls.js` type declarations in `src/features/three-d/`; related callback parameters also become implicit `any`.
- Vite served the UI, with dependency-scan warnings from vendored Anime.js examples under `research/vendor/` (`animejs` and `tweaks` unresolved).

These checks verify the local command path and resolver contract only. They do not measure a Laya model, because none is connected.

## Sources

- [Laya source repository](https://github.com/NandhaKishorM/laya) · [Laya model card](https://huggingface.co/convaiinnovations/laya)
- [TypeScript/ONNX wrapper and requirements](https://github.com/receptron/laya)
- [Node/Bun and browser WASM runtime](https://github.com/italoalmeida0/laya-system-one)
