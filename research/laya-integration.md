# Laya System 1 integration

Reviewed: 2026-09-29. This file is the implementation source of truth. Product rules live in
[Laya design decisions](laya-design-decisions.md).

## Role

Laya is a non-autoregressive, encoder-based model for typed `choice`, `score`, and yes/no
(`noul`) decisions. It does not generate images, SVG, text, or geometry. 2D Maker asks it to
choose from existing design catalogs; feature-owned deterministic code creates the artwork.

## Decision flow

```text
Brief + workspace category
  → one typed question + bounded catalog criteria
  → local System-One service (development proxy)
  → validate response type, supported ID, and score range
  → stage proposal in the matching workspace
  → user reviews preview and explicitly applies it
  → deterministic feature renderer uses the selected catalog ID
```

An invalid, failed, or timed-out request changes no artwork. Numeric model probabilities are
validated for shape/range only; they are not treated as art-domain confidence or an apply gate.

## Code ownership

| Path | Responsibility |
|---|---|
| `src/features/laya/io/systemOneClient.ts` | Typed request, timeout, response validation, catalog-ID boundary. |
| `src/features/laya/model/characterProfiles.ts` | Stable character proportion profiles. |
| `src/features/laya/model/localCharacterDecision.ts` | Deterministic brief rules for supported character cues. |
| `src/features/laya/ui/CharacterCommandPanel.svelte` | Character brief, proposal review, explicit apply. |
| `src/features/landscape/model/themes.ts` | Stable landscape style catalog and criteria. |
| `src/features/landscape/ui/LandscapeWorkspace.svelte` | Landscape proposal review and explicit apply. |
| `vite.config.ts` | Development-only `/api/laya` proxy to loopback service. |
| `scripts/start-laya-system-one.ps1` | Starts the separately installed, version-pinned Node service. |

Catalogs and renderers remain feature-owned. Laya cannot add IDs or directly change artwork.

## GitHub runtime choice

| Option | Fit |
|---|---|
| Upstream [`laya-ts`](https://github.com/NandhaKishorM/laya/tree/main/laya-ts) | TypeScript API for Node CPU/CUDA and browser WebGPU/WASM; optional ONNX Runtime peers. Direct browser inference requires hosting and downloading model assets. |
| Community [`laya-system-one`](https://github.com/italoalmeida0/laya-system-one) | Node/Bun native service or in-process API; compatible `POST /v1/systemone`; current app can keep its small HTTP adapter. Model is about 324 MB after first use. |

**Use the existing `laya-system-one` local service.** It fits the Vite app without adding a
model runtime to the browser bundle. The app already uses its typed HTTP contract through
`systemOneClient.ts` and the loopback-only Vite proxy. Keep model files outside the repository.
Reconsider upstream `laya-ts` only if a maintained Node inference host or browser model delivery
becomes a product requirement; measure install size, cold start, CPU/RAM, and held-out art-brief
quality first. Do not switch to browser WASM by default.

## Current behavior and fallback

- Character: deterministic local rules and manual controls always work; optional model suggests
  one of five body profiles.
- Landscape: manual controls always work; optional model suggests one existing style theme.
- Both model suggestion controls are development-only. The browser bundle does not include
  model weights; production needs a separately configured service if model suggestions are enabled.
- The pinned service and one landscape request through the Vite proxy passed a local smoke check.
  This verifies wiring, not design quality, CPU/RAM cost, or accuracy.

## Limits and evaluation

Laya's upstream typed-decision benchmark is not an art brief benchmark. The upstream README
reports 0.362 for a base English checkpoint and 0.766 for a fine-tuned checkpoint on that
benchmark; neither establishes agreement for this product. Before enabling wider use, evaluate
reviewed, held-out character and landscape briefs against deterministic rules and a majority
baseline. Report agreement, abstention, latency, and peak memory on target CPUs.

The community Node runtime currently documents about 324 MB model storage after first use;
this is an upstream figure, not a 2D Maker measurement. Inference stays optional and separate.

## Sources

- [Laya upstream: typed decision model, `laya-ts`, benchmarks](https://github.com/NandhaKishorM/laya)
- [Upstream `laya-ts` API and optional runtime peers](https://github.com/NandhaKishorM/laya/blob/main/laya-ts/README.md)
- [Laya System-One: Node/browser runtime, service API, storage and backends](https://github.com/italoalmeida0/laya-system-one)
- [Laya design decisions](laya-design-decisions.md)
