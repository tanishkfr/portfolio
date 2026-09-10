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

test("server-renders Quick Review as the only published work index", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  const html = await response.text();

  assert.match(html, /class="review"/);
  assert.match(html, /Quick review · 90 seconds/);
  assert.match(html, /Interaction designer in Bengaluru/);

  const works = [
    { slug: "fluxion-studios", title: "Fluxion Studios", t: "two-person web studio" },
    { slug: "design-or-disaster", title: "Design or Disaster", t: "Mark the part of an interface" },
    { slug: "pentimento", title: "Pentimento", t: "machine-written claim shows its evidence" },
    { slug: "invisible-interfaces", title: "Invisible Interfaces", t: "staged restoration runs only" },
    { slug: "atlas", title: "Atlas", t: "provisional rule" },
    { slug: "daynero", title: "Daynero", t: "first-paycheck earners" },
  ];
  for (const work of works) {
    assert.match(html, new RegExp(`href="/work/${work.slug}"`));
    assert.match(html, new RegExp(`>${work.title}<`));
    assert.match(html, new RegExp(work.t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }

  assert.equal((html.match(/class="review-id"/g) ?? []).length, 6);
  assert.match(html, /What I did/);
  assert.match(html, /Where it stands/);
  assert.match(html, />Explore\s*<span/);
  assert.match(html, /Under construction/);
  assert.match(html, />Quick review</);
  assert.doesNotMatch(html, /class="xp-arrive|class="xp-shed|class="xp-rift|class="xp-works-item/);
  assert.doesNotMatch(html, /mode=full|href="\/resume"|href="\/#work"/);
  assert.match(html, /theme-color" content="#f8f3e4"/);
  assert.match(html, /rel="canonical" href="https:\/\/portfolio\.test\/"/);
  assertCleanEncoding(html);

  const forcedExplore = await render("/?mode=full");
  const forcedHtml = await forcedExplore.text();
  assert.match(forcedHtml, /class="review"/);
  assert.doesNotMatch(forcedHtml, /class="xp-arrive|class="xp-shed|class="xp-rift/);
});

test("defines a meaningful interface, logic, and consequence for every project", async () => {
  const signals = await readFile(
    new URL("../app/data/project-signals.ts", import.meta.url),
    "utf8",
  );
  for (const phrase of [
    "The main number answers what is safe to spend today",
    "The amount responds to spending and goals",
    "The person gets guidance for today's decision",
    "The visitor sees a photograph that needs restoration",
    "Progress advances only while the page is hidden",
    "Returning shows the result, its limits, and a discard action",
    "The visitor starts with an interface screenshot",
    "A judgment needs a marked coordinate and an explanation",
    "Five different readings stay visible",
    "Software presents a draft story about a person",
    "The person can change every claim before the second draft",
    "Their correction leads",
    "The visitor starts with an editable design rule",
    "Each case asks whether the rule holds",
    "The final rule keeps the case and wording",
  ]) {
    assert.match(signals, new RegExp(phrase));
  }
});

test("renders an honest Daynero coming-soon note", async () => {
  const response = await render("/work/daynero");
  assert.equal(response.status, 200);
  const html = await response.text();

  for (const phrase of [
    "Coming soon",
    "first-paycheck",
    "Visit daynero.com",
    "I designed and built",
  ]) {
    assert.match(html, new RegExp(phrase));
  }

  assert.match(html, /href="https:\/\/daynero\.com\/"/);
  assert.doesNotMatch(html, /Try the core interaction|Built and verified|Read the case/);
  assert.match(html, /class="daynero-soon-mark"/);
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
      "What changed during the build",
      // the record stays: the decisions and the honest boundary
      "The record",
      "Built and working",
      "Not yet proven",
      "Next test",
      "Open the live project",
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
  for (const slug of ["daynero", "fluxion-studios", "design-or-disaster", "pentimento", "invisible-interfaces", "atlas"]) {
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
  assert.match(aboutHtml, /I design interactions, then build the working version/);
  assert.match(aboutHtml, /Fluxion Studios/);
  assert.match(aboutHtml, /Daynero · case study coming soon/);
  assert.match(aboutHtml, /Four working interaction projects/);
  assert.match(aboutHtml, /Human-Centred Design at Srishti/);
  assert.match(aboutHtml, /AI-assisted making/);
  assert.match(aboutHtml, /AI helps me explore wider and build faster/);
  assert.match(aboutHtml, /rel="canonical" href="https:\/\/portfolio\.test\/about"/);

  assert.equal(contactResponse.status, 200);
  const contactHtml = await contactResponse.text();
  assert.match(contactHtml, /interaction is hard to explain/i);
  assert.match(contactHtml, /@madebytanishk/);

  assert.equal(resumeResponse.status, 200);
  const resumeHtml = await resumeResponse.text();
  assert.match(resumeHtml, /Résumé/);
  assert.match(resumeHtml, /Tanishk/);
  assert.match(resumeHtml, /Print \/ save as PDF/);
  assert.doesNotMatch(resumeHtml, /Redirecting/);
  assertCleanEncoding(aboutHtml + contactHtml + resumeHtml);
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
  assert.match(sitemap, /https:\/\/portfolio\.test\/work\/fluxion-studios/);
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
    caseCss,
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
    fluxionMark,
    rift,
  ] = await Promise.all([
    readFile(new URL("../app/data/portfolio.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/components/work-index.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/components/explore.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/components/works.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/styles/explore.css", import.meta.url), "utf8"),
    readFile(new URL("../app/styles/case.css", import.meta.url), "utf8"),
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
    readFile(new URL("../app/components/fluxion-mark.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/components/rift.tsx", import.meta.url), "utf8"),
  ]);

  assert.match(data, /availability\?: "published" \| "preview" \| "coming-soon"/);
  assert.match(data, /id: "daynero"/);
  assert.doesNotMatch(data, /remainder|command-center/i);
  assert.match(data, /form: "Spatial critique archive"/);

  // Quick Review is the only published homepage. Explore remains source-only
  // while it is under construction and cannot be selected by URL or state.
  assert.match(index, /ReviewIndex/);
  assert.doesNotMatch(index, /import.*Explore|useMode|setMode|mode=full/);

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

  /* THE ROUTE STAGE MUST STAY A PLAIN BOX.
     It wraps every page, so a transform, filter, perspective, will-change or
     contain on it becomes a containing block for every position:fixed
     descendant — which includes the full-screen project room, the payoff of
     the whole site. When it carried a blur-and-rise entrance, the room laid
     out at 1189x9834 @ top:431 on a 1280x720 screen and clicking a project
     showed a blank page. It also meant nothing on the site was visible until
     an animation advanced. This regressed twice; it is a test now. */
  const routeStage = css.match(/\.route-stage\s*\{[^}]*\}/g) ?? [];
  for (const rule of routeStage) {
    assert.doesNotMatch(
      rule,
      /animation|transform|filter|perspective|will-change|contain\s*:/,
      `.route-stage must stay a plain box, found: ${rule}`,
    );
  }
  assert.doesNotMatch(css, /@keyframes route-enter/);

  // Each room is painted, not tinted: its own ground and its own reading ink.
  for (const slug of [
    "fluxion-studios",
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
  assert.doesNotMatch(projectPage, /returnHref\s*=.*#work/);
  for (const mark of [
    "FluxionSigil",
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
  assert.match(transitionLink, /requestAnimationFrame/);
  assert.match(mode, /Explore stays visible as[\s\S]*construction notice/);
  assert.match(mode, /only\s+published way to see the work/);
  assert.doesNotMatch(mode, /sessionStorage|localStorage|dataset\.mode|router\.push|setMode|mode=full/);
  assert.match(artifacts, /draft-machine-copy/);
  assert.doesNotMatch(artifacts, /demo-strike/);
  assert.match(caseCss, /text-decoration-skip-ink:\s*none/);
  assert.match(css, /data-mode="review"/);
  assert.match(css, /route-mobile-in/);
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
  assert.match(fluxionMark, /\/projects\/fluxion\/wordmark-transparent\.png/);
  assert.match(rift, /xp-rift-ghost/);
  assert.match(signature, /\/projects\/fluxion\/mark-transparent\.png/);
  assert.match(artifacts, /\/projects\/fluxion\/wordmark-transparent\.png/);

  await access(new URL("../public/projects/atlas/atlas.png", import.meta.url));
  await access(new URL("../public/projects/invisible-interfaces/return.png", import.meta.url));
  for (const asset of [
    "mark-dark.png",
    "mark-light.png",
    "wordmark-dark.png",
    "wordmark-light.png",
    "mark-transparent.png",
    "wordmark-transparent.png",
  ]) {
    await access(new URL(`../public/projects/fluxion/${asset}`, import.meta.url));
  }
  await assert.rejects(access(new URL("../public/projects/remainder", import.meta.url)));
  await assert.rejects(access(new URL("../app/components/project-proof.tsx", import.meta.url)));
});
