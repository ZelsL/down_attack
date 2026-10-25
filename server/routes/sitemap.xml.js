export default defineEventHandler((event) => {
  const { origin } = getRequestURL(event);

  const routes = [
    { path: "/", changefreq: "weekly", priority: "1.0" },
    { path: "/calculator", changefreq: "weekly", priority: "0.9" },
    { path: "/solare", changefreq: "weekly", priority: "0.9" },
    { path: "/privacy", changefreq: "monthly", priority: "0.3" },
    { path: "/terms", changefreq: "monthly", priority: "0.3" },
  ];

  const urlsXml = routes
    .map(
      (route) => `  <url>
    <loc>${origin}${route.path}</loc>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`,
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlsXml}
</urlset>
`;

  setResponseHeader(event, "Content-Type", "application/xml; charset=utf-8");
  return xml;
});
