# Pentimento — right-of-reply study protocol

Status: internal research preparation. Not part of the public case.

## Evidence boundary

Everything in the "synthetic stress test" section is **synthetic**. Synthetic
scenarios are written adversarially by the researcher to break the protocol.
They are **not** participants, **not** user research, **not** observed
behaviour, and **not** findings about people. They may only be used to expose
ambiguous wording, leading prompts, and gaps in the method.

The public case must keep saying that human participant evidence does not
exist yet. `docs/content-model.md` already forbids participant quotes,
outcomes, or research findings in the data.

## Research question

**Primary**

When a system writes an interpretive claim about someone from their own
archive, can that person understand and exercise a reply — let it stand, read
it differently, strike it, or decline to reply — that visibly changes the
document, and what does each reply mean to them?

**Secondary**

- Does "strike" read as *rejecting a meaning* or as *deleting a record*?
- Does keeping the machine's original reading support accountability, or
  contradict an expectation that correction removes it?
- Does supplying replacement wording feel optional, or like an obligation to
  repair the system's sentence?
- Does the machine reading carry more authority than the person's correction —
  in order, type size, weight, and permanence?
- Does declining to reply feel possible, and does the record distinguish it
  from assent?
- When the participant returns to the settled page, does it still read as
  theirs?

**What this study cannot establish**

- That Pentimento is trustworthy in general.
- Recognition, trust, or cultural-validity rates.
- Behaviour beyond the session.
- Whether the design generalises past Letterboxd users or past this interface.
- That correction reduces real-world harm.

An exploratory study of 8 can describe comprehension and meaning. It cannot
measure validity. The case copy must not imply otherwise.

## Current protocol (reconstructed)

1. Participant loads their own Letterboxd CSV locally; nothing is uploaded.
2. Computed chapters and claims appear, each with inspectable evidence
   (dates, titles, patterns, absences, ratios).
3. Participant opens a claim's evidence.
4. Participant replies: let it stand / read it differently / strike it, or
   declines to reply.
5. If they reframe or strike, they may supply replacement wording; it is not
   required.
6. The second draft renders: the machine underpainting recedes, the correction
   leads.
7. Participant reviews the second draft and may revise any reply.
8. The draft settles only after every claim has received a reply.
9. Participant chooses what to share (session record / print; the raw archive
   is never exported).
10. Think-aloud throughout; the researcher asks follow-ups.

The portfolio artifact demonstrates steps 2–6 in miniature. The real study must
run on the product, which also carries refusal, revise, and undo.

## Synthetic stress test

Twelve written adversarial scenarios, run against the protocol above. Each is a
test of the method, not a claim about people.

| # | Scenario | Action | Protocol pressure | Change needed |
|---|---|---|---|---|
| 01 | Agrees with the inference | Stand | Does "stand" separate agreement from non-engagement? | Yes — ask what stand meant |
| 02 | Disagrees strongly | Strike | Strike semantics: reject meaning vs delete record | Yes — check retention expectation |
| 03 | Agrees, dislikes the wording | Reframe | Is there a path for "right meaning, wrong words"? | Yes — separate wording from reading |
| 04 | Accepts wording, disputes evidence | Reframe / Stand | Evidence is read-only and "unchanged" | Yes — record evidence disputes separately |
| 05 | Misreads Reframe as the system acting | Reframe | "Read it differently" has unclear agency | Yes — comprehension check |
| 06 | Reads Strike as deletion | Strike | Retention disclosed after, not before | Yes — disclose before the choice |
| 07 | Wants the original erased | Strike, seeks delete | Erasure is a legitimate expectation, not a failure | Yes — ask before showing retention |
| 08 | Declines to reply | Refuse | Flow requires a reply per claim | Yes — refusal must be first-class |
| 09 | Defers to the machine | Stand everywhere | Machine leads, same size, evidence optional | Yes — record evidence inspection |
| 10 | Thinks correction means proving the AI wrong | Hesitates / abandons | Reply read as burden of proof | Yes — state no justification needed |
| 11 | Retypes a trait claim as a situational one | Reframe + replacement | Grammar has no paraphrase/reclassification distinction | Yes — record the kind of change |
| 12 | Worries the original stays visible | Strike, re-inspects | "Withdrawn" is a design term, not the participant's | Yes — post-choice comprehension check |

### What the stress test exposed

1. **Retention is disclosed after the choice, not before.** The label says
   "Strike it"; the consequence — the machine sentence stays visible — is
   explained in surrounding copy. A participant who reads strike as deletion
   will experience the result as a failure of their correction.
2. **"Read it differently" has unclear scope and agency.** It could mean
   revise wording, add context, soften certainty, change the category, or
   dispute evidence. The portfolio artifact also keeps the "System reading"
   label after reframe, which reads as the system re-reading rather than the
   person authoring.
3. **Refusal may be blocked.** "Settle the second draft only after every claim
   has received a reply" can convert refusal into forced assent if refusal is
   not a recorded, non-blocking state.
4. **"Let it stand" conflates assent with disengagement.** A stand may mean
   "correct", "close enough", or "I don't want to engage". The record cannot
   tell them apart.
5. **Evidence disputes have no home.** The evidence layer is presented as
   factual; a participant who disputes the data (an incomplete export, a
   mis-set date range) can only reframe the reading.
6. **The machine keeps the largest, first, most permanent sentence.** Even
   withdrawn, it stays at full size and comes first in reading order. The
   person's correction is italic, which can read as subordinate.
7. **The public case's framing is leading.** "Why the archive's interpretation
   failed" presumes failure; "recognition, trust, or cultural-validity result"
   overstates what an exploratory study can establish.
8. **Replacement wording may feel obligatory.** Nothing at the point of choice
   says the participant may refuse without supplying a better sentence.

## Failure modes, ranked

**CRITICAL**

- Strike retention is not stated before the choice.
- Refusal is not guaranteed to be a distinct, non-blocking state.

**HIGH**

- Reframe's agency and scope are ambiguous (system vs person; wording vs
  reading vs evidence vs category).
- Evidence cannot be contested, only the reading.
- "Let it stand" does not distinguish agreement from non-engagement.
- The withdrawn machine sentence remains the visually dominant text.

**MEDIUM**

- Replacement wording is not explicitly optional at the point of choice.
- The public study framing is leading and over-scoped.

**LOW**

- "Example correction" labelling is right for a demo but must not appear in
  the study instrument.
- Italic for the person's voice may read as subordinate; test, do not pre-fix.

## Revised real-participant protocol

Sample: **8 participants** (the public case states 8–12; 8 is the working
target, 12 the ceiling). One session each, 30–40 minutes, remote or in person.
Own archive preferred; the fictional demo edition as fallback.

**Introduction (neutral)**

"You are going to look at a page that software has written about your own film
history. It makes claims from patterns in the data. Nothing you load leaves
your machine. You can respond to any claim, or not. There are no right
answers, and you do not have to justify anything. I'm interested in what the
choices mean to you, not whether you agree with the software."

**Task**

1. Load your archive (or the demo edition).
2. Read the claims. Open the evidence for at least one claim.
3. For each claim, respond however you want — including declining.
4. Review the second draft and change anything you want.
5. Settle the draft, then look at what was recorded.

**Neutral prompts (verbatim, in order)**

- "Tell me what you're looking at."
- "What is this claim saying, in your words?"
- "What did you expect that choice to do?"
- "What actually happened?"
- "Where is the software's original sentence now?"
- "Is that what you expected? What would you have expected?"
- "What, if anything, would you change about this?"
- "How does the settled page read to you?"

Never ask: why the AI was wrong, whether you trust it, whether it was useful,
or whether it harmed you. Those assume the answer.

**Observation fields (recorded without interpretation)**

- Which claims were opened, and how long each stayed open.
- Whether evidence was inspected before or after replying.
- Time to first reply; hesitation; reversing a reply.
- Whether the participant read the surrounding copy before choosing.
- Which path was taken per claim (stand / reframe / strike / refuse).
- Whether replacement wording was supplied, and whether it was prompted.
- Whether the participant tried to erase, hide, or re-open the original.
- Exact interface state after settling.

**Follow-up questions (after acting)**

- "What did that choice do, in your words?"
- "Who wrote the sentence that now leads?"
- "If you wanted this gone entirely, what would you expect to happen?"
- "Was there anything you wanted to say that the choices did not let you say?"

**Debrief (must cover)**

- Retention: the machine's sentence is kept as a visible underpainting so the
  system cannot quietly rewrite what it claimed. Ask whether they accept that
  rationale, and record the answer.
- Ownership: the correction leads, but the record keeps both voices.
- Authority: the page is designed so the person outranks the system. Ask if it
  read that way.
- AI: claims are computed locally from their own export; no model is called.

**Deferred check (optional, low cost)**

Three to seven days later, ask one question by message: "Looking at the settled
page again, does it still read as yours?" Record the answer verbatim.

**Evidence classification (kept separate in every record)**

- OBSERVED ACTION — what happened in the interface.
- PARTICIPANT EXPLANATION — what they said it meant.
- RESEARCHER INTERPRETATION — what the researcher thinks it means, marked as
  interpretation and never merged with the other two.

## Evidence template

One record per participant. No record may be written from memory alone; use the
session capture.

```
PARTICIPANT ID       P01
SESSION DATE         YYYY-MM-DD
ARCHIVE MODE         own Letterboxd CSV (local) | fictional demo edition
ORIGINAL INFERENCE   [exact sentence shown]
EVIDENCE SHOWN       [exact evidence rows shown]
ACTION               stand | reframe | strike | refuse | no reply
REPLACEMENT          [exact wording, only if supplied; otherwise "none"]
OBSERVED ACTION      [neutral description: evidence opened? hesitated? revised?]
PARTICIPANT WORDS    [their explanation, transcribed as closely as possible]
ARCHIVE STATE        [what the second draft and session record show afterwards]
DEBRIEF ANSWERS      retention: [ ] ownership: [ ] authority: [ ]
DEFERRED CHECK       [optional; answer verbatim]
RESEARCHER NOTE      [interpretation, explicitly marked as interpretation]
```

Aggregate reporting may state counts of observed actions and themes in
participant explanations. It may not state trust, recognition, or
cultural-validity results, and it may not present researcher interpretation as
participant evidence.

## Remaining human work

- Recruit and run 8 participants. Nothing in this document substitutes for
  that.
- Code observed actions and participant explanations separately.
- Decide, from real sessions, whether strike retention and refusal are
  acceptable or need to change.
- Do not publish any result until records exist in the template above.
