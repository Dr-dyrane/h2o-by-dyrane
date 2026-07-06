# Portfolio UI/UX Audit — Customer's-Eye Pass

Date: July 5, 2026
Scope: dyrane.tech homepage (the only route), from a prospective client's perspective.
Author: design + front-end review.

## Method (so every claim is checkable)

Each finding below is backed by three kinds of evidence: a **screenshot** of the live site, the **code** responsible (file and line), and a **measurement** taken from the live DOM via computed styles. Nothing here is a matter of taste asserted as fact — where it is taste, it is labelled as such.

Environment and one honest caveat:

- Live site `https://www.dyrane.tech/`, default dark theme, Chrome.
- Measurements read from `getComputedStyle` on the running page.
- Mobile was tested at a **606px** viewport — the narrowest the browser window would allow (`window.innerWidth` clamped at 606). That is still inside the mobile breakpoint (`max-width:767px` matches; `md`/`lg` do not), so the mobile layout is genuinely exercised. At a true phone width (375–414px) the proportions get tighter, so mobile issues below are a **floor, not a ceiling**.

## Executive summary

The aesthetic is not the problem. The dark, cinematic, liquid-glass system genuinely reads as a premium studio, and the device-framed showcase is a real asset. The problem is that **the craft the site is meant to prove is undercut by a handful of concrete, measurable defects** — a nav that covers text, device frames that render as empty black rectangles, near-invisible outline headings, and a page that is 23.7 screens long — plus a **message gap**: the site's own meta copy is clearer than the words on the page.

Through-line: the site optimizes to impress peers over serving a buyer. Fixing that is mostly subtraction and clarification, not redesign.

Top priorities (detail below): **F1 nav overlap**, **F2 empty frames**, **F4 outline-text legibility**, **F5 hero clarity**. These four are the difference between "impressive but slightly broken" and "obviously excellent."

---

## Findings

Severity: 🔴 critical (hurts trust/usability now) · 🟡 moderate · 🟢 minor.
Effort: S (<1h) · M (a few hours) · L (larger).

### F1 — The floating nav covers page content 🔴 · Effort S–M

**Claim.** The floating pill nav sits on top of content and, because it is translucent, the content collides with it visibly rather than passing cleanly underneath. On mobile it clips section text mid-sentence; on desktop the giant section titles slide behind it.

**Proof.**
- Screenshot (mobile, 606px): the iVisit caption renders as "A shared dispatch view for real-t…" because the nav pill covers the remainder.
- Screenshot (desktop): the outline titles "Content" and "Storefront Conversion" pass behind the centered nav pill.
- Measurement: nav is `position:fixed`, `z-index:50`, background `rgba(28, 25, 23, 0.72)` (72% opaque), `backdrop-filter: blur(24px)`.
- Code: `src/components/FloatingNav.tsx:166–174` — `fixed left-1/2 ... -translate-x-1/2 z-50` with inner `bg-[var(--surface-glass)]`. Token `--surface-glass: rgba(28,25,23,0.72)` at `src/index.css:243`.

**Root cause.** A centered, `w-fit`, **translucent** pill is `position:fixed` over full-width content, and no layout space is reserved for it, so any content scrolling through its band shows through the 72%-opaque background. Translucency is what turns "content scrolls under a bar" (fine) into "content collides with a floating object" (looks broken).

**Fix.**
1. Give the nav a near-opaque surface in both themes — introduce a dedicated `--nav-surface` token (e.g. dark `rgba(14,13,12,0.92)`, light `rgba(251,245,238,0.94)`) and use it on the inner pill instead of `--surface-glass`. Keep the blur. Content then passes cleanly underneath and it reads as an intentional floating bar.
2. Add `scroll-margin-top: 6rem` to the anchored sections (`#showcase`, `#process`, `#contact`) so in-page jumps don't land titles under the nav.
3. Mobile: the centered pill spans the content column. Either dock it to a bottom bar (the layout already reserves `pb-[calc(6.5rem+safe-area)]` in `Index.tsx:68`, suggesting a bottom bar was intended) or shrink it and pin it to one edge so it never crosses body copy.

---

### F2 — Device mockups render as empty black rectangles on scroll-in 🔴 · Effort S–M

**Claim.** As showcase rows enter the viewport, the laptop/phone frame is frequently an empty black rectangle before its screenshot appears. On a pure-black page the unloaded frame is invisible, so it reads as broken or unfinished.

**Proof.**
- Screenshot: the "Content Flow" (ableGod) MacBook captured mid-scroll as a solid black screen.
- Measurement (live): showcase `<img>` elements are `loading:"lazy"`, and two of the first three measured `complete:false` with `naturalWidth:0` at capture time (`ivisit-console-dark.png`, `kradle-desktop-dark.png`) — i.e. not yet loaded while already in the DOM.
- Measurement: `document.body` background is `rgb(0,0,0)`; the frame's inner bezel is `bg-black`. Black frame on black page = invisible.
- Code: `src/components/ShowcaseSection.tsx` — `<img ... loading="lazy" />` (≈ lines 92–101 and 183–194) with no load-state placeholder; `dImg` is `null` until hydration (lines 35–37), and the bezel is `bg-black` (line 91/182).

**Root cause.** Lazy images + no skeleton/poster + a black bezel on a black background. There is nothing to look at until the (large) PNG paints.

**Fix.**
1. Add a visible placeholder inside the bezel: a subtle gradient shimmer or a tiny blurred LQIP, so the frame has form before the image loads. The overlay already does a version of this (`ProjectOverlay` fades the image in on `onLoad` with a `Loader2`) — mirror that here.
2. Fade the image in on `onLoad` (opacity 0→1) instead of popping.
3. Eager-load the first showcase image: `loading="eager"` + `fetchpriority="high"` on row 1; keep the rest lazy.
4. Keep shrinking image weight (the AU Mosaic set is already ~0.4–1.0MB; audit the rest to the same budget).

---

### F3 — The page is 23.7 screens long, much of it empty black 🟡 · Effort M

**Claim.** The homepage is punishingly long, and the pure-black background makes the gaps read as dead space rather than breathing room.

**Proof.**
- Measurement: `document.documentElement.scrollHeight` = **16,631px** at 606px width = **≈ 23.7 viewports** of scrolling.
- Code: three compounding sources —
  - `ProcessSteps.tsx:85` — each step is `sticky top-0 h-screen`, and there are three, so the Process section alone is ~3 full viewports of scroll-jacked panels.
  - Vertical padding stacks: `ShowcaseSection` header `mb-32` + section `py-20 md:py-24 lg:py-28`, rows `space-y-20 md:space-y-28`, and each `StaticSnapshot` adds its own `py-12 md:py-20`.
  - Hero is `h-[100dvh]` and the final CTA is `pt-24 pb-32 md:pt-40 md:pb-48`.

**Root cause.** Generous per-section spacing multiplied across many sections, plus the scroll-jacked Process section, on a background that gives the eye nothing during the gaps.

**Fix.**
1. Collapse Process from three `h-screen` sticky panels to one sticky scene or a normal stacked block — this removes ~2 viewports and the scroll-jack.
2. De-stack the showcase padding: pick one rhythm (e.g. row `space-y-24` OR snapshot `py`, not both) and reduce the `mb-32` header gap.
3. Consider featuring 3–4 flagship rows and moving the rest into a compact grid so the page proves range without 20+ screens of scroll.

---

### F4 — Outline headings are transparent with a hairline stroke (near-illegible) 🟡 · Effort S

**Claim.** The big "outline" words (section titles, the "Tell me what" CTA line, the process numerals) are transparent-filled with a ~1px stroke — so little ink lands on the glyphs that they are hard to read, especially on mobile.

**Proof.**
- Measurement: `"Interfaces"` — font-size **109px**, `-webkit-text-stroke: 1px`, fill `rgba(0,0,0,0)` → stroke is **0.92% of glyph height**. Process numeral `"01"` — **192px** font, **2px** stroke → **1.04%**.
- Note: this is *not* a WCAG contrast-ratio failure. Measured solid text passes AA (muted 8.6, ghost 5.97, accent 8.22 against `#000`). The issue is ink coverage on outlined glyphs, which contrast ratios don't capture.
- Code: `ShowcaseSection.tsx:285–297` (`WebkitTextStroke: "1px var(--text-dim)"`, transparent), `Index.tsx:119–122` (CTA "Tell me what"), `ProcessSteps.tsx:113–118` (numerals, `text-[12rem]…[28rem]`, `WebkitTextStroke: 2px`).

**Root cause.** A 1–2px stroke on 100–450px glyphs leaves ~99% of each letter transparent (= the black background), so the word barely registers.

**Fix.** Keep the effect but give the glyphs body: either (a) fill with a low-alpha color instead of transparent (e.g. `color: rgba(248,243,239,0.10–0.18)`), or (b) scale the stroke with the type (aim ~3–5% of font-size, so ~3–5px on the section titles, ~8–12px on the numerals). Simplest: reserve the outline treatment for one accent word per section and set the rest solid.

---

### F5 — The visible hero says less than the site's own meta 🔴 · Effort S

**Claim.** The page opens on an abstraction, while the meta/social copy — which you already wrote — is crisp and customer-framed.

**Proof.**
- Live hero (screenshot + `HeroSerious.tsx:63–66, 171–176`): eyebrow "SYSTEM ACTIVE // PORTFOLIO 2026", H1 "Complexity, clarified.", subhead "Design for operations, internal tools, and high-stakes AI systems." ("high-stakes AI systems" is jargon to a buyer.)
- Meta in `index.html:7–9, 85`: title "Premium Websites, AI Tools, and Custom Platforms"; description "I design and build premium websites, AI tools, and custom platforms that help brands and teams communicate clearly, move faster, and feel more trustworthy"; og:title **"Complex product? Make it clear before the call."**
- Your own closeout rule #1 (`docs/portfolio/closeout-checklist.md`): "a non-technical client can answer 'what does he do?' in under 10 seconds." The current hero doesn't meet the bar the meta already clears.

**Root cause.** The redesign pushed the hero toward artful minimalism and left the plain-language promise in the `<meta>` tags.

**Fix.** Promote the meta line into the page. Keep "Complexity, clarified." as a stylistic kicker if desired, but lead or immediately follow it with plain words, e.g. H1 "Complex product? Make it clear before the call." + subhead "I design and build websites, internal tools, and AI products for teams that need them to actually work." Edit `HeroSerious.tsx` `headlineWords` (line 63) and the subhead (line 175).

---

### F6 — The only way to act is a raw mailto 🔴 · Effort M

**Claim.** Every call to action opens an email client. There is no form, no scheduling link, no WhatsApp — higher friction than a ready buyer expects, and notably at odds with the WhatsApp-first commerce you just shipped for AU Mosaic.

**Proof.** `HeroSerious.tsx:190` (`mailto:hello@dyrane.tech`) and `Index.tsx:124–128` (footer CTA `mailto:hello@dyrane.tech?subject=…`). No other contact affordance in the tree.

**Fix.** Add one low-friction path next to the email: a short inline form (name + one message field), a scheduling link, or a WhatsApp deep link (you have the pattern from AU Mosaic). Keep mailto as the secondary option.

---

### F7 — Proof is in developer language, and demo screenshots show failing data 🟡 · Effort S

**Claim.** The headline proof numbers mean nothing to a buyer, and at least one showcase screenshot displays negative/empty metrics that read as failure.

**Proof.**
- Code `content/homepage.ts:64–77` / `Index.tsx:36,60` — proof strip renders "{n}k+ commits", "3 lanes", "1 workflow". "Commits" is a developer metric.
- Screenshot: the iVisit mobile screen shows "Aggregated Success 0% −40%", "$0 today", "0.0%".

**Fix.** Translate proof to buyer terms: "20+ products shipped", "Live in production", years, or client outcomes. Re-capture demo screens with healthy, positive numbers.

---

### F8 — The Process section talks to developers, not clients 🟡 · Effort S

**Claim.** The visible Process copy is about the tools and about impressing, not about the client's outcome — and it duplicates a *better*, customer-focused version that already exists but isn't used.

**Proof.**
- Rendered copy `ProcessSteps.tsx:6–28`: "Production-ready engineering using React, Tailwind, and Framer Motion. Built to scale, **designed to impress**." (jargon + impress-first).
- A customer-framed process already exists and is unused: `content/homepage.ts:116–135` — "Find where trust or clarity breaks", "Reshape the workflow and message around that moment", "Build the final version and sharpen the proof."

**Fix.** Render the `content/homepage.ts` process copy (or similar client-outcome language) in `ProcessSteps.tsx` and delete the hardcoded dev copy, removing the duplicate source of truth.

---

### F9 — Small design-system inconsistencies 🟢 · Effort S

**Claim & proof.**
- `--text-dim` (`rgba(248,243,239,0.66)`, contrast 8.12) and `--text-muted` (`0.68`, 8.6) are effectively the same token (`index.css:255–259`) — two names, one value, no clear rule for which to use.
- The "no borders" law is broken by `border-t border-white/5` in `ProcessSteps.tsx:85`.

**Fix.** Either give `--text-dim` a genuinely distinct role/value or merge it into `--text-muted`. Replace the `border-t` with a shadow/gradient separator (or remove it) to honor the stated system.

---

## Prioritized roadmap

**P0 — do first (the "looks broken" set), ~half a day**
- F1 nav overlap (opaque nav surface + scroll-margin + mobile placement)
- F2 empty frames (placeholder + onLoad fade + eager first image)
- F4 outline-text legibility (fill or thicker stroke)

**P1 — clarity & conversion, ~half a day**
- F5 hero copy from the meta
- F6 low-friction contact
- F7 buyer-language proof + fixed demo screenshots
- F8 client-facing process copy (reuse existing content)

**P2 — polish**
- F3 page length / Process scroll-jack / padding de-stack
- F9 token + border cleanup

## What's genuinely strong (keep it)

- The premium liquid-glass system reads as high craft; the warm-accent-on-monochrome direction is coherent and distinctive.
- The device-framed showcase (real product screens + plain feature lines + "View case study") is the most persuasive, most customer-legible part of the site.
- Meta/SEO/social copy and JSON-LD are sharp and buyer-focused.
- Solid front-end discipline: reduced-motion support, focus-visible rings, skip link, active-section nav via IntersectionObserver, font preloading, lazy sections.

## Appendix — measurements

| Element | Measured value | Verdict |
|---|---|---|
| Dark surface (`--surface`) | `#000000` (pure black) | Amplifies empty voids / invisible unloaded frames |
| `--text-muted` on surface | 8.6:1 | Passes AA |
| `--text-dim` on surface | 8.12:1 | Passes AA; nearly identical to muted |
| `--text-ghost` on surface | 5.97:1 | Passes AA |
| `--cat-ux` (accent) on surface | 8.22:1 | Passes AA |
| "Interfaces" heading | 109px font / 1px stroke = **0.92%** ink | Near-illegible |
| Process numeral "01" | 192px font / 2px stroke = **1.04%** ink | Near-illegible |
| Nav background | `rgba(28,25,23,0.72)`, blur 24px, z 50, fixed | Too translucent → content collision |
| Showcase images | `loading:lazy`, 2/3 `complete:false` on entry | Empty black frames |
| Page height | 16,631px ≈ **23.7 viewports** | Too long |
| Hero subhead | 17.6px, `--text-muted` | OK size/contrast; copy is the issue |

## Implementation log

Status legend: Open · Fixed (code, pending live QA) · Deferred (needs Dyrane).

- **F1 nav overlap — Fixed (code, pending live QA).** Added a near-opaque `--nav-surface` token (dark `rgba(10,9,8,0.92)`, light `rgba(251,245,238,0.94)`) used by `FloatingNav`; content now passes cleanly under the pill instead of colliding. Added `html { scroll-padding-top: 5.5rem }` and a `prefers-reduced-transparency: reduce` solidify (`src/index.css`, `FloatingNav.tsx`). Deeper mobile move (compact island / bottom bar) left as a Dyrane decision.
- **F4 outline-text legibility — Fixed (code, pending live QA).** Gave the transparent headings real body: "Interfaces" now `rgba(248,243,239,0.16)` fill + 1.5px `--text-muted` stroke; the "Tell me what" CTA likewise; process numerals now a `color-mix(... 14%)` fill + 3px stroke (also fixed a broken `${accent}22` shadow value). (`ShowcaseSection.tsx`, `Index.tsx`, `ProcessSteps.tsx`).
- **F2 empty frames — Fixed (code, pending live QA).** Device bezels changed from pure `bg-black` to a subtle "screen-off" gradient, so an unloaded frame reads as a powered-down screen rather than an invisible void; the screenshot paints over it (`ShowcaseSection.tsx`). Follow-up polish available: eager-load the first showcase image.
- **F5 hero — Fixed (code, pending live QA + copy sign-off).** Kept "Complexity, clarified." as the kicker; subhead now names the offer plainly; primary CTA "Explore Evidence" → "See the work" (`HeroSerious.tsx`).
- **F6 contact — Fixed (code); confirm number.** Added `WhatsAppFloat` (ported from AU Mosaic: fixed capsule, prefilled chat, hover chip, `data-cta` tag, safe-area) and wired it into `Index.tsx`. Number set to `2349517284218` (assumed +234 Nigeria) — confirm the country code.
- **F7 proof — Fixed (code, pending sign-off).** Proof strip now leads with "20+ products shipped, live in production" instead of a commit count (`content/homepage.ts`, `Index.tsx`).
- **F8 process copy — Fixed (code, pending sign-off).** Process steps swapped from developer-jargon to the client-focused copy already written in `content/homepage.ts` (`ProcessSteps.tsx`). Follow-up: unify to a single imported source.
- **F9 borders — Fixed (code).** Removed the `border-t border-white/5` hairline in `ProcessSteps` to honor the no-borders law. Optional follow-up: merge near-identical `--text-dim`/`--text-muted` and adopt AU Mosaic's fixed type ramp.
- **F3 page length — Accepted by design (Dyrane's call).** The long cinematic scroll (~23.7 viewports, with 3 sticky Process scenes) is intentional; kept as-is. Closed as won't-fix.

Verification note: edited files pass `esbuild` transform (vite's own transformer). Live visual QA (before/after at 1440 + ≤414) and deploy remain Dyrane's step, per the environment constraints in the elevation goal.
