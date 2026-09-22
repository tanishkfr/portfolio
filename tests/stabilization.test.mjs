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

test("project-sheet column floors are clamped against the viewport", async () => {
  const explore = await read("app/styles/explore.css");

  /* A rem floor is a promise the viewport may not be able to keep once
     text is enlarged. Both floors must therefore be capped in viewport
     units, and the layouts must read them. */
  const copyFloor = explore.match(/--piece-copy-floor:\s*min\(([^;]+)\);/);
  const stageFloor = explore.match(/--piece-stage-floor:\s*min\(([^;]+)\);/);
  assert.ok(copyFloor, "--piece-copy-floor is defined as a clamped value");
  assert.ok(stageFloor, "--piece-stage-floor is defined as a clamped value");
  assert.match(copyFloor[1], /vw/, "the copy floor is capped in viewport units");
  assert.match(stageFloor[1], /vw/, "the stage floor is capped in viewport units");

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
