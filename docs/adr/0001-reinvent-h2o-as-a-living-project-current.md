# ADR 0001 — Reinvent H₂O as a living project current

- **Status:** Accepted
- **Decision date:** 2026-08-12
- **Owners:** Alexander Udeogaranya / Dyrane
- **Applies to:** `dyrane.tech`, the H₂O portfolio application, its project data, case studies, media, motion system, spatial rendering, analytics, accessibility, performance and release process
- **Supersedes:** incremental visual-polish work as the primary portfolio strategy
- **Preserves:** the current production site as the stable baseline until the replacement passes every release gate in this ADR

## 1. Decision

H₂O will be reinvented as **a living, navigable record of Dyrane's body of work**, rather than maintained as a conventional portfolio with a decorative WebGL hero and a long sequence of project showcases.

The working product language is:

> **H₂O — A body of work in motion.**
>
> **50 builds. One current.**

The new experience will generate its primary spatial composition from truthful project data: when projects began, what domains they belong to, how they relate to one another, which technologies and design ideas moved between them, how mature they became, and what each project taught the next one.

The project current is not a decorative background. It is the portfolio's information architecture, opening image and central interaction.

The portfolio will organize the work through three overlapping modes of practice:

1. **Observe** — medicine, research, evidence, diagnosis of systems and the identification of where trust or clarity breaks.
2. **Build** — interface design, product architecture, engineering, interaction and the translation of complexity into working software.
3. **Operate** — production systems, real users, commerce, healthcare, logistics, trust, maintenance and the consequences of software after launch.

These modes are not service cards or isolated categories. They are lenses through which the same projects may be understood. A project may begin in Observe, become concrete in Build and prove itself in Operate.

WebGL will be used only where it carries this meaning:

- the opening project current;
- the exploratory project atlas;
- transitions between the atlas and a selected case study.

Case studies, navigation, controls, project evidence and all essential content will remain semantic HTML. The GPU will not run merely to decorate ordinary reading surfaces.

## 2. Context

### 2.1 The current site is technically capable but conceptually behind the work

The current H₂O application already contains competent modern implementation work:

- React and TypeScript;
- Vite client and server builds;
- server-side rendering through Express;
- React Three Fiber, Drei and Three.js;
- Framer Motion;
- responsive project showcases;
- project overlays and case studies;
- light and dark themes;
- PWA support;
- reduced-motion behavior;
- performance, accessibility, best-practice and SEO verification.

Therefore, the problem is not that H₂O lacks WebGL, motion or technical polish. The current hero already renders a transmissive glass sphere with lighting, environment and restrained movement.

The problem is that the spatial object is substantially independent of the portfolio's content. It proves familiarity with a rendering stack, but it does not explain who Dyrane is, why these projects belong together, or how the work changed over time.

The current presentation also compresses an unusually broad practice into familiar portfolio language. Dyrane's body of work spans:

- emergency healthcare and clinical systems;
- operational software and real-time dispatch;
- African commerce and local discovery;
- skincare evidence, safety and retailer trust;
- finance and personal operating systems;
- fashion commerce, identity and creative operations;
- spatial invitations and wedding storytelling;
- product research, design systems and engineering infrastructure.

A generic “designer and developer” frame understates the real differentiator: the same person moves between observing human systems, designing interfaces, engineering products and operating them in production.

### 2.2 Incremental refinement has reached diminishing returns

Previous portfolio work successfully improved:

- client-facing positioning;
- visual consistency;
- responsive rendering;
- image loading and device framing;
- project-overlay clarity;
- accessibility;
- metadata and social presentation;
- production performance.

Those improvements remain valuable and must not be discarded casually. However, continuing to tune the same hero, cards, glass, headings and page rhythm will not create the conceptual leap now required.

The next version must change the organizing idea, not merely increase animation density.

### 2.3 The portfolio must represent accumulated judgment

The newest Dyrane projects are stronger not only because newer tools were used, but because earlier projects changed the decisions made in later ones.

The portfolio should make that transfer visible. Examples include:

- healthcare experience informing safety, escalation and trust boundaries elsewhere;
- operating-console work informing dense information hierarchy;
- retailer-handoff research informing commerce trust;
- mobile map products informing detents, spatial orientation and progressive disclosure;
- fashion and wedding work expanding visual direction beyond conventional software UI;
- repeated release work producing stronger validation, fallbacks and documentation.

A chronological gallery cannot explain this well. A connected current can.

## 3. Product thesis

H₂O will answer three questions immediately:

1. **What does Dyrane do?**
   He studies complex human and operational systems, then designs, builds and operates software that makes them clearer and more trustworthy.
2. **What has he actually built?**
   The visitor can see a truthful body of shipped and evolving work, not a collection of disconnected mockups.
3. **Why is his work different?**
   Medicine, product design, engineering, research and operations are treated as one continuous practice rather than separate identities.

The experience must remain understandable to a non-technical prospective client within ten seconds, even when WebGL is unavailable.

The visual ambition is subordinate to that product thesis.

## 4. Governing experience model

### 4.1 Opening state

The first frame presents a calm field containing the living project current.

It must communicate, without requiring interaction:

- Dyrane's name or identity;
- the current positioning in plain language;
- the scale of the body of work;
- one obvious action to enter the work;
- a visible static interpretation when the spatial layer is absent.

The opening is not a long cinematic preloader. Essential text and the primary action render immediately in the DOM. The current may settle into place around them, but comprehension never waits for it.

Suggested copy hierarchy:

- **Dyrane**
- **I observe complex systems, build the product, then stay for what happens in the real world.**
- **50 builds. One current.**
- **Enter the work**

Final copy may change, but it must preserve the same directness.

### 4.2 Project current

The current is a spatial, data-derived representation of the portfolio.

Each project contributes a node or trajectory with properties derived from the canonical project record. The visual form may use points, filaments, ribbons, particles constrained to paths, instanced geometry or a hybrid approach, but its meaning must remain inspectable.

The current should make visible:

- chronology;
- project families;
- domain changes;
- recurring technologies;
- recurring interaction patterns;
- maturity;
- public or private status;
- active, maintained, paused, archived or superseded state;
- explicit lineage and influence between projects.

The current must not imply relationships that are not recorded in data.

### 4.3 Atlas state

Entering the work expands the current into an explorable atlas.

The atlas supports three equivalent ways to navigate:

- **spatial exploration** through the current;
- **structured filters** for Observe, Build, Operate, domain, year and status;
- **a complete semantic list** that remains usable with keyboard, reduced motion, no WebGL or assistive technology.

Hover is supplementary. Selection, focus, touch and keyboard all expose the same information.

Selecting a project reveals:

- project name;
- one-sentence purpose;
- year or active period;
- domain;
- maturity and current state;
- its strongest truthful proof;
- the connection to preceding and subsequent work;
- an action to open the case study.

The atlas must never become a game whose navigation has to be learned before the work can be understood.

### 4.4 Case-study state

Opening a flagship project transitions out of the current and into a reading-first editorial case study.

The transition may preserve a selected node, trajectory, color signal or camera direction, but the case study itself is semantic HTML with owned images, film, diagrams and interactive evidence.

The spatial layer must either pause or unmount while long-form content is being read.

Every flagship case study must contain:

1. **The situation** — who the system served and what was at stake.
2. **The first imperfect version** — what existed initially, including uncomfortable evidence where useful.
3. **The decision that changed the project** — the pivotal product, design or engineering judgment.
4. **The system** — architecture, workflow, interaction and operational boundaries in language appropriate to the reader.
5. **What shipped** — current production truth, not aspiration.
6. **What did not work or remains unresolved** — no false perfection.
7. **Outcome and proof** — measurable results where available; otherwise concrete observable evidence.
8. **What transferred forward** — how this project changed later work.

The case study may offer a technical-depth layer, but it must first work for clients, product leaders and design reviewers.

### 4.5 Return to the current

Closing a case study returns the visitor to the same atlas position, selection and filter state. The portfolio must preserve orientation rather than restarting the experience.

## 5. Information architecture

### 5.1 Primary routes

The target route model is:

- `/` — opening and atlas entry;
- `/work` — direct semantic archive and atlas route;
- `/work/[slug]` — canonical case-study routes;
- `/about` — concise identity, practice and availability;
- `/contact` — low-friction project enquiry;
- `/colophon` — credits, technologies, accessibility and spatial-experience notes.

The project overlay may remain during migration, but canonical case studies should become addressable routes. Deep linking, history, refresh and social sharing must not depend on an in-memory overlay state.

### 5.2 Flagship stories

The first award-ready version will deeply author approximately six flagship case studies rather than present every project at equal visual weight.

Initial flagship set:

- **Dyrane Weddings** — spatial storytelling, publishing and event collaboration;
- **iVisit** — emergency healthcare coordination and operational trust;
- **JeloCare** — evidence-led care guidance and Nigerian retail intelligence;
- **WetinDey** — community-confirmed local availability and map-first interaction;
- **AU Mosaic** — material commerce and visual decision support;
- **Just Urban Wears** or **EngineerOS** — fashion commerce and creative operations, or the engineering operating system, selected according to the strongest complete evidence at implementation time.

Flagship status is an editorial role, not a permanent ranking. The canonical data model must allow it to change without restructuring the application.

### 5.3 Archive

All other truthful work remains available in a compact archive.

Archive entries must not imitate incomplete case studies. Each should provide:

- name;
- period;
- one-line purpose;
- domain;
- status;
- role;
- strongest available proof;
- public link when safe and live;
- relationship to flagship or adjacent work.

Experiments, duplicates, deployment copies, backends and internal tools should be labeled honestly rather than counted as equivalent public products.

## 6. Canonical project data

### 6.1 Single source of truth

The current `src/data/projects.ts` approach will evolve into a versioned project manifest or typed content collection. Rendering code, archive counts, atlas geometry, filters, case-study metadata and proof summaries must derive from this same source.

No visual layer may invent project counts, dates, maturity, impact or relationships.

### 6.2 Minimum project schema

Each project record should support:

```ts
interface PortfolioProject {
  id: string;
  slug: string;
  name: string;
  summary: string;
  period: {
    startedAt: string;
    endedAt?: string;
  };
  status: "active" | "maintained" | "paused" | "archived" | "superseded";
  visibility: "public" | "private" | "internal" | "prototype";
  maturity: "experiment" | "prototype" | "beta" | "production";
  modes: Array<"observe" | "build" | "operate">;
  domains: string[];
  technologies: string[];
  roles: string[];
  proof: PortfolioProof[];
  media: PortfolioMedia[];
  relationships: PortfolioRelationship[];
  flagship?: boolean;
  caseStudy?: PortfolioCaseStudy;
}
```

Relationship records must state their type and evidence:

```ts
interface PortfolioRelationship {
  targetProjectId: string;
  type:
    | "informed"
    | "shared-pattern"
    | "shared-technology"
    | "successor"
    | "supersedes"
    | "companion";
  note: string;
}
```

Automatically inferred links may be used for exploratory filtering, but authored relationships must be visually distinguishable from algorithmic similarity.

### 6.3 Spatial projection

A deterministic projection layer will translate project data into renderer-ready positions, paths and weights.

The projection must be:

- deterministic for the same dataset and version;
- serializable for static fallback generation;
- testable without WebGL;
- independent from the React component tree;
- stable enough that a returning visitor does not encounter a completely rearranged atlas on every load.

Renderer-specific properties must not contaminate the editorial project records.

## 7. Spatial system

### 7.1 Visual law

The world should feel like one current, not a collection of effects.

A single visual grammar will govern:

- flow direction;
- project density;
- relationship lines;
- selection;
- maturity;
- active versus historical work;
- transitions into case studies.

Color, thickness, brightness, movement and depth must each have declared meaning. They may not all be used decoratively at once.

### 7.2 Rendering architecture

The WebGL surface should be isolated behind a stable application boundary.

Recommended layers:

1. **Project domain layer** — canonical records and authored relationships.
2. **Projection layer** — deterministic graph and timeline layout.
3. **Experience state machine** — opening, atlas, selection, transition, case study and return.
4. **Renderer adapter** — React Three Fiber implementation.
5. **DOM mirror** — equivalent semantic archive, controls, labels and selected-project information.
6. **Fallback renderer** — static poster or lightweight canvas/SVG projection generated from the same data.

The experience state must not live exclusively inside Three.js objects.

### 7.3 Rendering budget

The spatial layer will use deliberate budgets rather than open-ended visual ambition.

Initial engineering targets:

- no idle render loop after the scene settles;
- demand-based or invalidated rendering where practical;
- device-pixel-ratio cap based on capability;
- instanced geometry for repeated objects;
- no unbounded particle systems;
- no expensive post-processing as a dependency for legibility;
- no runtime texture or model larger than its demonstrated value;
- WebGL code split from the first semantic paint;
- first meaningful DOM content independent of spatial initialization;
- context loss produces an immediate complete fallback.

Exact bundle and frame-time budgets will be established with measured baselines during Wave 1 and locked before scene expansion.

### 7.4 Mobile behavior

Mobile is not a miniature desktop canvas.

The mobile atlas may use:

- a simplified current;
- fewer visible simultaneous nodes;
- lower geometry density;
- direct swipe or scroll traversal;
- a strong bottom-sheet or inline project reader;
- static or 2.5D fallback on constrained devices.

The same projects, proof and relationships must remain available. Visual density may reduce; information may not.

### 7.5 Pointer, touch and keyboard

The experience must support:

- pointer selection without precision traps;
- touch targets of at least 44 × 44 CSS pixels where controls are exposed;
- arrow-key or ordered keyboard traversal;
- Enter/Space selection;
- Escape return;
- visible focus outside and inside the canvas;
- programmatic focus transfer into the selected project summary and case study;
- orientation restoration on return.

Raw 3D picking is never the only path to a project.

## 8. Motion contract

Motion must explain state, relationship or movement through the body of work.

Permitted roles:

- establish the current;
- reveal chronology or lineage;
- acknowledge focus and selection;
- move between atlas and case study;
- preserve orientation on return.

Motion must be:

- interruptible;
- reversible where the navigation is reversible;
- bounded in duration;
- settled before reading is expected;
- free of hidden scroll hijacking;
- equivalent under reduced motion.

Reduced motion will not simply disable opacity transitions and leave a broken composition. It will present a complete static atlas, direct project selection and immediate route transitions.

## 9. Content and proof rules

### 9.1 Truth over volume

The portfolio will not use repository count, commit count or route count as primary buyer proof unless the metric has a clear reason to matter.

Preferred proof includes:

- production availability;
- users or organizations served;
- workflows completed;
- measurable performance;
- verified accessibility;
- operational coverage;
- reduced failure or decision time;
- release maturity;
- a concrete before-and-after product outcome.

When outcome data is unavailable, the case study must state what is known instead of manufacturing percentages.

### 9.2 Current-state labels

Every project must distinguish:

- what is live;
- what is simulated;
- what is locally verified;
- what remains roadmap;
- what is private;
- what was intentionally stopped.

The portfolio is allowed to show unfinished work, but not to disguise it as production truth.

### 9.3 Authorship

Case studies must sound like an experienced practitioner reflecting on decisions, not generated marketing copy.

Use:

- specific constraints;
- concrete decisions;
- evidence;
- admitted mistakes;
- clear outcomes;
- concise technical depth.

Avoid:

- generic “innovative solution” language;
- technology lists without consequence;
- invented team narratives;
- inflated claims;
- explaining obvious screenshots at length.

## 10. Accessibility and fallback are product requirements

The spatial experience is an enhancement, not an accessibility boundary.

The award-ready release must include:

- complete semantic DOM parity;
- skip navigation;
- logical heading structure;
- keyboard-complete project exploration;
- screen-reader labels and state announcements;
- no-WebGL fallback;
- `webglcontextlost` fallback;
- reduced-motion interpretation;
- reduced-transparency treatment where relevant;
- 320px reflow;
- 200% zoom review;
- visible focus;
- adequate text contrast;
- no information conveyed by color or position alone.

The canvas should be `aria-hidden` when it provides atmosphere that is already represented semantically. When it exposes interactive project selection, an equivalent DOM control set must be adjacent and synchronized.

## 11. Performance and quality gates

The final release is not accepted because it looks smooth on the owner's laptop.

Required evidence:

### Build and correctness

- clean install;
- lint;
- TypeScript;
- unit tests for project validation, projection and state transitions;
- production build;
- route and metadata tests;
- no broken project links or missing media.

### Web performance

Target field or representative lab thresholds:

- LCP at or below 2.5 seconds at p75 or the closest credible mobile test;
- INP at or below 200 milliseconds;
- CLS at or below 0.1;
- semantic first paint before the spatial layer is required;
- no idle GPU work after the scene settles;
- no sustained main-thread blocking during ordinary project reading.

### Spatial performance

- representative low-, medium- and high-capability device tiers;
- mobile frame-time evidence;
- DPR and geometry adaptation verified;
- context-loss recovery;
- no-WebGL behavior;
- static fallback asset verified;
- no memory growth across repeated atlas/case-study navigation.

### Browser and device coverage

- iOS Safari;
- Android Chrome;
- desktop Safari;
- Chrome;
- Firefox;
- Edge;
- touch, trackpad, wheel and keyboard paths.

### Accessibility

- automated serious/critical issue scan;
- manual keyboard pass;
- VoiceOver or equivalent screen-reader pass;
- reduced motion;
- 200% zoom;
- 320px reflow;
- focus restoration across route and spatial transitions.

## 12. Analytics and privacy

Analytics will answer product questions, not record every camera movement.

Allowed events include:

- opening entered;
- atlas entered;
- filter changed;
- project focused;
- project opened;
- case study completed to meaningful thresholds;
- contact action;
- fallback mode used;
- WebGL initialization failure or context loss;
- reduced-motion path used.

Do not record pointer coordinates, continuous camera telemetry or unnecessarily identifying device data.

Event payloads must use project identifiers and coarse capability classes, not personal data.

## 13. Contact and conversion

The experience must not end in a raw `mailto:` as the only action.

The final release will provide one low-friction primary path, such as a concise project enquiry that can be completed inside the site, with email remaining as an explicit secondary path.

The contact flow must preserve the portfolio's clarity:

- name or organization;
- what is being built or improved;
- the immediate problem;
- preferred response method;
- optional budget/timeline only when useful.

No account is required.

## 14. Migration strategy

The existing production site remains available until the replacement passes release gates. The reinvention will not be developed as a sequence of unreviewed visual mutations on production.

### Wave 0 — Preserve and measure

- tag or record the current production baseline;
- retain current Lighthouse and responsive evidence;
- inventory all current project records and media;
- identify broken, private, duplicate and stale external links;
- record current conversion and project-open behavior where available.

**Exit:** the current site can be restored and compared objectively.

### Wave 1 — Data canon

- create the typed project manifest;
- normalize dates, statuses, domains, roles, technologies and visibility;
- author relationships and evidence;
- separate flagship, archive, prototype, internal and deployment-copy records;
- add validation tests;
- generate a complete semantic archive from the data.

**Exit:** the portfolio is truthful and navigable without WebGL.

### Wave 2 — Flagship editorial stories

- author the first six case studies;
- replace weak screenshots and generic proof;
- include before, decision, system, shipped truth, unresolved work, outcome and transfer-forward sections;
- establish canonical routes and metadata.

**Exit:** the content alone is submission-worthy.

### Wave 3 — Current prototype

- implement deterministic projection;
- build a static projection preview;
- prototype the spatial current with a strict performance budget;
- synchronize canvas selection with DOM state;
- establish the opening-to-atlas transition;
- validate mobile simplification and no-WebGL parity.

**Exit:** the spatial layer makes the content more understandable, not merely more impressive.

### Wave 4 — Experience integration

- integrate atlas filters and project summaries;
- implement route transitions and orientation restoration;
- add contact conversion;
- add analytics and failure telemetry;
- complete colophon and accessibility notes.

**Exit:** every primary journey works with pointer, touch, keyboard, reduced motion and no WebGL.

### Wave 5 — Release hardening

- visual review at required widths;
- real-device and browser passes;
- accessibility review;
- performance and GPU adaptation;
- crawler, metadata and social-card verification;
- production smoke, monitoring and rollback plan;
- award-edition capture and submission assets.

**Exit:** no open issue affects first impression, comprehension, navigation, accessibility, performance or production reliability.

## 15. Feature and release control

The reinvention should be separable from the stable site through either a dedicated route, preview deployment or explicit feature flag until release.

Recommended progression:

- private preview;
- reviewer-accessible preview;
- public `/current` or equivalent candidate route;
- production switch only after final verification;
- immediate rollback to the existing stable experience if critical errors appear.

Project content and spatial rendering may ship independently. The semantic archive and flagship case studies should not be held hostage by an unfinished WebGL scene.

## 16. Rejected alternatives

### 16.1 Add more effects to the current hero

Rejected because the current problem is conceptual, not a shortage of rendering techniques.

### 16.2 Rebuild the site as one long cinematic scroll

Rejected because it would reduce project discoverability, make orientation fragile, complicate accessibility and encourage scroll hijacking.

### 16.3 Make every project a 3D scene

Rejected because it would fragment the design language, increase production cost, keep the GPU active unnecessarily and turn the portfolio into a technique showcase.

### 16.4 Present all projects with equal weight

Rejected because deployment copies, experiments, private systems, backends, mature products and flagship stories do not carry equal editorial value.

### 16.5 Replace project truth with abstract generated visuals

Rejected because the current must derive from the actual body of work. Abstract imagery may support the system, but it cannot substitute for evidence.

### 16.6 Preserve the current overlay as the only case-study destination

Rejected as the final architecture because canonical, shareable and refresh-safe routes are necessary. The overlay may survive as a transitional or preview interaction.

## 17. Explicit non-goals

The reinvention will not become:

- a shader in every section;
- an endless particle field without data meaning;
- a liquid distortion layer behind body copy;
- glassmorphism everywhere because the product is named H₂O;
- a compulsory audio experience;
- a long preloader;
- a scroll-hijacked film;
- a gallery of device mockups;
- a résumé disguised as a 3D world;
- a generic “creative developer” portfolio;
- a contest entry that sacrifices clients, accessibility or maintainability.

## 18. Consequences

### Positive

- The portfolio becomes structurally unique to Dyrane's actual history.
- New projects can strengthen the current without requiring a redesign.
- Relationships and learning become visible, not merely stated.
- WebGL gains a legitimate product role.
- Flagship work receives deeper editorial treatment.
- The archive remains complete without overwhelming the primary experience.
- Accessibility and fallback can be designed from the same canonical data rather than added afterward.

### Costs

- Project data and relationships require careful editorial work.
- The spatial system introduces performance, device and browser complexity.
- Some current visual components will be retired despite being technically sound.
- Canonical case-study routes require migration from overlay-only presentation.
- The release needs real-device testing and ongoing performance discipline.

### Risks

- The current could become visually impressive but informationally opaque.
- The graph could overstate weak or automatic relationships.
- Mobile could receive a degraded afterthought.
- WebGL could delay semantic content or harm field performance.
- The project could expand indefinitely as every repository is curated.

### Mitigations

- Content and semantic archive ship before spatial expansion.
- Relationship types and evidence are explicit.
- Mobile and fallback are first-class exit gates.
- Rendering has budgets and capability adaptation.
- The first release is limited to six flagship stories and a compact archive.
- Production remains on the current stable site until the candidate is verifiably better.

## 19. Definition of done

H₂O reinvention is complete when:

- a non-technical visitor understands the offer within ten seconds;
- the opening visual is generated from truthful project data;
- Observe, Build and Operate are understandable as connected practice modes;
- the atlas is fully usable by pointer, touch and keyboard;
- the semantic archive contains every approved project record;
- six flagship case studies meet the content contract;
- case-study routes are canonical, shareable and refresh-safe;
- returning from a case study preserves atlas orientation;
- reduced motion and no-WebGL paths are complete experiences;
- context loss recovers without losing content or navigation;
- mobile uses an intentional composition and measured rendering budget;
- accessibility, browser, real-device, metadata and production smoke gates pass;
- no known issue harms first impression, comprehension, trust, navigation or conversion;
- the site feels authored from Dyrane's body of work rather than assembled from portfolio conventions.

## 20. Immediate next action

Do not begin by editing the glass sphere.

Begin with **Wave 0 and Wave 1**:

1. preserve the current production baseline;
2. inventory and normalize the project dataset;
3. classify flagship, archive, prototype, internal and duplicate records;
4. author the first truthful project relationships;
5. render a complete semantic archive;
6. only then prototype the living current from that data.

The central test for every later visual decision is:

> **Could this experience exist without Dyrane's actual work?**

If the answer is yes, the decision is too generic and must be reconsidered.
