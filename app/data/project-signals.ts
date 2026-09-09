import type { Project } from "./portfolio";

export type ExposurePhase = "surface" | "rule" | "consequence";

export type ProjectSignal = {
  status: string;
  focus: string;
  proof: string;
  interaction: string;
  exposure: Record<ExposurePhase, string>;
};

export const projectSignals: Record<Project["artifact"], ProjectSignal> = {
  fluxion: {
    status: "Live studio site",
    focus: "Studio · client-facing web",
    proof: "Public studio website designed and built in-house.",
    interaction: "A commercial site with process, founders, and a working enquiry form.",
    exposure: {
      surface: "A studio homepage appears to be only a pitch.",
      rule: "The site has to demonstrate the craft it is selling.",
      consequence: "An enquiry can start without a sales deck sitting behind it.",
    },
  },
  daynero: {
    status: "Commercial product · case study soon",
    focus: "Adaptive finance · daily behavior",
    proof: "Live public product surface; detailed case study in preparation.",
    interaction: "Daily guidance adapts to behavior, goals, and spending patterns.",
    exposure: {
      surface: "A daily money companion, not a monthly spreadsheet.",
      rule: "Guidance adjusts to behavior and goals as the day changes.",
      consequence: "Money decisions become immediate, personal, and easier to act on.",
    },
  },
  disaster: {
    status: "Live interactive archive",
    focus: "Criticism · spatial evidence",
    proof: "Ten cases, five juror models, and keyboard-accessible evidence placement.",
    interaction: "Every judgment must point to the exact interface evidence that produced it.",
    exposure: {
      surface: "A verdict appears to be the final object.",
      rule: "Judgment must identify its evidence before comparison begins.",
      consequence: "Five incompatible readings can disagree without becoming a score.",
    },
  },
  pentimento: {
    status: "Live research prototype",
    focus: "AI authority · right of reply",
    proof: "Visible revision, a private local archive, and refusal as a valid output.",
    interaction: "The subject can replace a machine interpretation without erasing its history.",
    exposure: {
      surface: "A machine-written life appears settled.",
      rule: "The person represented owns the final account.",
      consequence: "Human correction leads while the withdrawn claim remains visible.",
    },
  },
  invisible: {
    status: "Released interactive exhibition",
    focus: "Delegation · accountable return",
    proof: "Delegated restoration, a local attention ledger, and a bounded receipt.",
    interaction: "The system works only while the visitor is absent, then accounts for the result.",
    exposure: {
      surface: "Delegated work appears to require watching.",
      rule: "Progress advances only while attention is elsewhere.",
      consequence: "Returning produces a receipt, a boundary, and a way to discard the result.",
    },
  },
  atlas: {
    status: "Live reasoning instrument",
    focus: "Reasoning · visible lineage",
    proof: "Rule stress traces with hold, refine, and fracture outcomes.",
    interaction: "A provisional principle travels through distant cases and keeps every revision.",
    exposure: {
      surface: "A design principle appears to be finished advice.",
      rule: "A rule earns authority only by surviving transfer.",
      consequence: "Every hold, refinement, and fracture remains in the reasoning lineage.",
    },
  },
};

export const flagshipOrder = [
  "fluxion-studios",
  "design-or-disaster",
  "pentimento",
  "invisible-interfaces",
  "atlas",
  "daynero",
] as const;
