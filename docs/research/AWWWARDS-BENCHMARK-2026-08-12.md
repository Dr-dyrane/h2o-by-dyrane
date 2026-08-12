# H₂O immersive benchmark — what is worth borrowing

- **Research date:** 2026-08-12
- **Decision:** borrow interaction grammar, never another studio's identity
- **Implementation:** `src/components/immersive/*`, `src/styles/immersive.css`

## The relevant standard

The useful Awwwards lesson is not “make the site move more.” Strong immersive portfolios make a single idea govern typography, motion, navigation, media, and technical behavior. WebGL is valuable only when it carries that idea and leaves the work legible.

## Most applicable references

| Reference | What is worth borrowing | What H₂O deliberately rejects |
| --- | --- | --- |
| [Lusion](https://lusion.co/) | One persistent authored world; project work remains easy to reach; motion, 3D, and copy feel like one system rather than separate tricks. | The literal blob language, exact layouts, type treatment, and any cloned shader or camera choreography. |
| [Active Theory](https://activetheory.net/) | Shader atmosphere can make an entire site feel spatial while conventional navigation and information remain usable. | Turning every interaction into an effect, or allowing the canvas to become the only navigation surface. |
| [Bruno Simon](https://bruno-simon.com/) | The interaction is the portfolio concept itself, not decoration added after the content. | Game controls, learned navigation, or requiring dexterity before a visitor can understand the work. |
| [Lusion — My Little Storybook](https://lusion.co/projects/my-little-storybook) | Hand-authored assets, scene continuity, and a visual world made specifically for the story. | A long cinematic sequence that delays project comprehension or weakens accessibility. |
| [0110 Studio portfolio](https://www.awwwards.com/inspiration/3d-scroll-animation-0110-studio-portfolio-web) | Scroll can be a camera and state-control system across desktop and mobile rather than a stack of entrance animations. | Scroll hijacking, uninterruptible sequences, and motion without a semantic equivalent. |
| [Noomo Labs mobile interactions](https://www.awwwards.com/inspiration/mobile-scroll-and-interactions-noomo-labs) | Mobile deserves its own spatial density, pacing, and touch behavior. | Treating mobile as a cropped desktop canvas. |

## H₂O's original answer

H₂O uses **the living current** as its governing visual law.

- The liquid field responds to page progress and the active project.
- Six flagship projects become long, readable scroll chapters.
- Real project captures, not speculative mockups, carry the visual proof.
- Observe, Build, and Operate explain the practice behind the screens.
- The WebGL layer runs on demand, sleeps when activity stops, and disappears under reduced motion or constrained hardware.
- The complete page remains semantic HTML when WebGL is absent.

The test remains:

> Could this experience exist without Dyrane's actual work?

If the answer is yes, the direction is too generic.

## Screenshot truth rule

The portfolio must not preserve a stale project image simply because it is attractive.

`scripts/capture-showcase.mjs` captures the current public state of the six flagship products at desktop and mobile dimensions. The scheduled workflow refreshes those assets weekly and commits only changed captures. Until a live capture exists, each project uses a truthful fallback rather than an invented UI.

## Submission restraint

Awwwards scores design, usability, creativity, and content separately. A visually impressive WebGL treatment can still underperform when navigation, mobile behavior, accessibility, or content are weak. H₂O therefore treats the spatial layer as an amplifier of the work, never as epermission to hide it.
