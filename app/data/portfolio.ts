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

type Pivot = {
  title: string;
  before: string;
  realization: string;
  after: string;
};

type RejectedPath = {
  title: string;
  reason: string;
};

type DesignDecision = {
  title: string;
  choice: string;
  consequence: string;
};

type SystemLayer = {
  label: string;
  title: string;
  body: string;
};

type NextTest = {
  title: string;
  body: string;
  success: string;
};

/**
 * The case, told the way you'd tell another designer who just asked
 * "so what made you build this?" — three beats, plain and distilled:
 *   intro        — the idea, and the itch behind it. Never the context.
 *   contribution — what it actually is, usually by saying what it isn't.
 *   reflection   — what building it changed in how I think.
 * turn is the one line worth pulling out and setting large.
 */
type Story = {
  intro: string[];
  contribution: string[];
  turn: string;
  reflection: string[];
};

/** Said once, for the whole site — not restated on every case. */
export const disclosure =
  "AI helped me think, argue, and iterate on code. The concepts, research, design decisions, writing, and every line that shipped are mine.";

export type Project = {
  id: string;
  slug: string;
  legacySlugs?: string[];
  title: string;
  form: string;
  thesis: string;
  question: string;
  oneLine: string;
  status: string;
  availability?: "published" | "preview" | "coming-soon";
  year: string;
  context: string;
  ownership: string;
  role: string;
  responsibilities: string[];
  tools: string[];
  scale: string;
  liveUrl: string;
  sourceUrl?: string;
  accent: string;
  artifact: "daynero" | "disaster" | "pentimento" | "invisible" | "atlas" | "fluxion";
  lensRelations: Record<InterpretiveLens, string>;
  relatedSlugs: string[];
  chapterTitles: {
    context: string;
    pivot: string;
    interaction: string;
    system: string;
    proof: string;
  };
  /** The three-beat read. Absent on previews, which have no case yet. */
  story?: Story;
  problem: NarrativeSection;
  pivot: Pivot;
  rejectedPaths: RejectedPath[];
  interactionIntro: string;
  interactionSteps: string[];
  systemLayers: SystemLayer[];
  decisions: DesignDecision[];
  demonstrated: string[];
  limits: string[];
  nextTest: NextTest;
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
    id: "fluxion-studios",
    slug: "fluxion-studios",
    title: "Fluxion Studios",
    form: "Studio website · freelance practice",
    thesis: "Fluxion's own site had to show the standard we would bring to a client site.",
    question:
      "Could our studio site explain what we build, show how we work, and take a real enquiry?",
    oneLine:
      "Fluxion is the two-person web studio I co-founded with Shreyas. I designed and built the public site, including its motion and enquiry flow.",
    status: "Live studio site",
    year: "2026",
    context: "Co-founded studio with Shreyas",
    ownership: "Co-founder · design and frontend with a partner",
    role: "Co-founder · design, copy, and frontend",
    responsibilities: [
      "Co-founded the studio and shaped how it talks about the work",
      "Designed and built the public studio website",
      "Wrote interface, motion, and form behaviour for the live site",
    ],
    tools: ["Visual design", "UI/UX", "Frontend", "Copy"],
    scale: "Public studio site · enquiry form · two-person practice",
    liveUrl: "https://fluxion-studios.vercel.app/",
    accent: "#c8102e",
    artifact: "fluxion",
    lensRelations: {
      "evidence-judgment":
        "The site has to prove craft in how it is built, not by listing awards it does not have.",
      "agency-authority":
        "A studio pitch that leaves room for the client’s voice instead of overwriting it.",
      "memory-lineage":
        "A two-person practice that grew out of years of making things together.",
      "visibility-accountability":
        "Scope, timing, and whether we are the right studio are stated before a project starts.",
    },
    relatedSlugs: ["design-or-disaster", "daynero"],
    chapterTitles: {
      context: "A studio needed a site that could take real enquiries.",
      pivot: "We built it the way we would build a client’s.",
      interaction: "Type, timing, and a form that actually goes somewhere.",
      system: "Interface, data, and the boring parts that keep a site upright.",
      proof: "The site is live and taking work.",
    },
    story: {
      intro: [
        "Fluxion is a two-person web studio I co-founded with Shreyas. We make sites for businesses that already have a voice and do not want to sound like everyone else online.",
        "Our site had to explain what we build and take real enquiries. It also had to show the level of detail we would bring to client work.",
      ],
      contribution: [
        "I worked on the structure, visual design, copy, motion, frontend, and enquiry form with Shreyas.",
        "The finished site is live and client-facing. It introduces both founders, explains our process, and gives prospective clients a direct way to start a project.",
      ],
      turn:
        "Our first piece of client-facing work was our own site.",
      reflection: [
        "Shipping it meant making practical calls about order, type, motion, form behaviour, and what we could maintain as a two-person studio.",
      ],
    },
    problem: {
      title: "Most studio sites describe craft and then look assembled.",
      paragraphs: [
        "We needed a site that could take a real project enquiry without sounding like every other two-person studio in a dark theme.",
      ],
    },
    pivot: {
      title: "Build the studio site the way we would build a client’s.",
      before: "A holding page would have been faster.",
      realization: "The first thing a client sees is how we treat our own work.",
      after: "The live site is designed, written, and implemented in-house.",
    },
    rejectedPaths: [],
    interactionIntro:
      "The public site covers how we think, what we build, how we work, and a form that starts a project.",
    interactionSteps: [],
    systemLayers: [],
    decisions: [
      {
        title: "Build it in-house",
        choice: "Design and implement the studio site ourselves instead of parking a template.",
        consequence: "Prospective clients can judge the work through the site itself.",
      },
      {
        title: "Say the constraints out loud",
        choice: "Publish reply time, typical duration, and that pricing is on enquiry.",
        consequence: "People can check the fit before writing.",
      },
    ],
    demonstrated: [
      "A live studio website with navigation, process, founders, and an enquiry form.",
      "Co-founded practice with Shreyas, based in Bengaluru.",
      "Design and frontend implementation of the public site.",
    ],
    limits: [
      "This record is the studio site, not a library of named client case studies.",
      "Project outcomes for clients are not published here.",
    ],
    nextTest: {
      title: "Add client work when it is ready to show.",
      body: "Publish case studies with the client's context, the work we did, and outcomes we can support.",
      success: "A visitor can tell what the studio has shipped and what we contributed.",
    },
    contribution:
      "Co-founded the studio; designed and built the public website with Shreyas.",
    disclosure:
      "Fluxion Studios is a two-person practice. This portfolio page describes the live studio site and my role. It does not invent client results.",
  },
  {
    id: "design-or-disaster",
    slug: "design-or-disaster",
    title: "Design or Disaster",
    form: "Spatial critique archive",
    thesis: "Critique becomes accountable when you have to point before you pronounce.",
    question:
      "What changes when a critique has to point to evidence before it gives a verdict?",
    oneLine:
      "Mark the part of an interface that shaped your judgment, explain it, then compare your reading with five others.",
    status: "Working archive",
    year: "2026",
    context: "Self-directed research-through-design",
    ownership: "Independent · concept to production",
    role: "Interaction design · criticism · writing · implementation",
    responsibilities: [
      "Framed the research question and critique method",
      "Authored ten cases and five fallible juror positions",
      "Designed the spatial evidence-map interaction",
      "Built and verified the responsive archive",
    ],
    tools: ["React", "JavaScript", "Vite", "CSS Modules", "Browser-local state"],
    scale: "10 cases · 5 jurors · 2 experience paths",
    liveUrl: "https://design-or-disaster.vercel.app/",
    sourceUrl: "https://github.com/tanishkfr/design-or-disaster",
    accent: "#ef4a35",
    artifact: "disaster",
    lensRelations: {
      "evidence-judgment":
        "Makes the path from observed interface evidence to a verdict visible and open to disagreement.",
      "agency-authority":
        "Distributes authority across the visitor and five fallible jurors instead of presenting critique as expert truth.",
      "memory-lineage":
        "Accumulates independent readings into an archive without collapsing their differences.",
      "visibility-accountability":
        "Pins every claim to a precise interface coordinate so criticism remains inspectable.",
    },
    relatedSlugs: ["atlas", "pentimento"],
    chapterTitles: {
      context: "Opinions arrive after the evidence has disappeared.",
      pivot: "I removed the answer key.",
      interaction: "Mark first. Argue second.",
      system: "One screen, six accountable readings.",
      proof: "A working archive—not a study result.",
    },
    problem: {
      title: "Design criticism often begins with a verdict and works backward.",
      paragraphs: [
        "A review says that an interface is clear, confusing, delightful, or broken. But the precise detail that produced the judgment is usually left implicit. Once that evidence disappears, disagreement becomes a contest of taste, confidence, or seniority.",
        "I wanted critique to leave a visible trail. Before anyone could rule, the interface would require them to choose a lens, locate evidence, explain what it showed, and only then state a verdict.",
      ],
    },
    pivot: {
      title: "The project stopped asking who was right and started showing how people looked.",
      before:
        "The obvious versions were a design quiz, an expert score, or a crowd percentage. Each would end by telling the visitor how their judgment compared with authority.",
      realization:
        "The useful object was not the score. It was the evidence map created before the score: a record of what entered one person's attention and what never did.",
      after:
        "I built five coherent but fallible jurors on one shared coordinate system. Their annotations can agree, collide, or miss one another without any perspective becoming the official answer.",
    },
    rejectedPaths: [
      {
        title: "Expert verdict",
        reason: "It would hide the expert's own selection of evidence behind institutional authority.",
      },
      {
        title: "Crowd consensus",
        reason: "Agreement would look like accuracy, even though the archive contains no live population data.",
      },
      {
        title: "Opinion-first prompt",
        reason: "It would let a verdict form before the visitor had made their evidence inspectable.",
      },
    ],
    interactionIntro:
      "Every case uses the same sequence. The five-minute path teaches it immediately; the full archive lets the visitor see their repeated patterns of attention across ten cases.",
    interactionSteps: [
      "Choose what kind of evidence you are looking for: hierarchy, access, task, trust, or feeling.",
      "Place a mark on the exact coordinate—or choose a named region when precision input is unavailable.",
      "Describe what that place makes visible and write the sentence the evidence supports.",
      "File a ruling and state your own confidence. The interface does not infer confidence from behavior.",
      "Open the juror maps. Your mark stays in place while five incompatible readings appear on the same screen.",
      "Reach the sealed case, where every outside interpretation is withheld and your evidence is the only record.",
    ],
    systemLayers: [
      {
        label: "Input",
        title: "A spatial claim",
        body: "Lens, coordinate or named region, evidence sentence, verdict, and self-reported confidence form one review record.",
      },
      {
        label: "Rule",
        title: "Evidence precedes authority",
        body: "Pending cases hide curator notes and panel status. Comparison unlocks only after the visitor has committed a reading.",
      },
      {
        label: "Output",
        title: "A trace, not a grade",
        body: "The Design Eye record reflects selected lenses, preserves ties, and never claims diagnostic or population validity.",
      },
    ],
    decisions: [
      {
        title: "One coordinate system",
        choice: "Store every mark as screenshot-relative percentages.",
        consequence: "Visitor and juror evidence stays aligned through responsive resizing and perspective changes.",
      },
      {
        title: "Fallible jurors",
        choice: "Write five authored positions instead of simulating experts.",
        consequence: "The panel demonstrates structured disagreement without manufacturing authority or telemetry.",
      },
      {
        title: "Ties stay ties",
        choice: "Preserve shared strongest and weakest lenses.",
        consequence: "The report refuses to invent a personalized winner from ambiguous evidence.",
      },
      {
        title: "Equivalent input paths",
        choice: "Support pointer, keyboard cursor, touch, and named-region placement.",
        consequence: "The research grammar survives when precise pointing is unavailable.",
      },
    ],
    demonstrated: [
      "A complete five-minute path plus a persistent ten-case archive.",
      "Five spatially annotated juror perspectives for every open case.",
      "Pointer, keyboard, touch, and named-region evidence placement.",
      "Validation for annotation bounds, evidence alternatives, content invariants, assets, encoding, and production build.",
    ],
    limits: [
      "The jurors, cases, annotations, and several interface images are authored or reconstructed critique objects.",
      "This is not expert research, a usability study, a live survey, or a population-level result.",
      "The browser-local Design Eye record is a trace of selection, not a diagnosis of the visitor.",
    ],
    nextTest: {
      title: "Use the grammar inside real critique sessions.",
      body:
        "Give design teams the same interface and compare an ordinary verbal critique with an evidence-map critique. Study whether claims become more specific, whether overlooked lenses enter the conversation, and whether disagreement becomes easier to inspect.",
      success:
        "The success measure is better-supported critique—not higher agreement between reviewers.",
    },
    story: {
      intro: [
        "Design critique is full of verdicts. The evidence that produced them is often gone by the time anyone disagrees.",
        "I built Design or Disaster to keep that evidence on the screen.",
      ],
      contribution: [
        "You mark a coordinate, explain what it shows, and file a verdict. Only then do five other readings appear on the same screen.",
        "I wrote those jurors as fallible positions, not experts, and kept every mark on one coordinate system so disagreement stays visible instead of becoming a score.",
      ],
      turn:
        "Two people can disagree more usefully when both marks are still on the screen.",
      reflection: [
        "Using one coordinate system changed the critique from a sequence of opinions into something people could inspect together.",
        "The archive works, but whether it improves a real critique session still needs to be tested with people.",
      ],
    },
    contribution:
      "I framed the critique method, wrote ten cases and five jurors, designed the evidence-map interaction, and built the archive.",
    disclosure:
      "AI assisted ideation, critique, writing iteration, and code iteration. Final concept selection, case construction, design decisions, editing, implementation, and authorship are Tanishk's.",
  },
  {
    id: "pentimento",
    slug: "pentimento",
    title: "Pentimento",
    form: "Algorithmic autobiography",
    thesis: "If software writes about you, your correction must outrank its sentence.",
    question:
      "What should happen when software writes a story about someone and they disagree with it?",
    oneLine:
      "Each machine-written claim shows its evidence. The person can accept it, rewrite it, or strike it, and their version leads the final page.",
    status: "Working artifact · participant study pending",
    year: "2026",
    context: "Self-directed research-through-design",
    ownership: "Independent · concept to production",
    role: "Research framing · interaction design · writing · implementation",
    responsibilities: [
      "Framed the right-of-reply research position",
      "Designed the strike and visible-withdrawal grammar",
      "Built local Letterboxd archive computation and refusal thresholds",
      "Authored the runnable participant-study protocol",
    ],
    tools: ["React", "TypeScript", "Vite", "CSS", "Browser-local computation"],
    scale: "2 archive modes · 3 reply paths · complete revision lineage",
    liveUrl: "https://pentimento-lovat.vercel.app/",
    sourceUrl: "https://github.com/tanishkfr/pentimento",
    accent: "#8b2f63",
    artifact: "pentimento",
    lensRelations: {
      "evidence-judgment":
        "Places an interpretation beside its evidence and lets the subject decide what stands, changes, or is struck.",
      "agency-authority":
        "Gives the person represented—not the interpreting system—the sovereign final word.",
      "memory-lineage":
        "Treats correction as a visible layer of history instead of a clean overwrite.",
      "visibility-accountability":
        "Keeps the withdrawn machine reading inspectable after human revision.",
    },
    relatedSlugs: ["atlas", "daynero"],
    chapterTitles: {
      context: "Generated memories speak with borrowed certainty.",
      pivot: "The movie product was only the costume.",
      interaction: "The person takes the page back.",
      system: "Evidence remains. Authority moves.",
      proof: "The artifact works; the human finding does not exist yet.",
    },
    problem: {
      title: "Personal archives are increasingly turned into confident stories about the people inside them.",
      paragraphs: [
        "Year-in-review products and generated memory systems select patterns, name chapters, and imply causes. They usually show little evidence, communicate little uncertainty, and offer no consequential way for the person described to say: that happened, but it does not mean what you think it means.",
        "Pentimento proposes three obligations for software that narrates a person: show the evidence, admit uncertainty, and give the subject a right of reply that changes the final artifact.",
      ],
    },
    pivot: {
      title: "A film-taste explorer became a document about authorship and power.",
      before:
        "The project began by detecting changes in film taste. That direction risked becoming a polished movie application with timelines, recommendations, and attractive cultural data.",
      realization:
        "The original moment was the strike: the system could make a defensible interpretation, the person could reject its meaning, and the page could visibly transfer authority.",
      after:
        "I rebuilt the project around algorithmic autobiography. Film history remains the first archive because it is portable and legible, but the contribution is a grammar for sovereign correction—not an analysis of taste.",
    },
    rejectedPaths: [
      {
        title: "Movie tracker",
        reason: "A better timeline or recommendation layer would improve the domain while leaving the authorship asymmetry untouched.",
      },
      {
        title: "Comment beside the claim",
        reason: "A comment keeps the person at the margin while the machine's sentence remains the document's authority.",
      },
      {
        title: "Delete the wrong reading",
        reason: "Deletion would hide that the system made the claim and erase the history of the disagreement.",
      },
    ],
    interactionIntro:
      "The product opens inside a contested first draft. Every consequential sentence must show its evidence and accept one of three replies before the second draft can be settled.",
    interactionSteps: [
      "Open a claim to inspect the dates, titles, patterns, absences, ratios, or arithmetic behind it.",
      "Let the reading stand, choose another defensible framing, or strike it without being forced to write a replacement.",
      "When struck, watch the machine sentence recede while the person's correction rises into the leading typographic voice.",
      "Reopen any reply and revise it. No consequential decision becomes irreversible because of one click.",
      "Settle the second draft only after every claim has received a reply.",
      "Print or download a record that preserves evidence, withdrawn language, authorship, and correction lineage without exporting the raw archive.",
    ],
    systemLayers: [
      {
        label: "Evidence",
        title: "The archive stays factual",
        body: "Dates, titles, returns, gaps, and literal computations answer why a reading was proposed. Causes are never treated as observable facts.",
      },
      {
        label: "Reply",
        title: "Disagreement changes the document",
        body: "Let stand, read differently, and strike are all successful paths. Each choice visibly changes the prose and remains revisable.",
      },
      {
        label: "Record",
        title: "The dispute survives settlement",
        body: "The second draft, print output, and session record preserve the machine underpainting and the person's sovereign correction.",
      },
    ],
    decisions: [
      {
        title: "Sovereign ink",
        choice: "Make the person's correction the leading text—not an annotation beside it.",
        consequence: "The interface shows that the represented person outranks the system's account of them.",
      },
      {
        title: "Visible withdrawal",
        choice: "Keep rejected language as a struck underpainting.",
        consequence: "The system yields without quietly rewriting the fact that it made the claim.",
      },
      {
        title: "Designed refusal",
        choice: "Decline to interpret archives below explicit evidence thresholds.",
        consequence: "Insufficient material produces no chapter instead of a thin but confident story.",
      },
      {
        title: "Local archive boundary",
        choice: "Compute a real Letterboxd CSV entirely in the browser.",
        consequence: "The raw personal archive is never uploaded or included in the shareable session record.",
      },
    ],
    demonstrated: [
      "A complete first draft, reply, second draft, print, and structured-record loop.",
      "Inspectable evidence and uncertainty choices for every consequential claim.",
      "Let stand, reframe, strike, blank refusal, revise, undo, and underpainting paths.",
      "A fictional demonstration edition plus a client-side real-archive mode with explicit refusal thresholds.",
    ],
    limits: [
      "Maya's edition is authored fictional research material—not participant evidence.",
      "The written 8–12 participant protocol has not been run, so no recognition, trust, or cultural-validity result is claimed.",
      "The corrections corpus is intentionally empty until consented sessions produce real corrections.",
    ],
    nextTest: {
      title: "Run the right-of-reply study with 8–12 Letterboxd users.",
      body:
        "Participants will work with their own local archive, think aloud through computed chapters, strike or accept readings, review the second draft, and choose what to share. The study will code not only whether a claim was rejected, but why the archive's interpretation failed.",
      success:
        "A high strike rate is not failure. The important signal is whether refusal feels possible, consequential, and trustworthy a week later.",
    },
    story: {
      intro: [
        "A year-in-review can count the films someone watched correctly and still explain that year badly.",
        "Pentimento asks what the interface should do when the person in the story disagrees with the software writing it.",
      ],
      contribution: [
        "Every claim opens to the dates, titles, ratios, or absences behind it. A person can accept the reading, replace it, or strike it without supplying an alternative.",
        "The machine's first draft stays visible as a withdrawn layer. The person's correction gets the final word.",
      ],
      turn:
        "The software gets a draft. The person gets the final word.",
      reflection: [
        "The first version was a film-taste explorer. Rebuilding it around correction made the conflict between the system's account and the person's account the centre of the interaction.",
        "The mechanism is working. The participant study has not been run, so the project does not yet show how correction feels with someone's own archive.",
      ],
    },
    contribution:
      "I framed the right of reply, designed the strike-and-rewrite interaction, built local archive processing, and wrote the participant-study protocol.",
    disclosure:
      "AI assisted ideation, critique, source discovery, and code iteration. Final concept selection, research framing, design decisions, editing, implementation, and authorship are Tanishk's.",
  },
  {
    id: "invisible-interfaces",
    slug: "invisible-interfaces",
    legacySlugs: ["invisible-interactions"],
    title: "Invisible Interfaces",
    form: "Interactive essay",
    thesis: "When work leaves the screen, accountability has to return.",
    question:
      "What should an interface show before someone delegates work and after they return?",
    oneLine:
      "A staged restoration runs only while the tab is hidden, then shows what changed, what did not, and how to discard the result.",
    status: "Complete v1.0 exhibition",
    year: "2026",
    context: "Self-directed research-through-design exhibition",
    ownership: "Independent · concept to production",
    role: "Interaction design · writing · visual direction · implementation",
    responsibilities: [
      "Framed the attention-to-delegation argument",
      "Directed the five-scene experiential sequence",
      "Designed absence as the causal input",
      "Built and verified the browser exhibition",
    ],
    tools: ["Next.js", "TypeScript", "Motion", "Tailwind CSS", "Page Visibility API"],
    scale: "5 scenes · 1 repeated task · causal absence loop",
    liveUrl: "https://invisible-interfaces.vercel.app/",
    sourceUrl: "https://github.com/tanishkfr/invisible-interfaces",
    accent: "#d79a29",
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
    relatedSlugs: ["design-or-disaster", "daynero"],
    chapterTitles: {
      context: "Convenience moved judgment out of sight.",
      pivot: "Watching the progress bar was the wrong interaction.",
      interaction: "The task moves only when you leave.",
      system: "Authority before. Receipt after.",
      proof: "A staged browser argument with a real causal loop.",
    },
    problem: {
      title: "Interfaces require less visible effort, but invisible work is not automatically trustworthy.",
      paragraphs: [
        "Software moved from syntax to pointing, touching, asking, prediction, memory, and delegation. That change can feel like relief. It can also relocate judgment into systems that act while nobody is watching.",
        "I wanted to test what should replace continuous supervision. The project argues for a clear authority boundary before work begins and an accountable receipt when attention returns.",
      ],
    },
    pivot: {
      title: "Absence became the event instead of the gap between events.",
      before:
        "A normal progress bar would let the visitor stay and watch a theatrical representation of invisible work. The experience would talk about delegation while rewarding supervision.",
      realization:
        "If absence mattered to the argument, it had to matter causally to the interface. Leaving could not be decorative; hidden time had to be the input that advanced the task.",
      after:
        "The restoration refuses to progress while the page is visible. Each interval away completes one bounded movement. Returning early pauses the unfinished work and makes that interruption part of the record.",
    },
    rejectedPaths: [
      {
        title: "Animated progress theater",
        reason: "A visible bar would simulate invisible labor while leaving the visitor in the role of supervisor.",
      },
      {
        title: "Agent dashboard",
        reason: "More status chrome would make the system look busy without clarifying its authority or accountability.",
      },
      {
        title: "Silent analytics",
        reason: "Measuring attention without returning the record would repeat the opacity the essay criticizes.",
      },
    ],
    interactionIntro:
      "The same beach photograph travels through five relationships with computing. The task stays stable while visible operation collapses, ending in a restoration that cannot finish while anyone is looking.",
    interactionSteps: [
      "Find the photograph through a terminal that demands syntax, error recovery, and continuous attention.",
      "Move through pointing, touching, asking, and prediction as visible friction falls.",
      "See the system begin to remember and anticipate before receiving an explicit request.",
      "Entrust a bounded restoration with stated limits and an available demonstration path.",
      "Leave the tab. Hidden time advances one bounded movement; returning early pauses what remains.",
      "Inspect the original and restored image, the work receipt, the authority boundary, the discard path, and the local attention receipt.",
    ],
    systemLayers: [
      {
        label: "Before",
        title: "Bound the authority",
        body: "The task states what may change, what must remain untouched, what cannot be inferred, and how the result can be discarded.",
      },
      {
        label: "Away",
        title: "Make absence causal",
        body: "The Page Visibility API advances the staged work only during hidden intervals and pauses it when attention returns.",
      },
      {
        label: "Return",
        title: "Show the work",
        body: "The interface returns the result, comparison, completed steps, limits, local attention record, and a reversible discard decision.",
      },
    ],
    decisions: [
      {
        title: "Causal absence",
        choice: "Use hidden time as the task input rather than as an animation trigger.",
        consequence: "The visitor must enact delegation to understand the argument.",
      },
      {
        title: "Accountable return",
        choice: "Describe changes, untouched material, transmission, inference limits, and disposal.",
        consequence: "Completion communicates responsibility instead of merely announcing success.",
      },
      {
        title: "Returned gaze",
        choice: "Expose the essay's own opening patience, terminal effort, reverse scrubs, and navigation use.",
        consequence: "The work applies its transparency demand to itself.",
      },
      {
        title: "No remote observer",
        choice: "Keep the attention ledger in session storage and remove it when the tab closes.",
        consequence: "The receipt can teach the argument without becoming an analytics system.",
      },
    ],
    demonstrated: [
      "A causal hide, pause, resume, early-return, completion, and accountable-return sequence.",
      "A keyboard- and touch-accessible original/restored comparison.",
      "A disclosed fallback so browser capability never traps the visitor.",
      "Automated walkthroughs for the opening, terminal, morph, anticipation, absence, keyboard, mobile, reduced-motion, About, and 404 paths.",
    ],
    limits: [
      "The browser stages authored work; it does not repair a real archive or run a deployed autonomous agent.",
      "The artifact investigates an experiential relationship—not operational safety or participant outcomes.",
      "The local attention receipt is an interaction argument, not a general analytics model.",
    ],
    nextTest: {
      title: "Move the grammar into a real delegated workflow.",
      body:
        "Apply authority-before and receipt-after to a task where changes have real consequence: bulk editing, financial categorization, archive repair, or document transformation. Test whether people can predict scope before leaving and audit the result on return.",
      success:
        "A trustworthy return should reduce the need for continuous supervision without reducing the person's ability to inspect, reverse, or contest the work.",
    },
    story: {
      intro: [
        "More software now does work offscreen. That can be convenient, but it also removes the moments where someone can see what is happening.",
        "Invisible Interfaces turns one restoration task into a before, an absence, and a return.",
      ],
      contribution: [
        "The first version used a progress bar. I removed it and made absence the input: the task stops while the page is visible and advances while the tab is hidden.",
        "On return, the interface shows the result, unchanged areas, a boundary, and a discard action.",
      ],
      turn:
        "Leaving starts the work. Returning starts the audit.",
      reflection: [
        "Removing the progress bar shifted the design problem from waiting to returning. The receipt became the part that needed the most detail.",
        "This is a staged browser exhibition, not an autonomous restoration system or a usability result.",
      ],
    },
    contribution:
      "I framed the exhibition, designed its five-scene sequence and return receipt, and built the Page Visibility interaction.",
    disclosure:
      "AI assisted ideation, critique, and code iteration. Final concept selection, design decisions, writing, visual direction, implementation, and authorship are Tanishk's.",
  },
  {
    id: "atlas",
    slug: "atlas",
    title: "Atlas",
    form: "Reasoning instrument",
    thesis: "A design rule is only as useful as the unlike cases that are allowed to change it.",
    question:
      "How does one rule change across a lightbox, a financial transfer, and switch access?",
    oneLine:
      "Write a provisional rule, test it against three unlike cases, and keep every hold, refinement, and fracture.",
    status: "Working instrument · evidence audit open",
    year: "2026",
    context: "Self-directed research-through-design",
    ownership: "Independent · concept to production",
    role: "Research framing · interaction design · editing · implementation",
    responsibilities: [
      "Reframed the project from answer library to reasoning activity",
      "Designed the adversarial three-case sequence",
      "Authored the 33 supporting interaction arguments",
      "Built the trace, persistence, export, and evidence audit",
    ],
    tools: ["React", "TypeScript", "Vite", "Framer Motion", "Tailwind CSS"],
    scale: "1 rule test · 3 pressure cases · 33 supporting examples",
    liveUrl: "https://atlas-slice.vercel.app/",
    sourceUrl: "https://github.com/tanishkfr/atlas-slice",
    accent: "#1d756d",
    artifact: "atlas",
    lensRelations: {
      "evidence-judgment":
        "Makes every hold, refinement, and fracture answerable to concrete cases instead of intuition alone.",
      "agency-authority":
        "Treats a principle as revisable reasoning, not a rule that gains authority by being written down.",
      "memory-lineage":
        "Preserves the lineage of a principle as it changes under pressure.",
      "visibility-accountability":
        "Exposes the cases and reasoning behind each revision so the result can be challenged.",
    },
    relatedSlugs: ["design-or-disaster", "pentimento"],
    chapterTitles: {
      context: "Finished principles hide the conditions that made them true.",
      pivot: "The library stopped pretending to be the product.",
      interaction: "Carry one rule until it changes shape.",
      system: "Claim, pressure, revision, lineage.",
      proof: "The instrument is built; transfer is not proven.",
    },
    problem: {
      title: "Design guidance often arrives as a finished sentence with its pressure history removed.",
      paragraphs: [
        "A principle can sound universal when the cases it fails, the assumptions it carries, and the revisions it survived remain invisible. Applying that sentence elsewhere then becomes recall rather than judgment.",
        "Atlas asks whether design reasoning can become inspectable without turning into an answer generator. The unit of value is not the rule alone; it is the visible trace of the rule changing under pressure.",
      ],
    },
    pivot: {
      title: "Thirty-three written answers became supporting material for one participatory test.",
      before:
        "The first Atlas centered a library of 33 completed interaction-design arguments. The writing was useful, but the visitor remained a reader of somebody else's reasoning.",
      realization:
        "The project claimed to teach transferable judgment while giving the visitor nothing to transfer. A library could illustrate reasoning, but it could not make revision happen.",
      after:
        "I moved a rule test to the center: write a provisional principle, carry it through deliberately distant situations, rewrite it when necessary, and keep the full lineage. The corpus now supports the activity instead of impersonating proof.",
    },
    rejectedPaths: [
      {
        title: "Answer library as product",
        reason: "It displayed finished reasoning while keeping the visitor outside the act of revision.",
      },
      {
        title: "Generated best practice",
        reason: "An answer generator would replace judgment with authority and hide the cases behind the recommendation.",
      },
      {
        title: "Three similar examples",
        reason: "Repeated near cases would reward consistency without testing whether the principle transfers.",
      },
    ],
    interactionIntro:
      "One familiar question—when should tapping outside a dialog close it?—moves through three cases selected for increasing distance rather than increasing difficulty.",
    interactionSteps: [
      "Edit a suggested starting rule until it states what you currently believe.",
      "Apply it to a low-consequence lightbox and choose whether it holds, needs refinement, or fractures.",
      "Carry the current wording into a high-consequence financial transfer and rewrite it if the stakes expose a missing condition.",
      "Pressure it with switch access, where an outside tap does not exist as an input event.",
      "Compare the first and final language, inspect every branch, and see exactly which case caused each change.",
      "Copy or download the stress trace; restarting rotates the suggested rule without changing the question or evidence sequence.",
    ],
    systemLayers: [
      {
        label: "Claim",
        title: "Begin with explicit wording",
        body: "A suggested principle is editable before pressure begins, making the visitor's assumption concrete enough to test.",
      },
      {
        label: "Pressure",
        title: "Increase adversarial distance",
        body: "The sequence moves from similar, to consequential, to orthogonal so one early success cannot masquerade as transfer.",
      },
      {
        label: "Trace",
        title: "Preserve every change",
        body: "Hold, refine, and fracture remain distinct; changed wording requires a visible rewrite and earlier language never disappears.",
      },
    ],
    decisions: [
      {
        title: "Preserved lineage",
        choice: "Require visible wording changes for refine and fracture.",
        consequence: "The final answer carries the cases and revisions that produced it.",
      },
      {
        title: "Adversarial distance",
        choice: "Move from lightbox to transfer flow to switch access.",
        consequence: "The rule encounters different stakes and finally a different event model.",
      },
      {
        title: "Motion follows reasoning",
        choice: "Animate only case entry, branch change, and trace construction.",
        consequence: "Previously read evidence stays stable while the reasoning visibly moves.",
      },
      {
        title: "Corpus as editorial support",
        choice: "Label four recurring answer styles as authored organization, not taxonomy.",
        consequence: "The 33 examples remain useful without being presented as validated research evidence.",
      },
    ],
    demonstrated: [
      "A complete claim, pressure, hold/refine/fracture, lineage, copy, and download loop.",
      "Persistent browser state and addressable routes with explicit focus movement.",
      "W3C and Microsoft constraints anchoring the three cases without deciding the verdict.",
      "A citation audit that names unsupported, backward, or drifting claims instead of hiding them.",
    ],
    limits: [
      "The three pressure cases are authored and intentionally adversarial—not sampled from practice.",
      "The mechanism has not been tested with learners, so it does not prove that transferable judgment occurred.",
      "The 33-example corpus remains authored argument until the priority citation audit is cleared.",
    ],
    nextTest: {
      title: "Clear the evidence audit, then study actual revision behavior.",
      body:
        "Attach verifiable sources to the empirical claims, fix the known reversed or drifting examples, then compare designers who read a principle with designers who carry one through the stress trace.",
      success:
        "Look for more conditional final rules, accurate recall of why wording changed, and transfer to a fourth case—not agreement with Atlas's authored examples.",
    },
    story: {
      intro: [
        "Design advice often arrives as a finished sentence. The case that produced it and the cases where it fails have disappeared.",
        "Atlas makes one rule editable and carries it through a lightbox, a financial transfer, and switch access.",
      ],
      contribution: [
        "At each case, the visitor chooses hold, refine, or fracture. A change in judgment requires new wording, and the earlier version stays in the trace.",
        "The useful record is the case that forced each edit, not a final rule presented as universally correct.",
      ],
      turn:
        "A rule is easier to trust when you can see which case changed it.",
      reflection: [
        "Atlas began as 33 written answers. Moving one editable rule to the centre turned the visitor from a reader into the person doing the revision.",
        "The interaction is built, but it has not been tested with learners and does not prove transfer.",
      ],
    },
    contribution:
      "I reframed a 33-answer library as a three-case rule test, then built its revision trace, persistence, export, and evidence audit.",
    disclosure:
      "AI assisted ideation, critique, source discovery, and code iteration. Final concept selection, scenario design, design decisions, editing, implementation, and authorship are Tanishk's.",
  },
  {
    id: "daynero",
    slug: "daynero",
    title: "Daynero",
    form: "AI-native financial product",
    thesis: "A money product for first-paycheck earners who need to know what they can spend today.",
    question:
      "How can a first-paycheck earner see what is safe to spend today?",
    oneLine:
      "A personal-finance app for first-paycheck earners, centred on what is safe to spend today and why. The full case study is coming soon.",
    status: "Coming soon",
    availability: "coming-soon",
    year: "2026",
    context: "Startup product work",
    ownership: "App and public website · commercial team context",
    role: "Product design and implementation across the app and public website",
    responsibilities: [
      "Designed the app's product experience",
      "Designed and built the public website",
      "Developed the interaction and visual systems across both surfaces",
      "Writing the case study when it can be told properly",
    ],
    tools: ["Product design", "Interaction design", "Web design", "Implementation"],
    scale: "Financial app · public website · active startup",
    liveUrl: "https://daynero.com/",
    accent: "#b7e34b",
    artifact: "daynero",
    lensRelations: {
      "evidence-judgment":
        "Turns spending patterns into timely guidance without presenting a static monthly budget as the whole picture.",
      "agency-authority":
        "Uses personal goals and behavior to shape guidance while keeping the person's priorities central.",
      "memory-lineage":
        "Connects current behavior with longer-term financial direction through an evolving daily view.",
      "visibility-accountability":
        "Makes overlooked patterns and the relationship between present behavior and future wealth more legible.",
    },
    relatedSlugs: ["fluxion-studios", "atlas"],
    chapterTitles: {
      context: "The commercial context is still being documented.",
      pivot: "The product evolution will be published with its constraints.",
      interaction: "Daily guidance responds to behavior and goals.",
      system: "The public model connects daily action to longer-term direction.",
      proof: "The product surface is live; the case evidence is not yet published.",
    },
    problem: {
      title: "Traditional monthly budgets can feel detached from the decisions happening today.",
      paragraphs: [
        "Daynero's public position is that financial guidance should respond to daily behavior and spending patterns rather than only report against a monthly plan.",
        "The full project context, constraints, and evidence will be added when they can be documented responsibly.",
      ],
    },
    pivot: {
      title: "Case-study documentation in progress.",
      before: "The earlier product direction is not being published as a placeholder claim.",
      realization: "The case needs the real team context and constraints before it can explain the product evolution honestly.",
      after: "The current portfolio shows only the public product model and Tanishk's stated contribution.",
    },
    rejectedPaths: [],
    interactionIntro:
      "The public product centers an adaptive daily budget, goals, a Meridian Score, and personalized insights.",
    interactionSteps: [],
    systemLayers: [],
    decisions: [],
    demonstrated: [
      "A live public website describing the current product position.",
      "Tanishk designed and built the app experience and public website.",
    ],
    limits: [
      "The full team, timeline, constraints, process, and outcomes are not yet published.",
      "No private product detail or unverified outcome is presented in this preview.",
    ],
    nextTest: {
      title: "Publish the commercial case with the correct context.",
      body: "Document the team, timeline, product evolution, interaction decisions, implementation trade-offs, and publishable evidence.",
      success: "The final case must make Tanishk's contribution precise without erasing collaborators or inventing outcomes.",
    },
    contribution:
      "I designed and built the app experience and public website. The detailed team and contribution record is still being prepared.",
    disclosure:
      "This preview uses Daynero's public product language and Tanishk's stated contribution. The full evidence record is pending.",
  },
];

export const lenses: LensDefinition[] = [
  {
    id: "all",
    shortLabel: "All work",
    label: "All work",
    prompt:
      "Shipped studio work and independent investigations into what interfaces decide, explain, and let people change.",
    order: projects.map((project) => project.slug),
  },
  {
    id: "evidence-judgment",
    shortLabel: "Reason",
    label: "Evidence & Judgment",
    prompt:
      "How can an interface help people inspect evidence and form a judgment without pretending that judgment is neutral?",
    // Atlas leads here, not Design or Disaster. There is no default
    // winner in this index: every reading has its own protagonist, and
    // each project leads exactly once — in the argument it makes best.
    // Atlas is the reasoning instrument; Design or Disaster answers
    // second because it judges what Atlas reasons about.
    order: ["atlas", "design-or-disaster", "pentimento", "invisible-interfaces", "fluxion-studios", "daynero"],
  },
  {
    id: "agency-authority",
    shortLabel: "Agency",
    label: "Agency & Authority",
    prompt:
      "What can a person contest, revise, delegate, or refuse, and who retains the final say?",
    order: ["pentimento", "invisible-interfaces", "fluxion-studios", "daynero", "design-or-disaster", "atlas"],
  },
  {
    id: "memory-lineage",
    shortLabel: "Memory",
    label: "Memory & Lineage",
    prompt:
      "How can a system preserve change and context without turning history into clutter or authority?",
    order: ["fluxion-studios", "daynero", "atlas", "pentimento", "invisible-interfaces", "design-or-disaster"],
  },
  {
    id: "visibility-accountability",
    shortLabel: "Visibility",
    label: "Visibility & Accountability",
    prompt:
      "What must a system reveal so its behavior can be understood, trusted, and challenged?",
    order: ["invisible-interfaces", "design-or-disaster", "fluxion-studios", "daynero", "pentimento", "atlas"],
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
