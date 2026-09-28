# Issues

Only unresolved risks and questions. Feature scope lives in requirements.md.
GitHub state checked 2026-09-28: issues #1–#5 remain open.

| ID | Status | Issue | Close when |
|---|---|---|---|
| [I-001](https://github.com/dr-week/NO-AI-2D-GAME-ASSET-Designer/issues/1) | Open | Bounded local Laya commands and a browser-local rule-based character brief flow use the nine-question result resolver. No model inference provider is connected; target-device performance and decision quality are unmeasured. | Choose target hardware before adding a provider; measure decision quality, latency, and memory, and retain deterministic controls as fallback. |
| [I-002](https://github.com/dr-week/NO-AI-2D-GAME-ASSET-Designer/issues/2) | Open | Minimum supported hardware and smoothness target are undefined. | Define a representative sample and smoothness threshold; verify rendering and editing on a low-end CPU/browser. |
| [I-003](https://github.com/dr-week/NO-AI-2D-GAME-ASSET-Designer/issues/3) | Open | Character joint deformation quality is unverified; clothing deformation is future scope. | Exercise shoulder, elbow, hip, and knee limits; record whether connected shapes show unacceptable gaps or overlaps. |
| [I-004](https://github.com/dr-week/NO-AI-2D-GAME-ASSET-Designer/issues/4) | Open | Color-mask quality, peak runtime memory, and worker compatibility lack measurements; image-path wave motion remains future scope. | Measure masks on flat, gradient, and textured references at target sizes; verify worker and fallback browsers; define memory limits and record results. |
| [I-005](https://github.com/dr-week/NO-AI-2D-GAME-ASSET-Designer/issues/5) | Open | Feedback folder writes depend on browser File System Access support; compatibility has not been verified. | Verify folder writes in supported browsers and confirm browser-storage and download fallbacks work. |

## Maintenance

Keep only unresolved items here. Record a concise reproduction or evidence when an issue
is a defect; use `requirements.md` for desired behavior and `design.md` for settled
architecture. Close or remove resolved rows and preserve lasting decisions in `design.md`.

