export const lensIds = [
  "all",
  "evidence-judgment",
  "agency-authority",
  "memory-lineage",
  "visibility-accountability",
] as const;

export type LensId = (typeof lensIds)[number];
export type InterpretiveLens = Exclude<LensId, "all">;

type NarrativeSection = {
  title: string;
  paragraphs: string[];
};

type DesignDecision = {
  title: string;
  body: string;
};

export type Project = {
  id: string;
  slug: string;
  legacySlugs?: string[];
  title: string;
  form: string;
  question: string;
  oneLine: string;
  status: string;
  year: string;
  context: string;
  role: string;
  tools: string[];
  liveUrl: string;
  sourceUrl: string;
  accent: string;
  artifact: "remainder" | "disaster" | "pentimento" | "invisible" | "atlas";
  lensRelations: Record<InterpretiveLens, string>;
  relatedSlugs: string[];
  problem: NarrativeSection;
  shift: NarrativeSection;
  interactionIntro: string;
  interactionSteps: string[];
  decisions: DesignDecision[];
  demonstrated: string[];
  limits: string[];
  nextStep: string;
  contribution: string;
  disclosure: string;
};

export type LensDefinition = {
  id: LensId;
  shortLabel: string;
  label: string;
  prompt: string;
  order: string[];
};

export const projects: Project[] = [
  {
    id: "design-or-disaster",
    slug: "design-or-disaster",
    title: "Design or Disaster",
    form: "Spatial critique archive",
    question:
      "What does a design judgment select as evidence before it becomes a verdict?",
    oneLine:
      "An interactive archive where visitors locate evidence, file a ruling, and compare it with five deliberately incompatible readings of the same interface.",
    status: "Working archive",
    year: "2026",
    context: "Self-directed research-through-design",
    role: "Interaction design, criticism, writing, and engineering",
    tools: ["React", "JavaScript", "Vite", "CSS Modules", "Browser-local state"],
    liveUrl: "https://design-or-disaster.vercel.app/",
    sourceUrl: "https://github.com/tanishkfr/design-or-disaster",
    accent: "#d6523c",
    artifact: "disaster",
    lensRelations: {
      "evidence-judgment":
        "Makes the path from observed interface evidence to a verdict visible and open to disagreement.",
      "agency-authority":
        "Distributes authority across the visitor and five fallible jurors rather than presenting critique as expert truth.",
      "memory-lineage":
        "Accumulates independent readings into an archive without collapsing their differences.",
      "visibility-accountability":
        "Pins every claim to a precise interface coordinate so criticism remains inspectable.",
    },
    relatedSlugs: ["atlas", "pentimento"],
    problem: {
      title: "Verdicts hide what attention selected first.",
      paragraphs: [
        "Most design critique begins after the judgment has already formed: good, bad, clear, confusing. The evidence that produced the verdict remains implicit, so disagreement quickly becomes a contest of taste or authority.",
        "The project tests a different sequence. Before a visitor can rule, they must identify the exact place that matters, name the lens they are using, and write the sentence that the evidence supports.",
      ],
    },
    shift: {
      title: "From opinion collection to incompatible perception.",
      paragraphs: [
        "A quiz, expert score, or crowd percentage would have recreated the authority problem. The archive instead stages five authored jurors as coherent but fallible positions. Agreement may happen, but it is never treated as accuracy.",
        "The final sealed case removes every outside perspective. The visitor's evidence remains the only record, returning responsibility instead of revealing an answer.",
      ],
    },
    interactionIntro:
      "The same grammar governs every case, whether the visitor takes the five-minute path or completes the ten-case archive.",
    interactionSteps: [
      "Choose an evidence lens: hierarchy, accessibility, usability, trust, or delight.",
      "Mark the exact coordinate or named interface region that matters.",
      "Describe what that place makes visible and what the evidence supports.",
      "File a verdict and state confidence in the ruling.",
      "Compare the map with five juror perspectives without being graded against them.",
    ],
    decisions: [
      {
        title: "One coordinate system",
        body: "Visitor marks and juror annotations remain aligned to screenshot-relative coordinates, so changing perspective changes interpretation without changing the underlying object.",
      },
      {
        title: "Fallible jurors",
        body: "The panel is structured disagreement, not simulated expertise. No telemetry, crowd distribution, or correctness percentage is implied.",
      },
      {
        title: "Ties stay ties",
        body: "The Design Eye record preserves shared strongest and weakest lenses rather than manufacturing a personalized winner.",
      },
      {
        title: "Evidence without precision input",
        body: "Pointer marks, a keyboard cursor, and named-region controls all produce the same evidence object.",
      },
    ],
    demonstrated: [
      "A complete five-minute path and a persistent ten-case archive.",
      "Five spatially annotated perspectives for every open case.",
      "Pointer, keyboard, touch, and named-region evidence placement.",
      "Project-specific validation for annotation bounds, alternatives, copy integrity, assets, and production build.",
    ],
    limits: [
      "The jurors, cases, annotations, and several interface images are authored or reconstructed composites.",
      "This is not a survey of experts, a usability study, or a population-level result.",
      "The visitor record stays in browser-local storage and is a trace of selection, not a diagnosis.",
    ],
    nextStep:
      "Test whether the evidence-map grammar changes the quality of critique when used by real design teams, without turning agreement into the success metric.",
    contribution:
      "Mark first, argue second, compare perception, then live with the ruling.",
    disclosure:
      "AI assisted ideation, critique, writing iteration, and code iteration. Final concept selection, case construction, design decisions, editing, and authorship are Tanishk's.",
  },
  {
    id: "pentimento",
    slug: "pentimento",
    title: "Pentimento",
    form: "Algorithmic autobiography",
    question:
      "What does software owe a person when it turns their archive into a story about their life?",
    oneLine:
      "A right-of-reply experiment where a person's correction becomes the leading text while the machine's withdrawn interpretation remains visible underneath.",
    status: "Working artifact · study pending",
    year: "2026",
    context: "Self-directed research-through-design",
    role: "Research, interaction design, writing, and engineering",
    tools: ["React", "TypeScript", "Vite", "CSS", "Browser-local computation"],
    liveUrl: "https://pentimento-lovat.vercel.app/",
    sourceUrl: "https://github.com/tanishkfr/pentimento",
    accent: "#a93228",
    artifact: "pentimento",
    lensRelations: {
      "evidence-judgment":
        "Places a machine interpretation beside its evidence and lets the subject decide what stands, changes, or is struck.",
      "agency-authority":
        "Gives the person represented, not the interpreting system, the sovereign final word.",
      "memory-lineage":
        "Treats correction as a visible layer of history rather than a clean overwrite.",
      "visibility-accountability":
        "Keeps the machine underpainting inspectable after human revision.",
    },
    relatedSlugs: ["atlas", "remainder"],
    problem: {
      title: "Generated memories narrate people without giving them a reply.",
      paragraphs: [
        "Year-in-review products and memory systems turn personal archives into confident stories. They commonly expose little evidence, communicate little uncertainty, and give the person described no consequential way to say that the interpretation is wrong.",
        "Pentimento proposes three obligations for machine-authored narrative: show the evidence, calibrate certainty, and yield when the subject contests the account.",
      ],
    },
    shift: {
      title: "The taste project was only the costume.",
      paragraphs: [
        "The project began by interpreting changes in film taste. Internal review exposed that its most original moment was not the recommendation model or timeline; it was the strike, where a person could refuse the system's story and leave the disagreement in the artifact.",
        "That finding reframed the work around algorithmic autobiography and the right of reply. Film history remains the first domain because Letterboxd provides a rich, portable archive, but the design question is broader than movies.",
      ],
    },
    interactionIntro:
      "Pentimento opens inside a contested first draft. Every consequential sentence remains answerable to evidence and revisable until settlement.",
    interactionSteps: [
      "Read a machine-authored claim and inspect the dates, titles, absences, or computation behind it.",
      "Let the interpretation stand, choose another defensible framing, or strike it.",
      "Write a correction in the human voice or refuse the claim without replacement.",
      "Revisit any reply before settling the second draft.",
      "Print or download a record that preserves evidence, withdrawal, authorship, and revision lineage.",
    ],
    decisions: [
      {
        title: "Sovereign ink",
        body: "A strike is not a comment beside the memoir. The machine sentence recedes and the subject's correction takes its place in the page hierarchy.",
      },
      {
        title: "Visible withdrawal",
        body: "The rejected sentence remains as an underpainting. Deleting it would hide that the system made the claim in the first place.",
      },
      {
        title: "Two archives, one privacy boundary",
        body: "Maya's edition is explicitly fictional. A real Letterboxd CSV is computed locally, never uploaded, and excluded from the exported session record.",
      },
      {
        title: "Refusal is a designed output",
        body: "Below evidence thresholds the system declines to interpret rather than manufacturing a thin narrative.",
      },
    ],
    demonstrated: [
      "A complete first-draft, reply, second-draft, print, and export loop.",
      "Inspectable evidence, literal computations, and uncertainty choices for every claim.",
      "Accept, reframe, strike, revise, undo, and blank-refusal paths.",
      "A corrections-corpus gallery that is deliberately empty until consented participant sessions exist.",
    ],
    limits: [
      "Maya's edition is an authored fictional research probe, not participant evidence.",
      "The written 8-12 participant protocol has not yet been run, so no recognition, trust, or cultural-validity finding is claimed.",
      "Several research references still require complete author records before formal submission.",
    ],
    nextStep:
      "Run the participant protocol with personal Letterboxd archives and build the corrections corpus from what people actually strike and say instead.",
    contribution:
      "A person can overrule a machine's interpretation without erasing the fact that the interpretation occurred.",
    disclosure:
      "AI assisted ideation, critique, source discovery, and code iteration. Final concept selection, research framing, design decisions, editing, and authorship are Tanishk's.",
  },
  {
    id: "invisible-interfaces",
    slug: "invisible-interfaces",
    legacySlugs: ["invisible-interactions"],
    title: "Invisible Interfaces",
    form: "Interactive essay",
    question:
      "What does an invisible system owe us when attention leaves the interface?",
    oneLine:
      "A measured exhibition in which an entrusted restoration advances only while the visitor is away, then returns with a bounded receipt of what happened.",
    status: "Complete v1.0 exhibition",
    year: "2026",
    context: "Self-directed research-through-design exhibition",
    role: "Interaction design, writing, visual direction, and engineering",
    tools: ["Next.js", "TypeScript", "Motion", "Tailwind CSS", "Page Visibility API"],
    liveUrl: "https://invisible-interfaces.vercel.app/",
    sourceUrl: "https://github.com/tanishkfr/invisible-interfaces",
    accent: "#c98222",
    artifact: "invisible",
    lensRelations: {
      "evidence-judgment":
        "Uses the visitor's own absence as evidence for examining what delegated computing should disclose.",
      "agency-authority":
        "Turns leaving the interface into an explicit act of delegation rather than an unobserved loss of control.",
      "memory-lineage":
        "Returns a receipt of what happened while attention was elsewhere.",
      "visibility-accountability":
        "Makes background behavior accountable through a legible record on return.",
    },
    relatedSlugs: ["design-or-disaster", "remainder"],
    problem: {
      title: "We traded visible labor for systems we cannot inspect.",
      paragraphs: [
        "Interfaces have moved from commanding and pointing toward prediction and delegated work. Less visible effort can feel like relief, but it can also move judgment into systems that operate beyond attention.",
        "The project asks what should replace continuous supervision. Its answer is not more agent theater; it is a clear authority boundary before work and an accountable receipt when the person returns.",
      ],
    },
    shift: {
      title: "Absence became the interaction event.",
      paragraphs: [
        "A progress bar would have let visitors watch a performance of invisible work. Instead, the entrusted task refuses to advance while the page is visible. Each interval away completes one bounded movement; returning early pauses what remains.",
        "The same photograph travels through terminal commands, pointing, touching, search, prediction, memory, and delegation. The task remains stable while the relationship to attention changes.",
      ],
    },
    interactionIntro:
      "The experience moves through five relationships with computing and culminates in a task that can only finish when nobody is looking.",
    interactionSteps: [
      "Find a photograph through a terminal that demands syntax and continuous attention.",
      "Move through pointing, touching, asking, and prediction as visible friction collapses.",
      "Entrust a bounded restoration with explicit limits and an available demonstration path.",
      "Leave the tab; returning early pauses the remaining work rather than pretending it completed.",
      "Inspect the restored result, work receipt, authority boundary, and local attention receipt.",
    ],
    decisions: [
      {
        title: "Causal absence",
        body: "The Page Visibility API is not a decorative trigger. Hidden time is the input that advances the entrusted task.",
      },
      {
        title: "Accountable return",
        body: "Completion states what changed, what remained untouched, what was not transmitted, what could not be inferred, and how the result can be discarded.",
      },
      {
        title: "The essay returns its own gaze",
        body: "A second receipt exposes opening patience, terminal effort, reverse scrubs, and navigation use instead of measuring the visitor silently.",
      },
      {
        title: "No remote observer",
        body: "The attention ledger exists only in session storage, is shown to the visitor, and disappears when the tab closes.",
      },
    ],
    demonstrated: [
      "A causal hide, pause, resume, completion, and return sequence.",
      "Keyboard- and touch-accessible original/restored comparison.",
      "A disclosed fallback so browser capability never becomes a trap.",
      "Automated walkthroughs for opening, morph, absence, keyboard, mobile, reduced motion, copy integrity, About, and 404 routes.",
    ],
    limits: [
      "The browser stages authored work; it does not repair a real archive or run a deployed agent.",
      "The artifact investigates an experiential relationship, not operational safety or participant outcomes.",
      "Its local attention receipt is an interaction argument, not a general analytics model.",
    ],
    nextStep:
      "Test the authority-and-receipt grammar on real delegated workflows where undo, inspection, and consequence carry higher stakes.",
    contribution:
      "Invisible work becomes trustworthy through accountable return, not continuous supervision.",
    disclosure:
      "AI assisted ideation, critique, and code iteration. Final concept selection, design decisions, writing, editing, and authorship are Tanishk's.",
  },
  {
    id: "atlas",
    slug: "atlas",
    title: "Atlas",
    form: "Reasoning instrument",
    question:
      "Can an interaction principle survive transfer across unlike situations?",
    oneLine:
      "A stress-testing instrument that carries one provisional rule through distant cases and preserves every place it holds, refines, or fractures.",
    status: "Working instrument · evidence audit",
    year: "2026",
    context: "Self-directed research-through-design",
    role: "Research, interaction design, editing, and engineering",
    tools: ["React", "TypeScript", "Vite", "Framer Motion", "Tailwind CSS"],
    liveUrl: "https://atlas-slice.vercel.app/",
    sourceUrl: "https://github.com/tanishkfr/atlas-slice",
    accent: "#39766f",
    artifact: "atlas",
    lensRelations: {
      "evidence-judgment":
        "Makes every hold, refinement, and fracture answerable to concrete cases rather than intuition alone.",
      "agency-authority":
        "Treats a principle as revisable reasoning, not a rule that gains authority by being written down.",
      "memory-lineage":
        "Preserves the lineage of a principle as it changes under pressure.",
      "visibility-accountability":
        "Exposes the cases and reasoning behind each revision so the resulting principle can be challenged.",
    },
    relatedSlugs: ["design-or-disaster", "pentimento"],
    problem: {
      title: "Principles look universal when their pressure stays hidden.",
      paragraphs: [
        "Interaction guidance often arrives as a finished rule. The conditions that produced it, the cases it cannot explain, and the revisions it survived are rarely visible to the person applying it elsewhere.",
        "Atlas asks whether design reasoning can become inspectable without becoming an answer generator. Its unit is not the principle alone; it is the full trace of the principle changing under pressure.",
      ],
    },
    shift: {
      title: "From a library of answers to an instrument for revision.",
      paragraphs: [
        "The first Atlas centered 33 completed interaction-design arguments. The writing was useful, but the visitor remained a reader of somebody else's reasoning.",
        "The redesign moved the participatory instrument to the center: state a rule, expose its assumptions, revise it when necessary, and retain the lineage. The corpus now supports the interaction instead of impersonating proof.",
      ],
    },
    interactionIntro:
      "One familiar question is pushed through three deliberately distant cases so that transfer, not recall, becomes the work.",
    interactionSteps: [
      "Write a provisional principle for when tapping outside a dialog should close it.",
      "Apply it to a low-consequence lightbox and record whether it holds.",
      "Carry it into a high-consequence financial transfer and refine or fracture it visibly.",
      "Pressure it with switch access, where an outside tap does not exist as an event.",
      "Compare the first and final wording, inspect every branch, and export the completed stress trace.",
    ],
    decisions: [
      {
        title: "Preserved lineage",
        body: "A refinement or fracture requires a visible revision. Earlier language stays available, and hold, refine, and fracture remain semantically distinct.",
      },
      {
        title: "Adversarial distance",
        body: "The sequence moves from near to consequential to orthogonal, preventing the first successful example from masquerading as transfer.",
      },
      {
        title: "Motion follows reasoning",
        body: "Movement is reserved for a case entering, a branch changing, or a trace drawing into view. Previously read content stays stable.",
      },
      {
        title: "Corpus as editorial support",
        body: "Four recurring reasoning patterns organize 33 authored arguments, explicitly labeled as an editorial lens rather than a validated taxonomy.",
      },
    ],
    demonstrated: [
      "A complete claim, pressure, hold/refine/fracture, lineage, copy, and download loop.",
      "Persistent trace state and addressable routes with explicit focus movement.",
      "W3C and Microsoft constraints anchoring the three pressure cases without deciding the verdict.",
      "A documented citation audit that identifies specific claims requiring correction or stronger sources.",
    ],
    limits: [
      "The three cases are authored and intentionally adversarial, not sampled from practice.",
      "Transfer has not been tested with learners, so the mechanism does not prove transferable judgment.",
      "The supporting corpus remains authored argument until its priority citation audit is cleared.",
    ],
    nextStep:
      "Clear the evidence audit, then study whether designers produce more conditional and transferable principles after using the stress trace.",
    contribution:
      "A principle becomes useful through the distant cases it survives and the lineage of every change it did not.",
    disclosure:
      "AI assisted ideation, critique, source discovery, and code iteration. Final concept selection, scenario design, design decisions, editing, and authorship are Tanishk's.",
  },
  {
    id: "remainder",
    slug: "remainder",
    legacySlugs: ["command-center"],
    title: "Remainder",
    form: "Creative memory system",
    question:
      "How can creative work preserve the consequences of conversation without surrendering judgment?",
    oneLine:
      "A local-first workspace where conversation becomes reviewed, traceable project memory instead of an ever-growing transcript.",
    status: "Working personal product",
    year: "2026",
    context: "Self-directed product and systems investigation",
    role: "Product architecture, interaction design, systems design, and engineering",
    tools: ["React", "TypeScript", "Express", "Vite", "Vercel Blob", "MCP"],
    liveUrl: "https://commandcenter-lilac-alpha.vercel.app/",
    sourceUrl: "https://github.com/tanishkfr/commandcenter",
    accent: "#625aa8",
    artifact: "remainder",
    lensRelations: {
      "evidence-judgment":
        "Preserves the material behind creative decisions so later judgment is not forced to rely on recollection.",
      "agency-authority":
        "Separates model confidence from human consent before memory can steer future work.",
      "memory-lineage":
        "Turns fragmented creative conversation into durable project memory with retrievable provenance and change history.",
      "visibility-accountability":
        "Makes what the system remembers, where it came from, and what it replaced inspectable to the maker.",
    },
    relatedSlugs: ["atlas", "pentimento"],
    problem: {
      title: "Transcripts preserve sequence, not what changed the work.",
      paragraphs: [
        "Creative projects increasingly happen through conversation, but the reasoning that changes direction stays trapped inside long transcripts. Generic notes preserve fragments; chat summaries preserve model confidence. Neither captures what the maker reviewed and decided should remain.",
        "Remainder tests a sharper proposition: a project should remember the reviewed consequences of conversation with enough provenance to challenge, reverse, or reinterpret them later.",
      ],
    },
    shift: {
      title: "The dashboard was activity without continuity.",
      paragraphs: [
        "The first version was a Command Center of projects, metrics, inboxes, and dashboard cards. It made activity visible but left the central problem untouched, so that runtime was removed.",
        "The redesign made conversation the primary surface and introduced a deliberate handoff: conversation creates candidate memory; human judgment decides what enters active context; history retains what changed.",
      ],
    },
    interactionIntro:
      "Capture is staged as a review handoff, not an automatic summary or a celebratory save action.",
    interactionSteps: [
      "Continue a conversation inside a durable project rather than a disposable chat.",
      "Capture the session when something changes the work; extracted items remain pending candidates.",
      "Dismiss a candidate, keep it alongside current context, or use it to explicitly change direction.",
      "Inspect the source messages, related memory, current direction, and superseded lineage.",
      "Recover the reasoning through Memory, History, Search, export, or MCP, and undo review or deletion decisions.",
    ],
    decisions: [
      {
        title: "Confidence is not consent",
        body: "No extracted candidate enters active context until a person reviews it. Pending and resolved memory cannot silently steer a later response.",
      },
      {
        title: "Change without erasure",
        body: "Supersession resolves earlier direction but retains provenance. Undo, successor deletion, or review release can restore it.",
      },
      {
        title: "The project outlives the model",
        body: "A deterministic local collaborator and extractor keep the core workflows usable without an AI key or provider availability.",
      },
      {
        title: "One trust model everywhere",
        body: "The same semantics govern UI, API, storage, grouped search, export, history, and authenticated MCP access.",
      },
    ],
    demonstrated: [
      "Complete project, conversation, capture, memory, lineage, search, import, export, reset, delete, restore, and undo workflows.",
      "Message-level provenance and explicit, constrained, reversible supersession.",
      "Local atomic storage plus conditional private Vercel Blob writes.",
      "Type checks, tests, builds, and isolated production smoke tests covering fallback AI, concurrency, migrations, MCP, and interaction invariants.",
    ],
    limits: [
      "The product demonstrates its trust model but does not yet prove that reviewed memory improves creative outcomes.",
      "No participant quote, usability metric, or desirability claim exists until the written research protocol is run.",
      "The current deployment is a private personal-product model; public multi-user use would require authentication and authorization.",
    ],
    nextStep:
      "Run the research protocol around context recovery, the distinction between keep-alongside and change-direction, and willingness to correct AI memory.",
    contribution:
      "The conversation is the interface. The project is the memory. Judgment decides what remains.",
    disclosure:
      "AI assisted ideation, critique, source discovery, and code iteration. Final product architecture, concept selection, domain model, interaction decisions, editing, and implementation are Tanishk's.",
  },
];

export const lenses: LensDefinition[] = [
  {
    id: "all",
    shortLabel: "All work",
    label: "All work",
    prompt:
      "Five independent products and research instruments about understanding, contesting, and remembering what systems do.",
    order: projects.map((project) => project.slug),
  },
  {
    id: "evidence-judgment",
    shortLabel: "Evidence",
    label: "Evidence & Judgment",
    prompt:
      "How can an interface help people inspect evidence and form a judgment without pretending that judgment is neutral?",
    order: ["design-or-disaster", "atlas", "pentimento", "invisible-interfaces", "remainder"],
  },
  {
    id: "agency-authority",
    shortLabel: "Agency",
    label: "Agency & Authority",
    prompt:
      "What can a person contest, revise, delegate, or refuse, and who retains the final say?",
    order: ["pentimento", "invisible-interfaces", "remainder", "design-or-disaster", "atlas"],
  },
  {
    id: "memory-lineage",
    shortLabel: "Memory",
    label: "Memory & Lineage",
    prompt:
      "How can a system preserve change and context without turning history into clutter or authority?",
    order: ["remainder", "atlas", "pentimento", "invisible-interfaces", "design-or-disaster"],
  },
  {
    id: "visibility-accountability",
    shortLabel: "Visibility",
    label: "Visibility & Accountability",
    prompt:
      "What must a system reveal so its behavior can be understood, trusted, and challenged?",
    order: ["invisible-interfaces", "design-or-disaster", "remainder", "pentimento", "atlas"],
  },
];

export function isLensId(value: unknown): value is LensId {
  return typeof value === "string" && lensIds.includes(value as LensId);
}

export function getProject(slug: string) {
  return projects.find(
    (project) =>
      project.slug === slug || project.legacySlugs?.includes(slug) === true,
  );
}

export function getLens(id: LensId) {
  return lenses.find((lens) => lens.id === id) ?? lenses[0];
}
