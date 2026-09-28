# Thanushree S — AI/ML Portfolio (Next.js + Three.js)

A real Next.js 14 / TypeScript project implementing the interactive 3D
portfolio: React Three Fiber + drei for the persistent neural-core scene
and skill constellation, GSAP + ScrollTrigger for the pinned horizontal
project track, Framer Motion for entrance/reveal choreography, and Lenis
for smooth scrolling (synced to ScrollTrigger).

## Getting started

```bash
npm install
npm run dev
```

Open https://portfolio-phi-beryl-63onbu42j8.vercel.app/

For a production build:

```bash
npm run build
npm run start
```

This was built and verified in a sandboxed environment without access to
Google Fonts at build time, so `next build` prints one harmless warning
("Failed to minify the stylesheet for fonts.googleapis.com…") — on a
machine with normal internet access this resolves itself and the fonts
load normally (they're loaded via a `<link>` tag in `src/app/layout.tsx`,
not `next/font`, specifically so the build never depends on that request).

## Project structure

```
src/
  app/
    layout.tsx        Root layout, metadata, Google Fonts <link>
    page.tsx           Assembles the whole page
    globals.css        Design tokens, base styles
  components/
    Loader.tsx          Boot sequence overlay
    Nav.tsx              Floating pill nav + active-section highlight
    CustomCursor.tsx    Dot + lagging ring cursor with hover labels
    SmoothScroll.tsx    Lenis + GSAP ScrollTrigger wiring
    SectionTracker.tsx  IntersectionObserver -> scrollStore + nav events
    Hero.tsx / About.tsx / Skills.tsx / Projects.tsx /
    Experience.tsx / Education.tsx / Contact.tsx / Footer.tsx
    canvas/
      Scene.tsx         Persistent fixed full-viewport <Canvas>
      CameraRig.tsx      Scroll + mouse driven camera movement
      NeuralCore.tsx     Hero neural point-cloud object
      ParticleField.tsx  Ambient background particles
      SkillsField.tsx    3D skill constellation + drei <Html> labels
  lib/
    data.ts             All resume content lives here
    scrollStore.ts      Mutable store read every frame by the 3D scene
    sections.ts         Section ids + nav labels
    hooks.ts            useReducedMotion / useIsMobile / useIsTouch
```

## What's implemented vs. simplified from the original brief

Implemented for real, and working end to end:

- Next.js + TypeScript + Tailwind foundation
- Persistent Three.js scene (not per-section canvases) driven by scroll
  progress — the neural core recedes/rotates as you scroll, doubling as
  ambient background for the rest of the site
- Lenis smooth scrolling wired to GSAP ScrollTrigger
- Cinematic loader → staggered hero reveal
- Custom cursor with hover states, disabled on touch
- 3D skill constellation (drei `<Html>`-projected labels, hover highlight)
- GSAP ScrollTrigger pinned horizontal project track with 3D tilt cards
- Scroll-reactive experience timeline, animated CGPA count-up
- Magnetic contact buttons
- `prefers-reduced-motion` support (skips Lenis smoothing, particle
  jitter, and cursor lag), mobile particle-count reduction, touch-device
  cursor disable

Simplified intentionally, to keep the codebase correct and shippable
rather than speculative:

- No custom GLSL shaders or post-processing (bloom/glow is faked with
  additive blending + point size rather than a bloom pass) — safe to add
  `@react-three/postprocessing` on top if you want the extra depth
- No full-screen "expand into detail page" transition for project
  cards — each card links out via its GitHub button instead
- Curtain/clip-path *section* transitions are not implemented; the
  camera-driven 3D continuity and per-section reveals carry that job
  instead

## Content to double-check before publishing

- `src/lib/data.ts` — **AutoTrust** and **Pratham-Chikitse** are
  placeholders (marked `placeholder: true`) since the source resume
  doesn't describe them. Replace with real descriptions, or remove them.
- LinkedIn and GitHub links in `CONTACT` are placeholders (`#`) — add
  the real profile URLs.
