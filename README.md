# Tanishk — Interaction Design Portfolio

Portfolio housing for one commercial product and four working interaction-design investigations:

- Daynero — commercial product preview
- Design or Disaster
- Pentimento
- Invisible Interfaces
- Atlas

The home uses one shared control to compare what each product shows, what governs it, and what changes for the person. It is a direct work index, not a simulated desktop or a conventional project-card feed.

## What ships here

- A five-project index with a synchronized interface / logic / consequence lens.
- An honest Daynero preview using only the public product position and Tanishk's stated contribution.
- Four evidence-bounded case studies with a small interactive proof, project story, design decisions, limits, and next test.
- Authored About and Contact pages; `/resume` redirects to About until a résumé exists.
- Metadata, sitemap, robots policy, semantic structure, visible focus, responsive layouts, reduced motion, and forced-colors support.
- Separate build paths for Cloudflare/Sites (`pnpm build`) and Vercel's standard Next.js runtime (`pnpm build:vercel`).

The independent projects remain separate repositories and deployments. This repository owns the portfolio housing and editorial case-study layer.

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
pnpm build:vercel
```

## Architecture notes

- [Interaction architecture](docs/interaction-architecture.md)
- [Content model](docs/content-model.md)

Daynero is commercial work in a team context; the detailed case is being documented. The other four investigations were independently conceived and built by Tanishk. AI assisted ideation, critique, source discovery, and code iteration; final concept selection, design decisions, editing, implementation decisions, and authorship remain Tanishk's.
