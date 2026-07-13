# Tanishk — Interaction Design Portfolio

The independent portfolio housing for five working interaction-design projects:

- Design or Disaster
- Pentimento
- Invisible Interfaces
- Atlas
- Remainder

The housing is a **Living Index**, not a simulated desktop. Every project is visible immediately; four optional lenses re-order and reframe the same body of work through recurring questions about evidence, authority, memory, and accountability.

## What ships here

- A complete five-project index with shareable lens state and browser-history support.
- Evidence-backed case studies covering problem, conceptual shift, interaction model, design decisions, demonstrated behavior, limits, and next research step.
- Signature project artifacts using imagery and interaction evidence from the source repositories.
- Authored About and Contact pages, with `/resume` intentionally redirected to About until a résumé is added.
- Dynamic metadata, manifest, sitemap, robots policy, responsive layouts, semantic structure, visible focus, and reduced-motion support.
- Direct links to each live artifact and its public source repository.

Projects remain separate repositories and deployments. This repository owns the portfolio housing and the editorial case-study layer only.

## Local development

```bash
pnpm install
pnpm dev
```

## Verification

```bash
pnpm typecheck
pnpm lint
pnpm test
```

`pnpm test` performs a production build and exercises the rendered index, a complete project case study, About, Contact, sitemap, robots, project aliases, launch copy, and accessibility foundations.

## Architecture notes

- [Interaction architecture](docs/interaction-architecture.md)
- [Content model](docs/content-model.md)

All work was independently conceived and built by Tanishk. AI assisted ideation, critique, source discovery, and code iteration; final concept selection, research framing, design decisions, editing, implementation decisions, and authorship remain Tanishk's.
