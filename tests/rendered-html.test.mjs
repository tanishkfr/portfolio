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

test("server-renders the folio at / and the concise index at ?mode=review", async () => {
  // `/` is Explore — the primary folio. Each URL's own reading is what the
  // server sends, so a no-JavaScript visitor gets the reading the address
  // promises, and hydration never flashes the other reading.
  const folioResponse = await render();
  assert.equal(folioResponse.status, 200);
  const folio = await folioResponse.text();
  assert.match(folio, /data-explore-cover/);
  /* The masthead's letters are individual width states (CoverName); the
     readable name is carried for assistive tech, so the h1 still says
     Tanishk without JavaScript. */
  assert.match(folio, /xp-cover-name" aria-hidden="true"><span class="xp-cover-letter">T</);
  assert.match(folio, /<span class="sr-only">Tanishk<\/span>/);
  assert.match(folio, /Things that only make sense in (<strong>)?motion(<\/strong>)?\./);
  assert.match(folio, /Product \/ Interaction Designer · Bengaluru/);
  assert.match(folio, /One sheet per project/);
  /* the project count is stated once on the folio — the handoff line —
     never again in the cover deck or the field head */
  assert.equal((folio.match(/[Ss]ix/g) ?? []).length, 1);
  assert.match(folio, /Six projects · each one live online/);
  assert.equal((folio.match(/data-explore-piece/g) ?? []).length, 6);
  /* The folio ends once: the narrative close hands off to the global
     footer, which carries the page's only contact address. */
  assert.match(folio, /Have something that needs a better behaviour\?/);
  /* The close offers the one action the statement was leading to — a small
     mono CTA to the contact page, not a second contact section. */
  assert.match(folio, /href="\/contact"[^>]*class="xp-close-cta"[^>]*>Tell me about it|class="xp-close-cta"[^>]*href="\/contact"[^>]*>Tell me about it/);
  assert.doesNotMatch(folio, /xp-close-mail/);
  assert.equal((folio.match(/class="site-footer"/g) ?? []).length, 1);
  assert.equal((folio.match(/class="footer-invite"/g) ?? []).length, 1);
  assert.ok(
    folio.indexOf('class="xp-close"') < folio.indexOf('class="site-footer"'),
    "the close precedes the global footer",
  );
  assert.match(folio, /id="work"/);
  /* One Projects destination in the nav, with the two readings as an
     explicit control beside it — not two top-level pages repeating
     each other. */
  assert.match(folio, />Projects</);
  assert.match(folio, />Quick view</);
  assert.match(folio, />Explore</);
  assert.match(folio, />Résumé</);
  assert.ok(folio.includes('href="/?mode=review"'), "Quick view is a real URL");
  assert.ok(folio.includes('href="/resume"'), "Résumé is a real destination");
  /* Utility CTAs are literal: staying inside is named as a case study,
     leaving names what opens — and never the old ambiguous pair. */
  assert.match(folio, /Read case study/);
  assert.ok(folio.includes("Visit studio site"), "Fluxion's CTA names the studio site");
  assert.ok(folio.includes("Open interactive essay"), "Invisible Interfaces' CTA names the essay");
  assert.doesNotMatch(folio, /Enter the case|>Open live</);
  assert.match(folio, /location\.search/);
  assert.match(folio, /data-mode="full"/);
  assert.match(folio, /theme-color" content="#e8eae4"/);
  assert.match(folio, /rel="canonical" href="https:\/\/portfolio\.test\/"/);
  assert.doesNotMatch(
    folio,
    /class="exhibit|claim-line|ex-zone|ex-arrival|deck-name|thinking-line|Ask five systems/i,
  );
  assertCleanEncoding(folio);

  // `/?mode=review` is the fast index: a catalogue line, then six rows
  // whose middle columns are the projects' own working objects.
  const workResponse = await render("/?mode=review");
  assert.equal(workResponse.status, 200);
  const html = await workResponse.text();

  assert.match(html, /class="review"/);
  assert.match(html, /Six selected projects\./);
  assert.match(html, /the row.s own object is live/);
  /* the index names itself as the other reading of the same projects */
  assert.match(html, /The same projects as Explore/);
  assert.ok(html.includes('href="/"'), "Explore is a real URL");
  /* the fast list carries the same literal internal CTA as the folio */
  assert.match(html, /Read case study/);

  const works = [
    { slug: "fluxion-studios", title: "Fluxion Studios", artifact: "fluxion" },
    { slug: "design-or-disaster", title: "Design or Disaster", artifact: "disaster" },
    { slug: "pentimento", title: "Pentimento", artifact: "pentimento" },
    { slug: "invisible-interfaces", title: "Invisible Interfaces", artifact: "invisible" },
    { slug: "atlas", title: "Atlas", artifact: "atlas" },
    { slug: "daynero", title: "Daynero", artifact: "daynero" },
  ];
  for (const work of works) {
    assert.ok(html.includes(`href="/work/${work.slug}?from=work"`), `${work.slug} link`);
    assert.ok(html.includes(`id="project-${work.slug}"`), `${work.slug} row id`);
    assert.ok(html.includes(`data-artifact="${work.artifact}"`), `${work.slug} artifact`);
    assert.ok(html.includes(work.title), `${work.slug} title`);
  }
  assert.equal((html.match(/class="work-row"/g) ?? []).length, 6);

  /* THE INDEX MUST SHOW WORK, NOT ONLY DESCRIBE IT. Every row's stage is
     a native, operating instrument — the same objects the folio runs —
     never a screenshot standing in for a behaviour. */
  for (const instrument of ["xp-flux", "xp-dod", "xp-pent", "xp-away", "xp-atlas", "xp-day"]) {
    assert.match(html, new RegExp(`class="xp-room-shot ${instrument}`), instrument);
  }
  assert.match(html, /\/projects\/design-or-disaster\/case-010\.jpg/);
  assert.match(html, /\/projects\/fluxion\/wordmark-transparent\.png/);
  assert.match(html, /You fell out of love with film in 2023\./);
  assert.match(html, /Absence demonstration\./);
  assert.match(html, /An authored rule revision/);
  assert.match(html, /Illustrative spending example/);

  // Both readings are offered as real URLs, and the URL selects the reading.
  /* Work resolves onto the global closing plate exactly once; Explore keeps
     its own authored close and must not double-end. */
  assert.equal((html.match(/class="site-footer"/g) ?? []).length, 1);
  assert.doesNotMatch(html, /Under construction|role="dialog"/);
  assert.doesNotMatch(
    html,
    /class="exhibit|claim-line|ex-zone|ex-arrival|deck-name|thinking-line|Ask five systems/i,
  );
  assertCleanEncoding(html);

  // `/?mode=full` remains an accepted, server-answered reading of the folio.
  const fullResponse = await render("/?mode=full");
  assert.equal(fullResponse.status, 200);
  const fullHtml = await fullResponse.text();
  assert.match(fullHtml, /data-explore-cover/);
  assert.match(fullHtml, /location\.search/);
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

test("renders an honest Daynero preview and names its case boundary", async () => {
  const response = await render("/work/daynero");
  assert.equal(response.status, 200);
  const html = await response.text();

  for (const phrase of [
    "Full case in preparation",
    "Commercial product · case in preparation",
    "What you can spend today, and why.",
    "first-paycheck",
    "Visit daynero.com",
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
  /* the page reads person-first: who, where, what he is doing now */
  assert.match(aboutHtml, /product and interaction designer in Bengaluru/);
  assert.match(aboutHtml, /Human Center(ed)? Design at Srishti Manipal/);
  assert.match(aboutHtml, /Tanishk at a glance/);
  assert.match(aboutHtml, /The work, right now\./);
  assert.match(aboutHtml, /five-person team/);
  assert.match(aboutHtml, /Taamboolam/);
  assert.match(aboutHtml, /Ariadne/);
  assert.match(aboutHtml, /Fluxion Studios/);
  assert.match(aboutHtml, /its full case is still being documented/);
  assert.match(aboutHtml, /four independent projects/);
  assert.match(aboutHtml, /I work with AI deliberately/);
  assert.match(aboutHtml, /href="\/work\/pentimento\?from=work"/);
  assert.match(aboutHtml, /rel="canonical" href="https:\/\/portfolio\.test\/about"/);

  assert.equal(contactResponse.status, 200);
  const contactHtml = await contactResponse.text();
  assert.match(contactHtml, /interaction is hard to explain/i);
  assert.match(contactHtml, /madebytanishk@gmail\.com/);
  assert.match(contactHtml, /linkedin\.com\/in\/tanishksalagame/);
  assert.match(contactHtml, /github\.com\/tanishkfr/);
  assert.doesNotMatch(contactHtml, /twitter\.com|x\.com/);

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
    exploreCss,
    motion,
    projectPage,
    artifacts,
    transitionLink,
    siteHeader,
    mode,
    css,
    invisibleAway,
    nextConfig,
    packageJson,
    vercel,
    worker,
    fluxionMark,
    fluxionSpecimen,
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
    readFile(new URL("../app/components/mode.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/styles/system.css", import.meta.url), "utf8"),
    readFile(new URL("../app/components/invisible-away.tsx", import.meta.url), "utf8"),
    readFile(new URL("../next.config.ts", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
    readFile(new URL("../vercel.json", import.meta.url), "utf8"),
    readFile(new URL("../worker/index.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/components/fluxion-mark.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/components/fluxion-specimen.tsx", import.meta.url), "utf8"),
  ]);

  assert.match(data, /availability\?: "published" \| "preview" \| "coming-soon"/);
  assert.match(data, /id: "daynero"/);
  assert.doesNotMatch(data, /remainder|command-center/i);
  assert.match(data, /form: "Spatial critique archive"/);

  // Two ways in: work-index only dispatches, so no design lives in it.
  assert.match(index, /ReviewIndex/);
  assert.match(index, /Explore/);

  // Explore is a working folio: a draggable cover, an addressable index, and
  // six sticky sheets with distinct project mechanics.
  assert.doesNotMatch(explore, /CoverIndex/); // the hero is identity + handoff, not an index
  assert.match(explore, /xp-piece-stack/);
  assert.match(explore, /data-explore-piece/);
  assert.match(explore, /TransitionLink/);
  /* Every sheet carries its own usable mechanic, not a sealed modal. */
  for (const mechanic of [
    "FluxionSpecimen",
    "DisasterMark",
    "PentimentoStrike",
    "InvisibleAway",
    "AtlasRule",
    "DayneroNumber",
  ]) {
    assert.match(explore, new RegExp(mechanic));
  }
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
  assert.match(motion, /IntersectionObserver/);
  assert.match(motion, /--scroll-progress/);
  assert.doesNotMatch(motion, /pointermove|--pointer-x/);
  assert.match(exploreCss, /position:\s*sticky/);
  assert.match(exploreCss, /clip-path/);
  assert.match(exploreCss, /prefers-reduced-motion:\s*reduce/);

  /* P0 REGRESSION — the Invisible Interfaces example return.
     A pinned sheet's on-screen box is fixed at one viewport, so content the
     sheet grows downward can never be scrolled into view: the next sticky
     sheet slides over it before the result is readable. The inspection is
     therefore a stage-contained overlay layer (role=dialog, positioned
     against .xp-piece-stage), never an in-flow expansion — the sheet keeps
     its size, the next sheet keeps its arrival, and the result stays inside
     the intended panel. */
  const awayExampleRule = exploreCss.match(/\.xp-away-example\s*\{[^}]*\}/)?.[0] ?? "";
  assert.match(
    awayExampleRule,
    /position:\s*absolute/,
    "the example return must be a stage-contained overlay, not in-flow growth",
  );
  assert.match(awayExampleRule, /inset:\s*0/);
  assert.match(awayExampleRule, /overflow:\s*hidden auto/);
  assert.match(invisibleAway, /role="dialog"/);
  assert.match(invisibleAway, /aria-modal="true"/);
  assert.match(invisibleAway, /aria-expanded=\{showReturn\}/);
  assert.match(invisibleAway, /"Escape"/);
  /* the modal claim is honored: Tab is wrapped inside the dialog */
  assert.match(invisibleAway, /event\.key !== "Tab"/);
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
  /* Session-scoped on purpose: a reviewer who once chose the digest should not
     be silently returned to it on a later visit and never see the work. */
  assert.match(mode, /useSyncExternalStore/);
  assert.match(mode, /sessionStorage/);
  assert.doesNotMatch(mode, /localStorage/);
  assert.match(mode, /dataset\.mode/);
  /* The header owns the in-place switch: no route change, no lost reading. */
  assert.match(siteHeader, /history\.replaceState/);
  assert.match(siteHeader, /window\.scrollTo\(/);
  // two modes, not three — and no stale edition contract left anywhere
  assert.match(css, /data-mode="review"/);
  assert.match(css, /route-fade-in/);
  assert.doesNotMatch(css, /data-edition=/);
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
  assert.match(fluxionMark, /\/projects\/fluxion\/wordmark-transparent\.png/);
  assert.match(artifacts, /\/projects\/fluxion\/wordmark-transparent\.png/);

  /* The Explore specimen is built from real captures of the shipped studio
     site — the desktop home plate and the same page at mobile width — not a
     mockup. */
  assert.match(fluxionSpecimen, /\/projects\/fluxion\/site-home-desktop\.png/);
  assert.match(fluxionSpecimen, /\/projects\/fluxion\/site-home-mobile\.png/);
  assert.match(fluxionSpecimen, /https:\/\/fluxion-studios\.vercel\.app\//);

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
