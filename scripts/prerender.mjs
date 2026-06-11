// Build-time prerendering for the LivelyLightingCo SPA.
//
// Why: the app renders client-side, so the initial HTML response was an empty
// shell. Crawlers and AI answer engines that don't execute JS saw no content.
// This script renders each public route in headless Chromium and writes the
// fully-rendered HTML into dist/<route>/index.html, so the server response now
// contains the real headline, body copy, links, and per-route head tags.
//
// It CRAWLS: starting from a few seed routes it follows internal links, so new
// pages (e.g. /locations/<city>-<state>) are picked up automatically with no
// route-list to maintain. It also writes dist/sitemap.xml from the routes it
// rendered, keeping the sitemap in sync.
//
// The client still boots normally (createRoot re-renders), so no hydration
// changes are needed. Prerendering is best-effort: if Chromium can't launch the
// build still succeeds and ships as CSR — never break a production deploy.

import { createServer } from "node:http";
import { readFile, writeFile, mkdir, stat } from "node:fs/promises";
import { join, extname, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST = join(__dirname, "..", "dist");
const PORT = 4178;
const SITE_URL = "https://livelylightingco.com";

// Crawl starts here; everything else is discovered by following links.
const SEED_ROUTES = ["/", "/about", "/contact", "/compare", "/locations"];
// Never prerender or sitemap these (noindex + auth).
const EXCLUDE_PREFIXES = ["/admin"];
const MAX_ROUTES = 500; // runaway-crawl backstop

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".map": "application/json; charset=utf-8",
};

// Minimal static server for dist/ with SPA fallback to index.html.
async function serveStatic() {
  const indexHtml = await readFile(join(DIST, "index.html"));
  const server = createServer(async (req, res) => {
    try {
      const urlPath = decodeURIComponent(new URL(req.url, "http://localhost").pathname);
      let filePath = join(DIST, urlPath);
      let info = null;
      try {
        info = await stat(filePath);
      } catch {
        /* not found */
      }
      if (info?.isDirectory()) {
        filePath = join(filePath, "index.html");
        try {
          info = await stat(filePath);
        } catch {
          info = null;
        }
      }
      if (info?.isFile()) {
        res.writeHead(200, {
          "Content-Type": MIME[extname(filePath)] || "application/octet-stream",
        });
        res.end(await readFile(filePath));
        return;
      }
      res.writeHead(200, { "Content-Type": MIME[".html"] });
      res.end(indexHtml);
    } catch {
      res.writeHead(500);
      res.end("prerender static server error");
    }
  });
  await new Promise((resolve) => server.listen(PORT, resolve));
  return server;
}

// Reduce a raw href to a crawlable internal route, or null to skip it.
function normalizeRoute(href) {
  if (!href) return null;
  href = href.trim();
  // Same-origin path links only: must start with a single "/".
  if (!href.startsWith("/") || href.startsWith("//")) return null;
  // Drop hash and query.
  href = href.split("#")[0].split("?")[0];
  if (!href) return null;
  // Collapse trailing slash (except root).
  if (href.length > 1 && href.endsWith("/")) href = href.slice(0, -1);
  if (EXCLUDE_PREFIXES.some((p) => href === p || href.startsWith(p + "/"))) return null;
  // Skip links that point at a file asset rather than a route.
  if (extname(href)) return null;
  return href;
}

function buildSitemap(routes, lastmod) {
  const priority = (r) => (r === "/" ? "1.0" : r === "/contact" ? "0.9" : "0.8");
  const urls = routes
    .map(
      (r) =>
        `  <url>\n    <loc>${SITE_URL}${r === "/" ? "/" : r}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>${priority(r)}</priority>\n  </url>`
    )
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

async function main() {
  let chromium;
  try {
    ({ chromium } = await import("playwright"));
  } catch (e) {
    console.warn(
      "[prerender] playwright not installed — skipping prerender, site ships as CSR. " +
        e.message
    );
    return;
  }

  const server = await serveStatic();

  let browser;
  try {
    browser = await chromium.launch({ headless: true });
  } catch (e) {
    console.warn(
      "[prerender] could not launch Chromium — skipping prerender, site ships as CSR. " +
        e.message.split("\n")[0]
    );
    server.close();
    return;
  }

  const queue = [...SEED_ROUTES];
  const seen = new Set();
  const rendered = [];
  const results = [];

  while (queue.length && seen.size < MAX_ROUTES) {
    const route = queue.shift();
    if (seen.has(route)) continue;
    seen.add(route);

    const page = await browser.newPage();
    try {
      await page.goto(`http://localhost:${PORT}${route}`, {
        waitUntil: "load",
        timeout: 30000,
      });
      await page.waitForSelector("main", { timeout: 15000 });
      try {
        await page.waitForLoadState("networkidle", { timeout: 8000 });
      } catch {
        /* websockets may keep the network busy; proceed */
      }

      const { html, links } = await page.evaluate(() => ({
        html: "<!DOCTYPE html>\n" + document.documentElement.outerHTML,
        links: [...document.querySelectorAll("a[href]")].map((a) =>
          a.getAttribute("href")
        ),
      }));

      const outDir = route === "/" ? DIST : join(DIST, route);
      await mkdir(outDir, { recursive: true });
      await writeFile(join(outDir, "index.html"), html, "utf8");
      rendered.push(route);
      results.push({ route, ok: true, bytes: html.length });

      // Enqueue newly discovered internal routes.
      for (const href of links) {
        const next = normalizeRoute(href);
        if (next && !seen.has(next) && !queue.includes(next)) queue.push(next);
      }
    } catch (e) {
      results.push({ route, ok: false, error: e.message.split("\n")[0] });
    } finally {
      await page.close();
    }
  }

  // Sitemap from the routes we actually rendered.
  if (rendered.length) {
    const lastmod = new Date().toISOString().slice(0, 10);
    await writeFile(
      join(DIST, "sitemap.xml"),
      buildSitemap(rendered.sort(), lastmod),
      "utf8"
    );
  }

  await browser.close();
  server.close();

  console.log("[prerender] results:");
  for (const r of results) {
    console.log(
      r.ok
        ? `  ✓ ${r.route}  (${r.bytes.toLocaleString()} bytes)`
        : `  ✗ ${r.route}  — ${r.error}`
    );
  }
  console.log(`[prerender] sitemap.xml written with ${rendered.length} URLs`);
  const failed = results.filter((r) => !r.ok);
  if (failed.length) {
    console.warn(
      `[prerender] ${failed.length} route(s) failed to prerender; they ship as CSR.`
    );
  }
}

main().catch((e) => {
  // Never fail the production build because of prerendering.
  console.warn("[prerender] unexpected error — skipping prerender:", e.message);
});
