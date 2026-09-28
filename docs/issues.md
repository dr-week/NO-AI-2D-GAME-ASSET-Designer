# Issues

Only unresolved risks and questions. Feature scope lives in requirements.md.

| ID | Status | Issue | Close when |
|---|---|---|---|
| I-001 | Open | Laya request mapping is unimplemented; browser runtime and command accuracy are unverified. | Choose an implementation and measure memory, latency, and validated character-command accuracy in supported browsers. |
| I-002 | Open | Minimum supported hardware and smoothness target are undefined. | Define a representative sample and smoothness threshold; verify rendering and editing on a low-end CPU/browser. |
| I-003 | Open | Character joint deformation quality is unverified; clothing deformation is future scope. | Exercise shoulder, elbow, hip, and knee limits; record whether connected shapes show unacceptable gaps or overlaps. |
| I-004 | Open | Color-mask quality and memory use have no documented measurements; wave motion remains future scope. | Measure color masks on flat, gradient, and textured references at target sizes; define memory limits and record results. |
| I-005 | Open | Feedback folder writes depend on browser File System Access support; compatibility has not been verified. | Verify folder writes in supported browsers and confirm browser-storage and download fallbacks work. |

## Maintenance

Keep only unresolved items here. Record a concise reproduction or evidence when an issue
is a defect; use `requirements.md` for desired behavior and `design.md` for settled
architecture. Close or remove resolved rows and preserve lasting decisions in `design.md`.

