# Zyrix — Code meets possibility.

A responsive software studio portfolio built with React, TypeScript, Vite, Tailwind CSS, and Three.js. Zyrix's capabilities span websites, bots, automations, tools, and custom software. Includes an original interactive 3D sculpture, five concept studies, a GSAP overlay menu, Lenis smooth scrolling, ScrollTrigger section reveals, and an email inquiry composer addressed to `imzyrixx@gmail.com`.

## Interactive components

All ten supplied React Bits components are integrated into the site:

| Component | Use |
| --- | --- |
| FlexCarousel | Draggable concept gallery with keyboard controls and a static fallback |
| MetallicPaint | Copper studio identity mark |
| TechText | Interactive footer wordmark |
| LogoLoop | Technology strip with pause/resume control |
| OptionWheel | Capability selection and relevant inquiry type |
| LineSidebar | Keyboard-accessible process navigation |
| FlowingMenu | Animated service links that open the inquiry composer |
| InfiniteSpiral | Drag-controlled concept exploration |
| FlipCard | Two-sided studio philosophy card |
| TearTicket | A project invitation that opens the contact form |

The Framer module was replaced with an original GSAP implementation at the user's request. There are no remote Framer runtime imports. Motion remains a dependency of the supplied FlipCard and TearTicket. GSAP controls the page/menu transitions; Lenis is the only smooth-scroll engine. Heavy visual components load lazily and unmount offscreen or when the tab is hidden.

## Development

Requires Node.js 22.12+ (validated with Node.js 24).

```sh
npm ci
npm run dev
```

Use `npm run build` for strict TypeScript checking and a production build, and `npm run preview` to serve it locally. Output is in `dist/`. No runtime secrets, backend, or external asset requests are required.

## Browser checks

```sh
npm run build
npm test
```

Tests use Chromium at `/usr/bin/chromium`. Set `CHROMIUM_PATH` to another installed Chromium executable when needed. Tests cover desktop/mobile rendering, WebGL and no-WebGL modes, concept dialogs, email composition, overlay focus handling, wheel and carousel keyboard interaction, process navigation, flip-card interaction, tear-ticket/reset behavior, service links, reduced motion, no-JavaScript content, and axe accessibility checks.

## Content

The Orbit, Relay, Pulse, Forma, and Parallel pieces are original **concept studies**, not client work or live applications. Sample metrics are illustrative interface data. Replace these studies with verified organization projects when available. `node scripts/render-concepts.mjs` regenerates their locally authored interface images with Chromium. Technology logos identify tools, not customers or partnerships.

The contact form prepares a `mailto:` link; visitors review and send through their email application. It does not silently submit or store personal information. Service selections prefill the inquiry type. Tearing the invitation opens the form and makes no booking or reservation.

## Cloudflare Pages

Project name: `zyrix-portfolio`. Intended production hostname: `dev.zyrix.qzz.io`.

For a Git-connected Pages project, choose `zyrixdevs/portfolio`, production branch `main`, build command `npm run build`, and output directory `dist`.

The build command must be set in the Pages project settings. The Wrangler `pages_build_output_dir` setting only identifies the output; it does not run the build. Leaving the build command empty results in `dist not found`.

For a direct deployment, provide `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` securely, then run:

```sh
npx wrangler pages project create zyrix-portfolio --production-branch main
npm run deploy
```

Run project creation only once. After deployment, `python3 scripts/configure-domain.py` attaches `dev.zyrix.qzz.io` to the Pages project and creates the matching DNS record. It stops without changing DNS if a conflicting record exists. This helper requires zone read access and has not been exercised against a live Cloudflare account yet.

Alternatively, in Pages → zyrix-portfolio → Custom domains, attach `dev.zyrix.qzz.io`. The Cloudflare account must control DNS for `zyrix.qzz.io`; point the `dev` CNAME to the actual Pages project hostname and wait for domain/certificate activation. Attaching the custom domain to Pages is required; adding DNS alone is insufficient. Do not overwrite an existing conflicting DNS record without reviewing it.

The token needs Account / Cloudflare Pages / Edit and Zone / DNS / Edit, with zone read access if resolving the zone through the API. Never place tokens in source, Vite variables, build output, or Git. `_headers` configures the static production security policy and immutable asset caching.

## Credits

See [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md). React Bits and ThreeUI components are vendored with their notices, and fonts are self-hosted npm assets. The 3D sculpture and concept compositions are original to this site.
