/**
 * SHEET BACKDROPS — the paper each room is printed on.
 *
 * One quiet glyph field per sheet, drawn in the room's own pigment and
 * laid behind the copy and the plate. These are not diagrams. Nothing
 * here resolves and nothing performs: each is a small composition built
 * from the vocabulary of its project — a scale of marks, a struck line,
 * a ticker column, a branching rule, a frame, a ledger — held at the
 * faintness of a printed watermark. The reader should register it as the
 * room's texture before they register it as anything at all.
 *
 * The only motion is slow and single: one travelling mark, one breathing
 * row, one blink. Each script reads the grid pitch the engine hands it,
 * so no mark breaks up on a phone's coarse register, and each field
 * sleeps with its sheet (only the room you are reading is awake).
 */

export type Backdrop = {
  glyphs: string;
  cell: number;
  seed: number;
  ambient: number;
  flow?: number;
  drift?: number;
  tune?: [number, number];
  shape: (
    v: number,
    nx: number,
    ny: number,
    t: number,
    cellX: number,
    cellY: number,
  ) => number;
  glyphAt?: (
    t: number,
    nx: number,
    ny: number,
    cellX: number,
    cellY: number,
  ) => number;
};

const smooth = (edge: number): number => {
  const x = Math.min(1, Math.max(0, edge));
  return x * x * (3 - 2 * x);
};

const hash = (n: number, salt: number): number => {
  const h = Math.sin(n * 127.1 + salt * 311.7) * 43758.5453;
  return h - Math.floor(h);
};

/** a mark's minimum size: never thinner than one glyph of its grid */
const fit = (preferred: number, pitch: number): number =>
  Math.max(preferred, pitch * 0.55);

const band = (ny: number, y: number, half: number): boolean =>
  ny > y - half && ny < y + half;

const row = (
  nx: number,
  ny: number,
  x0: number,
  x1: number,
  y: number,
  half: number,
): boolean => band(ny, y, half) && nx > x0 && nx < x1;

/* --------------------------------------------------------------
   01 · DESIGN OR DISASTER — the measured field.
   A surveyor's scale along the foot of the sheet, one travelling mark
   reading it, and a small crop frame in the corner: the marks of
   something being examined rather than decorated.
   -------------------------------------------------------------- */

const DISASTER_SCALE = 0.92;
const DISASTER_TICKS = 26;

function disasterBackdrop(
  v: number,
  nx: number,
  ny: number,
  t: number,
  cx: number,
  cy: number,
): number {
  let out = v * 0.3;
  const tickX = fit(0.0026, cx);
  const tickY = fit(0.008, cy);
  const longY = fit(0.018, cy);

  /* the scale: a tick every 1/26 of the width, every fourth one long */
  for (let i = 0; i <= DISASTER_TICKS; i++) {
    const x = 0.06 + (i / DISASTER_TICKS) * 0.88;
    if (Math.abs(nx - x) < tickX) {
      const long = i % 4 === 0;
      if (band(ny, DISASTER_SCALE, long ? longY : tickY)) {
        out = Math.max(out, long ? 0.66 : 0.38);
      }
    }
  }

  /* the travelling mark: one reading moving slowly along the scale */
  const px = 0.07 + ((t * 0.045) % 1) * 0.86;
  if (
    band(ny, DISASTER_SCALE, fit(0.022, cy)) &&
    Math.abs(nx - px) < fit(0.01, cx)
  ) {
    out = Math.max(out, 0.72);
  }

  /* a crop frame drawn in the top corner */
  const fx = 0.72;
  const fy = 0.1;
  const fw = 0.22;
  const fh = 0.16;
  const edge = fit(0.004, cy);
  const onV = Math.abs(nx - fx) < edge || Math.abs(nx - (fx + fw)) < edge;
  const onH =
    (Math.abs(ny - fy) < edge || Math.abs(ny - (fy + fh)) < edge) &&
    nx > fx - edge &&
    nx < fx + fw + edge;
  if (
    (onV && ny > fy - edge && ny < fy + fh + edge) ||
    (onH && ny < 0.42)
  ) {
    out = Math.max(out, 0.42);
  }
  return out;
}

/* --------------------------------------------------------------
   02 · PENTIMENTO — the working draft.
   Three staggered machine rows in the margin, a hand crossing one of
   them out, and the ruled edge of the page: a sheet that has been
   corrected.
   -------------------------------------------------------------- */

const REVISION_MARGIN = [0.13, 0.185, 0.24];
const REVISION_LENGTHS = [0.3, 0.22, 0.27];

function revisionBackdrop(
  v: number,
  nx: number,
  ny: number,
  t: number,
  cx: number,
  cy: number,
): number {
  let out = v * 0.28;
  const lineHalf = fit(0.006, cy);
  const textHalf = fit(0.011, cy);

  /* the rows: dashes with word gaps, each a different length */
  for (let i = 0; i < REVISION_MARGIN.length; i++) {
    const y = REVISION_MARGIN[i];
    const x1 = 0.1 + REVISION_LENGTHS[i];
    if (
      row(nx, ny, 0.06, x1, y, i === 1 ? textHalf : lineHalf) &&
      hash(Math.floor(nx * 18) * 7.3, i + 3) > 0.28
    ) {
      out = Math.max(out, 0.46);
    }
  }

  /* the strike: crossing the middle row, running out from the margin */
  const sweep = smooth(((t * 0.09) % 1) * 1.6);
  if (
    band(ny, REVISION_MARGIN[1], fit(0.008, cy)) &&
    nx > 0.06 &&
    nx < 0.06 + sweep * 0.26
  ) {
    out = Math.max(out, 0.7);
  }

  /* the ruled edge of the page */
  if (Math.abs(nx - 0.045) < fit(0.003, cx) && ny > 0.1 && ny < 0.3) {
    out = Math.max(out, 0.34);
  }
  return out;
}

/* --------------------------------------------------------------
   03 · INVISIBLE INTERFACES — the column that keeps running.
   A ticker down the outer edge of the sheet, still blinking, and the
   dashed edge of a receipt along the foot: work that continued while
   nobody was watching, and the paper it came back with.
   -------------------------------------------------------------- */

function absenceBackdrop(
  v: number,
  nx: number,
  ny: number,
  t: number,
  cx: number,
  cy: number,
): number {
  let out = v * 0.26;

  /* the ticker: a column of records, each on its own blink */
  if (Math.abs(nx - 0.955) < fit(0.005, cx)) {
    const slot = Math.floor((ny - 0.06) / 0.026);
    const within = Math.abs((ny - 0.06) % 0.026);
    if (slot >= 0 && slot < 18 && within < fit(0.011, cy)) {
      const on = 0.5 + 0.5 * Math.sin(t * 0.9 + slot * 1.7);
      out = Math.max(out, 0.26 + 0.46 * on);
    }
  }

  /* the receipt's dashed edge, and the total line under it */
  const dashes = 0.02;
  if (
    band(ny, 0.66, fit(0.006, cy)) &&
    nx > 0.5 &&
    nx < 0.94 &&
    (nx - 0.5) % dashes < dashes * 0.6
  ) {
    out = Math.max(out, 0.44);
  }
  if (
    band(ny, 0.695, fit(0.005, cy)) &&
    nx > 0.62 &&
    nx < 0.94 &&
    (nx - 0.62) % dashes < dashes * 0.6
  ) {
    out = Math.max(out, 0.3);
  }
  return out;
}

/* --------------------------------------------------------------
   04 · ATLAS — the rule and its branches.
   One rule laid down the lower margin, two cases branching off it into
   settled marks, and a pulse still travelling the rule.
   -------------------------------------------------------------- */

const ATLAS_BACKDROP_RULE = 0.8;
const ATLAS_BACKDROP_BRANCHES = [
  { x: 0.12, to: 0.86, w: 0.09 },
  { x: 0.24, to: 0.9, w: 0.06 },
];

function atlasBackdrop(
  v: number,
  nx: number,
  ny: number,
  t: number,
  cx: number,
  cy: number,
): number {
  let out = v * 0.22;
  const ruleHalf = fit(0.007, cy);
  const branchHalf = fit(0.005, cx);

  /* the rule */
  if (row(nx, ny, 0.05, 0.4, ATLAS_BACKDROP_RULE, ruleHalf)) {
    out = Math.max(out, 0.5);
  }
  /* two branches, each ending in a case mark */
  for (const b of ATLAS_BACKDROP_BRANCHES) {
    if (
      Math.abs(nx - b.x) < branchHalf &&
      ny > ATLAS_BACKDROP_RULE &&
      ny < b.to
    ) {
      out = Math.max(out, 0.4);
    }
    if (band(ny, b.to, fit(0.009, cy)) && Math.abs(nx - b.x) < fit(b.w, cx)) {
      out = Math.max(out, 0.56);
    }
  }
  /* the pulse travelling the rule */
  const px = 0.05 + ((t * 0.05) % 1) * 0.35;
  if (
    row(
      nx,
      ny,
      px - 0.012,
      px + 0.012,
      ATLAS_BACKDROP_RULE,
      fit(0.016, cy),
    )
  ) {
    out = Math.max(out, 0.62);
  }
  return out;
}

/* --------------------------------------------------------------
   05 · FLUXION STUDIOS — the frame being filled.
   A browser frame in the corner with its bar and a row inside it, and
   crop marks on the sheet's opposite corner: the studio's own delivery,
   on the paper.
   -------------------------------------------------------------- */

function fluxBackdrop(
  v: number,
  nx: number,
  ny: number,
  t: number,
  cx: number,
  cy: number,
): number {
  let out = v * 0.3;
  const fx = 0.66;
  const fy = 0.09;
  const fw = 0.3;
  const fh = 0.2;
  const edge = fit(0.005, cy);
  const onV = Math.abs(nx - fx) < edge || Math.abs(nx - (fx + fw)) < edge;
  const onH = Math.abs(ny - fy) < edge || Math.abs(ny - (fy + fh)) < edge;
  if (
    (onV && ny > fy - edge && ny < fy + fh + edge) ||
    (onH && nx > fx - edge && nx < fx + fw + edge)
  ) {
    out = Math.max(out, 0.52);
  }
  /* the bar across the frame, and one row inside it, breathing */
  if (row(nx, ny, fx + 0.012, fx + fw - 0.012, fy + 0.045, fit(0.005, cy))) {
    out = Math.max(out, 0.4);
  }
  const grow = 0.5 + 0.5 * Math.sin(t * 0.35);
  if (
    row(
      nx,
      ny,
      fx + 0.02,
      fx + 0.02 + (fw - 0.05) * grow,
      fy + 0.12,
      fit(0.007, cy),
    )
  ) {
    out = Math.max(out, 0.46);
  }
  /* crop marks in the opposite corner */
  const mark = fit(0.008, cy);
  if (
    (Math.abs(nx - 0.045) < fit(0.0026, cx) && band(ny, 0.11, mark)) ||
    (Math.abs(ny - 0.11) < fit(0.0026, cy) && Math.abs(nx - 0.045) < mark)
  ) {
    out = Math.max(out, 0.34);
  }
  return out;
}

/* --------------------------------------------------------------
   06 · DAYNERO — the ledger.
   Three rows of entries along the lower margin and the total line
   beneath them: spending kept in a column, ending in one figure. The
   total's cells are the only digits anywhere in the backdrops.
   -------------------------------------------------------------- */

const LEDGER_ROWS = [0.72, 0.765, 0.81];
const LEDGER_TOTAL = 0.865;

function numberBackdrop(
  v: number,
  nx: number,
  ny: number,
  t: number,
  cx: number,
  cy: number,
): number {
  let out = v * 0.24;
  const entryHalf = fit(0.006, cy);

  /* entries: short dashes whose lengths breathe out of step */
  for (let i = 0; i < LEDGER_ROWS.length; i++) {
    const y = LEDGER_ROWS[i];
    const len = fit(
      (0.16 + 0.06 * i) * (0.85 + 0.15 * Math.sin(t * 0.3 + i * 2)),
      cx,
    );
    const x0 = 0.56 + i * 0.02;
    if (row(nx, ny, x0, x0 + len, y, entryHalf)) {
      out = Math.max(out, 0.4);
    }
  }

  /* the total: a short run of digits, the only numerals in the set */
  if (row(nx, ny, 0.62, 0.86, LEDGER_TOTAL, fit(0.011, cy))) {
    out = Math.max(out, 0.68);
  }
  return out;
}

/** the total line resolves into digits, one per cell — never a hash */
function numberBackdropGlyphAt(
  t: number,
  nx: number,
  ny: number,
  cx: number,
  cy: number,
): number {
  if (!row(nx, ny, 0.62, 0.86, LEDGER_TOTAL, fit(0.013, cy))) return -1;
  return 4 + (Math.floor(nx / cx) % 10);
}

/* -------------------------------------------------------------- */

const BACKDROPS: Record<string, Backdrop> = {
  "design-or-disaster": {
    glyphs: "·:+=#",
    cell: 13,
    seed: 7,
    ambient: 0.3,
    flow: 0.5,
    drift: 0.2,
    tune: [0.62, 1.7],
    shape: disasterBackdrop,
  },
  pentimento: {
    glyphs: "·:+/x",
    cell: 13,
    seed: 19,
    ambient: 0.26,
    flow: 0.4,
    drift: 0.2,
    tune: [0.64, 1.6],
    shape: revisionBackdrop,
  },
  "invisible-interfaces": {
    glyphs: "01",
    cell: 12,
    seed: 31,
    ambient: 0.24,
    flow: 0.4,
    drift: 0.15,
    tune: [0.66, 1.6],
    shape: absenceBackdrop,
  },
  atlas: {
    glyphs: "·:+=#",
    cell: 12,
    seed: 43,
    ambient: 0.24,
    flow: 0.4,
    drift: 0.15,
    tune: [0.66, 1.6],
    shape: atlasBackdrop,
  },
  "fluxion-studios": {
    glyphs: "·:+=#",
    cell: 12,
    seed: 55,
    ambient: 0.3,
    flow: 0.5,
    drift: 0.2,
    tune: [0.62, 1.7],
    shape: fluxBackdrop,
  },
  daynero: {
    glyphs: "·:+=0123456789",
    cell: 12,
    seed: 67,
    ambient: 0.26,
    flow: 0.4,
    drift: 0.15,
    tune: [0.64, 1.6],
    shape: numberBackdrop,
    glyphAt: numberBackdropGlyphAt,
  },
};

export function backdropFor(slug: string): Backdrop | undefined {
  return BACKDROPS[slug];
}
