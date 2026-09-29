# 0046 · Random artwork and feedback controls
Status: complete
Owner: Codex

## Files
- `src/features/character/model/randomCharacter.ts` — seeded, bounded character pose and shape generation.
- `src/features/landscape/ui/LandscapeWorkspace.svelte` — random scene selection, material animation toggle, and artwork rating.
- `src/features/artwork-feedback/ui/ArtworkFeedback.svelte` — shared thumbs feedback for character and landscape; ratings stay in browser storage.
- `src/lib/random.ts` — shared seeded random generator and secure random seed creation, reused by landscape geometry/materials.
- `src/app/App.svelte`, character controls — connect character randomization, rating, and visible animation control.

## Checks
- `npm run check` — pass; zero Svelte/TypeScript errors or warnings.
- `npm run build` — pass.
- `git diff --check` — pass; Git reported existing working-tree line-ending normalization warnings.

## Limits
- Feedback is stored locally and displayed as a rating count; it does not train or automatically alter generation.
- The shared contribution index was updated during documentation consolidation (0039).
