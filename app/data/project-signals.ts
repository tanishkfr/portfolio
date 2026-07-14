import type { Project } from "./portfolio";

export type ProjectSignal = {
  status: string;
  focus: string;
  proof: string;
  interaction: string;
};

export const projectSignals: Record<Project["artifact"], ProjectSignal> = {
  remainder: {
    status: "Live personal product",
    focus: "Product architecture · trust boundaries",
    proof: "Reviewed memory candidates, retained lineage, and local-first storage.",
    interaction:
      "A proposed memory does not become project truth until a person reviews it.",
  },
  disaster: {
    status: "Live interactive archive",
    focus: "Criticism · spatial evidence",
    proof: "Ten cases, five juror models, and keyboard-accessible evidence placement.",
    interaction:
      "Every judgment must point to the exact interface evidence that produced it.",
  },
  pentimento: {
    status: "Live research prototype",
    focus: "AI authority · right of reply",
    proof: "Visible revision, a private local archive, and refusal as a valid output.",
    interaction:
      "The subject can replace a machine interpretation without erasing its history.",
  },
  invisible: {
    status: "Released interactive exhibition",
    focus: "Delegation · accountable return",
    proof: "Delegated restoration, a local attention ledger, and a bounded receipt.",
    interaction:
      "The system works only while the visitor is absent, then accounts for the result.",
  },
  atlas: {
    status: "Live reasoning instrument",
    focus: "Reasoning · visible lineage",
    proof: "Rule stress traces with hold, refine, and fracture outcomes.",
    interaction:
      "A provisional principle travels through distant cases and keeps every revision.",
  },
};

export const flagshipOrder = [
  "remainder",
  "invisible-interfaces",
  "design-or-disaster",
  "pentimento",
  "atlas",
] as const;
