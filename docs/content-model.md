# Portfolio Housing — Content Model

Status: architectural schema; copy remains provisional

## Core entities

### Project

Required fields:

- `id` — stable internal identifier.
- `slug` — canonical public route segment.
- `title` — current public name.
- `legacySlugs` — old routes that permanently redirect.
- `oneLine` — literal description of the work, not a slogan.
- `question` — the central inquiry in plain language.
- `form` — product, research-through-design, interactive essay, system, tool, or experiment.
- `role` — Tanishk’s actual contribution.
- `year` — display year or range.
- `status` — live, prototype, study pending, citation audit, archived, or unavailable.
- `liveUrl` — independently deployed destination when available.
- `sourceUrl` — repository destination when it adds value.
- `lensRelations` — authored relevance and explanation for each lens.
- `connections` — authored project-to-project relationships with reasons.
- `caseStudy` — flexible ordered sections.
- `credits` — collaborators, sources, and acknowledgements.
- `featured` — reversible editorial emphasis; never visibility.

### Lens

- `id` and `slug`.
- `label`.
- `prompt` — the question the visitor is bringing to the work.
- `description` — what becomes visible through this lens.
- `projectOrder` — deliberate order, not an inferred score.

### Connection

- `fromProject`.
- `toProject`.
- `lens` when relevant.
- `reason` — a short authored sentence displayed to the visitor.
- `direction` — one-way or reciprocal.

### Case-study section

Sections are semantic content objects, not fixed visual components.

- `id` — stable anchor.
- `kind` — context, inquiry, evidence, decision, prototype, finding, reflection, outcome, credits, or custom.
- `title`.
- `body`.
- `artifacts` — optional media and research objects.
- `layoutHint` — optional editorial suggestion, never a hard template.

### Artifact

The artifact model must support the actual research practice:

- Image or annotated image.
- Video or interaction recording.
- Quote or transcript excerpt.
- Observation or field note.
- Interface state or comparison.
- Diagram.
- Prototype embed or link.
- Dataset or corpus excerpt.
- Citation.
- Decision record.
- Participant or evaluator response.

Every artifact carries provenance, alternative text or equivalent, caption, and rights/credit where applicable.

## Initial project registry

### Atlas

- Form: system / interaction principle stress test.
- Core question: Can an interaction principle survive transfer across unlike situations, and how should its revisions remain visible?
- Strong lenses: Memory & Lineage; Evidence & Judgment.
- Live: https://atlas-slice.vercel.app/
- Source: https://github.com/tanishkfr/atlas-slice
- Known qualification: supporting corpus and citation audit should be represented honestly.

### Invisible Interactions

- Form: interactive essay / exhibition.
- Core question: What should an interface reveal when attention leaves it but delegated work continues?
- Strong lenses: Visibility & Accountability; Agency & Authority.
- Live: https://invisible-interfaces.vercel.app/
- Source: https://github.com/tanishkfr/invisible-interfaces

### Design or Disaster

- Form: research-through-design archive.
- Core question: How do different evaluators turn interface evidence into judgment?
- Strong lenses: Evidence & Judgment; Visibility & Accountability.
- Live: https://design-or-disaster.vercel.app/
- Source: https://github.com/tanishkfr/design-or-disaster

### Pentimento

- Form: algorithmic autobiography / right-of-reply experiment.
- Core question: Who has authority to revise a machine’s account of a person without erasing the original interpretation?
- Strong lenses: Agency & Authority; Memory & Lineage.
- Live: https://pentimento-lovat.vercel.app/
- Source: https://github.com/tanishkfr/pentimento
- Known qualification: participant-study status should not be overstated.

### Remainder

- Legacy name/slug: Command Center / `command-center`.
- Form: local-first creative memory product.
- Core question: How can creative work preserve its reasoning and history without making memory itself burdensome?
- Strong lenses: Memory & Lineage; Visibility & Accountability.
- Live: https://commandcenter-lilac-alpha.vercel.app/
- Source: https://github.com/tanishkfr/commandcenter
- Naming rule: use Remainder publicly; retain the legacy route and source URL until the independent project is renamed.

## Initial lens map

### Evidence & Judgment

Prompt: How does an interface help people inspect evidence and form a judgment without pretending the judgment is neutral?

Suggested order:

1. Design or Disaster
2. Atlas
3. Pentimento
4. Invisible Interactions
5. Remainder

### Agency & Authority

Prompt: What can a person contest, revise, delegate, or refuse—and who retains the final say?

Suggested order:

1. Pentimento
2. Invisible Interactions
3. Remainder
4. Design or Disaster
5. Atlas

### Memory & Lineage

Prompt: How can a system preserve change and context without turning history into clutter or authority?

Suggested order:

1. Remainder
2. Atlas
3. Pentimento
4. Invisible Interactions
5. Design or Disaster

### Visibility & Accountability

Prompt: What must a system reveal so that its behavior can be understood, trusted, and challenged?

Suggested order:

1. Invisible Interactions
2. Design or Disaster
3. Remainder
4. Pentimento
5. Atlas

## Content rules

- Project claims must be supported by visible artifacts or clearly labeled as intent, hypothesis, or pending research.
- Status qualifications belong near the relevant claim, not in distant footnotes.
- The same project may have different descriptions under different lenses; factual details remain consistent.
- Connection copy must explain a meaningful relationship. “You may also like” is not valid.
- Placeholder biography, résumé, contact details, and domain are explicitly marked in source data until replaced.
- No project is excluded because its live deployment or case study is unfinished.
