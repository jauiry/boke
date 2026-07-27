---
name: particle-performance
description: Diagnose and optimize ink mountain, bird, gold, cinnabar, water-ripple, and pointer-trail effects without losing the approved artistic direction.
---

# Particle Performance

Read `src/components/InkParticleLandscape.tsx`, `src/components/Hero.tsx`, and related CSS.

- Keep mountain and bird silhouettes recognizable.
- Cap pointer spawn rate, particle count, lifetime, and device-pixel ratio.
- Reuse canvases and animation loops; never create one loop per click.
- Clean up listeners, observers, timers, and animation frames.
- Pause when hidden; honor reduced motion and the motion toggle.
- Reduce costly effects on small screens or low-power conditions.
- Avoid per-frame React state and layout reads.
- Test repeated clicks, route changes, resize, desktop, and mobile.
