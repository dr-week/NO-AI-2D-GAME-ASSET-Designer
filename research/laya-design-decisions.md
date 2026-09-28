# Laya and design decisions

Checked 2026-09-29. Laya classifies text into typed choices, scores, or yes/no answers; it does not draw or render artwork. Keep rendering deterministic and validate every proposed value against existing controls.

## Product rules

- Organize briefs into supported categories and named, bounded profiles. Unknown or conflicting cues require a user choice.
- Treat model output as a recommendation. Show its category and preview; apply only after explicit user action.
- Keep exact sliders and reset controls available. Rejected, missing, or malformed results change no artwork.
- Store stable profile IDs and settings; keep catalog descriptions, tags, and render rules owned by their feature.
- Do not use model confidence as accuracy proof. Measure agreement on reviewed, held-out briefs before automating application.

## Model limits

The upstream README reports base checkpoints near chance on its typed-decision benchmark (0.35–0.36 versus a 0.318 random baseline), and says the stronger 0.766 result comes after fine-tuning on that benchmark's training split. This does not establish quality for 2D character or art-style briefs. Specialization and independent validation are prerequisites.

The community TypeScript runtime documents a ~324 MB model and a browser WASM path roughly 100× slower than native in its own measurements. Claims are upstream measurements, not verified on this project. Keep inference optional; do not bundle or fetch a large model silently.

## UI implementation guidance

Use Material 3 foundations as principles, not a component dependency: shared design tokens, clear hierarchy, accessible labels/focus, consistent control states, and visible feedback. Keep the existing compact Japanese visual language. Separate workflow categories; offer a short profile label and preview before apply; use one primary action per step.

## Sources

- [Laya upstream repository and benchmark caveats](https://github.com/NandhaKishorM/laya)
- [Laya System-One TypeScript/browser runtime and measured size/latency](https://github.com/italoalmeida0/laya-system-one)
- [Material Design 3 foundations](https://m3.material.io/foundations/)
