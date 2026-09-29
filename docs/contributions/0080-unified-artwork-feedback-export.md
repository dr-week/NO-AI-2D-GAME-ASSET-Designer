# 0080 · Unified artwork feedback export
Status: complete
Owner: Codex

## Files
- `src/features/artwork-feedback/io/feedbackStore.ts` — owns Character/Landscape browser storage validation and bounded persistence.
- `src/features/artwork-feedback/io/unifiedExport.ts` — combines feature-owned stores into a chronological versioned JSONL export.
- `src/features/artwork-feedback/ui/ArtworkFeedback.svelte` — uses the IO boundary for persistence and exposes all-ratings export beside Character and Landscape ratings.
- `src/features/image-animation/io/feedbackStore.ts`, `src/features/image-animation/ui/AnimationFeedback.svelte` — remove the duplicate animation-only serializer and use the unified export action.
- `src/features/image-animation/ui/AnimationFeedback.svelte` — uses the same cross-feature export while preserving animation folder append behavior.
- `docs/tasks/README.md`, `docs/contributions/README.md`, `docs/status.md`, `docs/design.md` — removes completed queue item, indexes this handoff, updates the implementation snapshot, and records module ownership.

## Checks
- `git diff --check` — pass.
- Automated checks — not run.

## Limits
- Folder append from Animation remains animation-only; the shared JSONL download includes all three categories.
- Browser storage remains local to the current browser profile; export provides the portable backup.
