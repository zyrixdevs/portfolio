# Sources and attribution

## Design guidance

Applied MengTo's [Build Awwwards-Quality Sites](https://github.com/MengTo/Skills/blob/main/agent-skills/web-design/build-awwwards-quality-sites/SKILL.md), [Three.js](https://github.com/MengTo/Skills/blob/main/agent-skills/web-design/threejs/SKILL.md), and Retina-resolution guidance. The site's identity, copy, 3D geometry composition, and concept layouts were made for Zyrix. No awards, clients, revenue, or partnerships are claimed.

Motion uses GSAP and Lenis, with Lenis as the sole smooth-scroll engine. Three.js creates the original hero sculpture and PMREM studio lighting. It pauses offscreen and in hidden tabs, caps device pixel ratio, disposes resources, and falls back to a locally rendered poster when motion is reduced or WebGL is unavailable.

## React Bits

Source: https://github.com/DavidHDev/react-bits

Vendored TypeScript/Tailwind components under `src/components/react-bits/`: `SpotlightCard`, `Magnet`, `AnimatedContent`, `FlexCarousel`, `MetallicPaint`, `TechText`, `LogoLoop`, `OptionWheel`, `LineSidebar`, `FlowingMenu`, `InfiniteSpiral`, `FlipCard`, and `TearTicket`. The latter ten were supplied by the user as full React Bits component sources; the unnamed attachments contained FlipCard and TearTicket.

Integration adaptations: Magnet respects coarse pointers/reduced motion; AnimatedContent retains visible content and honors reduced motion; FlexCarousel has a no-WebGL/reduced-motion static gallery; MetallicPaint exposes a successful render state for its fallback; LineSidebar uses native buttons and accessible index contrast; FlowingMenu clamps its duplication count, pauses its marquee except on hover, respects reduced motion, and hides decorative copies from screen readers. LiveScene bounds animation work to visible scenes and visible tabs. LogoLoop includes an external pause control.

Copyright © 2026 David Haz. MIT + Commons Clause. See [licenses/react-bits.md](licenses/react-bits.md). Included as components of this website, not as a standalone component product.

## ThreeUI

Source: https://github.com/MengTo/threeui

Vendored `CircleButtons` and its stylesheet under `src/components/threeui/`, used for the email preparation control. Site CSS adjusts its sizing and color. Copyright © 2026 Meng To. MIT license: [licenses/threeui.txt](licenses/threeui.txt).

## Fonts and icons

- Manrope Variable and Instrument Serif are self-hosted through Fontsource. SIL Open Font License: [Manrope](licenses/manrope.txt), [Instrument Serif](licenses/instrument-serif.txt).
- Interface icons use Solar through Iconify (`@iconify-icons/solar`), licensed CC BY 4.0; source: https://github.com/480-Design/Solar-Icon-Set. The simple Zyrix arrow mark is authored for this site.
- Technology logos use Simple Icons via `react-icons/si` (Simple Icons: CC0; React Icons: MIT). They identify technologies the studio works with and do not imply endorsement or sponsorship.

## Assets

`public/sculpture.png` is a static capture of this site's original Three.js scene. `public/social.jpg` captures the current hero. `public/work/*.png` are original HTML/interface compositions authored in `scripts/render-concepts.mjs`, representing disclosed concept studies. `public/zyrix-mark.svg` is an original simple letterform. No external stock photography or client logos are used.

The overlay menu is original GSAP code. The user explicitly chose this replacement for the inaccessible Framer module; no Framer module source or assets are included.

## Downloaded photography — Poly Haven (CC0)

The six photographs in `public/images/` are rectilinear, tone-mapped views of
Poly Haven / HDRI Haven panoramas, licensed under CC0 1.0. These are inspiration
images, not photographs of zyrixdev projects or offices. Sources were downloaded
from the Three.js examples repository at commit
`755f6e48c6865a83ae3e1e512adb3ea9e37a26da`:
https://github.com/mrdoob/three.js/tree/755f6e48c6865a83ae3e1e512adb3ea9e37a26da/examples/textures/equirectangular

| Local image | Source panorama / original source |
| --- | --- |
| coast.jpg | [Blouberg Sunrise 2](https://polyhaven.com/a/blouberg_sunrise_2), Greg Zaal |
| venice.jpg | [Venice Sunset](https://polyhaven.com/a/venice_sunset) |
| garden.jpg | [Spruit Sunrise](https://polyhaven.com/a/spruit_sunrise) |
| city.jpg | [San Giuseppe Bridge](https://polyhaven.com/a/san_giuseppe_bridge) |
| bridge.jpg | [Pedestrian Overpass](https://polyhaven.com/a/pedestrian_overpass) |
| quarry.jpg | [Quarry 01](https://polyhaven.com/a/quarry_01) |

License: https://polyhaven.com/license — https://creativecommons.org/publicdomain/zero/1.0/
