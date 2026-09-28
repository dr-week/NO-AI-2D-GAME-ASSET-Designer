# Animation SDK scan

For a broader comparison of authoring tools, playback formats, shared concepts, and a
phased application plan, see [animation-systems.md](animation-systems.md). This file is
the narrower SDK/dependency decision record.

## Decision

Start with SVG + WAAPI for T-pose joints and simple motion. Keep themes, recipes,
and character files app-owned. Use vendor libraries through adapters only; never
modify upstream code. No LLM is needed for deterministic animation.

| Tool | Fit | Decision | License |
|---|---|---|---|
| [WAAPI](https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API) | Joint transforms, timing, loops | Use first; native browser API | Browser |
| [Anime.js](https://animejs.com/documentation/svg/) | SVG morphing, paths, timelines | Optional adapter when needed | MIT |
| [Iki](https://github.com/zeikar/iki) | WebGL2 puppet mesh/physics | Revisit after SVG prototype | MIT |
| [Inochi2D](https://github.com/Inochi2D/inochi2d) | Mesh puppet runtime | Defer; greater integration cost | BSD-2-Clause |
| [dotLottie](https://github.com/LottieFiles/dotlottie-web) | Authored animation playback | Optional import/playback only | MIT |

CSS is for interface motion. SVG/WAAPI suits simple 2D animation. Mesh rigs suit
deformation. Lottie suits playback. Target CPU-friendly SVG first; WebGL2 is not
available on every CPU/browser combination.

## Integration

- Stable app-owned types: `AnimationTheme`, `AnimationRecipe`, character/joint IDs.
- Optional adapter contract: load, play, pause, seek, dispose.
- Pin SDK versions; verify adapters when upgrading. Vendor code stays untouched.
- Snapshots in `vendor/` are shallow inspection clones, ignored by Git, not bundled.

## Snapshots

| Folder | Repository | Commit |
|---|---|---|
| `vendor/animejs` | [juliangarnier/anime](https://github.com/juliangarnier/anime) | `01b81be1` |
| `vendor/iki` | [zeikar/iki](https://github.com/zeikar/iki) | `2f4a9e41` |
| `vendor/inochi2d` | [Inochi2D/inochi2d](https://github.com/Inochi2D/inochi2d) | `ba2b1413` |
| `vendor/dotlottie-web` | [LottieFiles/dotlottie-web](https://github.com/LottieFiles/dotlottie-web) | `a08deda3` |

## Papers

[ToonSynth](https://dcgi.fel.cvut.cz/publications/2018/dvoroznak-tog-toonsynth/) (motion/style examples); [Vector Prism](https://arxiv.org/abs/2512.14336) (semantic SVG groups); [Decomate](https://arxiv.org/abs/2511.06297) (LLM-driven); [LiveSVG](https://arxiv.org/abs/2605.30174) (video-to-vector fitting). Research informs future authoring, not runtime dependencies.
