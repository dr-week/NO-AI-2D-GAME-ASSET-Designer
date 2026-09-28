# 2D Maker

A lightweight, browser-based workspace for building structured 2D characters and reusable animation scenes.

[![Svelte](https://img.shields.io/badge/Svelte-5-FF3E00?logo=svelte&logoColor=white)](https://svelte.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)](https://vite.dev/)
[![SCSS](https://img.shields.io/badge/SCSS-Sass-CC6699?logo=sass&logoColor=white)](https://sass-lang.com/)

## Product scope

The editor uses explicit geometry, layers, and animation controls. It does not require generative AI or a runtime model.

**Available now:** portrait SVG character with joint posing and bounded proportions; image workspace with raster masks, text overlays, motion previews, JSON projects, SVG export, and local feedback.

**Planned:** character styling and rigging, clean-plate editing, keyframe animation, character project files, PNG export, and frame sequences. See [requirements](docs/requirements.md) and [open issues](docs/issues.md).

Contribution ownership and handoffs: [contribution log](docs/contributions/README.md).

## Start

Requires Node.js 24 or newer.

```sh
npm ci
npm run dev
```

`npm run check` runs Svelte/TypeScript diagnostics. `npm run build` creates the production bundle in `dist/`.

## Technology

| Area | Choice |
| --- | --- |
| UI | Svelte 5, TypeScript |
| Styling | SCSS |
| Build | Vite 8 |
| Graphics | SVG, Canvas 2D |
| Persistence | Browser storage |

## Source layout

- `src/app/` — application shell and feature composition
- `src/features/character/model|ui/` — skeleton rules, controls, and SVG canvas
- `src/features/animation/` — reusable motion themes and recipes
- `src/features/image-animation/model|io|ui/` — masks, file handling, and editor
- `src/styles/` — global styles and design tokens
- `public/` — static assets
- `docs/` — requirements, design, workflows, tasks, and UI behavior

Feature boundaries and contribution workflow are in [design](docs/design.md) and [contributing](docs/contributing.md).

## Industry context

In the United States, the Bureau of Labor Statistics counts **51,900** special effects artists and animators in 2025 and projects about **4,200 openings per year** through 2035. These figures indicate an established animation workforce; they do not measure demand for this product. [BLS Occupational Outlook Handbook](https://www.bls.gov/ooh/arts-and-design/multimedia-artists-and-animators.htm)

## Documentation

- [Requirements](docs/requirements.md) · [Design](docs/design.md) · [Issues](docs/issues.md)
- [Stack and architecture review](research/stack-and-architecture.md) · [Animation systems research](research/animation-systems.md)
- [Contributing](docs/contributing.md) · [Animation workflow](docs/workflows/layered-illustration-animation.md)
- [UI/UX scripts](docs/ui-ux/README.md) · [Task notes](docs/tasks/)

---

Copyright © 2026 Danger Labs. All rights reserved.
