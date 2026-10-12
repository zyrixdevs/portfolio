# zyrixdev — Code meets possibility.

A responsive software studio portfolio built with React, TypeScript, Vite, Tailwind CSS, and Three.js. zyrixdev’s capabilities span websites, bots, automations, tools, and custom software. Includes an original interactive 3D sculpture, five concept studies, a GSAP overlay menu, Lenis smooth scrolling, ScrollTrigger story chapters, and a Cloudflare Pages contact endpoint addressed to `imzyrixx@gmail.com`.

## Original experiments

The **Idea Engine** replaces the generic sculpture with 144 instanced metallic fins that morph between Signal, Structure, and Orbit. Drag or arrow keys rotate it; energy changes the motion. It uses one instanced mesh, a small custom shader for dust, capped pixel density, and automatic quality reduction after slow frames. Rendering stops offscreen, in hidden tabs, and after a paused form settles. A self-hosted SVG remains available without WebGL.

The **System Lab** is a local interactive prototype of website, bot, and automation routing. It animates real input through three stages and produces a copyable project blueprint. It does not execute external workflows or use an AI backend. The chapter dial reports actual reading progress and offers direct chapter navigation.

## Interactive components

All ten supplied React Bits components are integrated into the site:

| Component | Use |
| --- | --- |
| FlexCarousel | Full-screen gallery driven by vertical scroll, drag, horizontal wheel, and keyboard |
| MetallicPaint | Copper studio identity mark |
| TechText | Interactive footer wordmark |
| LogoLoop | Technology strip with pause/resume control |
| OptionWheel | Infinite capability wheel driven by page scroll, drag, and keyboard |
| LineSidebar | Scroll-driven process with keyboard-accessible navigation |
| FlowingMenu | Flowing links inside the full-screen navigation overlay |
| InfiniteSpiral | Full-screen photographic spiral driven by ScrollTrigger and drag |
| FlipCard | Three philosophy cards that flip and travel horizontally as the page scrolls |
| TearTicket | A project invitation that opens the contact form |

The Framer module was replaced with an original GSAP implementation at the user's request. There are no remote Framer runtime imports. Motion remains a dependency of the supplied FlipCard and TearTicket. GSAP controls the page/menu transitions; Lenis is the only smooth-scroll engine. Heavy visual components load lazily and unmount offscreen or when the tab is hidden.

## Development

Requires Node.js 22.12+ (validated with Node.js 24).

```sh
npm ci
npm run dev
```

Use `npm run build` for strict TypeScript checking and a production build, and `npm run preview` to serve it locally. Output is in `dist/`. All public assets are self-hosted. Browsing needs no secrets; sending contact messages requires the server configuration below.

## Browser checks

```sh
npm run build
npm test
```

Tests use Chromium at `/usr/bin/chromium`. Set `CHROMIUM_PATH` to another installed Chromium executable when needed. Tests cover desktop/mobile rendering, WebGL and no-WebGL modes, concept dialogs, contact submission success/failure, overlay focus handling, wheel and carousel keyboard interaction, process navigation, flip-card interaction, tear-ticket/reset behavior, flowing navigation links, reduced motion, no-JavaScript content, and axe accessibility checks.

## Content

The Orbit, Relay, Pulse, Forma, and Parallel pieces are original **concept studies**, not client work or live applications. Sample metrics are illustrative interface data. Replace these studies with verified organization projects when available. `node scripts/render-concepts.mjs` regenerates their locally authored interface images with Chromium. Technology logos identify tools, not customers or partnerships.

The contact form posts to `/api/contact`. The Cloudflare Pages Function validates inputs, checks the request origin, limits streamed request bodies, rejects honeypot submissions, and sends plain-text mail through Resend to the fixed recipient `imzyrixx@gmail.com`. It never puts the API key in Vite or the browser. Success means Resend accepted the message; actual inbox delivery depends on the email provider. Failed/unconfigured sends retain the visitor’s text and show a direct email fallback. No inquiries are stored in a database.

### Enable live email delivery

In **Cloudflare → Workers & Pages → zyrix-portfolio → Settings → Variables and Secrets**, add these to the **Production** environment, then redeploy:

- `RESEND_API_KEY`: a secret containing a Resend key authorized to send email.
- `CONTACT_FROM_EMAIL`: a sender address on a domain verified in that Resend account, for example `zyrixdev <hello@your-verified-domain.com>`. Do not use the visitor’s address or an unverified Gmail sender. Resend’s test sender is restricted to the account owner’s recipient address.

Set separate Preview credentials only if you want preview deployments to send email. The receiver is fixed in server source. Consider a Cloudflare rate-limiting rule for POST `/api/contact` if the public form attracts abuse.

For local backend checks, copy `.dev.vars.example` to the ignored `.dev.vars`, enter your local credentials securely, build, then run `npx wrangler pages dev dist --port 8788`. Plain Vite preview serves the frontend only. Run `npm run test:contact` for mocked-provider validation, acceptance, failure, and missing-configuration checks; these tests do not send real emails.

### Storytelling and access

The five-second cinematic introduction progresses through signal, system, and reality, with a numeric sequence readout, five reveal shutters, a skip control, and a 5.1-second failsafe. It plays once per tab; reduced motion bypasses it. Vertical scrolling drives CSS-sticky chapters through GSAP ScrollTrigger; Lenis is the single smooth-scrolling engine. Galleries retain drag, horizontal wheel, and keyboard interaction. The photo spiral allows vertical touch scrolling and horizontal dragging. Reduced motion removes sticky scroll journeys and autoplay while preserving content and manual controls. The section-focus outline is suppressed only on programmatic section targets; keyboard controls retain visible focus.

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
