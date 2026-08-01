import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

async function render(path = "/", accept = "text/html", extraHeaders = {}) {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}-${path}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`https://portfolio.test${path}`, {
      headers: {
        accept,
        "x-forwarded-host": "portfolio.test",
        "x-forwarded-proto": "https",
        ...extraHeaders,
      },
    }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

function assertCleanEncoding(html) {
  assert.doesNotMatch(html, /(?:Ã.|Â.|â€|â†|âœ|ï¿½|�)/);
}

test("server-renders Explore as a cinematic world ending in the work", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  const html = await response.text();

  // The premise, the thing he keeps observing, and the close that
  // bookends the opening line — all server-rendered.
  /* The opening line is split so the shared prefix can hold still while only
     the tail swaps — the finished sentence is still what the h1 reads. */
  assert.match(html, /<h1 class="xp-arrive-line">\s*I design/);
  assert.match(html, /the part you.{0,10}t see\./);
  // the draft it replaced is present but decorative
  assert.match(html, /aria-hidden="true"[^>]*>\s*apps and interfaces\./);
  assert.match(html, /Every year, software asks less of us\./);
  assert.match(html, /And every year, it shows me/);
  assert.match(html, /That was the part you.{0,10}t see\./);

  // Every project is a room with its own ground colour — still a real link
  // to its case, carrying its thesis, server-rendered before any JS.
  const works = [
    { slug: "design-or-disaster", title: "Design or Disaster", t: "point before you pronounce" },
    { slug: "pentimento", title: "Pentimento", t: "must outrank its sentence" },
    { slug: "invisible-interfaces", title: "Invisible Interfaces", t: "accountability has to return" },
    { slug: "atlas", title: "Atlas", t: "allowed to change it" },
    { slug: "daynero", title: "Daynero", t: "not just a monthly reset" },
  ];
  for (const work of works) {
    assert.match(html, new RegExp(`href="/work/${work.slug}"`));
    assert.match(html, new RegExp(`>${work.title}<`));
    assert.match(html, new RegExp(work.t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
    // each room declares which world it is, which is what paints it
    assert.match(html, new RegExp(`data-room="${work.slug}"`));
  }
  /* There is no work section. Each project stands where it is the reply to
     the sentence just made, with a page of argument either side of it — which
     is what separates them, rather than an edge or a position in a row. */
  assert.equal((html.match(/class="xp-works-item"/g) ?? []).length, 5);
  assert.match(html, /class="xp-works-thesis"/);
  assert.doesNotMatch(html, /class="xp-track"|class="xp-poster"|class="xp-answer"/);
  // the work is one addressable region, so a returning case lands here
  assert.match(html, /id="work"/);


  /* Opening a project is a dialog, not a navigation: it is labelled, modal,
     and every name is still a real link to its case for anyone without JS. */
  assert.match(html, /class="xp-works-open"/);
  assert.match(html, /<noscript>/);

  // Entrances are typed: a name does not arrive the way a caption does.
  for (const kind of ["name", "quiet", "figure"]) {
    assert.match(html, new RegExp(`data-reveal="${kind}"`));
  }

  // The descent's five statements are the argument, so they must reach
  // assistive tech; only the control glyphs may be hidden.
  assert.match(html, /class="xp-era-glyph" aria-hidden="true"/);
  assert.match(html, /You had to speak its language\./);
  assert.doesNotMatch(html, /class="xp-shed-control" aria-hidden/);

  // Spoken aloud, the struck words would invert the sentence.
  assert.match(html, /class="xp-close-strike" aria-hidden="true"/);

  /* The mechanics now live inside the room a project opens into, so the home
     page server-renders the argument and the set rather than five live
     widgets. The case screen is asserted on its own case page instead. */
  assert.match(html, /Five questions I couldn.{0,8}t drop/);

  /* Each row carries its project's ground, so the set previews the room you
     are about to be standing in before you open it. */
  for (const tint of ["251 236 227", "247 236 245", "232 244 241"]) {
    assert.ok(html.includes("--room:rgb(" + tint), "row tint " + tint);
  }

  // Two ways in are still offered.
  assert.match(html, />Explore</);
  assert.match(html, />Quick review</);
  assert.match(html, /theme-color" content="#f8f3e4"/);

  assert.match(html, /rel="canonical" href="https:\/\/portfolio\.test\/"/);
  // none of the retired homepages return.
  assert.doesNotMatch(
    html,
    /class="exhibit|claim-line|ex-zone|ex-arrival|deck-name|thinking-line|type="range"|Ask five systems/i,
  );
  assertCleanEncoding(html);
});

test("defines a meaningful interface, logic, and consequence for every project", async () => {
  const signals = await readFile(
    new URL("../app/data/project-signals.ts", import.meta.url),
    "utf8",
  );
  for (const phrase of [
    "A daily money companion, not a monthly spreadsheet",
    "Guidance adjusts to behavior and goals",
    "Money decisions become immediate",
    "Delegated work appears to require watching",
    "Progress advances only while attention is elsewhere",
    "Returning produces a receipt",
    "A verdict appears to be the final object",
    "Judgment must identify its evidence",
    "Five incompatible readings can disagree",
    "A machine-written life appears settled",
    "The person represented owns the final account",
    "Human correction leads",
    "A design principle appears to be finished advice",
    "A rule earns authority only by surviving transfer",
    "Every hold, refinement, and fracture remains",
  ]) {
    assert.match(signals, new RegExp(phrase));
  }
});

test("renders an honest Daynero commercial preview", async () => {
  const response = await render("/work/daynero");
  assert.equal(response.status, 200);
  const html = await response.text();

  for (const phrase of [
    "Less noise. Better money",
    "AI-native financial product",
    "Case study in preparation",
    "Adaptive daily budget",
    "Goals in the loop",
    "Meridian",
    "A preview, not a manufactured case study",
    "I designed and built the app experience and public website",
    "Visit daynero.com",
  ]) {
    assert.match(html, new RegExp(phrase));
  }

  assert.match(html, /href="https:\/\/daynero\.com\/"/);
  assert.doesNotMatch(html, /Inspect the source|Try the core interaction|Built and verified/);
  assert.match(html, /rel="canonical" href="https:\/\/portfolio\.test\/work\/daynero"/);
  assertCleanEncoding(html);
});

test("server-renders four interactive, evidence-bounded published cases", async () => {
  const cases = [
    ["design-or-disaster", "Critique becomes accountable", "Choose a juror perspective"],
    ["pentimento", "your correction must outrank", "Reply to the machine reading"],
    ["invisible-interfaces", "accountability has to return", "Inspect a delegation phase"],
    ["atlas", "A design rule is only as useful", "Judge the provisional rule"],
  ];

  for (const [slug, thesis, proof] of cases) {
    const response = await render(`/work/${slug}`);
    assert.equal(response.status, 200);
    const html = await response.text();
    for (const phrase of [
      thesis,
      proof,
      // the three-beat read replaced the five chapters
      "Why I built it",
      "What it is",
      "What it changed",
      // the record stays: the decisions and the honest boundary
      "The record",
      "Built and working",
      "Not yet proven",
      "The next honest test",
      "Experience the project",
      "Inspect the source",
    ]) {
      assert.match(html, new RegExp(phrase));
    }
    // the retired publication scaffolding must be gone
    assert.doesNotMatch(html, /What I made accountable|What to remember|01 \/ Context|case-chapter/);
    assert.match(html, /aria-pressed="true"/);
    assert.match(html, new RegExp(`rel="canonical" href="https:\\/\\/portfolio\\.test\\/work\\/${slug}"`));
    assertCleanEncoding(html);
  }
});

test("keeps all canonical project navigation payloads valid", async () => {
  for (const slug of ["daynero", "design-or-disaster", "pentimento", "invisible-interfaces", "atlas"]) {
    const response = await render(`/work/${slug}.rsc?from=all&_rsc`, "text/x-component", { RSC: "1" });
    assert.equal(response.status, 200);
    assert.match(response.headers.get("content-type") ?? "", /^text\/x-component\b/i);
    assert.ok((await response.text()).length > 700);
  }
});

test("keeps valid legacy routes and retires removed work", async () => {
  const legacy = await render("/work/invisible-interactions");
  assert.ok([301, 302, 307, 308].includes(legacy.status));
  assert.equal(new URL(legacy.headers.get("location")).pathname, "/work/invisible-interfaces");

  const retired = await render("/work/command-center");
  assert.equal(retired.status, 404);
});

test("publishes accurate identity, commercial context, and contact", async () => {
  const [aboutResponse, contactResponse, resumeResponse] = await Promise.all([
    render("/about"),
    render("/contact"),
    render("/resume"),
  ]);

  assert.equal(aboutResponse.status, 200);
  const aboutHtml = await aboutResponse.text();
  assert.match(aboutHtml, /I design the rules people feel/);
  assert.match(aboutHtml, /Daynero · app and public website/);
  assert.match(aboutHtml, /Four working interaction studies/);
  assert.match(aboutHtml, /commercial startup context/);
  assert.match(aboutHtml, /rel="canonical" href="https:\/\/portfolio\.test\/about"/);

  assert.equal(contactResponse.status, 200);
  const contactHtml = await contactResponse.text();
  assert.match(contactHtml, /behavior is the hard part/i);
  assert.match(contactHtml, /@madebytanishk/);

  assert.ok([301, 302, 307, 308].includes(resumeResponse.status));
  assert.equal(new URL(resumeResponse.headers.get("location")).pathname, "/about");
  assertCleanEncoding(aboutHtml + contactHtml);
});

test("exposes crawl metadata for Daynero and the four published cases", async () => {
  const [sitemapResponse, robotsResponse] = await Promise.all([
    render("/sitemap.xml", "application/xml"),
    render("/robots.txt", "text/plain"),
  ]);
  assert.equal(sitemapResponse.status, 200);
  const sitemap = await sitemapResponse.text();
  assert.match(sitemap, /https:\/\/portfolio\.test\/work\/daynero/);
  assert.match(sitemap, /https:\/\/portfolio\.test\/work\/atlas/);
  assert.doesNotMatch(sitemap, /command-center/);
  assert.equal(robotsResponse.status, 200);
  assert.match(await robotsResponse.text(), /Sitemap: https:\/\/portfolio\.test\/sitemap\.xml/);
});

test("keeps motion, image, and dual-deployment contracts explicit", async () => {
  const [
    data,
    index,
    explore,
    rooms,
    exploreCss,
    motion,
    projectPage,
    signature,
    artifacts,
    transitionLink,
    mode,
    css,
    nextConfig,
    packageJson,
    vercel,
    worker,
  ] = await Promise.all([
    readFile(new URL("../app/data/portfolio.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/components/work-index.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/components/explore.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/components/works.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/styles/explore.css", import.meta.url), "utf8"),
    readFile(new URL("../app/components/motion-director.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/work/[slug]/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/components/project-sigil.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/components/case-artifacts.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/components/transition-link.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/components/mode.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/styles/system.css", import.meta.url), "utf8"),
    readFile(new URL("../next.config.ts", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
    readFile(new URL("../vercel.json", import.meta.url), "utf8"),
    readFile(new URL("../worker/index.ts", import.meta.url), "utf8"),
  ]);

  assert.match(data, /availability\?: "published" \| "preview"/);
  assert.match(data, /id: "daynero"/);
  assert.doesNotMatch(data, /remainder|command-center/i);
  assert.match(data, /form: "Spatial critique archive"/);

  // Two ways in: work-index only dispatches, so no design lives in it.
  assert.match(index, /ReviewIndex/);
  assert.match(index, /Explore/);

  // Explore is a world, not an index: a descent whose scenes are driven by
  // scroll, ending in five rooms that each carry their own ground colour and
  // a name that morphs into its case. Server render is the base.
  assert.match(explore, /Descent|Notice|Rooms/);
  assert.match(rooms, /data-room/);
  assert.match(rooms, /TransitionLink/);
  /* The set carries the anchor a returning case links back to. */
  assert.match(rooms, /id="work"/);
  /* Explore composes; it no longer measures anything itself. The scroll work
     belongs to the three engines, and every scene reads their published
     values rather than running a listener of its own. */
  assert.match(explore, /Cinema/);
  assert.match(explore, /Atmosphere/);
  assert.match(explore, /SceneDirector/);
  assert.doesNotMatch(explore, /addEventListener/);

  // Each room is painted, not tinted: its own ground and its own reading ink.
  for (const slug of [
    "design-or-disaster",
    "pentimento",
    "invisible-interfaces",
    "atlas",
    "daynero",
  ]) {
    assert.match(exploreCss, new RegExp(`data-room="${slug}"`));
  }
  assert.match(exploreCss, /--room-ink/);

  // The housing carries no decorative glow — pigment does the work.
  assert.doesNotMatch(exploreCss, /radial-gradient\([^)]*var\(--accent\)/);
  // and nothing shouts in tracked-out capitals
  assert.doesNotMatch(exploreCss, /text-transform:\s*uppercase/);
  assert.doesNotMatch(
    index,
    /readings|lensRelations|temperament|field-shown|data-lead|reRank|class="rank"/,
  );
  assert.doesNotMatch(
    index,
    /deck-name|deck-panel|thinking-line|claim-line|ex-zone|ex-arrival|scroll-snap|exhibit--|work-grid|type="range"|Ask five systems/i,
  );
  assert.match(motion, /IntersectionObserver/);
  assert.match(motion, /--scroll-progress/);
  assert.doesNotMatch(motion, /pointermove|--pointer-x/);
  assert.match(projectPage, /DayneroPreview/);
  assert.match(projectPage, /SignaturePlate/);
  assert.match(projectPage, /project\.sourceUrl \?/);
  for (const mark of [
    "DayneroSigil",
    "InvisibleSigil",
    "DisasterSigil",
    "PentimentoSigil",
    "AtlasSigil",
  ]) {
    assert.match(signature, new RegExp(mark));
  }
  for (const phaseState of ["ph-s", "ph-r", "ph-c"]) {
    assert.match(signature, new RegExp(phaseState));
  }
  assert.match(transitionLink, /startViewTransition/);
  assert.match(transitionLink, /prefers-reduced-motion/);
  /* Session-scoped on purpose: a reviewer who once chose the digest should not
     be silently returned to it on a later visit and never see the work. */
  assert.match(mode, /sessionStorage/);
  assert.doesNotMatch(mode, /localStorage/);
  assert.match(mode, /dataset\.mode/);
  assert.match(mode, /aria-pressed/);
  // two modes, not three — and no stale edition contract left anywhere
  assert.match(css, /data-mode="review"/);
  assert.doesNotMatch(css, /data-edition=/);
  assert.match(rooms, /TransitionLink/);
  assert.match(projectPage, /TransitionLink/);
  assert.match(css, /view-transition/);
  for (const accent of ["#ef4a35", "#8b2f63", "#d79a29", "#1d756d", "#b7e34b"]) {
    assert.match(data, new RegExp(accent));
  }
  assert.doesNotMatch(artifacts, /remainder|candidate memory/i);
  assert.match(css, /prefers-reduced-motion:\s*reduce/);
  assert.match(css, /forced-colors:\s*active/);
  assert.match(nextConfig, /unoptimized:\s*true/);
  assert.match(packageJson, /"build:vercel": "next build"/);
  assert.match(vercel, /"framework": "nextjs"/);
  assert.match(worker, /!env\.ASSETS \|\| !env\.IMAGES/);

  await access(new URL("../public/projects/atlas/atlas.png", import.meta.url));
  await access(new URL("../public/projects/invisible-interfaces/return.png", import.meta.url));
  await assert.rejects(access(new URL("../public/projects/remainder", import.meta.url)));
  await assert.rejects(access(new URL("../app/components/project-proof.tsx", import.meta.url)));
});
