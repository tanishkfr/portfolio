# Portfolio content model

Status: current production contract

The portfolio has three storytelling depths:

1. The opening states Tanishk's practice and current context.
2. The shared home lens compares interface, logic, and consequence across all five projects.
3. A project route either presents a complete evidence-bounded case or an explicitly limited preview.

## Project record

`app/data/portfolio.ts` is the canonical content source. A published case includes identity, fast understanding, ownership, responsibilities, story, interaction sequence, system anatomy, design decisions, evidence limits, relationships, and authorship disclosure.

`availability: "preview"` changes the contract. A preview may contain enough data to appear in the index and describe the public product surface, but the route must not render placeholder process fields as a finished case.

No metric, participant quote, outcome, or research finding may enter the data unless the source project contains supporting evidence.

## Daynero preview

The Daynero route may state:

- the public positioning on daynero.com;
- the adaptive daily budget, goals, Meridian Score, and personalized insights described there;
- that Tanishk designed and built the app experience and public website;
- that the full commercial case is being documented.

It may not infer team structure, timeline, internal constraints, research results, adoption, business impact, or product outcomes.

## Published case reading order

1. **Threshold** — what this is, the position it takes, ownership, role, scale, live work, and source.
2. **Contribution** — what Tanishk made and four concrete responsibilities.
3. **Interactive proof** — one small native-control demonstration of the core behavior.
4. **Context** — the situation and design question.
5. **Pivot** — the earlier direction, realization, redesign, and rejected alternatives.
6. **Interaction** — the complete consequential sequence.
7. **System** — input, rule, output, and design decisions.
8. **Evidence boundary** — built and verified, not yet proven, and the next honest test.

## Language rules

- Lead with the action or position, not a discipline label.
- Prefer concrete verbs over language about “systems exposing themselves.”
- Describe behavior before interpretation.
- Name ownership without erasing collaborators.
- Keep commercial previews visibly different from published independent cases.
- Never convert verification into desirability or impact evidence.
- Keep AI disclosure specific and visible.

## Adding work

A future published case needs a clear position, a real product evolution, one consequential interaction, concrete system anatomy, and a truthful evidence boundary. If those are unavailable, publish a deliberately limited preview or leave the work out of the index.
