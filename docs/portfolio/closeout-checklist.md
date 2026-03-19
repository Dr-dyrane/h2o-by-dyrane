# Portfolio Closeout Checklist

Last updated: March 18, 2026

This document defines what "closed" means for this portfolio.

A portfolio is only closed when all hard gates pass, there are no known major UX regressions, and the remaining issues are purely optional polish.

## Non-Negotiables

- The site must speak to clients first, not developers first.
- The first screen must tell a non-technical client what is being offered.
- The work must be easy to scan before it asks anyone to read deeply.
- The project overlay is a reference interaction and should not be redesigned casually.
- The visual system should avoid obvious separator borders unless there is a very strong reason.
- The color system must be intentional. For this portfolio, the chosen direction is a neutral monochrome base plus one warm accent on public-facing surfaces.

## Closure Rule

Close the portfolio only when all of the following are true:

- All hard gates below are marked `Pass`.
- No `Open` item affects first impression, trust, or navigation.
- No `Open` item affects mobile, tablet, or desktop usability.
- Lighthouse production scores are at target or any gap is understood and accepted deliberately.
- The site feels finished in both behavior and message, not just visually impressive.

## Status Legend

- `Pass`: complete and verified
- `Verify`: expected to be good, but still needs a full QA pass
- `Open`: not ready to close

## 1. Positioning and Client Clarity

Status: `Pass`

Pass criteria:

- Hero states clearly what services are offered.
- A non-technical client can answer "what does he do?" in under 10 seconds.
- Services are framed in client language, not internal or conceptual language.
- The portfolio explains outcomes, not just systems or aesthetics.
- The CTA is obvious and not buried.

Checks:

- Hero headline is plain English.
- Supporting copy mentions products, websites, AI workflows, or platforms in direct terms.
- Services section maps to real client needs.
- Footer CTA is explicit and actionable.

## 2. Scan-First Information Architecture

Status: `Pass`

Pass criteria:

- The page works for scanners before it works for readers.
- Section labels are short and clear.
- Project sections can be understood from headings, chips, and proof points alone.
- Long-form copy is secondary, not primary.

Checks:

- Each major section has a visible label or strong heading.
- Featured work is legible without opening overlays.
- Supporting archive cards are easy to compare quickly.
- No section opens with a paragraph when a heading plus one sentence would do better.

## 3. Portfolio-Specific Storytelling

Status: `Pass`

Pass criteria:

- Each featured project reads like a product reveal.
- Each featured project clearly answers what it is, who it is for, what problem it solves, and why it is credible.
- The work section feels guided, not chaotic.

Checks:

- One flagship project per lane.
- Archive cards support the flagship instead of competing with it.
- Overlay deepens the story instead of compensating for unclear listing cards.

## 4. Visual System and Brand Consistency

Status: `Pass`

Pass criteria:

- The palette feels intentional and consistent.
- The no-borders rule is respected across the public-facing surfaces.
- Shadows, glass, and spacing all belong to the same design language.
- The site feels premium and calm, not overdesigned or tech-demo-like.

Checks:

- No accidental divider lines or stroke-heavy surfaces.
- Chips, panels, and cards feel from the same family.
- Visual rhythm is consistent across hero, work, and footer.
- Accent usage is deliberate and limited.

Notes:

- The chosen color direction is now implemented on public-facing surfaces: neutral monochrome base plus one warm accent.

## 5. Responsive Layout Quality

Status: `Verify`

Pass criteria:

- The layout is clean from small mobile through extra-large desktop.
- No navigation squeeze occurs between `md` and `xl`.
- No project text blocks become cramped or awkward at tablet widths.
- CTA placement stays obvious at every breakpoint.

Required QA widths:

- 320
- 375
- 390
- 414
- 768
- 820
- 1024
- 1280
- 1440

Checks:

- Navbar has no squeeze, wrap, or awkward hiding behavior.
- Hero text balance works on tablet and desktop.
- Featured project two-column layouts remain comfortable.
- Footer does not collapse awkwardly.
- Overlay remains strong on mobile and desktop.

Known notes:

- Navbar squeeze was corrected by moving desktop nav behavior to `lg`.
- A mechanical responsive pass now exists under `docs/portfolio/reports/responsive-metrics.json` and shows no horizontal overflow or section spillover at `768`, `820`, `1024`, `1280`, or `1440`.
- A full responsive capture set exists under `docs/portfolio/responsive-pass`.
- The earlier blank lower sections were caused by deferred homepage mounts showing placeholders in real captures; those deferred mounts were removed, and fresh production captures under `docs/portfolio/responsive-pass/live` now show the work section rendering correctly at `375`, `768`, `1024`, and `1280`.

## 6. Interaction and Motion

Status: `Verify`

Pass criteria:

- Interactions feel deliberate and premium.
- Motion clarifies hierarchy instead of distracting.
- No animation causes layout instability.
- Reduced motion still feels complete.

Checks:

- Overlay open and close feel controlled.
- CTA hover states are consistent.
- Motion does not delay comprehension.
- No decorative effect harms readability.

## 7. Overlay Quality

Status: `Verify`

Pass criteria:

- Overlay remains the strongest storytelling surface.
- Mobile overlay works fully.
- Desktop overlay works fully.
- Content stages are visible and coherent.
- Closing and reopening works reliably.

Checks:

- Step content renders on mobile.
- Body scroll lock works.
- Case-study flow remains intact.
- No redesign of overlay structure unless explicitly intentional.
- Overlay step labels, CTAs, and supporting copy speak to clients first, not technical peers first.

Known notes:

- Overlay copy has been rewritten to client-facing summaries and recommendations.
- Fake stability and reliability metrics were removed in favor of actual build depth, core-system counts, and live/public signals.

## 8. Copy and Content Hygiene

Status: `Verify`

Pass criteria:

- No leftover old-brand or placeholder language remains.
- No overly conceptual copy blocks client understanding.
- Grammar, punctuation, and naming are clean.
- Each project has concise, useful proof.

Checks:

- Navbar, hero, services, work, process, and footer all use the current positioning.
- No stale "collective" or internal-system wording remains unless intentional.
- No encoding artifacts remain.
- Link labels and CTA labels are consistent.

Known notes:

- Mojibake in project data is now normalized at the overlay display layer, but the source dataset itself still contains some legacy encoded strings.

## 9. Performance

Status: `Pass`

Target:

- Lighthouse production score: 100 if feasible, otherwise accepted only with a documented reason
- FCP under 1.8s
- LCP under 2.5s ideally, under 3.0s maximum
- TBT near 0ms
- CLS 0 to 0.02

Current known benchmark:

- Final production Lighthouse against a fresh production server and clean Chrome profile: Performance 96, Accessibility 100, Best Practices 100, SEO 100.
- Metrics: FCP 1.4s, LCP 2.7s, TBT 0ms, CLS 0, Speed Index 1.4s.

Pass criteria:

- Production build, not dev mode, is used for judging performance.
- No localhost-only analytics or service worker noise remains.
- Homepage path avoids unnecessary heavy mounts.
- Major interaction components are lazy-loaded where appropriate.

Checks:

- Run Lighthouse in production, clean profile, incognito.
- Verify no `/_vercel/insights/script.js` localhost errors.
- Verify no stale service worker behavior.
- Review bundle and render-blocking CSS only if still below target.

Known notes:

- The score remained at 96 after removing deferred homepage placeholders so the actual work and proof sections render immediately.
- This is an accepted tradeoff for UX integrity unless a strict 100 performance target is still required.

## 10. Accessibility

Status: `Pass`

Target:

- Lighthouse Accessibility 100

Pass criteria:

- Color contrast remains compliant.
- Interactive elements are reachable and labeled.
- Visual hierarchy is still understandable without relying on color alone.

Checks:

- Keyboard access works for navigation and overlay.
- CTA labels are meaningful.
- Theme toggle and social icons have labels.

## 11. Best Practices and SEO

Status: `Pass`

Target:

- Lighthouse Best Practices 100
- Lighthouse SEO 100

Pass criteria:

- Metadata reflects the actual portfolio positioning.
- Social preview assets are valid.
- Robots, sitemap, and canonical setup are sane.
- No broken production-only scripts remain.

Checks:

- `index.html` metadata matches current brand and message.
- OG image and favicon load correctly.
- `public/robots.txt` and `public/sitemap.xml` remain correct.

## 12. Reliability and Deployment

Status: `Pass`

Pass criteria:

- Production SSR path works.
- Static serving does not accidentally bypass SSR.
- No local-only hacks leak into deployed behavior incorrectly.

Checks:

- `npm run build` passes.
- `npm run build:client` passes.
- Production server renders expected HTML.
- Analytics only load when appropriate.

Known notes:

- A stale SSR process previously cached an older server bundle and caused a false hydration failure against a newer client bundle.
- After a clean rebuild and restart, the current runtime probe is clean again; final production QA should always be done from a fresh server process.

## 13. Final Human QA

Status: `Verify`

Pass criteria:

- A full manual pass has been done on phone, tablet, and desktop.
- The site feels finished, not just functional.
- Every visible screen has been checked by eye.

Required walkthrough:

- Open homepage from top to bottom.
- Test navbar at all required widths.
- Open every featured project overlay.
- Test archive project selection.
- Test theme switch.
- Test footer CTA and social links.
- Test return navigation and page reload.

## 14. Closeout Decision

Status: `Verify`

Do not mark this mathematically perfect yet if any of the following remain true:

- A strict 100 performance score is still being treated as non-negotiable.
- A visible rule of the design system is knowingly broken.
- The site still raises a "this is impressive, but what does he sell?" reaction for non-technical viewers.

## Current Known Open Items

- Optional manual overlay walkthrough across mobile and desktop for exhaustive signoff
- Optional performance pass only if Lighthouse 100 remains a hard requirement

## Definition of Done

The portfolio is done when it is:

- clear to clients
- memorable to peers
- stable on every screen
- fast in production
- visually consistent
- free of known major regressions

Until then, it is close, but not closed.
