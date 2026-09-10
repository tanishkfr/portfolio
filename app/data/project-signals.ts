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
    focus: "Two-person studio · public website",
    proof: "Live site with founders, process, services, and an enquiry form.",
    interaction: "I designed and built the client-facing site with Shreyas.",
    exposure: {
      surface: "The homepage introduces the studio and its services.",
      rule: "The site itself is the first example of our web work.",
      consequence: "A prospective client can understand the fit and send an enquiry.",
    },
  },
  daynero: {
    status: "Commercial product · case study soon",
    focus: "Personal finance · daily spending",
    proof: "Live public product surface; detailed case study in preparation.",
    interaction: "A daily amount explains what is safe to spend and why.",
    exposure: {
      surface: "The main number answers what is safe to spend today.",
      rule: "The amount responds to spending and goals.",
      consequence: "The person gets guidance for today's decision.",
    },
  },
  disaster: {
    status: "Live interactive archive",
    focus: "Criticism · spatial evidence",
    proof: "Ten cases, five authored jurors, and keyboard-accessible evidence placement.",
    interaction: "Mark the interface evidence before filing a judgment.",
    exposure: {
      surface: "The visitor starts with an interface screenshot.",
      rule: "A judgment needs a marked coordinate and an explanation.",
      consequence: "Five different readings stay visible without becoming a score.",
    },
  },
  pentimento: {
    status: "Live research prototype",
    focus: "AI authority · right of reply",
    proof: "Visible revisions, local archive processing, and a strike action.",
    interaction: "Accept, rewrite, or strike each machine-written claim.",
    exposure: {
      surface: "Software presents a draft story about a person.",
      rule: "The person can change every claim before the second draft.",
      consequence: "Their correction leads while the withdrawn claim stays visible.",
    },
  },
  invisible: {
    status: "Released interactive exhibition",
    focus: "Offscreen work · return receipt",
    proof: "A staged restoration, local attention ledger, and return receipt.",
    interaction: "The restoration advances only while the tab is hidden.",
    exposure: {
      surface: "The visitor sees a photograph that needs restoration.",
      rule: "Progress advances only while the page is hidden.",
      consequence: "Returning shows the result, its limits, and a discard action.",
    },
  },
  atlas: {
    status: "Live reasoning instrument",
    focus: "Rule testing · revision history",
    proof: "Rule stress traces with hold, refine, and fracture outcomes.",
    interaction: "Edit one rule as it moves through three unlike cases.",
    exposure: {
      surface: "The visitor starts with an editable design rule.",
      rule: "Each case asks whether the rule holds, needs refinement, or fractures.",
      consequence: "The final rule keeps the case and wording behind every change.",
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
