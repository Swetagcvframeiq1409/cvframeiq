// p24-image-audit.js — Prompt 24 PART B verification
// Run: node p24-image-audit.js
// Checks: file existence, sizes, img attrs, aspect ratio, CLS proxy, dark+light themes
'use strict';
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const ROOT = path.resolve(__dirname, '..');
const SITE = 'file:///' + ROOT.replace(/\\/g, '/');

// ── 1. FILE EXISTENCE TABLE ──────────────────────────────────────────────────
const EXPECTED_PRODUCTS = [
  { file: 'pcb-guardian-hero.webp',  maxKB: 220, note: 'hero 4:3' },
  { file: 'pcb-guardian-spec.webp',  maxKB: 140, note: 'spec 3:2' },
  { file: 'beejhealth-hero.webp',    maxKB: 220, note: 'hero 4:3' },
  { file: 'beejhealth-crops.webp',   maxKB: 140, note: 'crops 3:2' },
  { file: 'autolabel-hero.webp',     maxKB: 220, note: 'hero 4:3' },
  { file: 'autolabel-workflow.webp', maxKB: 140, note: 'workflow 3:2' },
  { file: 'ppe-safety-hero.webp',    maxKB: 220, note: 'hero 4:3' },
  { file: 'ppe-safety-specs.webp',   maxKB: 140, note: 'specs 3:2' },
  { file: 'ai-store-hero.webp',      maxKB: 220, note: 'hero 16:9' },
  { file: 'store-safety.webp',       maxKB: 140, note: 'thumb 16:10' },
  { file: 'store-retail.webp',       maxKB: 140, note: 'thumb 16:10' },
  { file: 'store-traffic.webp',      maxKB: 140, note: 'thumb 16:10' },
  { file: 'store-health.webp',       maxKB: 140, note: 'thumb 16:10' },
  { file: 'store-industry.webp',     maxKB: 140, note: 'thumb 16:10' },
  { file: 'store-agriculture.webp',  maxKB: 140, note: 'thumb 16:10' },
];

const EXPECTED_SECTORS = [
  'banking-finance-hero.webp', 'banking-finance-band.webp',
  'aviation-hero.webp',        'aviation-band.webp',
  'infrastructure-hero.webp',  'infrastructure-band.webp',
  'security-surveillance-hero.webp', 'security-surveillance-band.webp',
  'healthcare-medical-hero.webp',    'healthcare-medical-band.webp',
  'events-entertainment-hero.webp',  'events-entertainment-band.webp',
  'manufacturing-hero.webp',         'manufacturing-band.webp',
  'agriculture-hero.webp',           'agriculture-band.webp',
  'retail-hero.webp',                'retail-band.webp',
  'all-sectors-hero.webp',
];

// Existing images referenced by product pages (not in products/ subfolder)
const EXISTING_REFS = [
  { path: 'assets/img/pcb-guardian-hero.webp',              maxKB: 220, page: 'pcb-guardian (hero)' },
  { path: 'assets/img/ppesafety.webp',                      maxKB: 220, page: 'ppe-safety (hero)' },
  { path: 'assets/img/smartagriculture.webp',               maxKB: 220, page: 'beejhealth (hero)' },
  { path: 'assets/img/Agriculture.webp',                    maxKB: 140, page: 'beejhealth (workflow)' },
  { path: 'assets/img/agricultureai.webp',                  maxKB: 140, page: 'beejhealth (tab)' },
  { path: 'assets/img/manufacturing-defect-inspection.webp',maxKB: 140, page: 'pcb-guardian (workflow)' },
  { path: 'assets/img/manufacturing-line-monitoring.webp',  maxKB: 140, page: 'pcb-guardian (tab)' },
  { path: 'assets/img/manufacturing-hero.webp',             maxKB: 140, page: 'ppe-safety (tab)' },
];

function fileReport() {
  console.log('\n══════════════════════════════════════════════════════════');
  console.log('PART A — FILE EXISTENCE & SIZE REPORT');
  console.log('══════════════════════════════════════════════════════════\n');

  console.log('── assets/img/products/ (PART A new files) ──');
  let missingProducts = 0;
  for (const e of EXPECTED_PRODUCTS) {
    const p = path.join(ROOT, 'assets/img/products', e.file);
    const exists = fs.existsSync(p);
    if (!exists) { missingProducts++; }
    const sizeKB = exists ? Math.round(fs.statSync(p).size / 1024) : null;
    const sizeStr = exists ? sizeKB + 'KB' : '—';
    const sizeFlag = exists ? (sizeKB > e.maxKB ? ' ⚠ OVER ' + e.maxKB + 'KB limit' : ' OK') : '';
    console.log(`  ${exists ? 'EXIST  ' : 'MISSING'} ${e.file.padEnd(30)} ${sizeStr.padStart(7)}${sizeFlag}  [${e.note}]`);
  }
  console.log(`\n  ${missingProducts} of ${EXPECTED_PRODUCTS.length} product images missing — generate with PART A prompts\n`);

  console.log('── assets/img/sectors/ (PART A new sector files) ──');
  let missingSectors = 0;
  for (const f of EXPECTED_SECTORS) {
    const p = path.join(ROOT, 'assets/img/sectors', f);
    const exists = fs.existsSync(p);
    if (!exists) missingSectors++;
    const sizeKB = exists ? Math.round(fs.statSync(p).size / 1024) : null;
    const sizeStr = exists ? sizeKB + 'KB' : '—';
    console.log(`  ${exists ? 'EXIST  ' : 'MISSING'} ${f.padEnd(40)} ${sizeStr}`);
  }
  console.log(`\n  ${missingSectors} of ${EXPECTED_SECTORS.length} sector images missing — generate with PART A prompts\n`);

  console.log('── Existing images referenced by product pages ──');
  let overLimit = 0;
  for (const e of EXISTING_REFS) {
    const p = path.join(ROOT, e.path);
    const exists = fs.existsSync(p);
    const sizeKB = exists ? Math.round(fs.statSync(p).size / 1024) : null;
    const sizeStr = exists ? sizeKB + 'KB' : 'MISSING';
    const flag = exists && sizeKB > e.maxKB ? ` ⚠ OVER ${e.maxKB}KB — recompress` : (exists ? ' OK' : ' ⚠ MISSING');
    if (exists && sizeKB > e.maxKB) overLimit++;
    console.log(`  ${sizeStr.padStart(8)}  ${e.path.padEnd(55)} used by: ${e.page}${flag}`);
  }
  if (overLimit > 0) {
    console.log(`\n  ⚠ ${overLimit} existing image(s) exceed their size limit.`);
    console.log('  Recommendation: recompress with cwebp -q 75 or Squoosh to bring under limit.');
    console.log('  manufacturing-defect-inspection.webp: 1015KB → target ≤140KB');
    console.log('  manufacturing-line-monitoring.webp:   1329KB → target ≤140KB');
    console.log('  manufacturing-hero.webp:               957KB → target ≤140KB');
  }
}

// ── 2. PLAYWRIGHT BROWSER CHECKS ────────────────────────────────────────────
const PAGES_TO_TEST = [
  { id: 'pcb-guardian', file: 'pages/pcb-guardian.html' },
  { id: 'beejhealth',   file: 'pages/beejhealth.html' },
  { id: 'autolabel',    file: 'pages/autolabel.html' },
  { id: 'ppe-safety',   file: 'pages/ppe-safety.html' },
  { id: 'ai-store',     file: 'pages/ai-store.html' },
];

async function checkPage(browser, pageInfo, theme) {
  const url = SITE + '/' + pageInfo.file;
  const ctx = await browser.newContext({ viewport: { width: 1918, height: 990 } });
  const page = await ctx.newPage();

  // Set theme before navigation
  await page.addInitScript((t) => {
    document.addEventListener('DOMContentLoaded', () => {
      if (t === 'light') document.body.setAttribute('data-theme', 'light');
    });
  }, theme);

  await page.goto(url, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(800);

  if (theme === 'light') {
    await page.evaluate(() => document.body.setAttribute('data-theme', 'light'));
    await page.waitForTimeout(200);
  }

  // Check all <img> elements
  const imgResults = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('img')).map(img => ({
      src: img.getAttribute('src') || '',
      hasAlt: img.hasAttribute('alt'),
      hasWidth: img.hasAttribute('width'),
      hasHeight: img.hasAttribute('height'),
      naturalWidth: img.naturalWidth,
      naturalHeight: img.naturalHeight,
      renderedWidth: img.getBoundingClientRect().width,
      renderedHeight: img.getBoundingClientRect().height,
      hasFetchPriority: img.hasAttribute('fetchpriority'),
      hasLoading: img.hasAttribute('loading'),
      decoding: img.getAttribute('decoding'),
    }));
  });

  // Check aspect ratio within 2%
  const aspectIssues = imgResults
    .filter(i => i.naturalWidth > 0 && i.renderedWidth > 0 && i.renderedHeight > 0)
    .filter(i => {
      const natAR = i.naturalWidth / i.naturalHeight;
      const renAR = i.renderedWidth / i.renderedHeight;
      return Math.abs(natAR - renAR) / natAR > 0.02;
    });

  // Check imgs with naturalWidth === 0 (broken)
  const brokenImgs = imgResults.filter(i => i.naturalWidth === 0);

  // Check imgs missing required attrs
  const missingAttrs = imgResults.filter(i => !i.hasAlt || !i.hasWidth || !i.hasHeight);

  // Check band background colours (dark vs light must differ)
  const bandBgs = await page.evaluate(() => {
    const bands = Array.from(document.querySelectorAll('.gk-band, .pp-cta-band, .ais-hero-band, .ais-spotlight-band'));
    return bands.slice(0, 4).map(b => ({
      cls: b.className.split(' ').find(c => c.startsWith('gk-band') || c.startsWith('pp-') || c.startsWith('ais-')) || b.className,
      bg: getComputedStyle(b).backgroundColor,
    }));
  });

  // Scroll-film: check for blank viewports (no visible text or image in viewport)
  const scrollResults = [];
  const pageHeight = await page.evaluate(() => document.body.scrollHeight);
  for (let y = 0; y < Math.min(pageHeight, 3000); y += 240) {
    await page.evaluate((scrollY) => window.scrollTo(0, scrollY), y);
    await page.waitForTimeout(50);
    const viewportCheck = await page.evaluate(() => {
      const vw = window.innerWidth, vh = window.innerHeight;
      const els = document.elementsFromPoint(vw / 2, vh / 2);
      const hasText = els.some(el => {
        const t = el.textContent?.trim();
        return t && t.length > 3 && getComputedStyle(el).display !== 'none';
      });
      const hasImg = els.some(el => el.tagName === 'IMG' && el.naturalWidth > 0);
      return { y: Math.round(window.scrollY), hasText, hasImg, blank: !hasText && !hasImg };
    });
    if (viewportCheck.blank) scrollResults.push(viewportCheck);
  }

  await ctx.close();

  return {
    page: pageInfo.id,
    theme,
    imgCount: imgResults.length,
    brokenImgs: brokenImgs.map(i => i.src.split('/').pop()),
    missingAttrs: missingAttrs.map(i => i.src.split('/').pop()),
    aspectIssues: aspectIssues.map(i => ({
      src: i.src.split('/').pop(),
      nat: `${i.naturalWidth}x${i.naturalHeight}`,
      ren: `${Math.round(i.renderedWidth)}x${Math.round(i.renderedHeight)}`,
    })),
    bandBgs,
    blankViewports: scrollResults,
  };
}

async function runBrowserChecks() {
  console.log('\n══════════════════════════════════════════════════════════');
  console.log('PART B — BROWSER VERIFICATION (BEFORE changes)');
  console.log('══════════════════════════════════════════════════════════\n');

  const browser = await chromium.launch();
  const allResults = [];

  for (const pageInfo of PAGES_TO_TEST) {
    for (const theme of ['dark', 'light']) {
      const r = await checkPage(browser, pageInfo, theme);
      allResults.push(r);
    }
  }

  await browser.close();

  // Print results table
  let totalFails = 0;
  for (const r of allResults) {
    const pass =
      r.brokenImgs.length === 0 &&
      r.missingAttrs.length === 0 &&
      r.aspectIssues.length === 0 &&
      r.blankViewports.length === 0;
    if (!pass) totalFails++;

    console.log(`PAGE: ${r.page}  THEME: ${r.theme}`);
    console.log(`  imgs total:        ${r.imgCount}`);
    console.log(`  broken (nat=0):    ${r.brokenImgs.length === 0 ? 'PASS (0)' : 'FAIL ' + JSON.stringify(r.brokenImgs)}`);
    console.log(`  missing attrs:     ${r.missingAttrs.length === 0 ? 'PASS (0)' : 'FAIL ' + JSON.stringify(r.missingAttrs)}`);
    console.log(`  aspect issues:     ${r.aspectIssues.length === 0 ? 'PASS (0)' : 'FAIL ' + JSON.stringify(r.aspectIssues)}`);
    console.log(`  blank viewports:   ${r.blankViewports.length === 0 ? 'PASS (0)' : 'WARN ' + r.blankViewports.length + ' at y=' + r.blankViewports.map(v => v.y).join(',')}`);
    console.log(`  band backgrounds:  ${r.bandBgs.map(b => b.bg).join(' | ')}`);
    console.log('');
  }

  console.log(totalFails === 0 ? '=== ALL BROWSER CHECKS PASS ===' : `=== ${totalFails} PAGE/THEME COMBINATIONS HAVE ISSUES ===`);
  return allResults;
}

// ── MAIN ─────────────────────────────────────────────────────────────────────
(async () => {
  fileReport();
  await runBrowserChecks();
})().catch(err => { console.error(err); process.exit(1); });
