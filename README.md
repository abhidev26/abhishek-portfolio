# NEXUS COSMOS — Abhishek's Cinematic 3D Developer Portfolio

> *Explore My Developer Universe.* — Beyond Code. Beyond Limits. Into the Universe.

React 18 + Vite + TypeScript (strict) + Tailwind CSS + Framer Motion + Three.js (`@react-three/fiber`, `drei`, `postprocessing`) + Lenis + EmailJS.

## Quick start

```bash
npm install
cp .env.example .env     # optional: add EmailJS keys (see below)
npm run dev              # http://localhost:5173
npm run build            # type-check (strict) + production build into dist/
npm run preview
```

Test quality modes with a query string: `/?quality=full`, `/?quality=lite`, `/?quality=fallback` (CSS starfield, no WebGL).

## The Cosmic Journey

The 3D canvas is fixed behind the page. **One** `CameraController` (`src/three/CameraController.tsx`) reads the real page scroll position (Lenis drives native scroll, so wheel / trackpad / touch / keyboard all work) and maps it to waypoints around **live** planet positions:

| Section | Destination |
|---|---|
| Home | Whole solar system |
| About | Earth |
| Skills | Mercury |
| Projects | Mars |
| Education | Jupiter |
| Certifications | Saturn (camera sits in the ring plane among ring particles) |
| Contact | Neptune, then a slow pull-back into space |

Scrolling up reverses the journey. Only the scroll value is damped, so there are no jumps and no per-frame React state. Keys `1`–`7` jump to a destination.

Everything in the scene is procedural: planet textures are generated from seamless 3-D noise at start-up (no texture files), the Sun/corona/nebula/rings are shaders, the asteroid belt and Saturn's ring rocks are `InstancedMesh`.

## Things YOU should edit

| What | Where |
|---|---|
| LinkedIn URL (currently a placeholder) | `LINKEDIN_URL` in `src/data/personal.ts` |
| Project **Live Demo** / **GitHub** links (left empty — none were supplied) | `demoUrl` / `repoUrl` in `src/data/projects.ts` |
| Real project screenshots | replace `public/images/projects/*.webp` (same filenames). The current images are labelled *preview artwork*, not screenshots. |
| Resume | replace `public/resume.pdf` (a one-page resume generated from the details in the brief is included) |
| Profile photo (optional) | drop into `public/images/profile/` and use it in `src/sections/About.tsx` |
| Skill proficiency wording | `level` field in `src/data/skills.ts` |

Notes on the data: the skills brief has no "Languages" group, so HTML5, CSS3, JavaScript, PHP and Python (Basic) are filed under **Languages** and the rest of the Frontend/Backend lists are split accordingly. The skill-detail "Used in X of 6 projects" bar is computed from the project technology lists — nothing is invented.

## Contact form (EmailJS)

1. Create an account at <https://www.emailjs.com>, add an email service and a template (variables: `from_name`, `from_email`, `reply_to`, `message`, `to_email`).
2. Put the three **public** identifiers in `.env`:
   ```
   VITE_EMAILJS_SERVICE_ID=...
   VITE_EMAILJS_TEMPLATE_ID=...
   VITE_EMAILJS_PUBLIC_KEY=...
   ```
3. Restart the dev server.

Without these the form validates, then shows a clear **development-mode** notice and a `mailto:` fallback. It never claims a message was sent when it wasn't.

## Accessibility & performance

- Semantic landmarks, skip link, visible focus, labelled form fields, accessible modals (Escape, focus trap, focus restore).
- `prefers-reduced-motion`: no 3D scene, no Lenis, CSS starfield, simplified animations.
- Device budget (`src/hooks/useDevicePerformance.ts`): fewer stars / asteroids / nebula layers, lower DPR and simpler post-processing on tablet and mobile; adaptive DPR (1 → 1.75) via `PerformanceMonitor`.
- The whole 3D stack is lazy-loaded in its own chunk. The loader's percentage reflects real milestones (fonts, 3D chunk, texture generation, first rendered frame).
- Performance target is *smooth on modern desktops*; FPS depends on the GPU (it is not guaranteed on every device).

## Folder structure

```
public/        images/, textures/, models/, resume.pdf, favicon.svg, og-image.png
src/components UI building blocks (Navbar, TiltCard, GradientButton, modals, Preloader…)
src/sections   Hero, About, Skills, Projects, Education, Certifications, Contact
src/three      SolarSystem, Sun, Planet, SaturnRings, AsteroidBelt, StarField, Nebula, ShootingStars, CameraController, PlanetAtmosphere, PostProcessing, textures, orbit
src/hooks      useLenis, useScrollProgress, useReducedMotion, useDevicePerformance, useModal
src/data       personal, skills, projects, education, certifications
src/lib        email, store (shared mutable scroll/camera state), ui (toasts, scrolling), ambient, utils
```

Optional ambient sound is synthesised with the Web Audio API, **muted by default**, and only starts when the visitor clicks the toggle.
