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
    {
      ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) },
    },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

function assertCleanEncoding(html) {
  assert.doesNotMatch(html, /(?:Ã.|Â.|â€|â†|âœ|ï¿½|�)/);
}

test("server-renders one direct-manipulation exposure instrument", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  for (const phrase of [
    "Tanishk",
    "Interaction Designer",
    "Bangalore",
    "Design or Disaster",
    "Pentimento",
    "Invisible Interfaces",
    "Atlas",
    "Remainder",
    "Make the hidden rule visible",
    "Portfolio instrument 01",
    "Drag the plane",
    "Surface",
    "Rule",
    "Consequence",
    "The housing is exposing itself",
    "Pass 01 · expose rule",
    "Pass 02 · expose consequence",
    "05 live interactive artifacts",
    "Available for work",
    "madebytanishk@gmail.com",
  ]) {
    assert.match(html, new RegExp(phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }
  assert.equal((html.match(/class="instrument-panel instrument-panel--/g) ?? []).length, 5);
  assert.match(html, /type="range"/);
  assert.match(html, /aria-label="Exposure presets"/);
  assert.match(html, /rel="canonical" href="https:\/\/portfolio\.test\/"/);
  assert.doesNotMatch(html, /Reorder by question|Interaction proof|project-row--proof/);
  assert.doesNotMatch(
    html,
    /placeholder|coming soon|pending verified|codex-preview|Your site is taking shape/i,
  );
  assertCleanEncoding(html);
});

test("renders meaningful surface, rule, and consequence states for all projects", async () => {
  const response = await render();
  const html = await response.text();
  for (const phrase of [
    "A conversation appears to be the product",
    "Confidence is not consent",
    "A reviewed decision retains its source",
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
    assert.match(html, new RegExp(phrase));
  }
});

test("server-renders five distinct, interactive, evidence-bounded case studies", async () => {
  const cases = [
    {
      slug: "design-or-disaster",
      thesis: "Critique becomes accountable when you have to point before you pronounce",
      proof: ["Five fallible readings", "Choose a juror perspective"],
    },
    {
      slug: "pentimento",
      thesis: "your correction must outrank its sentence",
      proof: ["Reply to the machine reading", "Correction · sovereign ink"],
    },
    {
      slug: "invisible-interfaces",
      thesis: "When work leaves the screen, accountability has to return",
      proof: ["Inspect a delegation phase", "Attention elsewhere"],
    },
    {
      slug: "atlas",
      thesis: "A design rule is only as useful as the unlike cases",
      proof: ["Judge the provisional rule", "Starting rule"],
    },
    {
      slug: "remainder",
      thesis: "Only human judgment can commit one",
      proof: ["Review candidate memory", "Resulting project memory"],
    },
  ];

  for (const project of cases) {
    const response = await render(`/work/${project.slug}`);
    assert.equal(response.status, 200);
    const html = await response.text();
    assert.match(html, new RegExp(project.thesis));
    for (const phrase of [
      "Try the core interaction",
      "What this proves",
      "What I made accountable",
      "The question",
      "What I built",
      "Context",
      "Pivot",
      "Interaction",
      "System",
      "Evidence",
      "What I rejected",
      "Built and verified",
      "Not yet proven",
      "The next honest test",
      "Experience the project",
      "Inspect the source",
      "Independent · concept to production",
      ...project.proof,
    ]) {
      assert.match(html, new RegExp(phrase));
    }
    assert.match(html, /aria-pressed="true"/);
    assert.match(
      html,
      new RegExp(`rel="canonical" href="https:\\/\\/portfolio\\.test\\/work\\/${project.slug}"`),
    );
    assertCleanEncoding(html);
  }
});

test("keeps dynamic project navigation payloads valid", async () => {
  for (const slug of [
    "design-or-disaster",
    "pentimento",
    "invisible-interfaces",
    "atlas",
    "remainder",
  ]) {
    const response = await render(
      `/work/${slug}.rsc?from=all&_rsc`,
      "text/x-component",
      { RSC: "1" },
    );
    assert.equal(response.status, 200);
    assert.match(response.headers.get("content-type") ?? "", /^text\/x-component\b/i);
    assert.ok((await response.text()).length > 1000);
  }
});

test("preserves legacy project URLs with canonical redirects", async () => {
  for (const [legacySlug, expectedPath] of [
    ["command-center", "/work/remainder"],
    ["invisible-interactions", "/work/invisible-interfaces"],
  ]) {
    const response = await render(`/work/${legacySlug}`);
    assert.ok([301, 302, 307, 308].includes(response.status));
    assert.equal(new URL(response.headers.get("location")).pathname, expectedPath);
  }
});

test("publishes authored identity, hiring signals, contact, and no premature resume", async () => {
  const [aboutResponse, contactResponse, resumeResponse] = await Promise.all([
    render("/about"),
    render("/contact"),
    render("/resume"),
  ]);

  assert.equal(aboutResponse.status, 200);
  const aboutHtml = await aboutResponse.text();
  assert.match(aboutHtml, /architect, design, write, and implement/i);
  assert.match(aboutHtml, /Five live interactive artifacts/);
  assert.match(aboutHtml, /What I bring to a team/);
  assert.match(aboutHtml, /rel="canonical" href="https:\/\/portfolio\.test\/about"/);

  assert.equal(contactResponse.status, 200);
  const contactHtml = await contactResponse.text();
  assert.match(contactHtml, /behavior is the hard part/i);
  assert.match(contactHtml, /@madebytanishk/);
  assert.match(contactHtml, /rel="canonical" href="https:\/\/portfolio\.test\/contact"/);

  assert.ok([301, 302, 307, 308].includes(resumeResponse.status));
  assert.equal(new URL(resumeResponse.headers.get("location")).pathname, "/about");
  assertCleanEncoding(aboutHtml + contactHtml);
});

test("returns a non-indexable authored 404", async () => {
  const response = await render("/this-route-does-not-exist");
  assert.equal(response.status, 404);
  const html = await response.text();
  assert.match(html, /Outside the index/);
  assert.match(html, /(?:name="robots" content="noindex|content="noindex" name="robots")/);
  assertCleanEncoding(html);
});

test("exposes crawl metadata on the request origin", async () => {
  const [sitemapResponse, robotsResponse] = await Promise.all([
    render("/sitemap.xml", "application/xml"),
    render("/robots.txt", "text/plain"),
  ]);

  assert.equal(sitemapResponse.status, 200);
  assert.match(await sitemapResponse.text(), /https:\/\/portfolio\.test\/work\/remainder/);
  assert.equal(robotsResponse.status, 200);
  assert.match(await robotsResponse.text(), /Sitemap: https:\/\/portfolio\.test\/sitemap\.xml/);
});

test("keeps housing and case-study interaction contracts explicit", async () => {
  const [
    data,
    index,
    css,
    polish,
    experience,
    caseCss,
    hiring,
    layout,
    header,
    motion,
    projectPage,
    artifacts,
    navigator,
    manifest,
    packageJson,
  ] = await Promise.all([
    readFile(new URL("../app/data/portfolio.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/components/living-index.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
    readFile(new URL("../app/polish.css", import.meta.url), "utf8"),
    readFile(new URL("../app/experience.css", import.meta.url), "utf8"),
    readFile(new URL("../app/case-studies.css", import.meta.url), "utf8"),
    readFile(new URL("../app/hiring.css", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/components/site-header.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/components/motion-director.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/work/[slug]/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/components/case-artifacts.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/components/case-navigator.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/manifest.ts", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
  ]);

  assert.match(data, /legacySlugs: \["command-center"\]/);
  assert.match(data, /responsibilities: \[/);
  assert.match(data, /rejectedPaths: \[/);
  assert.match(data, /systemLayers: \[/);
  assert.match(data, /nextTest: \{/);
  assert.match(index, /type="range"/);
  assert.match(index, /aria-valuetext/);
  assert.match(index, /data-phase=\{phase\}/);
  assert.match(index, /data-pass=\{depth > 50/);
  assert.match(index, /--rule-reveal/);
  assert.match(index, /--consequence-reveal/);
  assert.match(index, /aria-live="polite"/);
  assert.match(index, /<a\s+className=\{`instrument-panel/);
  assert.doesNotMatch(index, /<Link[^>]+projectHref/);
  assert.doesNotMatch(index, /history\.pushState|startViewTransition|project-row--proof/);
  assert.match(css, /prefers-reduced-motion:\s*reduce/);
  assert.match(css, /forced-colors:\s*active/);
  assert.match(polish, /prefers-contrast:\s*more/);
  assert.match(experience, /@view-transition/);
  assert.match(experience, /navigation:\s*auto/);
  assert.match(experience, /instrument-field/);
  assert.match(experience, /clip-path: inset\(0 calc\(100% - var\(--rule-reveal\)\)/);
  assert.match(experience, /exposure-plane--consequence/);
  assert.match(experience, /--signal:\s*#d8ff4f/);
  assert.doesNotMatch(experience, /radial-gradient|orbit-turn|pointer-x|project-row--proof/);
  assert.match(caseCss, /case-title-lockup/);
  assert.match(caseCss, /case-instrument/);
  assert.match(caseCss, /evidence-ledger/);
  assert.match(caseCss, /prefers-reduced-motion:\s*reduce/);
  assert.match(caseCss, /forced-colors:\s*active/);
  assert.match(hiring, /about-facts/);
  assert.match(motion, /IntersectionObserver/);
  assert.doesNotMatch(motion, /pointermove|--pointer-x|page-progress/);
  assert.match(projectPage, /CaseNavigator/);
  assert.match(projectPage, /Built and verified/);
  assert.match(projectPage, /Not yet proven/);
  assert.match(artifacts, /"use client"/);
  assert.match(artifacts, /aria-pressed=\{value === option.value\}/);
  assert.match(artifacts, /Review candidate memory/);
  assert.match(artifacts, /Choose a juror perspective/);
  assert.match(artifacts, /Reply to the machine reading/);
  assert.match(artifacts, /Inspect a delegation phase/);
  assert.match(artifacts, /Judge the provisional rule/);
  assert.match(navigator, /Case study · 5 chapters/);
  assert.match(layout, /className="skip-link"/);
  assert.match(layout, /MotionDirector/);
  assert.match(layout, /case-studies\.css/);
  assert.match(header, /System exposure/);
  assert.match(header, /Instrument/);
  assert.match(manifest, /display: "browser"/);
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);

  await access(new URL("../public/projects/atlas/atlas.png", import.meta.url));
  await access(new URL("../public/projects/invisible-interfaces/return.png", import.meta.url));
  await assert.rejects(access(new URL("../app/_sites-preview", import.meta.url)));
});
