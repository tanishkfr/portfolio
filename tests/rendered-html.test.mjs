import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

async function render(
  path = "/",
  accept = "text/html",
  extraHeaders = {},
) {
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
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

function assertCleanEncoding(html) {
  assert.doesNotMatch(html, /Â|Ã|â€”|â†|âœ|ï¿½/);
}

test("server-renders the interactive five-project proof index", async () => {
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
    "Inspect the behavior, not just the outcome",
    "Interaction proof",
    "05 live interactive artifacts",
    "Available for interaction design work",
    "madebytanishk@gmail.com",
  ]) {
    assert.match(html, new RegExp(phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }
  assert.ok(html.indexOf("Remainder") < html.indexOf("Invisible Interfaces"));
  assert.equal((html.match(/class="proof-visual/g) ?? []).length, 5);
  assert.match(html, /rel="canonical" href="https:\/\/portfolio\.test\/"/);
  assert.doesNotMatch(
    html,
    /placeholder|coming soon|pending verified|codex-preview|Your site is taking shape/i,
  );
  assertCleanEncoding(html);
});

test("server-renders all five canonical, evidence-bounded case studies", async () => {
  const cases = [
    ["design-or-disaster", "A verdict begins with a mark"],
    ["pentimento", "The subject edits the account"],
    ["invisible-interfaces", "Leaving is the consequential action"],
    ["atlas", "A rule travels until it breaks"],
    ["remainder", "From conversation to reviewed memory"],
  ];

  for (const [slug, uniqueHeading] of cases) {
    const response = await render(`/work/${slug}`);
    assert.equal(response.status, 200);
    const html = await response.text();
    assert.match(html, new RegExp(uniqueHeading));
    for (const section of [
      "The problem",
      "What changed",
      "The interaction",
      "Design decisions",
      "Evidence boundary",
      "Limits and next move",
      "Open live work",
      "View source",
      "My contribution",
      "Independent · end to end",
    ]) {
      assert.match(html, new RegExp(section));
    }
    assert.match(
      html,
      new RegExp(
        `rel="canonical" href="https:\\/\\/portfolio\\.test\\/work\\/${slug}"`,
      ),
    );
    assertCleanEncoding(html);
  }
});

test("keeps dynamic project navigation payloads valid", async () => {
  const slugs = [
    "design-or-disaster",
    "pentimento",
    "invisible-interfaces",
    "atlas",
    "remainder",
  ];

  for (const slug of slugs) {
    const response = await render(
      `/work/${slug}.rsc?from=all&_rsc`,
      "text/x-component",
      { RSC: "1" },
    );
    assert.equal(response.status, 200);
    assert.match(
      response.headers.get("content-type") ?? "",
      /^text\/x-component\b/i,
    );
    assert.ok((await response.text()).length > 1000);
  }
});

test("preserves legacy project URLs with canonical redirects", async () => {
  const aliases = [
    ["command-center", "/work/remainder"],
    ["invisible-interactions", "/work/invisible-interfaces"],
  ];
  for (const [legacySlug, expectedPath] of aliases) {
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
  assert.match(
    aboutHtml,
    /rel="canonical" href="https:\/\/portfolio\.test\/about"/,
  );

  assert.equal(contactResponse.status, 200);
  const contactHtml = await contactResponse.text();
  assert.match(contactHtml, /behavior is the hard part/i);
  assert.match(contactHtml, /@madebytanishk/);
  assert.match(
    contactHtml,
    /rel="canonical" href="https:\/\/portfolio\.test\/contact"/,
  );

  assert.ok([301, 302, 307, 308].includes(resumeResponse.status));
  assert.equal(new URL(resumeResponse.headers.get("location")).pathname, "/about");
  assertCleanEncoding(aboutHtml + contactHtml);
});

test("returns a non-indexable authored 404", async () => {
  const response = await render("/this-route-does-not-exist");
  assert.equal(response.status, 404);
  const html = await response.text();
  assert.match(html, /Outside the index/);
  assert.match(
    html,
    /(?:name="robots" content="noindex|content="noindex" name="robots")/,
  );
  assertCleanEncoding(html);
});

test("exposes crawl metadata on the request origin", async () => {
  const [sitemapResponse, robotsResponse] = await Promise.all([
    render("/sitemap.xml", "application/xml"),
    render("/robots.txt", "text/plain"),
  ]);

  assert.equal(sitemapResponse.status, 200);
  const sitemap = await sitemapResponse.text();
  assert.match(sitemap, /https:\/\/portfolio\.test\/work\/remainder/);
  assert.match(sitemap, /https:\/\/portfolio\.test\/contact/);

  assert.equal(robotsResponse.status, 200);
  assert.match(
    await robotsResponse.text(),
    /Sitemap: https:\/\/portfolio\.test\/sitemap\.xml/,
  );
});

test("keeps navigation, motion, URL, asset, and accessibility foundations explicit", async () => {
  const [
    data,
    index,
    css,
    polish,
    experience,
    hiring,
    layout,
    header,
    motion,
    projectPage,
    manifest,
    packageJson,
  ] = await Promise.all([
    readFile(new URL("../app/data/portfolio.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/components/living-index.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
    readFile(new URL("../app/polish.css", import.meta.url), "utf8"),
    readFile(new URL("../app/experience.css", import.meta.url), "utf8"),
    readFile(new URL("../app/hiring.css", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/components/site-header.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/components/motion-director.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/work/[slug]/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/manifest.ts", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
  ]);

  assert.match(data, /legacySlugs: \["command-center"\]/);
  for (const lens of [
    "evidence-judgment",
    "agency-authority",
    "memory-lineage",
    "visibility-accountability",
  ]) {
    assert.match(data, new RegExp(`"${lens}"`));
  }
  assert.match(index, /history\.pushState/);
  assert.match(index, /startViewTransition/);
  assert.match(index, /aria-live="polite"/);
  assert.match(index, /aria-controls="project-list"/);
  assert.match(index, /<a href=\{projectHref\}>/);
  assert.doesNotMatch(index, /<Link href=\{projectHref\}>/);
  assert.match(css, /prefers-reduced-motion:\s*reduce/);
  assert.match(css, /forced-colors:\s*active/);
  assert.match(polish, /prefers-contrast:\s*more/);
  assert.match(experience, /@view-transition/);
  assert.match(experience, /navigation:\s*auto/);
  assert.match(experience, /project-row--proof/);
  assert.match(motion, /pointer:\s*fine/);
  assert.match(hiring, /about-facts/);
  assert.match(motion, /IntersectionObserver/);
  assert.match(projectPage, /CaseNavigator/);
  assert.match(layout, /className="skip-link"/);
  assert.match(layout, /MotionDirector/);
  assert.doesNotMatch(layout, /alternates:\s*{\s*canonical:\s*"\/"/);
  assert.doesNotMatch(header, /header-actions/);
  assert.match(manifest, /display: "browser"/);
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);

  await access(new URL("../public/projects/atlas/atlas.png", import.meta.url));
  await access(
    new URL("../public/projects/invisible-interfaces/return.png", import.meta.url),
  );
  await assert.rejects(access(new URL("../app/_sites-preview", import.meta.url)));
});
