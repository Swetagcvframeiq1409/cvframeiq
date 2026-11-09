// navbar-test.js — Playwright navbar audit. Run: node _review/navbar-test.js
// Tests both server roots, four viewports, three pages.

const { chromium } = require('playwright');
const http = require('http');
const fs = require('fs');
const path = require('path');

const SITE_ROOT = path.resolve(__dirname, '..');
const PARENT_ROOT = path.resolve(SITE_ROOT, '..');

function serveDir(dir, port) {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      let filePath = path.join(dir, decodeURIComponent(req.url.split('?')[0]));
      if (filePath.endsWith('/') || !path.extname(filePath)) {
        const tryHtml = filePath.endsWith('/') ? filePath + 'index.html' : filePath + '.html';
        if (fs.existsSync(tryHtml)) filePath = tryHtml;
        else if (fs.existsSync(path.join(filePath, 'index.html'))) filePath = path.join(filePath, 'index.html');
      }
      if (!fs.existsSync(filePath)) { res.writeHead(404); res.end('Not found'); return; }
      const ext = path.extname(filePath).toLowerCase();
      const mime = { '.html': 'text/html', '.css': 'text/css', '.js': 'application/javascript',
        '.woff2': 'font/woff2', '.webp': 'image/webp', '.png': 'image/png',
        '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.json': 'application/json' }[ext] || 'application/octet-stream';
      res.writeHead(200, { 'Content-Type': mime });
      fs.createReadStream(filePath).pipe(res);
    });
    server.listen(port, () => resolve(server));
  });
}

const VIEWPORTS = [
  { name: '1918x988', width: 1918, height: 988 },
  { name: '1366x768', width: 1366, height: 768 },
  { name: '768x1024', width: 768, height: 1024 },
  { name: '360x800', width: 360, height: 800 },
];

const RESULTS = [];
function log(section, label, status, detail) {
  const line = `[${status}] ${section} | ${label} | ${detail}`;
  RESULTS.push(line);
  console.log(line);
}

async function checkLinks(page, baseUrl, serverLabel) {
  const anchors = await page.$$eval('header a, aside a', (els) =>
    els.map((a) => ({ label: a.textContent.trim().slice(0, 40) || a.getAttribute('aria-label') || '(no label)', href: a.getAttribute('href') }))
  );
  for (const { label, href } of anchors) {
    if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) {
      log('LINKS', label, 'SKIP', href || '(empty)');
      continue;
    }
    const resolved = new URL(href, baseUrl).href;
    try {
      const resp = await page.request.get(resolved);
      const ct = resp.headers()['content-type'] || '';
      const ok = resp.status() === 200 && ct.includes('text/html');
      log('LINKS', label, ok ? 'PASS' : 'FAIL',
        `href=${href} resolved=${resolved} status=${resp.status()} ct=${ct.split(';')[0]}`);
    } catch (e) {
      log('LINKS', label, 'FAIL', `href=${href} resolved=${resolved} error=${e.message}`);
    }
  }
}

async function checkGhosting(page, serverLabel) {
  // Open Solutions panel and sample opacity every 16ms for 400ms
  const trigger = page.locator('.nav__button').first();
  if (!(await trigger.isVisible())) { log('GHOST', serverLabel, 'SKIP', 'trigger not visible (mobile viewport)'); return; }
  await trigger.hover();
  await page.waitForTimeout(200);
  const samples = [];
  for (let i = 0; i < 25; i++) {
    const sample = await page.evaluate(() => {
      const panel = document.querySelector('.mega');
      if (!panel) return null;
      const ps = getComputedStyle(panel);
      const children = Array.from(panel.querySelectorAll('a, span, i'));
      const childOpacities = children.map((c) => parseFloat(getComputedStyle(c).opacity));
      const maxChild = Math.max(...childOpacities, 0);
      const panelBg = ps.backgroundColor;
      const match = panelBg.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
      const bgAlpha = match ? parseFloat(match[4] ?? '1') : 1;
      return { panelOpacity: parseFloat(ps.opacity), panelVis: ps.visibility, bgAlpha, maxChild };
    });
    if (sample) samples.push(sample);
    await page.waitForTimeout(16);
  }
  // Check: no child opacity > 0.05 while panel bg alpha < 0.5
  const ghostFrames = samples.filter((s) => s.maxChild > 0.05 && s.bgAlpha < 0.5);
  log('GHOST', serverLabel, ghostFrames.length === 0 ? 'PASS' : 'FAIL',
    `ghostFrames=${ghostFrames.length}/25 samples`);
}

async function checkStuckOpen(page, serverLabel) {
  const triggers = page.locator('.nav__button');
  if (!(await triggers.first().isVisible())) { log('STUCK', serverLabel, 'SKIP', 'mobile'); return; }
  await triggers.first().hover();
  await page.waitForTimeout(200);
  // Move to Home link
  const homeLink = page.locator('.nav__link').first();
  if (await homeLink.isVisible()) {
    await homeLink.hover();
    await page.waitForTimeout(350);
    const openCount = await page.$$eval('.nav__item--mega.is-open', (els) => els.length);
    log('STUCK', serverLabel, openCount === 0 ? 'PASS' : 'FAIL',
      `panels still open after moving to Home: ${openCount}`);
  } else {
    log('STUCK', serverLabel, 'SKIP', 'no Home link visible');
  }
}

async function checkFlicker(page, serverLabel) {
  const triggers = await page.$$('.nav__button');
  if (!triggers.length) { log('FLICKER', serverLabel, 'SKIP', 'mobile'); return; }
  // Hover Products trigger (index 2)
  const idx = Math.min(2, triggers.length - 1);
  await triggers[idx].hover();
  await page.waitForTimeout(300);
  // Track toggle count
  const toggleCount = await page.evaluate((triggerIdx) => {
    return new Promise((resolve) => {
      const items = Array.from(document.querySelectorAll('.nav__item--mega'));
      const item = items[triggerIdx];
      if (!item) { resolve(0); return; }
      let count = 0;
      const obs = new MutationObserver(() => count++);
      obs.observe(item, { attributes: true, attributeFilter: ['class'] });
      setTimeout(() => { obs.disconnect(); resolve(count); }, 600);
    });
  }, idx);
  log('FLICKER', serverLabel, toggleCount <= 2 ? 'PASS' : 'FAIL',
    `class mutations on Products item during 600ms hover: ${toggleCount}`);
}

async function checkOneAtATime(page, serverLabel) {
  const triggers = await page.$$('.nav__button');
  if (triggers.length < 2) { log('ONE-AT-A-TIME', serverLabel, 'SKIP', 'mobile'); return; }
  for (const t of triggers.slice(0, 3)) {
    await t.hover();
    await page.waitForTimeout(150);
    const openCount = await page.$$eval('.nav__item--mega.is-open', (els) => els.length);
    if (openCount > 1) {
      log('ONE-AT-A-TIME', serverLabel, 'FAIL', `${openCount} panels open simultaneously`);
      return;
    }
  }
  log('ONE-AT-A-TIME', serverLabel, 'PASS', 'never more than 1 panel open');
}

async function checkKeyboard(page, serverLabel) {
  const trigger = page.locator('.nav__button').first();
  if (!(await trigger.isVisible())) { log('KEYBOARD', serverLabel, 'SKIP', 'mobile'); return; }
  await trigger.focus();
  await page.keyboard.press('Enter');
  await page.waitForTimeout(100);
  const expanded = await trigger.getAttribute('aria-expanded');
  const isOpen = await page.$$eval('.nav__item--mega.is-open', (els) => els.length);
  log('KEYBOARD', `${serverLabel} Enter opens`, expanded === 'true' && isOpen > 0 ? 'PASS' : 'FAIL',
    `aria-expanded=${expanded} is-open=${isOpen}`);
  await page.keyboard.press('Escape');
  await page.waitForTimeout(100);
  const expandedAfter = await trigger.getAttribute('aria-expanded');
  const isOpenAfter = await page.$$eval('.nav__item--mega.is-open', (els) => els.length);
  log('KEYBOARD', `${serverLabel} Escape closes`, expandedAfter === 'false' && isOpenAfter === 0 ? 'PASS' : 'FAIL',
    `aria-expanded=${expandedAfter} is-open=${isOpenAfter}`);
}

async function checkBounds(page, serverLabel) {
  const triggers = await page.$$('.nav__button');
  if (!triggers.length) { log('BOUNDS', serverLabel, 'SKIP', 'mobile'); return; }
  for (const t of triggers) {
    await t.hover();
    await page.waitForTimeout(200);
    const result = await page.evaluate(() => {
      const panel = document.querySelector('.nav__item--mega.is-open > .mega');
      if (!panel) return null;
      const r = panel.getBoundingClientRect();
      return { left: r.left, right: r.right, bottom: r.bottom, vw: window.innerWidth, vh: window.innerHeight };
    });
    if (!result) continue;
    const ok = result.left >= 8 && result.right <= result.vw - 8 && result.bottom <= result.vh - 8;
    log('BOUNDS', serverLabel, ok ? 'PASS' : 'FAIL',
      `left=${result.left.toFixed(0)} right=${result.right.toFixed(0)} bottom=${result.bottom.toFixed(0)} vw=${result.vw} vh=${result.vh}`);
  }
}

async function checkIcons(page, serverLabel) {
  const results = await page.evaluate(() => {
    const items = Array.from(document.querySelectorAll('.mega__icon i'));
    return items.map((el) => {
      const cls = Array.from(el.classList).find((c) => c.startsWith('bi-') && c !== 'bi');
      const before = cls ? getComputedStyle(el, '::before').content : '';
      return { cls: cls || '(none)', content: before };
    });
  });
  let fail = 0;
  for (const { cls, content } of results) {
    const isArrow = cls === 'bi-arrow-right';
    const empty = !content || content === 'none' || content === '""' || content === '';
    if (isArrow || empty) {
      log('ICONS', serverLabel, 'FAIL', `icon=${cls} content=${content}`);
      fail++;
    }
  }
  if (fail === 0) log('ICONS', serverLabel, 'PASS', `${results.length} icons checked, none are arrows or empty`);
}

async function runForServer(browser, baseUrl, serverLabel, pages) {
  console.log(`\n=== SERVER: ${serverLabel} (${baseUrl}) ===`);
  for (const vp of VIEWPORTS) {
    const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
    const page = await ctx.newPage();
    for (const pagePath of pages) {
      const url = baseUrl + pagePath;
      try {
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 15000 });
        await page.waitForTimeout(500);
        const label = `${vp.name} ${pagePath}`;
        await checkLinks(page, url, label);
        if (vp.width >= 1025) {
          await checkGhosting(page, label);
          await checkStuckOpen(page, label);
          await checkFlicker(page, label);
          await checkOneAtATime(page, label);
          await checkKeyboard(page, label);
          await checkBounds(page, label);
          await checkIcons(page, label);
        }
      } catch (e) {
        log('NAV', `${vp.name} ${pagePath}`, 'ERROR', e.message);
      }
    }
    await ctx.close();
  }
}

async function main() {
  const serverA = await serveDir(SITE_ROOT, 5510);
  const serverB = await serveDir(PARENT_ROOT, 5511);
  const browser = await chromium.launch({ headless: true });

  const pagesA = ['/', '/pages/team.html', '/pages/about.html'];
  const pagesB = ['/frameiq-site/', '/frameiq-site/pages/team.html', '/frameiq-site/pages/about.html'];

  await runForServer(browser, 'http://localhost:5510', 'ROOT=frameiq-site', pagesA);
  await runForServer(browser, 'http://localhost:5511', 'ROOT=parent (Live Server style)', pagesB);

  await browser.close();
  serverA.close();
  serverB.close();

  const outPath = path.join(__dirname, 'navbar-test-results.txt');
  fs.writeFileSync(outPath, RESULTS.join('\n'), 'utf8');
  console.log(`\nResults saved to ${outPath}`);

  const fails = RESULTS.filter((r) => r.includes('[FAIL]'));
  console.log(`\nSUMMARY: ${RESULTS.length} checks, ${fails.length} FAIL`);
  if (fails.length) { console.log('\nFAILURES:'); fails.forEach((f) => console.log(f)); }
}

main().catch((e) => { console.error(e); process.exit(1); });
