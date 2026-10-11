# Sources and attribution

## Design guidance

Applied MengTo's [Build Awwwards-Quality Sites](https://github.com/MengTo/Skills/blob/main/agent-skills/web-design/build-awwwards-quality-sites/SKILL.md), [Three.js](https://github.com/MengTo/Skills/blob/main/agent-skills/web-design/threejs/SKILL.md), and Retina-resolution guidance. The site's identity, copy, 3D geometry composition, and concept layouts were made for Zyrix. No awards, clients, revenue, or partnerships are claimed.

Motion uses GSAP and Lenis, with Lenis as the sole smooth-scroll engine. Three.js creates the original hero sculpture and PMREM studio lighting. It pauses offscreen and in hidden tabs, caps device pixel ratio, disposes resources, and falls back to a locally rendered poster when motion is reduced or WebGL is unavailable.

## React Bits

Source: https://github.com/DavidHDev/react-bits

Vendored TypeScript/Tailwind components: `SpotlightCard`, `Magnet`, and `AnimatedContent` under `src/components/react-bits/`. Adapted Magnet to disable pointer motion on coarse pointers and reduced motion; adapted AnimatedContent to retain visible content and honor reduced motion.

Copyright © 2026 David Haz. MIT + Commons Clause. See [licenses/react-bits.md](licenses/react-bits.md). Included as components of this website, not as a standalone component product.

## ThreeUI

Source: https://github.com/MengTo/threeui

Vendored `CircleButtons` and its stylesheet under `src/components/threeui/`, used for the email preparation control. Site CSS adjusts its sizing and color. Copyright © 2026 Meng To. MIT license: [licenses/threeui.txt](licenses/threeui.txt).

## Fonts and icons

- Manrope Variable and Instrument Serif are self-hosted through Fontsource. SIL Open Font License: [Manrope](licenses/manrope.txt), [Instrument Serif](licenses/instrument-serif.txt).
- Interface icons use Solar through Iconify (`@iconify-icons/solar`), licensed CC BY 4.0; source: https://github.com/480-Design/Solar-Icon-Set. The simple Zyrix arrow mark is authored for this site.

## Assets

`public/sculpture.png` is a static capture of this site's original Three.js scene. `public/social.jpg` is a capture of the original site hero. Project visuals are original HTML/interface compositions representing disclosed concept studies. No external stock photography or client logos are used.
