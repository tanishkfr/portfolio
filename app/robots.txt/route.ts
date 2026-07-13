export async function GET(request: Request) {
  const origin = new URL(request.url).origin;
  return new Response(
    `User-agent: *\nAllow: /\n\nSitemap: ${new URL("/sitemap.xml", origin).href}\n`,
    { headers: { "content-type": "text/plain; charset=utf-8" } },
  );
}
