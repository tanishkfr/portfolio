# THE PORTFOLIO — Design Direction & Build Plan

Plan of record for the Explore rebuild. Read this before implementing (per global workflow).

## What this is
Tanishk's interaction-design portfolio. Two modes:
- **Explore** — a tactile, cinematic world you want to keep touching.
- **Quick Review** — fast, clean, complete, for busy reviewers.

Quick Review exists so Explore can take creative risks. Audience bar: the best
interaction portfolios in the world (CMU, RCA, TU Delft, Apple, IDEO, Awwwards).

## The one idea (spine)
**A working folio, not a gallery.** Explore opens with one manual "look under"
gesture, then becomes a compact index and six full-viewport sheets. Scrolling lifts
each sheet over the last; every sheet uses the verb and interaction logic of its
project rather than repeating a thumbnail treatment. The finished surface and the
reasoning beneath it remain the conceptual thread, but not a template imposed on
every project.

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
  art book, read in daylight. Each of the six sheets repaints that ground edge to
  edge with its own pigment, so travelling through the work means walking between
  rooms. A project's accent carries that project's meaning and is never borrowed to
  colour an unrelated scene: colour is either a room or it is the housing.
  (This line previously described the inverse — a near-black ground with off-white
  ink — which the build has not used for some time.)
- Every animation earns itself; motion communicates, never decorates. Camera =
  lifting, covering, revealing, and carrying a selected object into its case.
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

## Explore interaction contract

- **Cover.** One authored title, one draggable seam, and a direct route to the index.
  It teaches the surface/underneath grammar without a preamble or modal.
- **Index.** Six scannable rows expose title, sequence, and project verb. Native
  anchors land before the sticky sheets so direct links remain stable.
- **Stack.** Six edge-to-edge sheets accumulate through sticky scroll on wide screens
  and become ordinary reading flow on narrow screens and reduced motion.
- **Distinct behaviour.** Fluxion launches; Design or Disaster points; Pentimento
  strikes; Invisible Interfaces asks the visitor to leave and return; Atlas revises;
  Daynero recalculates one live number.
- **Portraits.** Every sheet carries one legible mini-demonstration of its project's
  behaviour, composed in the DOM so its states read before any interaction: evidence
  marked on a screen beside three readings, a machine sentence struck and rewritten,
  an absence that returns a receipt, a rule revised with its lineage, fragments
  assembled into a shipped site, one safe number recalculated by spending. One shared
  shell (mono rack, framed stage, registration ticks, one plain caption) keeps the
  series a family; the ASCII field behind each stage is supporting material —
  scaffolding, residue, signal — never the message. Each portrait runs one passive
  loop and one pointer/touch interaction that deepens it; nothing depends on hover,
  and reduced motion resolves every demo to its resting state.
- **Case handoff.** The chosen title and project stage carry through the View
  Transitions API. Ordinary links remain the fallback.
- **Header rail.** The four destinations sit on one continuous track carrying a
  single registration mark in two registers — filled and breathing where you are,
  hollow while it walks to what you point at or tab to, leaving two fading pixels
  of residue behind it. The mark is a named shared element, so a click hands it
  through the View Transition to the new destination. Hover carries nothing:
  `aria-current`, the filled mark, and the CSS-only pip underneath all state where
  you are without JavaScript, and reduced motion makes every change instant.
- **Close.** One concise invitation and real contact routes. No hidden rewards,
  decorative manifesto, or interaction added only to lengthen the page.
