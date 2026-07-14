# Portfolio interaction architecture

Status: current production contract

## Core idea

The portfolio is a calm index with one memorable comparison tool. A shared control moves all five projects through three layers:

- **Interface** — what the person first encounters.
- **Logic** — the decision shaping the behavior underneath.
- **Consequence** — what changes for the person.

The interaction makes Tanishk's way of thinking visible without turning navigation into a puzzle. Every project remains a normal link and every phase remains understandable without animation.

## Home contract

The first viewport answers who Tanishk is, what kind of work he does, where he is based, and whether he is available. The selected-work section then introduces the shared control and five stable project cards. Each card renders one current statement rather than stacking clipped layers, so dragging the control cannot produce overlapping or unreadable states.

The home avoids a carousel, simulated operating system, drag physics, pointer glow, card tilt, ambient spectacle, and abstract language about the housing itself. Motion communicates entry, state change, progress, and affordance.

## Project routes

Four independent projects use the full case-study structure:

1. title, position, question, ownership, live work, and source;
2. contribution and concrete responsibilities;
3. one controllable proof of the signature interaction;
4. five chapters covering context, pivot, interaction, system, and evidence.

Daynero uses a commercial preview until the team, timeline, constraints, product evolution, and publishable outcomes can be documented. The preview may state the public product model and Tanishk's contribution; it may not manufacture a process narrative.

## Project-specific proofs

- **Design or Disaster** — switch between fallible perspectives on one evidence surface.
- **Pentimento** — let a reading stand, reframe it, or strike it while preserving the withdrawn claim.
- **Invisible Interfaces** — inspect the authority boundary before leaving, while away, and on return.
- **Atlas** — hold, refine, or fracture a provisional rule while preserving its lineage.

## Motion and resilience

- Entry reveals run once as content enters the viewport.
- The home cards use a short mask-and-rise transition when the shared phase changes.
- Hover motion confirms clickability; it never carries required information.
- A thin header rail reports page progress.
- Reduced-motion preferences remove travel and delay while preserving every state.
- Content is visible before JavaScript adds the motion-ready class, so a script failure cannot hide the page.

## Images and deployment

Project images are served as original static assets. Next's optimizer is disabled because the Cloudflare image binding does not exist in local or Vercel environments. The worker also returns a safe direct-asset redirect if an optimization request reaches an environment without those bindings.

The repository keeps two explicit production paths:

- `pnpm build` — vinext / Cloudflare output used by Sites.
- `pnpm build:vercel` — standard Next.js output used by Vercel.

## Accessibility and release checks

- Native links, buttons, and range input remain keyboard accessible.
- Active options use `aria-pressed`; the range exposes a plain-language value.
- Visible focus, named landmarks, one-column responsive order, forced colors, and reduced motion are required.
- Every canonical route must render independently.
- Builds, type checks, lint, route tests, encoding checks, and source contracts must pass before release.
