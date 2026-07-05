# H₂O — Dyrane's Portfolio

**Complexity, clarified.** Design and engineering for operations software, high-stakes AI systems, and product interfaces that help people trust and act faster.

This is the source for Dyrane's portfolio site. It is built to speak to clients first: within a few seconds a non-technical visitor should understand what is on offer and see the proof behind it. Live at [dyrane.tech](https://dyrane.tech).

## What it shows

The site presents shipped work across three lanes:

- **Operations and logistics** — dispatch, routing, inventory, and real-time visibility tools (iVisit, Slatechain, BoxDrop).
- **AI workflow systems** — AI packaged into clear, trustworthy workflows (Dr. Dyrane clinical triage, Aero).
- **Product and UX** — storefronts, redesigns, and brand surfaces built to convert (Kradle, House of Prax, AU Mosaic).

Everything is driven by a single dataset in `src/data/projects.ts`. Each project can carry a case study (shown in the project overlay) and a showcase block (device-framed screenshots on the homepage). Proof numbers such as total commits are summed from that data, not hardcoded.

## Stack

- React 18 and TypeScript, bundled with Vite 5
- Tailwind CSS with a custom design system
- Framer Motion for interaction; React Three Fiber for the hero scene
- Radix UI primitives; PWA support via `vite-plugin-pwa`
- Server-side rendering through a small Express server (`server.js`)

## Design system — Quiet Performance

The interface favors depth over decoration: a soap-bubble glass material, a global no-borders rule (structure comes from light, spacing, and shadow), a neutral monochrome base with a single warm accent, SF Pro Display type, squircle geometry, and full light and dark theming. Motion is deliberate and respects reduced-motion preferences.

## Develop

```bash
npm install
npm run dev        # SSR dev server at http://localhost:5173
```

Other scripts:

- `npm run build` — build the client and server bundles
- `npm run start` — run the production SSR server
- `npm run lint` — run eslint
- `npm run generate:og` — regenerate the social preview image

## Deploy

Two supported paths:

- **Vercel** — the static client build (`build:client`) served as an SPA, per `vercel.json`.
- **Node SSR** — `npm run build` then `npm run start` to serve server-rendered HTML from `server.js`.

## Quality bar

The definition of done lives in `docs/portfolio/closeout-checklist.md`: clear to clients, stable on every screen, fast in production (last production Lighthouse: Performance 96, Accessibility 100, Best Practices 100, SEO 100), visually consistent, and free of known regressions.

## Contact

**Dyrane** — [hello@dyrane.tech](mailto:hello@dyrane.tech)

---
*© 2026 Dyrane. Complexity, clarified.*
