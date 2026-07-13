import { projects } from "../data/portfolio";

export async function GET(request: Request) {
  const origin = new URL(request.url).origin;
  const paths = ["/", "/about", "/contact", ...projects.map((project) => `/work/${project.slug}`)];
  const urls = paths
    .map(
      (path) =>
        `  <url><loc>${new URL(path, origin).href}</loc><changefreq>${
          path === "/" ? "weekly" : "monthly"
        }</changefreq></url>`,
    )
    .join("\n");

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`,
    { headers: { "content-type": "application/xml; charset=utf-8" } },
  );
}
