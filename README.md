# Zyrix — Beyond ordinary.

A responsive digital studio portfolio built with React, TypeScript, Vite, Tailwind CSS, and Three.js. Includes an original interactive 3D sculpture, concept study dialogs, accessible mobile navigation, GSAP/Lenis motion, and an email inquiry composer addressed to `imzyrixx@gmail.com`.

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

Tests use Chromium at `/usr/bin/chromium`. Set `CHROMIUM_PATH` to another installed Chromium executable when needed. Tests cover desktop/mobile rendering, WebGL startup, dialogs, email composition, mobile navigation, reduced motion, no-JavaScript content, and axe accessibility checks.

## Content

The Orbit, Forma, and Parallel pieces are original **concept studies**, not client work or live applications. Replace them with verified organization projects when available. The contact form prepares a `mailto:` link; visitors review and send through their email application. It does not silently submit or store personal information.

## Cloudflare Pages

Project name: `zyrix-portfolio`. Intended production hostname: `dev.zyrix.qzz.io`.

For a Git-connected Pages project, choose `zyrixdevs/portfolio`, production branch `main`, build command `npm run build`, and output directory `dist`.

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
