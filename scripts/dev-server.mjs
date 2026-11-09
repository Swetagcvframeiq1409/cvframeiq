#!/usr/bin/env node
import fs from 'node:fs/promises';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const port = process.env.PORT || 5501;

const routeMap = {
  '/': 'index.html',
  '/about': 'pages/about.html',
  '/ai-store': 'pages/ai-store.html',
  '/beejhealth': 'pages/beejhealth.html',
  '/blog': 'pages/blog.html',
  '/careers': 'pages/careers.html',
  '/contact': 'pages/contact.html',
  '/compare': 'pages/compare.html',
  '/cookies': 'pages/cookies.html',
  '/culture': 'pages/culture.html',
  '/docs': 'pages/docs.html',
  '/features': 'pages/features.html',
  '/gear': 'pages/gear.html',
  '/gear-product': 'pages/gear-product.html',
  '/glossary': 'pages/glossary.html',
  '/hardware': 'pages/hardware/gear.html',
  '/hardware/edge-starter-kit': 'pages/hardware/edge-starter-kit.html',
  '/hardware/smart-factory-kit': 'pages/hardware/smart-factory-kit.html',
  '/how-we-work': 'pages/how-we-work.html',
  '/login': 'pages/login.html',
  '/partners': 'pages/partners.html',
  '/playground': 'pages/playground.html',
  '/press-kit': 'pages/press-kit.html',
  '/privacy': 'pages/privacy.html',
  '/research': 'pages/research.html',
  '/responsible-ai': 'pages/responsible-ai.html',
  '/sectors': 'pages/sectors.html',
  '/sectors/agriculture': 'pages/sectors/agriculture.html',
  '/sectors/aviation': 'pages/sectors/aviation.html',
  '/sectors/banking': 'pages/sectors/banking.html',
  '/sectors/events-entertainment': 'pages/sectors/events-entertainment.html',
  '/sectors/healthcare': 'pages/sectors/healthcare.html',
  '/sectors/manufacturing': 'pages/sectors/manufacturing.html',
  '/sectors/retail': 'pages/sectors/retail.html',
  '/sectors/security-surveillance': 'pages/sectors/security-surveillance.html',
  '/sectors/smart-city': 'pages/sectors/smart-city.html',
  '/security': 'pages/security.html',
  '/team': 'pages/team.html',
  '/terms': 'pages/terms.html',
  '/404': '404.html'
};

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8'
};

function normalizeUrl(requestUrl) {
  const url = new URL(requestUrl, 'http://127.0.0.1');
  let pathname = decodeURIComponent(url.pathname);
  if (pathname === '/') return '/';
  pathname = pathname.replace(/\/+/g, '/');
  if (pathname.endsWith('/')) pathname = pathname.slice(0, -1);
  return pathname;
}

function resolveFile(requestPath) {
  const pathname = normalizeUrl(requestPath);
  if (pathname === '/favicon.ico') return path.join(rootDir, 'assets', 'img', 'favicon.ico');
  if (pathname.endsWith('.html') || pathname.startsWith('/pages/') || pathname.includes('/sectors/')) {
    const candidate = pathname.replace(/^\//, '').replace(/\.html$/, '');
    const clean = `/${candidate}`;
    const legacy = routeMap[clean];
    if (legacy) return path.join(rootDir, legacy);
  }
  if (routeMap[pathname]) return path.join(rootDir, routeMap[pathname]);
  if (pathname === '/404') return path.join(rootDir, '404.html');
  const filePath = pathname === '/' ? path.join(rootDir, 'index.html') : path.join(rootDir, pathname.replace(/^\//, ''));
  return filePath;
}

const server = http.createServer(async (req, res) => {
  const requestPath = req.url || '/';
  const pathname = normalizeUrl(requestPath);
  const file = resolveFile(pathname);
  try {
    await fs.access(file);
    const ext = path.extname(file).toLowerCase();
    const content = await fs.readFile(file);
    res.writeHead(200, {
      'Content-Type': mimeTypes[ext] || 'application/octet-stream',
      'Cache-Control': 'no-store',
      'X-Frame-Options': 'DENY'
    });
    res.end(content);
    console.log(`200 ${pathname} -> ${path.relative(rootDir, file)}`);
  } catch (error) {
    const notFound = path.join(rootDir, '404.html');
    const fallback = await fs.readFile(notFound).catch(() => Buffer.from('<!doctype html><title>404</title><h1>404</h1>', 'utf8'));
    res.writeHead(404, {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-store'
    });
    res.end(fallback);
    console.log(`404 ${pathname}`);
  }
});

server.listen(port, () => {
  console.log(`FrameIQ static server running on http://127.0.0.1:${port}`);
  console.log('Run with: node scripts/dev-server.mjs');
});
