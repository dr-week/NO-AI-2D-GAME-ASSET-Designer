# Laya product decision rules

Implementation and model limits: [Laya System 1 integration](laya-integration.md).

- Ask only for decisions supported by a named catalog and bounded values.
- Treat a model result as a suggestion; preview and require explicit apply.
- Keep deterministic rules, manual controls, and reset paths available offline.
- Reject missing, conflicting, malformed, or unsupported results without changing artwork.
- Keep rendering and saved recipes independent from model/service availability.
- Evaluate with reviewed, held-out art briefs before automating a decision.

Use Material 3 as UI guidance only: hierarchy, accessible feedback, and predictable controls.
Keep the existing compact visual system; do not add a component dependency.

## Sources

- [Laya upstream model and benchmarks](https://github.com/NandhaKishorM/laya)
- [Laya System-One Node/browser runtime](https://github.com/italoalmeida0/laya-system-one)
- [Material Design 3 foundations](https://m3.material.io/foundations/)
