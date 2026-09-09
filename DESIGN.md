# THE PORTFOLIO — Design Direction & Build Plan

Plan of record for the Explore rebuild. Read this before implementing (per global workflow).

## What this is
Tanishk's interaction-design portfolio. Two modes:
- **Explore** — a tactile, cinematic world you want to keep touching.
- **Quick Review** — fast, clean, complete, for busy reviewers.

Quick Review exists so Explore can take creative risks. Audience bar: the best
interaction portfolios in the world (CMU, RCA, TU Delft, Apple, IDEO, Awwwards).

## The one idea (spine)
**Finished surfaces you learn to look *under*.** Every project is the same move —
see underneath the finished result to the reasoning, evidence, or earlier draft.
*Pentimento* (an earlier painting bleeding through a later one) is the visual and
motion language. A draggable **lens** is the connective toy: under it, any finished
surface becomes its reasoning (struck drafts, evidence marks, the "why").

## Tone (locked)
Tactile and inviting, clean and purposeful — **not abstract, not funny**. Every
scene has one thing you *want* to touch, and touching it makes you want the next.
Meaning rides underneath the interaction; never lead with abstract copy. Reference
the *feeling* of prathamesh.world (purposeful, keep-going invitation) — not its look.

## Personality — from truth only
Built from real creative habits, values, interests, process, and the projects.
**No fabrication**: no invented diary entries, notebook pages, childhood memories,
coffee cups, or personal photos. Personality comes from:
- The tiny interaction details he notices that most people ignore.
- His design values, made *felt* rather than stated.
- Cross-domain obsessions: film & storytelling, F1 & automotive design,
  architecture & spatial experience, Apple-grade interaction, editorial books &
  layout, atmospheric games, motion design, human behaviour, AI.
- How he works: collects screenshots, prototypes lots, iterates obsessively,
  explores before solving, revisits old ideas, polishes after the concept is strong.

## Art-direction principles
- Editorial + cinematic + material. Fraunces (authored serif) as display; a precise
  grotesque/mono for labels and instruments.
- Cornsilk paper (`#f8f3e4`), near-black ink (`#16150f`) — the endpaper of a printed
  art book, read in daylight. Each of the five rooms repaints that ground edge to
  edge with its own pigment, so travelling through the work means walking between
  rooms. A project's accent carries that project's meaning and is never borrowed to
  colour an unrelated scene: colour is either a room or it is the housing.
  (This line previously described the inverse — a near-black ground with off-white
  ink — which the build has not used for some time.)
- Every animation earns itself; motion communicates, never decorates. Camera = descent.
- Print-worthy frames. Details and craft over trend. Originality over reference.
- Accessible: pointer / touch / keyboard, reduced-motion, and a readable no-JS field.

## Anti-slop guardrails
No radial glows, aurora/gradient backgrounds, card soup, nested cards, glassmorphism,
fake status dots, emoji decoration, arbitrary accent colors, or motion-because-it-can.
Test every decision: *if another portfolio could reuse it unchanged, remove it.*

## Keep vs rebuild
- **Keep:** content + writing (`app/data`), stack (Next 16 / vinext / Cloudflare),
  two-mode system (`app/components/mode.tsx`), case pages (`/work/[slug]`), the
  name→case view transition, Quick Review (`review-index.tsx`).
- **Rebuild from scratch:** all of Explore — scenes, art direction, motion, moments.

## Build stages
Each stage: build → verify in the browser → then the next.

- **Stage 0 — Foundation.** Design tokens (type, color, motion, spacing), the
  surface/underneath layer primitive, Explore container scaffold, a11y baseline.
  Quick Review left intact.
- **Stage 1 — Signature "Look under."** Cold-open authored surface → draggable lens
  reveal → scroll-cue into the descent. The lens becomes reusable.
- **Stage 2 — The descent spine.** One continuous connected journey; real accents as
  light, motivated by depth; the "software asks less / shows me less" beat made
  physical; "things I notice" micro-demos.
- **Stage 3 — Five rooms, each enacting its thesis.** Design or Disaster (point before
  you rule), Pentimento (strike + visible underpainting), Invisible Interfaces
  (advances only when you look away → receipt), Atlas (one rule rewrites under
  pressure, lineage trails), Daynero (one live number, warmer register). Each opens by
  looking under it; each links to its case page via the name→case transition.
- **Stage 4 — Personal layer + rewards.** Design values made interactive, cross-domain
  patterns, the rejected-paths graveyard (real `rejectedPaths` data), a hidden
  "reasoning mode" for the persistently curious.
- **Stage 5 — Close + polish + Quick Review pass.** The pull-back close, contact as a
  struck-and-corrected line, motion / performance / a11y polish, both modes verified on
  mobile and reduced-motion.
