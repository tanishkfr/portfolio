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
  year: string;
  context: string;
  ownership: string;
  role: string;
  responsibilities: string[];
  tools: string[];
  scale: string;
  liveUrl: string;
  sourceUrl: string;
  accent: string;
  artifact: "remainder" | "disaster" | "pentimento" | "invisible" | "atlas";
  lensRelations: Record<InterpretiveLens, string>;
  relatedSlugs: string[];
  chapterTitles: {
    context: string;
    pivot: string;
    interaction: string;
    system: string;
    proof: string;
  };
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
    accent: "#d6523c",
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
    accent: "#a93228",
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
    relatedSlugs: ["atlas", "remainder"],
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
    accent: "#39766f",
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
    contribution:
      "I turned a design principle from finished advice into a revisable object with a visible pressure history.",
    disclosure:
      "AI assisted ideation, critique, source discovery, and code iteration. Final concept selection, scenario design, design decisions, editing, implementation, and authorship are Tanishk's.",
  },
  {
    id: "remainder",
    slug: "remainder",
    legacySlugs: ["command-center"],
    title: "Remainder",
    form: "Creative memory system",
    thesis: "Model confidence may propose a memory. Only human judgment can commit one.",
    question:
      "How can creative work keep the consequences of conversation without letting AI decide what becomes memory?",
    oneLine:
      "A local-first workspace where conversations produce traceable memory candidates that stay inert until the maker dismisses them, keeps them alongside context, or explicitly changes direction.",
    status: "Working personal product · study pending",
    year: "2026",
    context: "Self-directed product and systems investigation",
    ownership: "Independent · concept to production",
    role: "Product architect, interaction designer, systems designer, and engineer",
    responsibilities: [
      "Defined the product thesis and creative-memory domain model",
      "Designed the conversation-to-memory review handoff",
      "Built the UI, API, storage, search, export, and MCP surfaces",
      "Authored the verification and participant-research protocols",
    ],
    tools: ["React", "TypeScript", "Express", "Vite", "Vercel Blob", "MCP"],
    scale: "1 trust model across UI, API, storage, search, export, and MCP",
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
        "Turns fragmented conversation into durable project memory with retrievable provenance and change history.",
      "visibility-accountability":
        "Makes what the system remembers, where it came from, and what it replaced inspectable to the maker.",
    },
    relatedSlugs: ["atlas", "pentimento"],
    chapterTitles: {
      context: "A transcript remembers sequence. A project needs consequences.",
      pivot: "I deleted the dashboard and made conversation the product.",
      interaction: "Capture is a review—not a save animation.",
      system: "The same trust model reaches every surface.",
      proof: "The system works; the product hypothesis is still open.",
    },
    problem: {
      title: "Creative work now happens through conversation, but the reasoning that changes direction stays buried inside it.",
      paragraphs: [
        "A transcript preserves sequence. Generic notes preserve fragments. Automatic summaries preserve whatever the model considered important. None of them reliably preserve what the maker reviewed and decided should continue shaping the project.",
        "Remainder tests a sharper proposition: project memory should contain the reviewed consequences of conversation, with enough provenance to challenge, reverse, or reinterpret them later.",
      ],
    },
    pivot: {
      title: "Activity visibility gave way to continuity and judgment.",
      before:
        "The first implementation was a Command Center of project cards, inboxes, metrics, and dashboard modules. It made activity visible but did not help a project remember why its direction had changed.",
      realization:
        "The durable object was not the dashboard or the model. It was the project—and the reviewed reasoning that should survive both sessions and providers.",
      after:
        "I removed the old runtime, made conversation the primary surface, and inserted a deliberate boundary between extraction and memory: conversation creates candidates; human judgment decides what becomes context; history preserves what changed.",
    },
    rejectedPaths: [
      {
        title: "Keep every summary",
        reason: "Automatic acceptance would let model confidence silently steer later work.",
      },
      {
        title: "Overwrite conflict",
        reason: "Replacing old direction would destroy the evidence needed to understand or reverse a change.",
      },
      {
        title: "Make AI the product persona",
        reason: "The project must remain usable when a provider fails, changes, or disappears.",
      },
    ],
    interactionIntro:
      "Capture stages a handoff from conversation to reviewed project memory. Nothing enters active context because a model sounded certain or because the user clicked a celebratory save button.",
    interactionSteps: [
      "Continue a conversation inside a durable project rather than a disposable chat session.",
      "Capture when something changes the work. Extracted items appear as pending candidates and remain outside active context.",
      "Dismiss a candidate, keep it alongside current memory, or use it to explicitly change direction.",
      "When direction changes, inspect the source messages, current memory, earlier direction, and successor relationship.",
      "Recover the reasoning later through project memory, history, grouped search, export, or authenticated MCP access.",
      "Undo review, deletion, or supersession decisions and restore the earlier state without losing provenance.",
    ],
    systemLayers: [
      {
        label: "Propose",
        title: "Conversation creates candidates",
        body: "The extractor can identify decisions, constraints, questions, and insights, but every item remains pending and inert.",
      },
      {
        label: "Judge",
        title: "A person decides what remains",
        body: "Dismiss, keep alongside, and change direction have different domain consequences. Confidence never substitutes for consent.",
      },
      {
        label: "Remember",
        title: "Context keeps its lineage",
        body: "Accepted memory can steer later conversation; superseded memory becomes resolved history and can be restored through undo or successor removal.",
      },
    ],
    decisions: [
      {
        title: "Confidence is not consent",
        choice: "Exclude pending and resolved items from active AI context.",
        consequence: "No extracted candidate can silently influence a later response before review.",
      },
      {
        title: "Change without erasure",
        choice: "Model supersession as a reversible relationship instead of replacement.",
        consequence: "Earlier direction remains inspectable and returns when the successor is removed or the decision is undone.",
      },
      {
        title: "The project outlives the model",
        choice: "Provide deterministic local collaboration and extraction fallbacks.",
        consequence: "Core conversation and memory workflows remain usable without an AI key or provider availability.",
      },
      {
        title: "One trust model everywhere",
        choice: "Share the same domain semantics across UI, REST, storage, search, export, history, and MCP.",
        consequence: "A memory cannot mean one thing on screen and something looser in another interface.",
      },
    ],
    demonstrated: [
      "Complete project, conversation, capture, review, memory, lineage, search, import, export, reset, delete, restore, and undo workflows.",
      "Message-level provenance plus explicit, constrained, and reversible supersession.",
      "Atomic local writes, conditional private Blob replacement, fallback AI, migrations, and authenticated MCP mutations.",
      "Type checks, tests, production bundles, and isolated smoke tests covering interaction and domain invariants.",
    ],
    limits: [
      "The implementation demonstrates its trust model but does not prove that reviewed memory improves creative outcomes.",
      "No participant quote, usability metric, or desirability claim exists because the written study has not been run.",
      "The deployed model is private and personal; public multi-user use would require authentication and authorization.",
    ],
    nextTest: {
      title: "Run the two-session study with 8–12 creative practitioners.",
      body:
        "Participants will use a real project across a week, return after at least 48 hours, recover a decision and rationale, explain changed direction from lineage, and compare the experience with their existing notes.",
      success:
        "If more than 2 of 10 people mistake supersession for deletion, redesign lineage. If fewer than 70% recover rationale unaided, redesign provenance. If review costs more than it returns, reduce extraction volume.",
    },
    contribution:
      "I designed and implemented one trust model where conversation proposes, judgment commits, and project memory preserves the consequences with provenance.",
    disclosure:
      "AI assisted ideation, critique, source discovery, and code iteration. Final product architecture, concept selection, domain model, interaction decisions, editing, implementation, and authorship are Tanishk's.",
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
