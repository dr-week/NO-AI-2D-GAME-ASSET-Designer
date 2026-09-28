# 0060 · Three dimensional artwork workspace
Status: complete
Owner: Codex

## Files
- `src/features/three-d/model/artworkCatalog.ts` — five 3D artwork categories and starter pieces.
- `src/features/three-d/model/objectFactory.ts` — procedural low-poly geometry builders.
- `src/features/three-d/ui/ThreeDWorkspace.svelte` — camera, orbit, object placement, clear, and PNG export.
- `src/app/App.svelte` — lazy-loaded 3D workspace entry.
- `tests/threeDArtwork.test.mjs`, `package.json` — add scene catalog and geometry contract checks.
- `package.json`, `package-lock.json` — Three.js and type dependency.
- `vite.config.ts` — scan only app HTML for dev dependencies, excluding vendored research examples.
- `docs/design.md`, `docs/roadmap/technology-register.md`, `research/stack-and-architecture.md` — ownership and research update.
- `README.md`, `docs/status.md` — publish workspace availability and remaining limits.

## Checks
- `npm run verify` — pass; includes type checks, focused tests, and production build.

## Limits
- 3D chunk adds 142.61 kB gzip after opening the workspace. It remains separate from the 50.92 kB gzip main chunk.
- WebGL2 required; transform tools, scene save/restore, model import, and deeper category libraries remain future work.
