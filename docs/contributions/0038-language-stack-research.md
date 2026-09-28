# 0038 · Language and stack research
Status: complete
Owner: Codex

## Files
- `research/stack-and-architecture.md` — compare TypeScript workers, Rust/Wasm, native Rust/Tauri, OpenCV.js/C++ Wasm, and Python against current product boundaries; add primary sources and community evidence.

## Checks
- `git diff --check -- research/stack-and-architecture.md` — pass.
- Automated checks — not run; documentation-only change.

## Limits
- No language or runtime added. Benchmark the current mask kernel before selecting a compute extension.
