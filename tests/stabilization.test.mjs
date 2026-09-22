import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

/**
 * Stabilization regressions.
 *
 * Every assertion here protects a defect that was reproduced and fixed in
 * the stabilization pass, or an invariant the fix depends on. They are
 * deliberately coarse: they assert the shape of the contract (no mask over
 * text, no un-clamped column floor, no unpaused recording) rather than
 * exact values, so a later pass can change the design without having to
 * rewrite the test.
 */

async function render(path = "/", accept = "text/html") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}-${path}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`https://portfolio.test${path}`, {
      headers: { accept, "x-forwarded-host": "portfolio.test", "x-forwarded-proto": "https" },
    }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

const read = (rel) => readFile(new URL(`../${rel}`, import.meta.url), "utf8");

/** Every rule body whose selector mentions `needle`, as a list of blocks. */
function blocks(css, needle) {
  const out = [];
  const re = /([^{}]+)\{([^{}]*)\}/g;
  let m;
  while ((m = re.exec(css))) {
    if (m[1].includes(needle)) out.push({ selector: m[1].trim(), body: m[2] });
  }
  return out;
}

test("reveal states never mask or hide essential text with a clip", async () => {
  const system = await read("app/styles/system.css");

  /* The reveal vocabulary is opacity and offset only. A directional
     clip-path wipe over a heading is what produced "missing first
     letters" and half-titles in an earlier pass; it must not come back. */
  for (const block of blocks(system, "[data-reveal]")) {
    const clip = block.body.match(/clip-path:\s*([^;]+);/);
    if (clip) {
      assert.match(
        clip[1].trim(),
        /^none(\s*!important)?$/,
        `[data-reveal] may only ever reset a mask, not set one (${block.selector})`,
      );
    }
  }

  const hidden = blocks(system, "[data-reveal]").filter((b) =>
    /opacity:\s*0\s*;/.test(b.body),
  );
  assert.ok(hidden.length > 0, "the unrevealed state still exists");
  for (const block of hidden) {
    assert.doesNotMatch(
      block.body,
      /visibility:\s*hidden/,
      "unrevealed content stays in the accessibility tree",
    );
  }
});

test("case arrival cues are arrivals, not masks over the artefact", async () => {
  const caseCss = await read("app/styles/case.css");
  const keyframes = [...caseCss.matchAll(/@keyframes\s+([\w-]+)\s*\{([\s\S]*?)\n\}/g)];
  const arrivals = keyframes.filter((k) => k[1].endsWith("-arrive"));
  assert.ok(arrivals.length >= 4, "the per-project arrival cues still exist");
  for (const [, name, body] of arrivals) {
    assert.doesNotMatch(
      body,
      /clip-path/,
      `${name} must not clip; the hero artefact carries its own label bar and evidence caption`,
    );
  }
});

test("project-sheet column floors are clamped against the space the tracks share", async () => {
  const explore = await read("app/styles/explore.css");

  /* A rem floor is a promise the space may not be able to keep once text
     is enlarged. At 200% text 13rem + 28rem is 1056px of floor before any
     gutter or gap, and at 1024px that pushed the sheet's own status line
     37px past its clip. Both floors must therefore be capped, and the cap
     must be a share of the box the tracks actually live in — a viewport
     unit is not, because the sheet's left padding is itself
     `--page-gutter + 3.5rem` and both terms grow with the text.

     Asserted per rule rather than per property: the pair is defined twice
     (the base sheet and the narrower split), and a check that keyed by
     property name would only ever see the last definition. The floors must
     leave room for the column gap between them, so each pair has to sum to
     well under one container width — a share that leaves a little over a
     tenth of the box for the gap. */
  /* Match the declaration, not a `var(--piece-copy-floor)` reference in a
     layout rule, so each block found here is one that actually defines the
     pair. */
  const declared = [...explore.matchAll(/\{([^{}]*--piece-copy-floor:[^{}]*)\}/g)].map(([, body]) => body);
  assert.ok(declared.length >= 2, "both sheet rules define their floors");

  for (const body of declared) {
    const pair = {};
    for (const [, which, value] of body.matchAll(/--piece-(copy|stage)-floor:\s*min\(([^;]+)\);/g)) {
      const [, rem, cap, unit] = value.match(/([\d.]+)rem,\s*([\d.]+)(%|vw|vi|cqi)/) || [];
      assert.ok(rem, `the ${which} floor clamps a rem value: ${value}`);
      assert.ok(cap, `the ${which} floor has a cap: ${value}`);
      assert.equal(
        unit,
        "%",
        `the ${which} floor must be capped against its own container, not the viewport: ${value}`,
      );
      pair[which] = Number(cap);
    }
    assert.ok(
      pair.copy !== undefined && pair.stage !== undefined,
      "a rule that caps one floor caps both, in the same block",
    );
    const sum = pair.copy + pair.stage;
    assert.ok(
      sum <= 90,
      `each rule's floors leave room for the column gap (this rule: ${pair.copy}% + ${pair.stage}% = ${sum}%)`,
    );
  }

  const layouts = [...explore.matchAll(/\.xp-piece(?:\[data-layout="[a-z-]+"\])?\s*\{[^}]*grid-template-columns:\s*([^;]+);/g)];
  assert.ok(layouts.length >= 6, "every sheet layout is covered");
  for (const [, value] of layouts) {
    assert.match(
      value,
      /var\(--piece-(copy|stage)-floor\)|minmax\(0, 1fr\)|1fr/,
      `a sheet layout still uses a bare track: ${value.replace(/\s+/g, " ")}`,
    );
    assert.doesNotMatch(
      value,
      /minmax\(\s*[\d.]+rem/,
      `a sheet layout still floors a track in unclamped rem: ${value.replace(/\s+/g, " ")}`,
    );
  }
});

test("no single-column grid track keeps an automatic minimum", async () => {
  /* `grid-template-columns: 1fr` floors the track at its content's
     min-content width, which is how an unbreakable address or a display
     word leaves the column and lands outside the body clip. Every
     collapsed single-column arrangement uses minmax(0, 1fr) instead. */
  for (const sheet of ["system.css", "explore.css", "case.css", "pages.css"]) {
    const css = await read(`app/styles/${sheet}`);
    assert.doesNotMatch(
      css,
      /grid-template-columns:\s*1fr;/,
      `${sheet} still has an unclamped single-column track`,
    );
  }
});

test("reduced motion keeps the folio readable and unpinned", async () => {
  const explore = await read("app/styles/explore.css");
  const reduced = [...explore.matchAll(/@media\s*\(prefers-reduced-motion:\s*reduce\)\s*\{([\s\S]*?)\n\}/g)]
    .map((m) => m[1])
    .join("\n");
  assert.ok(reduced.length > 0, "the folio honours reduced motion");
  assert.match(reduced, /position:\s*relative/, "the pinned sheets return to flow");
  assert.match(reduced, /min-height:,\s*|min-height:/, "the sheets keep a readable height");
  assert.match(reduced, /animation:\s*none/, "decorative animation is switched off");

  const system = await read("app/styles/system.css");
  assert.match(
    system,
    /\[data-motion="reduced"\][\s\S]{0,200}opacity:\s*1\s*!important/,
    "revealed content is forced visible under reduced motion",
  );
});

test("portrait previews keep their media lifecycle contract", async () => {
  const portrait = await read("app/components/portrait.tsx");

  /* Playing is gated on the frame being visible, the sheet being read,
     the tab being visible and motion being allowed. */
  assert.match(portrait, /visible\s*&&\s*!document\.hidden\s*&&\s*!reduced/);
  assert.match(portrait, /video\.pause\(\)/);
  assert.match(portrait, /document\.addEventListener\("visibilitychange"/);

  /* The tap is a toggle: a tap also focuses a focusable frame, so the
     focus route is gated on :focus-visible or the closing tap re-opens. */
  assert.match(portrait, /matches\(":focus-visible"\)/);

  /* The frame is focusable and its state is its interaction, so it carries
     a name; Chromium computes none for role="figure" from a caption. */
  assert.match(portrait, /role="group"/);
  assert.match(portrait, /aria-label=\{meta\.tag\}/);

  /* No crop: every real asset is framed with object-fit: contain. */
  const fits = [...portrait.matchAll(/fit:\s*"(cover|contain)"/g)].map((m) => m[1]);
  assert.ok(fits.length >= 5, "all portrait media declare a fit");
  assert.deepEqual([...new Set(fits)], ["contain"], "no real project asset is cropped");
});

test("every published sheet states its own evidence boundary", async () => {
  const slugs = [
    ["fluxion-studios", /Fluxion Studios/],
    ["athena", /illustrative scenario, not a participant quotation/],
    ["daynero", /remains pre-MVP/],
    ["invisible-interfaces", /staged browser exhibition, not an autonomous restoration system/],
    ["design-or-disaster", /authored|juror/i],
    ["pentimento", /Pentimento/],
    ["atlas", /Atlas/],
  ];

  for (const [slug, evidence] of slugs) {
    const response = await render(`/work/${slug}`);
    assert.equal(response.status, 200, `/work/${slug} renders`);
    const html = await response.text();
    assert.match(html, evidence, `/work/${slug} keeps its evidence statement`);
    /* each sheet is operable: a heading, a summary, and at least one route out */
    assert.match(html, /<h1[^>]*>/, `/work/${slug} has a level-one heading`);
    assert.match(
      html,
      /class="(case-actions|daynero-actions)"/,
      `/work/${slug} offers its actions`,
    );
    assert.match(html, /href="\/contact"/, `/work/${slug} keeps a route back to contact`);
  }
});

test("the folio's five sheets each keep a caption, a state, and two actions", async () => {
  const html = await (await render()).text();
  const sheets = html.split("data-explore-piece").slice(1);
  assert.equal(sheets.length, 5, "five sheets render");
  for (const sheet of sheets) {
    assert.match(sheet, /class="xpp-caption"/, "the portrait states what the evidence is");
    assert.match(sheet, /class="xpp-rack"/, "the frame states which state it is in");
    assert.match(sheet, /data-fit="contain"/, "the real artefact is not cropped");
    assert.match(sheet, /class="xp-piece-status"/, "the sheet states its own record");
    const actions = sheet.slice(0, sheet.indexOf("class=\"xp-piece-status\""));
    assert.ok(
      (actions.match(/<a\b/g) ?? []).length >= 2,
      "the sheet offers its reading and its external route",
    );
  }
});

test("the nested reading stacks can shrink below their content", async () => {
  /* Reproduced at 320px with 200% text: fifty-one text runs left their
     column and were cut by the sheet's clip. The sections had been given
     an explicit `minmax(0, 1fr)` column in an earlier pass; the stacks
     inside them had not, so each still carried an implicit `auto` track
     with a min-content floor — a paragraph in Design or Disaster, every
     `dd` in Fluxion's and Athena's briefs, Atlas's trace rows and the
     index's record column. Every one of these is a single-column stack,
     so naming the column cannot change the layout at any size; it only
     removes the floor. */
  const caseCss = await read("app/styles/case.css");
  const stacks = [
    ".story-prose",
    ".reason-block",
    ".reason-decision",
    ".reason-rejected",
    ".relation-primary",
    ".disaster-evidence",
    ".case-brief > div",
    ".fluxion-demo",
    ".atlas-editor",
    ".record-boundary ul",
  ];
  for (const sel of stacks) {
    const declared = [...caseCss.matchAll(new RegExp(`\\${sel.replace(/ /g, "\\s+")}\\s*[,{]`, "g"))];
    assert.ok(declared.length, `${sel} is styled`);
  }
  /* The group's own block, bounded at its closing brace. A match that was
     allowed to run on to the next `minmax(0, 1fr)` elsewhere in the file
     would pass even with this declaration removed, because the selector
     names would still appear in the span. */
  const block = caseCss.match(/^\.story-prose,[\s\S]*?\n\}/m);
  assert.ok(block, "the nested stacks are declared as one group");
  for (const sel of stacks) {
    assert.ok(block[0].includes(sel), `${sel} is in the shrinkable-column group`);
  }
  assert.match(
    block[0],
    /grid-template-columns:\s*minmax\(0, 1fr\)/,
    "the group declares a shrinkable single column rather than inheriting an auto track",
  );

  /* The calls to action are a flex row of a label, an arrow and a hint,
     and a flex item of the actions row — both nowrap by default. Measured
     344px wide inside a 240px column at 320px with 200% text, which put
     64px of the primary button past the clip. They must be able to
     shrink and to wrap their own parts. */
  const cta = caseCss.match(/\.case-actions a,[\s\S]*?\{([^}]*)\}/);
  assert.ok(cta, "the sheet calls to action are grouped");
  assert.match(cta[1], /min-width:\s*0/, "a call to action may shrink below its content");
  assert.match(cta[1], /flex-wrap:\s*wrap/, "a call to action may wrap its own label, arrow and hint");
});

test("the route plate cannot flash, stick, or take a click", async () => {
  /* The page-change plate. It is the one overlay that can appear over any
     route, so the things worth protecting are the ones that would make it
     a defect rather than a state: it must not draw for a navigation that
     is already over, it must not survive the route it was waiting for, and
     it must never intercept a click meant for the page. */
  const src = await read("app/components/route-loader.tsx");
  const css = await read("app/styles/system.css");

  /* idle renders nothing, so an ordinary page has no overlay in the DOM */
  assert.match(src, /if \(phase === "idle"\) return null;/, "the plate is absent unless it is loading");

  /* a threshold, so a fast navigation cannot produce a one-frame flash.
     Warm navigations here measure 18–102ms, so the threshold sits inside
     that band: it catches the changes a reader feels and leaves alone the
     ones they do not. It must stay well above a frame. */
  const showAfter = src.match(/const SHOW_AFTER = (\d+);/);
  assert.ok(showAfter, "the plate has a show threshold");
  assert.ok(
    Number(showAfter[1]) >= 80 && Number(showAfter[1]) <= 200,
    `the threshold sits between a frame and a pause (${showAfter[1]}ms)`,
  );
  const minVisible = src.match(/const MIN_VISIBLE = (\d+);/);
  assert.ok(minVisible, "the plate has a minimum visible time");
  assert.ok(
    Number(minVisible[1]) >= 200 && Number(minVisible[1]) <= 400,
    `it cannot strobe once drawn, and does not outstay the wait (${minVisible[1]}ms)`,
  );

  /* it stands down while a shared-element transition is animating */
  assert.match(src, /viewTransitionRunning\(\)/, "the plate defers to a running view transition");
  assert.match(src, /::view-transition/, "and asks the document what is animating");

  /* the route landing is what ends it — the same effect clears the timer
     that would have drawn it */
  assert.match(src, /useEffect\(\(\) => \{\s*pending\.current = false;/, "the landing route clears the pending navigation");

  /* announced, and never in front of the pointer */
  assert.match(src, /role="status"/, "the wait is announced politely");
  assert.match(src, /aria-hidden="true"/, "the decorative parts stay out of the accessibility tree");
  assert.match(css, /\.route-loader \{[\s\S]*?pointer-events: none;/, "the plate never takes a click");

  /* reduced motion keeps the state and drops the movement */
  assert.match(css, /@media \(prefers-reduced-motion: reduce\) \{[\s\S]{0,240}?\.route-loader\[data-phase="leaving"\]/, "reduced motion removes the exit transition");
});

test("the header keeps its navigation when the text is enlarged", async () => {
  /* Reproduced twice. First the caption was set in `--step--2`, a step the
     scale does not define: an undefined custom property makes the
     declaration invalid at computed-value time, so the size fell through to
     inherited and the caption rendered at the body size — 17.28px, a shade
     under the wordmark's own 17.92px, which is why a caption read as a
     second title. Then, with that fixed, 200% text at 768px still overran:
     the caption is `nowrap` and shares one rail with the nav down to 40rem,
     so the identity pushed 36px of the navigation past the edge and eleven
     controls were clipped. */
  const system = await read("app/styles/system.css");

  /* every scale step a stylesheet names must exist in the scale */
  const used = new Set([...system.matchAll(/var\((--step-[-0-9]+)\)/g)].map(([, name]) => name));
  for (const name of used) {
    assert.ok(
      system.includes(`${name}:`),
      `${name} is referenced but never defined — the declaration would fall through to inherited`,
    );
  }

  /* and the caption yields under pressure rather than taking the nav with it */
  const label = system.match(/\.site-identity small \{([^}]*font-size:[^}]*)\}/);
  assert.ok(label, "the identity caption declares its size");
  assert.match(
    label[1],
    /font-size:\s*min\(var\(--step--1\),\s*[\d.]+vw\)/,
    "the caption's size is capped against the viewport so it can never push the rail out",
  );
});

test("the signal field never resurrects a zero-width canvas", async () => {
  /* The contact page's signal field is sized by script from its own box.
     A floor of one pixel there rebuilt a canvas whose width rule had
     resolved to zero — 68rem of boundary inside a shorter page — and a
     1px canvas parked at that x gave the document 737px of horizontal
     scroll at 200% text. The field must stay at zero when it is given no
     room, and it must not pin its own box while it is there: an inline
     size would keep the resize observer from ever seeing the stylesheet
     give the field room again. */
  const src = await read("app/components/signal-field.tsx");
  assert.doesNotMatch(src, /Math\.max\(1,\s*Math\.round\(box\.width\)\)/, "the canvas width is not floored at 1px");
  assert.match(src, /Math\.max\(0,\s*Math\.round\(box\.width\)\)/, "the canvas width may resolve to zero");
  assert.match(src, /if \(width < 1 \|\| height < 1\)/, "a field with no room stops before it paints");
  assert.doesNotMatch(
    src,
    /canvas\.style\.(width|height) = "0px"/,
    "the zero path leaves the stylesheet's size authoritative instead of pinning its own box",
  );

  /* The stylesheet guard. An inline width from the engine beats a
     stylesheet width, so a reader who enlarged text after the field had
     measured kept the old inline size while `left` moved to the boundary
     — 352px of document scroll at 1440px. `max-width` is a different
     property and constrains a stale inline width rather than losing to it. */
  const css = await read("app/styles/pages.css");
  assert.match(
    css,
    /width:\s*clamp\(0px,\s*calc\(100% - max\(70%, 68rem\)\),\s*100%\)/,
    "the boundary width clamps to exactly zero when the boundary meets the edge",
  );
  assert.match(
    css,
    /max-width:\s*calc\(100% - min\(max\(70%, 68rem\), 100%\)\)/,
    "the boundary caps the used width, so a stale inline size cannot overflow the page",
  );
});
