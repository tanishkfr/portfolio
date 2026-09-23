import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

/**
 * Text-enlargement and hit-area regressions.
 *
 * Every assertion protects a defect reproduced in the final accessibility
 * pass against the running production build (200% text-only enlargement at
 * 320–390px, and a hit-area overlap measured in the rendered layout). They
 * assert the mechanism the fix depends on rather than exact pixel values,
 * so a later pass can change the design without rewriting the test.
 */

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

test("the instrument caption cannot collapse to a zero-width column", async () => {
  /* Reproduced at 320px with 200% text: `.case-instrument figcaption` is a
     two-column grid whose first track is `auto`. The label ("Built in-house")
     grew wider than the whole content box, so the caption's `minmax(0, 1fr)`
     track resolved to exactly 0px and the sentence rendered one character per
     line down a 4381px column. The column must be able to change shape with
     the text, not only with the viewport, so the figure is a container and a
     container query (whose `em` is the figure's own font size) stacks it. */
  const css = await read("app/styles/case.css");
  assert.match(
    css,
    /\.case-instrument\s*\{[^}]*container-type:\s*inline-size/,
    "the artefact frame is the measure for the caption's own layout",
  );
  const query = css.match(/@container\s*\(max-width:\s*([\d.]+)em\)\s*\{([\s\S]*?)\n\}/);
  assert.ok(query, "a container query guards the caption's two-column grid");
  const threshold = Number(query[1]);
  assert.ok(threshold >= 10 && threshold <= 24, `the threshold is a plausible reading measure (${threshold}em)`);
  assert.match(query[2], /figcaption/, "the query changes the caption");
  assert.match(
    query[2],
    /grid-template-columns:\s*minmax\(0,\s*1fr\)/,
    "the caption becomes a single column rather than a collapsed one",
  );
});

test("the phone rail never breaks a destination to keep its row", async () => {
  /* Reproduced at 320px and 390px with 200% text: four equal tracks of 54px
     held labels needing up to 128px, so "Projects" rendered as "Pro / jec /
     ts" and every destination fragmented. The floor must scale with the
     label's own size, so it is set in `em`; `min-content` cannot be used
     because Chrome resolves it in an auto-repeated track as one repetition. */
  const css = await read("app/styles/system.css");
  const nav = blocks(css, ".site-header nav").find((b) => /grid-template-columns/.test(b.body));
  assert.ok(nav, "the rail declares its tracks");
  const cols = nav.body.match(/grid-template-columns:\s*([^;]+);/);
  assert.ok(cols, "the rail declares its tracks");
  assert.match(cols[1], /repeat\(auto-fit,/, "the rail can fold instead of fragmenting a label");
  const floor = cols[1].match(/minmax\(([\d.]+)em,/);
  assert.ok(floor, "the track floor scales with the label size");
  const em = Number(floor[1]);
  assert.ok(em >= 4.6 && em <= 5.4, `the floor is one label's own measure (${em}em)`);
  assert.doesNotMatch(cols[1], /repeat\(4,/, "four fixed tracks are what broke the labels");
});

test("the work index keeps its number track out of the name's column", async () => {
  /* Reproduced at 320px with 200% text: the number track is `2.5rem`, which
     doubles to 80px and leaves the name 115px — "Interfaces" then needs four
     lines at display size. The track is furniture, so it is capped as a share
     of the row; the cap never binds at normal text, where 2.5rem is the
     smaller value. */
  const css = await read("app/styles/explore.css");
  const row = blocks(css, ".xp-field-index a").find((b) => /min\(/.test(b.body) && /grid-template-columns/.test(b.body));
  assert.ok(row, "the index row caps its number track");
  assert.match(
    row.body,
    /grid-template-columns:\s*min\(\s*2\.5rem\s*,\s*[\d.]+%\s*\)/,
    "the number's width yields to the name once the text grows",
  );
});

test("no invisible hit area reaches into a neighbouring control", async () => {
  /* Reproduced in the rendered layout at 1440: `.xp-field-index a` carried a
     0.45rem padding with a matching negative margin, so each row's hit area
     reached 13px into the row above (28.8px at 200% text) and a press in the
     band opened the lower work. The rows are already 60–90px tall, so the
     growth bought nothing. The header identity keeps its growth but at a
     size that cannot cross the phone header's own row gap. */
  const css = await read("app/styles/system.css");
  const touch = css.match(/Touch targets[\s\S]*?\n\}/);
  assert.ok(touch, "the touch-target block is present");
  assert.doesNotMatch(touch[0], /\.xp-field-index a/, "the index rows do not grow an overlapping hit area");
  const identity = css.match(/@media \(max-width: 40rem\) \{\s*\.site-identity \{([^}]*)\}/);
  assert.ok(identity, "the phone header restates the identity's growth");
  assert.match(identity[1], /padding-block:\s*0\.[0-3]/, "the growth stays inside the header's row gap");
});
