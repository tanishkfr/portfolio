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
  availability?: "published" | "preview";
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
  artifact: "daynero" | "disaster" | "pentimento" | "invisible" | "atlas";
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
    id: "design-or-disaster",
    slug: "design-or-disaster",
    title: "Design or Disaster",
    form: "Spatial critique archive",
    thesis: "Critique becomes accountable when you have to point before you pronounce.",
    question:
      "What does a design judgment select as evidence before it becomes a verdict?",
    oneLine:
      "Visitors mark the exact part of an interface that shaped their judgment, file a ruling, then compare it with five deliberately incompatible readings of the same screen.",
    status: "Working archive",
    year: "2026",
    context: "Self-directed research-through-design",
    ownership: "Independent · concept to production",
    role: "Interaction designer, critic, writer, and engineer",
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
        "Most critique happens after the answer. I wanted to see what happens before it.",
        "Good designers don't just know whether something works. They build a case — they notice what they're looking at, weigh it, and defend a call. But we mostly teach the verdict, not the reasoning that earned it.",
        "Design or Disaster tries to make the judgment itself visible.",
      ],
      contribution: [
        "Instead of asking you to guess the right answer, it asks you to commit to one.",
        "You mark the exact part of the interface that shaped your read, say what it shows, and only then rule. Then five other readings appear on the same screen — not experts, just positions that don't agree with you or with each other. Your mark stays where you put it.",
        "The disagreement is the lesson. Not the verdict.",
      ],
      turn:
        "Confidence and good judgment aren't the same thing. Sometimes the most useful thing an interface can do is slow you down just long enough to reconsider.",
      reflection: [
        "I thought I was building a critique tool. I built an argument that critique should leave a trail.",
        "Once you've had to point before you pronounce, an opinion with nothing underneath it starts to feel like what it is.",
      ],
    },
    contribution:
      "I turned design judgment into an inspectable sequence: mark first, argue second, compare perception, then live with the ruling.",
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
      "When software narrates a person's life from their archive, what does that person need to contest, correct, and co-own the story?",
    oneLine:
      "A right-of-reply experiment where every machine-authored claim exposes its evidence, accepts refusal, and yields the page hierarchy to the person being described.",
    status: "Working artifact · participant study pending",
    year: "2026",
    context: "Self-directed research-through-design",
    ownership: "Independent · concept to production",
    role: "Researcher, interaction designer, writer, and engineer",
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
        "Most AI products tell you what they know about you. Almost none ask whether they got it right.",
        "That gap bothered me. The more software summarizes our lives, the more those summaries start to matter — they shape what we're shown, and eventually how we see ourselves. Yet most systems only let you accept the summary or ignore it. You can't argue with it.",
        "Pentimento started with one question. If software can write a story about me, I should be able to rewrite it.",
      ],
      contribution: [
        "This isn't another chat interface. It's an interaction model for disagreement.",
        "Every claim the system makes shows its evidence, and every claim can be struck. Strike one and the machine's sentence doesn't vanish — your correction rises to lead, and the original stays underneath it, visibly withdrawn.",
        "The point was never perfect accuracy. It's giving people authorship over how software describes them.",
      ],
      turn:
        "The interesting part wasn't the model that wrote the story. It was the moment it stops being the author and becomes something you can overrule.",
      reflection: [
        "I set out to build something about generated memory. It turned into something about authorship.",
        "A system that can be corrected is a different kind of thing than one that's simply right. It assumes it might be wrong about you — and builds you a way to say so.",
      ],
    },
    contribution:
      "I made correction structural: a person can overrule a machine's interpretation without erasing the fact that the interpretation occurred.",
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
      "What does an invisible system owe us when attention leaves the interface?",
    oneLine:
      "A browser exhibition where a bounded restoration advances only while the visitor is away, then returns with an inspectable result, authority boundary, and work receipt.",
    status: "Complete v1.0 exhibition",
    year: "2026",
    context: "Self-directed research-through-design exhibition",
    ownership: "Independent · concept to production",
    role: "Interaction designer, writer, visual director, and engineer",
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
        "Every year, software asks less of us. We stopped typing commands, started pointing, then touching, then asking. Now it acts before we ask at all.",
        "That's usually called progress. But every time an interface asks less of you, it also shows you less. The work moves somewhere you can't watch, and you're meant to trust that it happened.",
        "I wanted to know what a system owes you when it works while you're not looking.",
      ],
      contribution: [
        "Most demonstrations of invisible work make you watch a progress bar. That's a contradiction — you're supervising the thing meant to free you from supervising.",
        "So I made absence the input. The task here only advances while the tab is hidden. Watch it and it stops. Leave, and it works. Come back, and it hands you a receipt: what it changed, what it left untouched, what it couldn't know, and how to throw the result away.",
        "Handing the work over isn't the interesting part. Coming back to it is.",
      ],
      turn:
        "What makes delegation feel safe isn't watching it happen. It's knowing you'll get the truth when you return.",
      reflection: [
        "I thought this was a project about automation. It turned into one about attention.",
        "The question was never whether a machine could do the work unwatched. It was whether it would tell you the truth about what it did.",
      ],
    },
    contribution:
      "I made absence an interaction event and paired invisible work with accountable return instead of continuous supervision.",
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
      "Can an interaction principle survive transfer across situations with different consequences and input models?",
    oneLine:
      "A rule-testing instrument that pushes one provisional principle through a familiar case, a high-risk case, and an accessibility case while preserving every revision.",
    status: "Working instrument · evidence audit open",
    year: "2026",
    context: "Self-directed research-through-design",
    ownership: "Independent · concept to production",
    role: "Researcher, interaction designer, editor, and engineer",
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
        "Design advice arrives as finished sentences. Don't use modals. Reduce the load. Make it obvious.",
        "Every one of those was true somewhere. None of them tell you where. The conditions that made a rule true get stripped off before it reaches you — you inherit the conclusion and lose the reasoning.",
        "I wanted to see what happens to a principle when you push it somewhere it was never meant to go.",
      ],
      contribution: [
        "Atlas isn't a library of answers. It's one rule and three cases that argue with it.",
        "You carry a principle into a familiar case, then a high-stakes one, then a case where the input model itself changes. Each time it holds, bends, or breaks — and every version stays on the record. What you end up with isn't a cleaner rule. It's the history of how that rule earned whatever authority it has left.",
        "A finished principle hides the pressure that shaped it. This one shows it.",
      ],
      turn:
        "A rule that survives the case it was written for proves nothing. A rule that survives a case it was never meant for is worth something.",
      reflection: [
        "I started out trying to write good guidance. I stopped believing the guidance was the useful part.",
        "The reasoning is the artifact. The finished sentence is just where it happened to stop.",
      ],
    },
    contribution:
      "I turned a design principle from finished advice into a revisable object with a visible pressure history.",
    disclosure:
      "AI assisted ideation, critique, source discovery, and code iteration. Final concept selection, scenario design, design decisions, editing, implementation, and authorship are Tanishk's.",
  },
  {
    id: "daynero",
    slug: "daynero",
    title: "Daynero",
    form: "AI-native financial product",
    thesis: "Money guidance works better when it responds to daily behavior, not just a monthly reset.",
    question:
      "How might financial guidance respond to daily behavior, goals, and changing context?",
    oneLine:
      "Daynero is a behavioral-finance app with an adaptive daily budget, goal-aware guidance, a real-time Meridian Score, and personalized spending insights.",
    status: "Commercial product · case study in preparation",
    availability: "preview",
    year: "2026",
    context: "Startup product work",
    ownership: "App and public website · commercial team context",
    role: "Product designer and builder across the app and public website",
    responsibilities: [
      "Designed the app's product experience",
      "Designed and built the public website",
      "Developed the interaction and visual systems across both surfaces",
      "Preparing the full case study with an explicit evidence boundary",
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
    relatedSlugs: ["pentimento", "atlas"],
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
      "Tanishk designed and built the app experience and public website; the detailed contribution record is being prepared.",
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
      "One commercial product and four independent investigations into what systems decide, explain, and let people change.",
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
    order: ["atlas", "design-or-disaster", "pentimento", "invisible-interfaces", "daynero"],
  },
  {
    id: "agency-authority",
    shortLabel: "Agency",
    label: "Agency & Authority",
    prompt:
      "What can a person contest, revise, delegate, or refuse, and who retains the final say?",
    order: ["pentimento", "invisible-interfaces", "daynero", "design-or-disaster", "atlas"],
  },
  {
    id: "memory-lineage",
    shortLabel: "Memory",
    label: "Memory & Lineage",
    prompt:
      "How can a system preserve change and context without turning history into clutter or authority?",
    order: ["daynero", "atlas", "pentimento", "invisible-interfaces", "design-or-disaster"],
  },
  {
    id: "visibility-accountability",
    shortLabel: "Visibility",
    label: "Visibility & Accountability",
    prompt:
      "What must a system reveal so its behavior can be understood, trusted, and challenged?",
    order: ["invisible-interfaces", "design-or-disaster", "daynero", "pentimento", "atlas"],
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
