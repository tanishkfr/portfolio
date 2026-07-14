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

test("server-renders a clear introduction and one operable interaction score", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  const html = await response.text();

  for (const phrase of [
    "I design the moment a system becomes",
    "Tanishk · Interaction designer · Bangalore",
    "Daynero · AI-native finance",
    "Four working investigations",
    "Five systems. One reading head",
    "Encounter",
    "Rule",
    "Consequence",
    "Design or Disaster",
    "Pentimento",
    "Invisible Interfaces",
    "Atlas",
    "Available for work",
    "madebytanishk@gmail.com",
  ]) {
    assert.match(html, new RegExp(phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }

  assert.equal((html.match(/class="score-voice score-voice--/g) ?? []).length, 5);
  assert.match(html, /type="range"/);
  assert.match(html, /aria-label="Choose a movement of the score"/);
  assert.match(html, /aria-valuetext=/);
  assert.match(html, /rel="canonical" href="https:\/\/portfolio\.test\/"/);
  assert.doesNotMatch(html, /housing is exposing|Portfolio instrument|Drag the plane|class="work-grid"/i);
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
      "Try the core interaction",
      "What this proves",
      "What I made accountable",
      "What I rejected",
      "Built and verified",
      "Not yet proven",
      "The next honest test",
      "Experience the project",
      "Inspect the source",
    ]) {
      assert.match(html, new RegExp(phrase));
    }
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
    motion,
    projectPage,
    signature,
    artifacts,
    css,
    nextConfig,
    packageJson,
    vercel,
    worker,
  ] = await Promise.all([
    readFile(new URL("../app/data/portfolio.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/components/living-index.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/components/motion-director.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/work/[slug]/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/components/project-signature.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/components/case-artifacts.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/home-system.css", import.meta.url), "utf8"),
    readFile(new URL("../next.config.ts", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
    readFile(new URL("../vercel.json", import.meta.url), "utf8"),
    readFile(new URL("../worker/index.ts", import.meta.url), "utf8"),
  ]);

  assert.match(data, /availability\?: "published" \| "preview"/);
  assert.match(data, /id: "daynero"/);
  assert.doesNotMatch(data, /remainder|command-center/i);
  assert.match(index, /type="range"/);
  assert.match(index, /key=\{`\$\{project\.id\}-\$\{phase\}`\}/);
  assert.match(index, /Five systems\. One reading head/);
  assert.equal((index.match(/score-voice--/g) ?? []).length, 1);
  assert.doesNotMatch(index, /work-grid|work-card--|exposure-plane|housing is exposing/i);
  assert.match(motion, /IntersectionObserver/);
  assert.match(motion, /--scroll-progress/);
  assert.doesNotMatch(motion, /pointermove|--pointer-x/);
  assert.match(projectPage, /DayneroPreview/);
  assert.match(projectPage, /ProjectSignature/);
  assert.match(projectPage, /project\.sourceUrl \?/);
  for (const artifact of ["daynero", "disaster", "pentimento", "invisible", "atlas"]) {
    assert.match(signature, new RegExp(`signature-${artifact}`));
  }
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
