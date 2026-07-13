# Portfolio Housing — Interaction Architecture

Status: foundation decision, before visual design

## Product definition

This portfolio is a **living index of a design practice**, not a simulated operating system and not a conventional case-study gallery. Its job is to make five different works immediately legible while revealing the questions that connect them.

The housing demonstrates interaction design through orientation, state, relationships, motion, and trust. It does not ask visitors to learn a fictional interface before they can evaluate the work.

## Non-negotiable principles

1. **The work is available before the interface is impressive.** A visitor can identify all five projects, understand the practice, and open a project without discovering a gesture or decoding a metaphor.
2. **All five projects are first-class.** No arbitrary “top three” hides the shape of the practice. Editorial emphasis may change with context, but the complete set is visible in the default overview.
3. **Relationships add meaning; they do not become taxonomy homework.** Lenses reframe and annotate the work. They never make projects disappear.
4. **Every state is addressable.** Projects, lenses, and meaningful case-study sections have stable URLs and survive refresh, sharing, history navigation, and direct entry.
5. **Project identities remain sovereign.** The housing supplies orientation and continuity; each project page and live experience may retain its own voice, typography, color, and interaction model.
6. **Motion explains a change.** It may show reordering, continuity, focus, causality, or completion. It is not ambient proof of craft.
7. **The system works without precision input, hover, sound, animation, or a large screen.** Enhancements deepen the experience but are never prerequisites.

## Competing architecture prototypes

These are interaction models, not visual styles.

### A. Living Index — selected

The entry is a calm, complete index of work. Visitors can read it linearly or activate a recurring question such as Evidence & Judgment. The five project entries reorganize and gain short relationship notes, making the practice legible from several valid angles.

Core sequence:

`Arrive → understand the practice → scan all work → reframe by question (optional) → open a project → read or launch → continue through a meaningful relationship`

Strengths:

- Immediate orientation for reviewers with little time.
- Makes the body of work feel like a coherent practice without flattening project identities.
- Scales through metadata and multiple views instead of through more interface chrome.
- Works equally well with mouse, keyboard, touch, assistive technology, and direct links.

Risk:

- Can become a tasteful editorial grid with superficial filter buttons.

Required proof:

- Reframing must change the explanation and relationship between projects, not merely their order or color.

### B. Evidence Atlas

The entry is a two-dimensional field. One axis represents what is being examined (evidence, authority, memory, accountability); another represents the mode of inquiry (product, experiment, research, system). Projects occupy positions and expose connections.

Core sequence:

`Arrive → inspect the field → follow a cluster or axis → open a project → return to the field with position preserved`

Strengths:

- Shows intellectual range and relationships very clearly.
- Could grow into a distinctive research instrument as the archive expands.

Risks:

- Requires visitors to understand the classification before the work.
- Position implies false precision and invites debate about taxonomy.
- Mobile and screen-reader translations become separate experiences rather than the same product.

Decision:

Keep the atlas as a possible later alternate view when the body of work is large enough to justify it. Do not make it the front door.

### C. Studio Session

The entry asks what the visitor wants to understand, then composes a short sequence of projects and artifacts. The portfolio behaves like a guided reading session rather than an archive.

Core sequence:

`Arrive → choose an inquiry → receive a three-stop path → move through the path → branch or return to all work`

Strengths:

- Produces strong narrative pacing.
- Can serve recruiters, collaborators, and researchers differently without separate sites.

Risks:

- Personalization before trust creates friction.
- A generated path may look like the designer is controlling what reviewers are allowed to see.
- Direct comparison and rapid scanning are weakened.

Decision:

Use curated paths later as shareable links for specific audiences, not as the default architecture.

### D. Spatial Workbench

Projects are objects on an open surface and can be arranged, overlapped, or compared. This is the strongest descendant of the original desktop proposal.

Core sequence:

`Arrive → manipulate a workspace → open objects in layers → arrange or compare → restore the workspace later`

Strengths:

- High expressive ceiling.
- Directly demonstrates complex state and manipulation design.

Risks:

- The metaphor competes with the projects and makes basic navigation expensive.
- Windowing, dragging, resizing, persistence, touch behavior, focus order, and assistive semantics create a large platform tax.
- “Memorable” can become “slower to review,” especially for hiring contexts.

Decision:

Reject it as primary housing. A constrained comparison workspace may become an optional lab only if two projects genuinely benefit from side-by-side inspection.

## Chosen model: the Living Index

The Living Index wins because it puts the strongest idea in the architecture rather than in decoration: **the same body of work can be understood differently depending on the question brought to it**.

It has two simultaneous layers:

- **Stable layer:** identity, complete project set, project routes, about, résumé, contact.
- **Interpretive layer:** active lens, annotations, ordering, relationships, and the visitor’s current place.

The stable layer makes the portfolio trustworthy. The interpretive layer makes it distinctive.

## Entry and orientation

The first viewport must answer four questions without scrolling or interaction:

1. Whose work is this?
2. What kind of designer is this?
3. What work can I open?
4. What is the unusual but useful interaction here?

The entry therefore contains:

- A compact identity line using placeholder biography until final copy exists.
- A one-sentence practice statement centered on making hidden systems, evidence, memory, and authority inspectable.
- The complete set of five projects or an unmistakable continuation of that set at smaller heights.
- A plain-language invitation to view the work through a recurring question.

There is no hero performance, loading ritual, onboarding tour, wallpaper, dock, fake menu bar, or instruction to double-click.

## Choosing work

Each project entry exposes the minimum evidence needed to make a choice:

- Title.
- One exact question or tension.
- Form of the work: product, research-through-design, interactive essay, system, or tool.
- Status when material: live, study pending, citation audit, or prototype.
- Primary action: open the project account.
- Secondary action, when available: launch the live work.

Entries use real links. The entire hit area may be generous, but text selection, opening in a new tab, copied URLs, keyboard focus, and context menus continue to behave normally.

## Lenses and reframing

Initial lenses:

- Evidence & Judgment
- Agency & Authority
- Memory & Lineage
- Visibility & Accountability

“All work” is the default and is not presented as a fifth philosophical category.

Activating a lens performs three coordinated changes:

1. Project order changes according to relevance.
2. Each project’s short description changes to explain its relationship to the active question.
3. Relationship lines or grouping cues update, using motion only to preserve object continuity.

No project is filtered out. The URL gains `?lens=<slug>`. The page title and history state remain meaningful. On direct entry, the same state is reconstructed without an intro animation.

## Opening a project

Projects open as full, addressable routes at `/work/<slug>`. They do not open in draggable windows or modal replicas of browser navigation.

The transition has three parts:

1. The selected entry asserts focus.
2. Shared identity elements carry into a compact project threshold.
3. The project account takes over the page with its own visual language.

The threshold supplies orientation, not ceremony:

- Project name.
- The question it investigates.
- Tanishk’s role and contribution.
- Medium and current status.
- Read case study / launch live experience.

After the threshold, each project uses a flexible narrative schema rather than a fixed visual template. Shared semantic landmarks remain consistent: context, inquiry, process/evidence, decisions, outcome/learning, and credits. A project may omit, rename, reorder, or expand them when the work requires it.

## Live launch and return

The live experience is clearly distinguished from the portfolio account.

- “Open live work” names the destination and signals that it belongs to a separate deployment.
- It opens in a new tab by default so the visitor’s portfolio reading position is preserved; the label discloses this behavior.
- The case-study route remains useful even if the live deployment is slow or unavailable.
- Availability is never inferred optimistically. A simple maintained status field controls whether the live action is promoted, qualified, or withheld.
- Returning to the portfolio reveals the same lens, scroll anchor, and previously visited state without a celebratory interruption.

## Relationships and continuation

The end of a project does not show generic “previous” and “next” cards. It offers one or two explicit continuations:

- “Continue through Memory & Lineage.”
- “Compare how Pentimento and Atlas treat revision.”
- “Return to all work.”

Every recommendation includes a reason. Relationships come from authored metadata, not from automatic similarity scores.

## Growth from five to twenty projects

The architecture expands in stages:

- **5–8 works:** complete index plus lenses; no search field competing for attention.
- **9–14 works:** add a compact list view, type facets, and visible project count.
- **15–20+ works:** add search, saved URL queries, year/status facets, and an optional atlas view.

The underlying data model supports these from the beginning. The interface exposes them only when the content volume creates a real need.

Older or exploratory work may move to an archive but remains directly addressable. “Featured” is a reversible editorial property, not a different content type.

## URL and state model

- `/` — all work.
- `/?lens=evidence-judgment` — lens state.
- `/work/atlas` — project account.
- `/work/remainder` — project account using the current public name.
- `/work/command-center` — permanent redirect/alias to Remainder for old links.
- `/about`, `/resume`, `/contact` — stable utility routes.
- `/work/<slug>#<section>` — direct links to meaningful case-study sections.

Only shareable state belongs in the URL. Visited-project markers, reduced-motion preference, and optional display preference may be stored locally. Core navigation never depends on local storage.

## Navigation and history

Navigation is spatially calm, but not spatially dependent.

- A compact persistent identity returns to the index.
- Project pages expose “All work” and the active lens when relevant.
- Browser back and forward reproduce the visitor’s state and approximate reading position.
- Focus is moved deliberately after route changes and restored when returning.
- The site never overrides browser shortcuts, scrolling, pinch zoom, or text selection.

## Mobile behavior

Mobile is the same information architecture in a linear form.

- The index becomes a reading sequence, not a mini desktop.
- Lenses use a horizontally scrollable, keyboard-compatible control with a visible selected state; a select control is an acceptable narrow fallback.
- Project entries keep their hierarchy and relationship notes.
- Project-specific visual languages may simplify composition but not omit substantive content.
- No interaction depends on hover, double-click, drag, long-press, or device orientation.

## Accessibility contract

- Semantic landmarks, headings, lists, links, and buttons precede animation or layout technique.
- Every operation is available by keyboard with a visible focus state.
- Reordering retains predictable reading order. A concise polite announcement identifies the active lens and count; it does not narrate every moved item.
- Reduced motion replaces spatial interpolation with brief opacity/state changes.
- Contrast meets WCAG AA at minimum, including muted metadata and focus indicators.
- Text scales to 200% without clipping or horizontal page scrolling.
- Project media has authored alternatives appropriate to its meaning; decorative media is ignored.
- External destinations, unavailable work, and new-tab behavior are disclosed in accessible names or adjacent text.

## Motion grammar

Only three classes of motion are permitted:

- **Continuity:** an existing project entry changes position while remaining recognizably the same object.
- **Transition:** the selected project becomes the project threshold.
- **Feedback:** a control confirms focus, selection, availability, or completion.

Default guidance:

- Feedback: 100–160 ms.
- Reframing: 220–360 ms with distance-aware staggering capped at 80 ms total.
- Route transition: 280–450 ms.
- Exit movement is shorter than entry movement.
- No looping ambient animation in content regions.
- No spring overshoot unless it conveys a constrained physical relationship and survives reduced-motion review.

## Search and commands

Search is architectural but initially latent. When volume warrants it:

- `/` focuses search unless focus is already in an editable field.
- Results match titles, questions, roles, media, and authored keywords.
- Search never replaces browse; clearing it restores the prior lens and position.
- A command palette is not introduced unless it performs more than duplicating visible navigation.

## Failure states

- If scripting fails, server-rendered project links and core content remain usable.
- If a project deployment is unavailable, the case study remains complete and the launch action communicates status.
- If metadata is incomplete, the project appears under All work and never silently disappears.
- If fonts or media fail, hierarchy and legibility survive.
- If transition state cannot be restored, navigation falls back to the top of the correct addressable page.

## What will make this architecture fail

- Treating lenses as decorative filter chips.
- Hiding weak or unfinished projects through ranking rather than editing the body of work.
- Forcing every project into the same case-study modules.
- Letting project visual identities destroy shared navigation and accessibility.
- Adding OS conventions, cursor effects, sound, or persistent novelty before the index is clear.
- Using motion to compensate for unclear information architecture.

## Validation criteria before visual design

The architecture is ready for visual exploration only when a low-fidelity prototype demonstrates that:

1. A first-time visitor can name the practice and all five projects within 30 seconds.
2. Every project is reachable in one primary action from the default index.
3. A visitor can explain what changed after activating a lens.
4. Direct project and lens URLs reconstruct the intended state.
5. Browser back returns to a useful place.
6. The complete flow works with keyboard only and with reduced motion.
7. A narrow viewport preserves the same decisions and content.
8. Adding a sixth and twentieth project does not require a new architecture.
