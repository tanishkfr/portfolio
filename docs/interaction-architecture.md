# Portfolio interaction architecture

Status: current production contract

## Core idea

The portfolio is itself a system making claims about a person, so it holds
itself to the same obligations its projects propose: claims carry records,
evidence stays inspectable, and nothing asks to be believed unexamined.

Two devices carry the concept:

- **Marked claims.** Key claims in the housing (the thesis, availability) are
  native `<details>` disclosures whose records open inline. They work before
  hydration, with the keyboard, and with screen readers. The first interaction
  on the site teaches its whole grammar.
- **The examination.** One shared control puts the same question to all five
  projects: *What does it show? What does it decide? What does it change?*
  The three questions map to the surface / rule / consequence layers in the
  project data.

Every project remains a normal link and every state remains understandable
without animation.

## Visual identity: the observation room at night

The room is dark; the instruments are lit. The ground is warm charcoal, and
paper survives only as the surfaces the work is examined on — the specimen
plates, the case signature plates, and the closing slip of the footer. On a
floor of light tables, Invisible Interfaces keeps the one unlit plate. Light
surfaces re-declare the reading tokens, so everything set on paper keeps its
original ink.

Three voices map to the content model:

- **Serif** — the claim: Fraunces (self-hosted, variable in optical size and
  weight) for theses, titles, and statements under examination.
- **Mono** — the record: indices, statuses, evidence labels, receipts.
- **Sans** — the explanation: narration and body copy.

The housing's own color is registrar blue, lit for the dark room — used for
focus, selection, marked claims, and the question instrument. The five project
accents keep their canonical values for marks and graphics, with brightened
ink variants for legible text on the dark ground.

## Editions

Reviewers read differently, so the portfolio keeps three editions of itself —
three cuts of the same record, never three sets of claims:

- **Full record** — the canonical, atmospheric read. The default, and what
  the server always renders: without JavaScript there is only the full
  record.
- **Digest** — condensed for committees: motion near-instant, choreography
  skipped, marked claims arrive open, density up, spacing compressed. The
  same material, filed tighter.
- **Abstract** — two minutes: each case reduces to what it is (hero and
  question), what is new (the contribution), what to remember (the three
  signal statements), the one memorable interaction (the proof), and the
  evidence boundary. Everything else waits in the full record.

The edition is a presentation state on the root element (`data-edition`),
chosen from the header or the docket, persisted in localStorage, applied
before first paint, and linkable with `?edition=` so a reviewer can be sent
directly into the cut that fits how they work. No content is generated or
altered per edition — selection and pacing only.

## Atmosphere

The site renders the reading room its identity implies, with light and
material rather than effects:

- A static paper grain (one SVG noise tile, never animated) gives the cream
  physical tooth. It disappears under forced colors and in print.
- Reading light pools over the thesis on the threshold; the docket is a ruled
  record sheet, not a card.
- Every page ends in a full-bleed ink-dark footer — the dark of the archive
  bookends the paper and gives the cream its light. The header casts a breath
  of shadow only once content slides beneath it.
- Each case hero carries a mural: the world's sigil painted faint and
  enormous, bleeding off the canvas. The story opens with a single drop cap
  in the world's ink.
- Hovering an exhibit tints the row with the world's color before you enter
  it — anticipation, not decoration.

## The overture

The first thing a fresh visitor meets is not text but a dark room with a
single instrument lit: the Design or Disaster critique grid, floating in a
pool of light, captioned only "Place a mark to begin." Placing a mark — the
project's own act of pointing before pronouncing — lights the rest of the
room: the overlay dissolves and the page comes into focus beneath it, thesis
earned rather than read. Feel, then interact, then read.

It is pure enhancement, portalled to `document.body`: the server renders the
full page, so no-JS visitors and the test suite see the normal home. It never
appears under reduced motion, on a deep link with a hash, or a second time in
a session, and it self-dissolves on the placed mark, the first scroll,
Enter/Escape, a tap on the surrounding dark, or a six-second timeout — it can
never trap anyone.

## Home contract

Once past the overture, the home is composed as three movements, not a card
feed:

1. **The door** — a centered, monumental thesis under a single overhead pool
   of light, with the record mark and availability claim beneath it and one
   line of brief. No two-column hero.
2. **The rail** — the three-question instrument becomes a horizontal control
   that sticks beneath the header and travels with the reader down the whole
   floor. Its answer is carried into every station's statement tag.
3. **The stations** — five full-bleed exhibition stations, alternating left
   and right down an aisle. Each specimen floats in its own pool of light on
   the dark ground (no cards, no boxes), flanked by a giant serif index
   numeral and a wall-label caption. Every plate stays playable.

The coda closes with the three obligations, the editions note, and contact.
On mobile the rail compacts to numerals plus the range and the stations stack
caption-first.

The index is a floor of five specimen plates, and every plate is playable:
each project's thesis is met as its own core gesture before a word of the
case is read. You must place a mark on Design or Disaster before its five
readings appear; you strike Pentimento's machine sentence and can revise the
strike; Invisible Interfaces advances only while the pointer is elsewhere and
stops the moment you watch it; Atlas cycles carry, refine, and fracture as
you press the rule against its case; Daynero's guidance traces the day your
pointer draws. Each landed gesture is rewarded with the project's own
interaction line from the case record. Captions carry the exhibit number,
title, and the statement driven by the question instrument; keyboard readers
get the plates as labeled buttons and the caption links as the path in.

The home avoids a carousel, simulated operating system, drag physics, pointer
glow, card tilt, ambient spectacle, and metaphors unrelated to the work.
Motion communicates entry, state change, progress, and affordance.

## Sigils

Each project has a living sigil — its argument in miniature — with three
states matching the reading phases:

- **Daynero** — a ring of day-ticks; guidance thickens around the day.
- **Invisible Interfaces** — two frames; the work happens in the gap between them.
- **Design or Disaster** — a screen on a grid; a pin lands; five readings gather.
- **Pentimento** — machine lines; one is struck; a sovereign line leads.
- **Atlas** — one rule-line that bends and forks under its cases.

Sigils appear phase-aware on the home exhibits and complete on case plates.

## Project routes

Four independent projects use the full case-study structure:

1. title, position, question, ownership, live work, and source;
2. contribution and concrete responsibilities;
3. one controllable proof of the signature interaction;
4. five chapters covering context, pivot, interaction, system, and evidence.

A case is composed as a **title wall** — meta line, monumental centered title,
thesis, and the lit signature plate, with the world's mural glowing enormous
behind it — followed by the playable proof, then a single centered column of
story. The chapters are navigated by a **horizontal chapter rail** that sticks
beneath the header (replacing the old side TOC), carrying the reading-progress
line and the active chapter's authored title; each chapter opens behind a
giant ghost numeral.

Within a case, pacing is deliberate: the pivot's realization spans the full
measure in the larger voice (it is the emotional peak of the story), and the
"Not yet proven" half of the evidence boundary sits in a dashed provisional
frame so the honesty is visible before a single item is read.

Daynero uses a commercial preview until the team, timeline, constraints,
product evolution, and publishable outcomes can be documented. The preview may
state the public product model and Tanishk's contribution; it may not
manufacture a process narrative.

## Case worlds

Each case is a world with its own accent, wash, and motion temperament while
every structural element stays in the shared grammar. Each world also enacts
its own argument once, structurally:

- **Design or Disaster** — verdict-fast motion; a crosshair cursor over the
  evidence surface.
- **Pentimento** — slow ink; its own pivot renders the earlier direction
  struck but legible beneath the correction.
- **Invisible Interfaces** — the one world allowed darkness; an attention
  ledger counts absence through the Page Visibility API, holds it in memory
  only, and reports it back on return.
- **Atlas** — the interaction sequence rail is drawn as a lineage.

## Project-specific proofs

- **Design or Disaster** — switch between fallible perspectives on one evidence surface.
- **Pentimento** — let a reading stand, reframe it, or strike it while preserving the withdrawn claim.
- **Invisible Interfaces** — inspect the authority boundary before leaving, while away, and on return.
- **Atlas** — hold, refine, or fracture a provisional rule while preserving its lineage.

## Motion and resilience

- One motion vocabulary: beat 150ms (acknowledgement), move 280ms (state
  change), settle 440ms (arrival), with per-world temperament overrides.
  Arrivals materialize — opacity, a small rise, and blur clearing. Exits are
  subtler than entrances or instant. A tactile pop curve exists for small
  glyphs (arrows, the instrument thumb) and never for text blocks.
- The instrument is high-frequency, so its answers re-settle at move speed
  with a 35ms sweep down the docket — never at arrival speed.
- Scroll-linked fills (header progress, case reading progress, instrument
  track) are compositor-only transforms, never width or height.
- Each case chapter opens with a plate: the index files in and a short rule
  draws in the world's ink; the chapter note in the navigator acknowledges
  the reader crossing into a new chapter.
- The threshold arrives as a pure-CSS choreography: the record line, the
  claim, the deck, and the docket settle in sequence; a registrar-ink
  underline draws once beneath the key word; the record mark gives one quiet
  nudge. It runs without JavaScript and collapses to a static page under
  reduced motion.
- Opening a case is a shared-element navigation through the View Transitions
  API: the exhibit line morphs into the case title, and returning reverses
  it. Browsers without support, reduced-motion readers, and modified clicks
  fall through to ordinary navigation.
- Entry reveals run once as content enters the viewport; content is visible
  before JavaScript adds the motion-ready class, so a script failure cannot
  hide the page.
- Statement changes re-settle with a short stagger down the docket.
- Hover motion confirms clickability; it never carries required information.
- A thin registrar-ink rail under the header reports page progress.
- Reduced-motion preferences remove travel and delay while preserving every state.

## Images and deployment

Project images are served as original static assets. Next's optimizer is
disabled because the Cloudflare image binding does not exist in local or
Vercel environments. The worker also returns a safe direct-asset redirect if
an optimization request reaches an environment without those bindings.

The repository keeps two explicit production paths:

- `pnpm build` — vinext / Cloudflare output used by Sites.
- `pnpm build:vercel` — standard Next.js output used by Vercel.

## Accessibility and release checks

- Native links, buttons, range input, and details/summary disclosures remain
  keyboard accessible.
- Active options use `aria-pressed`; the range exposes a plain-language value.
- Visible focus, named landmarks, one-column responsive order, forced colors,
  and reduced motion are required.
- Every canonical route must render independently.
- Builds, type checks, lint, route tests, encoding checks, and source
  contracts must pass before release.
