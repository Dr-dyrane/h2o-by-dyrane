# Portfolio UI Elevation — Goal & Guardrails

Date: July 5, 2026
Companion docs: `docs/portfolio/ui-audit.md` (findings F1–F9) · `docs/portfolio/closeout-checklist.md` (definition of done)
Design source: AU Mosaic — the "Mosaic Maison" design law (`AGENTS.md`, `docs/DESIGN.md`)

## North-Star goal

Make the portfolio visibly embody the craft it sells — by borrowing AU Mosaic's proven design discipline to fix the audit's defects — **without a rewrite, and without diluting the premium aesthetic.**

One-line test of done: a non-technical client lands, understands the offer in under 10 seconds, sees polished (never-broken) proof of work, and has an obvious low-friction way to start — on any device.

## Why now

The audit proved the site's problems are concrete and measurable, and AU Mosaic already solved several of them under a stricter design law. This is elevation by borrowing a working reference next door, not invention.

## Success criteria (measurable, tied to the audit)

| # | Target | Source finding |
|---|--------|----------------|
| S1 | No content obscured by the nav at 375 / 768 / 1024 / 1440 | F1 |
| S2 | Zero empty/black device frames; every showcase image has a placeholder + on-load fade; first image eager-loaded | F2 |
| S3 | Large "outline" text legible — ink coverage raised from ~1% to a readable level (thicker stroke or a real fill) | F4 |
| S4 | Hero states the offer in plain language (meets closeout rule #1: "what does he do?" in <10s) | F5 |
| S5 | At least one low-friction contact path besides `mailto:` | F6 |
| S6 | Homepage cut from ~23.7 viewports toward ~12–14; Process no longer 3× full-screen scroll-jack | F3 |
| S7 | Proof + process copy in client language; demo screenshots show healthy data; one content source | F7, F8 |
| S8 | One type ramp; zero stray borders/hairlines | F9 |

**No-regression bar (must all hold):** Lighthouse ≥ Perf 96 / A11y 100 / Best Practices 100 / SEO 100 · WCAG AA maintained (focus rings, skip link, reduced motion) · the AU Mosaic flagship and existing showcase still render · the project overlay interaction is unchanged.

## Guardrails (hard constraints — these outrank speed or convenience)

1. **Elevation, not redesign.** Preserve the aesthetic, palette, bubble hero, and cinematic scale. Any change that alters the *feel* needs Dyrane's sign-off before it ships.
2. **No re-architecture.** No stack migration, no SSR/SSG rewrite, no router swap. Borrow AU Mosaic's *patterns and CSS primitives*, not its framework. Revisit only if Dyrane explicitly approves.
3. **Subtract before adding.** No new heavy dependencies; prefer removing over installing.
4. **Honor the borrowed laws.** No borders/hairlines (separate with whitespace, imagery, lucent surfaces). One type ramp (11/12/14/16/20/26 + display sizes). Capsule interactive chrome, 28px squircle panels. Media eye-verified and under ~400KB. A single content source of truth.
5. **Protect shipped work.** The AU Mosaic entry, the desktop-only showcase support, and the overlay (a reference interaction, per the closeout checklist) must not regress.
6. **Copy is Dyrane's voice.** Claude drafts customer-facing words; Dyrane approves. Terse, human, one idea per sentence, no em dashes (AU Mosaic copy law).
7. **Ship incrementally and reversibly.** P0 → P1 → P2, each phase independently verifiable, small reviewable commits with story-telling messages.
8. **Prove every fix.** Before/after screenshots (desktop + mobile) plus a clean build and lint per change (AU Mosaic's verify ritual). Update the finding's status in `ui-audit.md`.
9. **Stay in scope.** Tight diffs. No drive-by refactors outside the finding being fixed.
10. **Mind the sandbox.** Deletes are blocked and `git` leaves a stale `index.lock`; commit via the temp-index workaround, and Dyrane pushes from his own terminal.

## Scope

**In:** the 9 audit findings, fixed via the AU Mosaic borrow kit; token / geometry / media discipline; copy clarity.
**Out:** framework migration; new features or sections; content strategy beyond copy fixes; any overlay redesign.

## The AU Mosaic borrow kit (design source → target finding)

- Floating nav + "iOS 26 tab bar" treatment → **F1** (nav overlap): lucent-but-legible surface, safe-area, mobile placement.
- Media law (stills <~400KB, eye-verified, day/night pairs) → **F2** + image weight.
- "No borders — whitespace, imagery, lucent surfaces separate" → **F9**.
- Fixed type ramp (11/12/14/16/20/26 + display sizes) → **F4** + the magic-number problem.
- Apple-terse, customer-first copy → **F5**, **F8**.
- `wa.ts` WhatsApp deep-links with placement tracking → **F6**.
- `catalog.ts` single read path → **F8**'s duplicate content source.
- SSG instant-paint *principle* (not the migration) → a static hero fallback in `index.html` for first paint.

## Phased plan

**Phase 0 — Extract (no visible change).** Read AU Mosaic's `docs/DESIGN.md`, `src/app/globals.css`, and its floating-nav / tab-bar component. Port the type ramp, geometry tokens, lucent-surface separators, and nav treatment into the portfolio's `index.css` as tokens. Gate: build clean, no visual change yet.

**Phase 1 — P0, the "looks-broken" set.** F1 nav overlap · F2 empty frames · F4 outline-text legibility. Gate: before/after screenshots at four widths; no content obscured; no empty frames.

**Phase 2 — P1, clarity & conversion.** F5 hero copy · F6 contact path · F7 proof + demo screenshots · F8 client-facing process copy (reuse `content/homepage.ts`). Gate: 10-second test passes; contact path works; Dyrane approves copy.

**Phase 3 — P2, polish.** F3 page length / Process · F9 tokens & borders. Gate: viewport count down; Lighthouse re-run at baseline.

## Verification gate (every phase)

- `npm run build` clean + `eslint` clean (warnings treated as errors).
- Before/after screenshots: desktop (1440) + mobile (≤414) via Chrome.
- Lighthouse re-check against the baseline.
- For structural phases (P0, P2), a fresh-eyes verification pass before marking done.
- Flip the finding's status in `ui-audit.md` from Open → Fixed with the proof.

## Decision points for Dyrane (flagged, not assumed)

- **Aesthetic latitude:** strict elevation (default) vs. allow bolder moves on the hero / Process.
- **Contact method (F6):** inline form vs. scheduling link vs. WhatsApp — recommend WhatsApp, given AU Mosaic and the market.
- **The 3D bubble hero:** keep as-is, make it lighter, or make it optional.
- **Page-length target:** how aggressively to cut Process and the inter-section voids.
