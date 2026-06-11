// Build-time prerendering for the LivelyLightingCo SPA.
//
// Why: the app renders client-side, so the initial HTML response was an empty
// shell. Crawlers and AI answer engines that don't execute JS saw no content.
// This script renders each public route in headless Chromium and writes the
// fully-rendered HTML into dist/<route>/index.html, so the server response now
// contains the real headline, body copy, links, and per-route head tags.
//
// The client still boots normally (createRoot re-renders), so no hydration
// changes are needed. Prerendering is best-effort: if Chromium can't launch,
// the build still succeeds and ships as CSR — never break a production deploy
// over prerendering.

import { createServer } from "node:http";
import { readFile, writeFile, mkdir, stat } from "node:fs/promises";
import { join, extname, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST = join(__dirname, "..", "dist");
const PORT = 4178;

// Public, indexable routes. /admin is intentionally excluded (noindex + auth).
const ROUTES = ["/", "/about", "/contact", "/compare"];

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

  const results = [];
  for (const route of ROUTES) {
    const page = await browser.newPage();
    try {
      await page.goto(`http://localhost:${PORT}${route}`, {
        waitUntil: "load",
        timeout: 30000,
      });
      // Wait for the router to render the route's <main> content.
      await page.waitForSelector("main", { timeout: 15000 });
      // Give async CMS content / images a brief window to populate.
      try {
        await page.waitForLoadState("networkidle", { timeout: 8000 });
      } catch {
        /* websockets etc. may keep the network busy; proceed anyway */
      }
      const html = await page.evaluate(
        () => "<!DOCTYPE html>\n" + document.documentElement.outerHTML
      );
      const outDir = route === "/" ? DIST : join(DIST, route);
      await mkdir(outDir, { recursive: true });
      await writeFile(join(outDir, "index.html"), html, "utf8");
      results.push({ route, ok: true, bytes: html.length });
    } catch (e) {
      results.push({ route, ok: false, error: e.message.split("\n")[0] });
    } finally {
      await page.close();
    }
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
