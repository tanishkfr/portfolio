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

test("server-renders the folio at / — one projects reading", async () => {
  const folioResponse = await render();
  assert.equal(folioResponse.status, 200);
  const folio = await folioResponse.text();
  assert.match(folio, /data-explore-cover/);
  /* The masthead's letters are individual width states (CoverName); the
     readable name is carried for assistive tech, so the h1 still says
     Tanishk without JavaScript. */
  assert.match(folio, /xp-cover-name" aria-hidden="true"><span class="xp-cover-letter">T</);
  assert.match(folio, /<span class="sr-only">Tanishk<\/span>/);
  assert.match(
    folio,
    /Designing (<strong>)?behavior(<\/strong>)?, not just screens\./,
  );
  /* the identity block carries the role once, in the header; the
     folio's registration row states place and edition only */
  assert.match(folio, /Product &amp; Interaction Designer</);
  assert.match(folio, /Bengaluru, India/);
  assert.match(folio, /The folio · 2026/);
  assert.match(folio, /Selected projects/);
  /* the route into the work is stated once on the folio — the handoff
     cue — and it is a real control into the field, not furniture */
  assert.match(folio, /Explore selected work/);
  assert.match(folio, /class="xp-cover-handoff" href="#work"/);
  /* One clear action: Quick review is retired, and nothing on the folio
     offers a second reading mode. */
  assert.doesNotMatch(folio, /Quick review|quick-review/);
  assert.match(folio, /Explore selected work/);
  assert.equal((folio.match(/data-explore-piece/g) ?? []).length, 5);
  /* The folio ends once: the last sheet hands over to one quiet closing
     note — the folio's argument and one small Contact link — and then the
     global footer, which keeps the page's only contact address. The old
     sales-CTA language must never return. */
  assert.doesNotMatch(folio, /Have something that needs a better behaviour|Tell me about it|Let's build something|Get in touch/);
  assert.equal((folio.match(/data-close-note/g) ?? []).length, 1);
  const bridgeStart = folio.indexOf("data-close-note");
  const footerAt = folio.indexOf('class="site-footer"');
  assert.ok(bridgeStart > folio.lastIndexOf("data-explore-piece"), "the closing note follows the projects");
  assert.ok(footerAt > bridgeStart, "the footer follows the closing note");
  const bridge = folio.slice(bridgeStart, footerAt);
  assert.match(bridge, /explain themselves, adapt, and leave evidence behind/);
  assert.match(bridge, /If that sounds like the kind of problem you/);
  assert.match(bridge, /href="\/contact"/);
  assert.match(bridge, />Contact </);
  /* the bridge is not a second footer: no contact address or social
     destinations inside it */
  assert.doesNotMatch(bridge, /mailto:|footer-invite/);
  assert.equal((folio.match(/class="site-footer"/g) ?? []).length, 1);
  assert.equal((folio.match(/class="footer-invite"/g) ?? []).length, 1);
  assert.ok(
    folio.indexOf('class="footer-invite"') > folio.indexOf("data-explore-piece"),
    "the footer follows the projects",
  );
  assert.match(folio, /id="work"/);
  /* Selected Work is the five, in order, and the index numbering follows. */
  {
    const index = folio.slice(
      folio.indexOf('class="xp-field-index"'),
      folio.indexOf('class="xp-piece-stack"'),
    );
    const order = ["Fluxion Studios", "Athena", "Daynero", "Invisible Interfaces", "Design or Disaster"];
    let cursor = -1;
    for (const title of order) {
      const at = index.indexOf(title);
      assert.ok(at > cursor, `${title} appears in Selected Work order`);
      cursor = at;
    }
  }
  /* More work sits after the five sheets and before the closing note;
     Ariadne leads with its real documented workflow, then the three
     screenshot projects with verified links. */
  assert.match(folio, /class="more-work"/);
  assert.match(folio, /More work/);
  assert.match(folio, /github\.com\/tanishkfr\/ariadne/);
  assert.match(folio, /mw-feature/);
  assert.match(folio, /Route \+ Discover/);
  assert.match(folio, /Direction Lock/);
  assert.ok(
    (folio.match(/v1\.6\.7/g) ?? []).length === 1,
    "the Ariadne release is stated once, not duplicated",
  );
  assert.doesNotMatch(folio, /more-work-visual--repo|more-work-repo/);
  assert.match(folio, /8BIT Boxer/);
  assert.match(folio, /https:\/\/bag-bop\.vercel\.app\//);
  assert.ok(
    folio.includes("8bit-boxer%2Fplaying-hit.png") ||
      folio.includes("8bit-boxer/playing-hit.png"),
    "8BIT Boxer shows its real gameplay capture",
  );
  assert.ok(
    folio.indexOf('class="more-work"') > folio.lastIndexOf("data-explore-piece"),
    "More work follows the five sheets",
  );
  assert.ok(
    folio.indexOf("data-close-note") > folio.indexOf('class="more-work"'),
    "the closing note follows More work",
  );
  /* One Projects destination: the header carries plain navigation, with
     no second reading control anywhere. */
  assert.match(folio, />Projects</);
  assert.match(folio, />Résumé</);
  assert.ok(folio.includes('href="/resume"'), "Résumé is a real destination");
  assert.doesNotMatch(folio, /Quick view|nav-modes|data-mode=/);
  /* Utility CTAs are literal: staying inside is named as a case study,
     leaving names what opens — and never the old ambiguous pair. */
  assert.match(folio, /Read case study/);
  assert.ok(folio.includes("Visit studio site"), "Fluxion's CTA names the studio site");
  assert.ok(folio.includes("Open interactive essay"), "Invisible Interfaces' CTA names the essay");
  assert.doesNotMatch(folio, /Enter the case|>Open live</);
  assert.match(folio, /theme-color" content="#e8eae4"/);
  assert.match(folio, /rel="canonical" href="https:\/\/portfolio\.test\/"/);
  assert.doesNotMatch(
    folio,
    /class="exhibit|claim-line|ex-zone|ex-arrival|deck-name|thinking-line|Ask five systems/i,
  );
  /* every selected sheet now carries its own portrait, each with a real
     capture revealed on hover/focus */
  assert.ok(
    (folio.match(/class="xp-portrait/g) ?? []).length >= 5,
    "all five selected sheets carry their portrait",
  );
  for (const artifact of [
    "design-or-disaster",
    "invisible-interfaces",
    "fluxion-studios",
    "daynero",
    "athena",
  ]) {
    assert.match(folio, new RegExp(`data-portrait="${artifact}"`), artifact);
  }
  assert.doesNotMatch(folio, /data-portrait="pentimento"/);
  assert.doesNotMatch(folio, /data-portrait="atlas"/);
  /* Athena's portrait states its own idea and carries the real Explain Back
     footage — not a generic book/brain illustration. */
  assert.match(folio, /xpp-ath/);
  assert.match(folio, /Reading something is not the same as knowing it\./);
  assert.ok(
    folio.includes("athena%2Fpreview.mp4") || folio.includes("athena/preview.mp4"),
    "Athena's portrait plays the real Explain Back footage",
  );
  /* Every portrait carries real evidence: a recording with a real poster,
     or a real static capture where a recording would say no more than the
     still (Daynero's site does not change state on scroll; Invisible
     Interfaces' receipt needs a genuinely hidden tab). */
  for (const slug of [
    "fluxion",
    "athena",
    "daynero",
    "design-or-disaster",
    "invisible-interfaces",
  ]) {
    assert.ok(
      folio.includes(`${slug}%2Fpreview.mp4`) ||
        folio.includes(`${slug}/preview.mp4`) ||
        folio.includes(`${slug}%2Fbudget.jpg`) ||
        folio.includes(`${slug}/budget.jpg`) ||
        folio.includes(`${slug}%2Freturn.png`) ||
        folio.includes(`${slug}/return.png`),
      `${slug} carries real evidence`,
    );
  }
  /* The three recordings that demonstrate an interaction keep a real
     consequence-frame poster. */
  for (const slug of ["fluxion", "athena", "design-or-disaster"]) {
    assert.ok(
      folio.includes(`${slug}%2Fposter.jpg`) || folio.includes(`${slug}/poster.jpg`),
      `${slug} has a real poster frame`,
    );
  }
  /* Daynero and Invisible Interfaces are honest static captures. */
  assert.doesNotMatch(folio, /daynero(%2F|\/)preview\.mp4/);
  assert.doesNotMatch(folio, /invisible-interfaces(%2F|\/)preview\.mp4/);
  assertCleanEncoding(folio);

  /* A stale review URL still resolves to the one reading, gracefully. */
  const legacy = await render("/?mode=review");
  assert.equal(legacy.status, 200);
  assert.match(await legacy.text(), /data-explore-cover/);
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

test("retires Quick review by redirecting to the folio work anchor", async () => {
  const response = await render("/quick-review");
  /* Next answers a server redirect; whether it is 307 or 308, the
     destination must be the homepage's work anchor, and the removed
     reading mode must no longer render anywhere. */
  assert.ok(
    [301, 302, 303, 307, 308].includes(response.status),
    `expected a redirect, got ${response.status}`,
  );
  const location = response.headers.get("location") ?? "";
  assert.match(location, /\/#work$/, `redirect lands on the work anchor (got ${location})`);

  const home = await render("/");
  const folio = await home.text();
  assert.doesNotMatch(folio, /quick-review|Quick review/);
  const sitemapResponse = await render("/sitemap.xml");
  const sitemap = await sitemapResponse.text();
  assert.doesNotMatch(sitemap, /quick-review/);
});

test("renders an honest Daynero preview and names its case boundary", async () => {
  const response = await render("/work/daynero");
  const html = await response.text();

  for (const phrase of [
    "Full case in preparation",
    "Early product preview · public site live",
    "What you can spend today, and why.",
    "first-paycheck",
    "Visit daynero.com",
    // the one real public surface: the live marketing site, as shipped
    "The public product site, as shipped.",
    // orientation: the preview is part of Projects too
    "← Projects / Daynero",
    "Back to projects",
  ]) {
    assert.ok(html.includes(phrase), phrase);
  }

  assert.ok(html.includes('href="https://daynero.com/"'), "live product link");
  assert.match(html, /class="daynero-preview daynero-soon"/);
  assert.match(html, /rel="canonical" href="https:\/\/portfolio\.test\/work\/daynero"/);

  // The preview names a boundary; it does not stage evidence it cannot support.
  assert.doesNotMatch(
    html,
    /Try the core interaction|Built and verified|Read the case|daynero-soon-mark/,
  );
  assertCleanEncoding(html);
});

test("renders Athena as a team case with verified evidence and an honest boundary", async () => {
  const response = await render("/work/athena");
  assert.equal(response.status, 200);
  const html = await response.text();

  for (const phrase of [
    "Athena",
    "Working P0 prototype",
    "18 of 18 P0 acceptance criteria verified",
    "Explain Back, Cue Cards and Apply It",
    "Activity and knowledge evidence are reported apart",
    "focus group of six",
    "Team project with Nishtha, Anushrutha and Trisha",
    "What I did",
    "Main design decision",
    "What exists",
    "Still unproven",
    "Built and working",
    "Not yet proven",
    "Next test",
    "No learning-outcome study has been run",
    "illustrative scenario",
  ]) {
    assert.ok(html.includes(phrase), phrase);
  }
  // The brief is a skim layer: it does not re-state what the hero or the
  // immediately following section already says.
  assert.doesNotMatch(html, /<dt>What it is<\/dt>|<dt>Why it exists<\/dt>/);
  // Team attribution is explicit and the work is not claimed as solo.
  assert.ok(html.includes("four-person team"), "team attribution present");
  assert.doesNotMatch(html, /I ran the student research|mine end to end/);
  // Selected Work numbering: Athena is 02.
  assert.match(html, /Case 02/);
  // Real interface evidence from the working prototype, and the verified demo.
  for (const asset of ["home.png", "learn.png", "explain-report.png", "dashboard-finished.png"]) {
    assert.ok(
      html.includes(`athena%2F${asset}`) || html.includes(`athena/${asset}`),
      `Athena case shows ${asset}`,
    );
  }
  assert.ok(html.includes('href="https://athena-learning-platform-seven.vercel.app/"'));
  assert.ok(html.includes("Open the demo"));
  // The disconnected demo is stated, not implied.
  assert.ok(html.includes("disconnected"));
  // No invented embedded instrument; the captures are the evidence.
  assert.doesNotMatch(html, /Product preview|Try the interaction/);
  assert.match(html, /rel="canonical" href="https:\/\/portfolio\.test\/work\/athena"/);
  assertCleanEncoding(html);
});

test("server-renders four interactive, evidence-bounded published cases", async () => {
  const cases = [
    {
      slug: "design-or-disaster",
      summary:
        "Mark the part of an interface that shaped your judgment, explain it, then compare your reading with five others.",
      proof: "Or name a region",
      external: "Open interactive project",
      pressed: true,
    },
    {
      slug: "pentimento",
      summary:
        "Each machine-written claim shows its evidence. The person can accept it, rewrite it, or strike it, and their version leads the final page.",
      proof: "Reply to the machine reading",
      external: "Open interactive project",
      pressed: true,
    },
    {
      slug: "invisible-interfaces",
      summary:
        "A staged restoration runs only while the tab is hidden, then shows what changed, what did not, and how to discard the result.",
      proof: "Inspect a delegation phase",
      external: "Open interactive essay",
      pressed: true,
    },
    {
      slug: "atlas",
      summary:
        "Write a provisional rule, test it against three unlike cases, and keep every hold, refinement, and fracture.",
      proof: "Your current wording",
      external: "Open interactive tool",
      pressed: false,
    },
  ];

  for (const entry of cases) {
    const response = await render(`/work/${entry.slug}`);
    assert.equal(response.status, 200);
    const html = await response.text();

    assert.ok(html.includes(entry.summary), `${entry.slug} summary`);
    assert.ok(html.includes(entry.proof), `${entry.slug} instrument`);
    assert.ok(html.includes(entry.external), `${entry.slug} external CTA names what opens`);
    for (const phrase of [
      // the three-beat read replaced the five chapters, and the situation
      // states the problem the project answers
      "The situation",
      "The reasoning",
      "What it is",
      "What changed during the build",
      // the record stays: the decisions and the honest boundary
      "The record",
      "Built and working",
      "Not yet proven",
      "Next test",
      "Inspect the source",
      // the case hands over something real to inspect
      "Try the interaction",
      "What this shows",
      // orientation: the breadcrumb names the destination and the room,
      // and the case ends with the quiet way back to the projects
      "← Projects",
      "← Back to projects",
    ]) {
      assert.match(html, new RegExp(phrase));
    }
    // the retired, ambiguous CTA must be gone everywhere
    assert.doesNotMatch(html, /Open the live project/);
    // the retired publication scaffolding must be gone
    assert.doesNotMatch(html, /What I made accountable|What to remember|01 \/ Context|case-chapter/);
    // Every instrument publishes its status to assistive tech.
    assert.match(html, /aria-live="polite"/);
    // Choice-driven instruments expose real toggles: they carry aria-pressed
    // whether or not anything is selected at rest (Design or Disaster begins
    // unmarked). Atlas is a text editor, so it has no toggle group.
    if (entry.pressed) {
      assert.match(html, /aria-pressed="(?:true|false)"/);
    }
    assert.match(html, new RegExp(`rel="canonical" href="https:\\/\\/portfolio\\.test\\/work\\/${entry.slug}"`));
    assertCleanEncoding(html);
  }
});

test("keeps all canonical project navigation payloads valid", async () => {
  for (const slug of ["daynero", "fluxion-studios", "athena", "design-or-disaster", "pentimento", "invisible-interfaces", "atlas"]) {
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
  assert.match(aboutHtml, /From Pixels to Products\./);
  /* the page reads person-first: who, where, what he is doing now */
  assert.match(aboutHtml, /product and interaction designer in Bengaluru/);
  assert.match(aboutHtml, /Human Center(ed)? Design at Srishti Manipal/);
  assert.match(aboutHtml, /Tanishk at a glance/);
  assert.match(aboutHtml, /Four things running right now\./);
  assert.match(aboutHtml, /Currently making/);
  assert.match(aboutHtml, /five-person team/);
  assert.match(aboutHtml, /Taamboolam/);
  assert.match(aboutHtml, /Ariadne/);
  assert.match(aboutHtml, /v1\.6\.7 on GitHub/);
  assert.match(aboutHtml, /Fluxion Studios/);
  assert.match(aboutHtml, /preview until the full record can be published/);
  assert.match(aboutHtml, /I use AI to explore, critique and build/);
  assert.match(aboutHtml, /I remain responsible for the decisions and the work I contribute/);
  assert.match(aboutHtml, /Working with AI/);
  assert.match(aboutHtml, /an interface behaviour I kept thinking about/);
  assert.match(aboutHtml, /href="\/work\/pentimento\?from=work"/);
  assert.doesNotMatch(aboutHtml, /~\/tanishk/);
  assert.doesNotMatch(aboutHtml, /12\.9716|77\.5946/);
  assert.match(aboutHtml, /rel="canonical" href="https:\/\/portfolio\.test\/about"/);

  assert.equal(contactResponse.status, 200);
  const contactHtml = await contactResponse.text();
  /* the contact page states what he does, the two real paths (roles and
     client work), and how to reach him — no slogans */
  assert.match(contactHtml, /Have something worth building\?/);
  assert.match(contactHtml, /product and interaction designer in Bengaluru/);
  assert.match(contactHtml, /For roles and collaboration/);
  assert.match(contactHtml, /For client websites/);
  assert.match(contactHtml, /fluxion-studios\.vercel\.app/);
  assert.match(contactHtml, /madebytanishk@gmail\.com/);
  assert.match(contactHtml, /linkedin\.com\/in\/tanishksalagame/);
  assert.match(contactHtml, /github\.com\/tanishkfr/);
  assert.doesNotMatch(contactHtml, /twitter\.com|x\.com/);
  assert.doesNotMatch(contactHtml, /digital experiences|where design meets|Let's build something/);

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
  assert.doesNotMatch(sitemap, /quick-review/);
  assert.match(sitemap, /https:\/\/portfolio\.test\/work\/athena/);
  assert.doesNotMatch(sitemap, /command-center/);
  assert.equal(robotsResponse.status, 200);
  assert.match(await robotsResponse.text(), /Sitemap: https:\/\/portfolio\.test\/sitemap\.xml/);
});

test("keeps motion, image, and single-deployment contracts explicit", async () => {
  const [
    data,
    index,
    explore,
    exploreCss,
    motion,
    projectPage,
    artifacts,
    transitionLink,
    siteHeader,
    css,
    nextConfig,
    packageJson,
    vercel,
    worker,
  ] = await Promise.all([
    readFile(new URL("../app/data/portfolio.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/components/work-index.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/components/explore.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/styles/explore.css", import.meta.url), "utf8"),
    readFile(new URL("../app/components/motion-director.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/work/[slug]/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/components/case-artifacts.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/components/transition-link.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/components/site-header.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/styles/system.css", import.meta.url), "utf8"),
    readFile(new URL("../next.config.ts", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
    readFile(new URL("../vercel.json", import.meta.url), "utf8"),
    readFile(new URL("../worker/index.ts", import.meta.url), "utf8"),
  ]);

  assert.match(data, /availability\?: "published" \| "preview" \| "coming-soon"/);
  assert.match(data, /id: "daynero"/);
  assert.doesNotMatch(data, /remainder|command-center/i);
  assert.match(data, /form: "Interface critique tool"/);
  /* the folio's sequence is the data file's own order: 01 Fluxion,
     02 Daynero, then the rest in their established relative order */
  assert.ok(
    data.indexOf('slug: "fluxion-studios"') < data.indexOf('slug: "daynero"'),
    "Fluxion leads the sequence",
  );
  assert.ok(
    data.indexOf('slug: "daynero"') < data.indexOf('slug: "design-or-disaster"'),
    "Daynero follows Fluxion",
  );
  assert.ok(
    data.indexOf('slug: "design-or-disaster"') < data.indexOf('slug: "pentimento"'),
    "the remaining projects keep their relative order",
  );

  // One reading: work-index mounts the folio and the footer, nothing else.
  assert.match(index, /Explore/);
  assert.doesNotMatch(index, /ReviewIndex|useMode|setMode/);

  // Explore is a working folio: an addressable index and six sticky sheets
  // with distinct project portraits.
  assert.doesNotMatch(explore, /CoverIndex/); // the hero is identity + handoff, not an index
  assert.match(explore, /xp-piece-stack/);
  assert.match(explore, /data-explore-piece/);
  assert.match(explore, /TransitionLink/);
  /* Every Explore sheet carries its project's portrait — the only
     project preview, in both the index and the sheets. */
  assert.match(explore, /ProjectPortrait/);
  const portraits = await readFile(
    new URL("../app/components/portrait.tsx", import.meta.url),
    "utf8",
  );
  for (const behaviour of [
    "evidenceShape",
    "revisionShape",
    "absenceShape",
    "atlasShape",
    "fluxShape",
    "numberShape",
  ]) {
    assert.match(portraits, new RegExp(behaviour), behaviour);
  }
  /* the mechanical previews are gone from the reading */
  assert.doesNotMatch(explore, /DisasterMark|PentimentoStrike|InvisibleAway|AtlasRule|DayneroNumber|FluxionSpecimen/);
  /* The set carries the anchor a returning case links back to. */
  assert.match(explore, /id="work"/);
  /* Each sheet is painted with its project's own ground and reading ink. */
  assert.match(explore, /"--room"/);
  assert.match(explore, /ROOM_WORLDS/);
  /* One passive, rAF-throttled loop publishes cover and sheet progress and
     responds when the user's motion preference changes. */
  assert.match(explore, /requestAnimationFrame/);
  assert.match(explore, /addEventListener\("scroll", queueMeasure, \{ passive: true \}\)/);
  assert.match(explore, /prefers-reduced-motion: reduce/);

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

  // Each sheet is painted, not tinted: its own ground and reading ink.
  for (const slug of [
    "fluxion-studios",
    "design-or-disaster",
    "pentimento",
    "invisible-interfaces",
    "atlas",
    "daynero",
  ]) {
    assert.match(exploreCss, new RegExp(`data-project="${slug}"`));
  }
  assert.match(exploreCss, /--room-ink/);

  // The housing carries no decorative glow — pigment does the work.
  assert.doesNotMatch(exploreCss, /radial-gradient\([^)]*var\(--accent\)/);
  // and nothing shouts in tracked-out capitals
  // capitals are the poster voice and belong to the cover name alone;
  // labels, metadata and body text never shout
  const upperUses = exploreCss.match(/\.[a-z-]+\s*\{[^}]*text-transform:\s*uppercase/g) ?? [];
  assert.ok(
    upperUses.every((u) => u.includes("cover-name")),
    "uppercase is reserved for the cover name",
  );
  assert.doesNotMatch(
    index,
    /lensRelations|temperament|field-shown|data-lead|reRank|class="rank"/,
  );
  assert.doesNotMatch(
    index,
    /deck-name|deck-panel|thinking-line|claim-line|ex-zone|ex-arrival|scroll-snap|exhibit--|work-grid|type="range"|Ask five systems/i,
  );
  /* Reveals must not depend on IntersectionObserver. The entrance's own
     hidden state clips the target to zero area, and Chromium folds that
     clip into the observer's intersection rect — so a hidden target is
     reported as never intersecting and can never be revealed by
     observation. The sweep measures boxes instead, and fails open on
     anything the viewport has already passed. */
  assert.doesNotMatch(motion, /new IntersectionObserver/);
  assert.match(motion, /getBoundingClientRect/);
  assert.match(motion, /is-revealed/);
  assert.match(motion, /--scroll-progress/);
  assert.doesNotMatch(motion, /pointermove|--pointer-x/);
  assert.match(exploreCss, /position:\s*sticky/);
  assert.match(exploreCss, /clip-path/);
  assert.match(exploreCss, /prefers-reduced-motion:\s*reduce/);

  /* THE STAGE OVERLAY RULE IS GONE WITH THE INLINE INSTRUMENTS: Explore's
     sheets now carry interaction-led portraits (one legible demo of each
     project's behaviour, ASCII as supporting material), and the real
     evidence lives in the case study only. What must survive here is the
     sticky-sheet architecture and the arrival material. */
  assert.match(exploreCss, /\.xp-piece-field\s*\{[^}]*position:\s*absolute/);
  assert.doesNotMatch(exploreCss, /\.xp-away-field|\.xp-away-example|\.xp-pent-field|\.xp-atlas-field/);
  assert.match(projectPage, /DayneroPreview/);
  assert.match(projectPage, /CaseArtifact/);
  assert.match(projectPage, /project\.sourceUrl \?/);
  /* Each published project's case carries its own named instrument — the
     signature plate's role, now that the artifact is the case's art. */
  assert.match(artifacts, /case-instrument--\$\{project\}/);
  for (const instrument of ["fluxion", "disaster", "pentimento", "invisible", "atlas"]) {
    assert.match(artifacts, new RegExp(`project="${instrument}"`));
  }
  assert.match(transitionLink, /startViewTransition/);
  assert.match(transitionLink, /prefers-reduced-motion/);
  assert.match(transitionLink, /requestAnimationFrame/);
  /* One reading: no mode state, no reading control, no stale edition
     contract anywhere. The header is plain navigation. */
  assert.doesNotMatch(siteHeader, /replaceState|setMode|useMode|nav-modes/);
  /* The dock is a strict function of scroll: no idle timer, no settle to a
     nearest endpoint, no step cap that lets the wordmark lag the page. */
  assert.doesNotMatch(siteHeader, /settleTo|setTimeout|nav-residue/);
  assert.match(siteHeader, /const LANDED/);
  /* The rail is quiet: the trail and the breathing pip are gone from CSS. */
  assert.doesNotMatch(css, /nav-residue|nav-pip-breathe/);
  /* The homepage selected sequence comes from one place in the data. */
  assert.match(explore, /selectedSlugs/);
  assert.match(data, /export const selectedSlugs/);
  assert.match(index, /MoreWork/);
  assert.match(data, /slug: "athena"/);
  /* Pentimento and Atlas keep their cases and routes despite leaving the
     five-item sequence. */
  assert.match(data, /slug: "pentimento"/);
  assert.match(data, /slug: "atlas"/);
  assert.doesNotMatch(css, /data-mode=|data-edition=/);
  assert.match(css, /route-fade-in/);
  assert.match(projectPage, /TransitionLink/);
  assert.match(css, /view-transition/);
  for (const accent of ["#ef4a35", "#8b2f63", "#d79a29", "#1d756d", "#4f6612"]) {
    assert.match(data, new RegExp(accent));
  }
  assert.doesNotMatch(artifacts, /remainder|candidate memory/i);
  assert.match(css, /prefers-reduced-motion:\s*reduce/);
  assert.match(css, /forced-colors:\s*active/);
  assert.match(nextConfig, /unoptimized:\s*true/);
  assert.match(packageJson, /"build:vercel": "next build"/);
  assert.match(vercel, /"framework": "nextjs"/);
  assert.match(worker, /!env\.ASSETS \|\| !env\.IMAGES/);
  assert.match(artifacts, /\/projects\/fluxion\/wordmark-transparent\.png/);

  /* The computational-material engine and the portrait family are the
     shared representation layer; the case carries the real captures. */
  assert.match(portraits, /ProjectPortrait/);
  assert.match(portraits, /ROOM_WORLDS/);

  await access(new URL("../public/projects/atlas/atlas.png", import.meta.url));
  await access(new URL("../public/projects/invisible-interfaces/return.png", import.meta.url));
  for (const asset of [
    "mark-dark.png",
    "mark-light.png",
    "wordmark-dark.png",
    "wordmark-light.png",
    "mark-transparent.png",
    "wordmark-transparent.png",
    "site-home-desktop.png",
    "site-home-mobile.png",
  ]) {
    await access(new URL(`../public/projects/fluxion/${asset}`, import.meta.url));
  }
  await assert.rejects(access(new URL("../public/projects/remainder", import.meta.url)));
  await assert.rejects(access(new URL("../app/components/project-proof.tsx", import.meta.url)));
});
