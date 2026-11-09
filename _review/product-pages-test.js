// product-pages-test.js — verification for Prompt 22 product pages
// Run: node product-pages-test.js
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const SITE = 'file:///' + path.resolve(__dirname, '..').replace(/\\/g, '/');
const PAGES = [
  { id: 'pcb-guardian', file: 'pages/pcb-guardian.html' },
  { id: 'beejhealth',   file: 'pages/beejhealth.html' },
  { id: 'autolabel',    file: 'pages/autolabel.html' },
  { id: 'ppe-safety',   file: 'pages/ppe-safety.html' }
];

async function run() {
  const browser = await chromium.launch();
  const results = [];

  for (const page of PAGES) {
    const url = SITE + '/' + page.file;
    const ctx = await browser.newContext({ viewport: { width: 1918, height: 990 } });
    const p = await ctx.newPage();
    await p.goto(url, { waitUntil: 'domcontentloaded' });
    await p.waitForTimeout(600);

    // 1. Zero empty outlined boxes (.pp-media that have no img and no fallback)
    const emptyBoxes = await p.evaluate(() => {
      return Array.from(document.querySelectorAll('.pp-hero-media, .pp-workflow-img, .pp-tab-img'))
        .filter(el => {
          const img = el.querySelector('img');
          const fallback = el.querySelector('.pp-media-fallback');
          return !img && !fallback;
        }).length;
    });

    // 2. Zero placeholder text
    const placeholderText = await p.evaluate(() => {
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      let count = 0;
      let node;
      while ((node = walker.nextNode())) {
        if (/\[Placeholder/i.test(node.textContent) || /\bUnconfirmed\b/.test(node.textContent)) count++;
      }
      return count;
    });

    // 3. Status chip count (concept pages: 1, beejhealth: 0)
    const statusChips = await p.evaluate(() =>
      document.querySelectorAll('.pp-status').length
    );

    // 4. Problem grid columns match card count at 1918px
    const gridCheck = await p.evaluate(() => {
      const grid = document.querySelector('.pp-problem-grid');
      if (!grid) return 'no grid';
      const count = parseInt(grid.getAttribute('data-count') || '0');
      const cols = getComputedStyle(grid).gridTemplateColumns.split(' ').length;
      return { count, cols, match: count === cols };
    });

    // 5. Tab panels have visible text
    const tabPanels = await p.evaluate(() => {
      const panels = Array.from(document.querySelectorAll('.pp-tab-panel'));
      return panels.map(panel => ({
        id: panel.id,
        hasText: panel.textContent.trim().length > 0
      }));
    });
    const tabsOk = tabPanels.every(t => t.hasText);

    // 6. All imgs have alt, width, height
    const imgCheck = await p.evaluate(() => {
      const imgs = Array.from(document.querySelectorAll('img'));
      return imgs.map(img => ({
        src: img.src.split('/').pop(),
        hasAlt: img.hasAttribute('alt'),
        hasWidth: img.hasAttribute('width'),
        hasHeight: img.hasAttribute('height'),
        naturalWidth: img.naturalWidth
      }));
    });
    const imgsMissingAttrs = imgCheck.filter(i => !i.hasAlt || !i.hasWidth || !i.hasHeight);

    // 7. Sticky rail stays inside section
    const stickyOk = await p.evaluate(() => {
      const rail = document.querySelector('.pp-step-rail');
      if (!rail) return 'no rail';
      const section = rail.closest('section');
      if (!section) return 'no section';
      const railRect = rail.getBoundingClientRect();
      const sectionRect = section.getBoundingClientRect();
      return {
        railTop: Math.round(railRect.top),
        sectionTop: Math.round(sectionRect.top),
        sectionBottom: Math.round(sectionRect.bottom),
        ok: railRect.top >= sectionRect.top - 1
      };
    });

    // 8. CTA band background is light (#f4f1ff range)
    const ctaBg = await p.evaluate(() => {
      const band = document.querySelector('.pp-cta-band');
      if (!band) return 'missing';
      return getComputedStyle(band).backgroundColor;
    });

    results.push({
      page: page.id,
      emptyBoxes,
      placeholderText,
      statusChips,
      gridCheck,
      tabsOk,
      imgsMissingAttrs: imgsMissingAttrs.length,
      stickyOk,
      ctaBg
    });

    await ctx.close();
  }

  await browser.close();

  console.log('\n=== PRODUCT PAGES VERIFICATION REPORT ===\n');
  let allPass = true;
  for (const r of results) {
    const pass = r.emptyBoxes === 0 && r.placeholderText === 0 && r.tabsOk && r.imgsMissingAttrs === 0;
    if (!pass) allPass = false;
    console.log(`PAGE: ${r.page}`);
    console.log(`  Empty outlined boxes:    ${r.emptyBoxes} (must be 0) ${r.emptyBoxes === 0 ? 'PASS' : 'FAIL'}`);
    console.log(`  Placeholder text nodes:  ${r.placeholderText} (must be 0) ${r.placeholderText === 0 ? 'PASS' : 'FAIL'}`);
    console.log(`  Status chips:            ${r.statusChips}`);
    console.log(`  Problem grid:            count=${r.gridCheck.count} cols=${r.gridCheck.cols} match=${r.gridCheck.match} ${r.gridCheck.match ? 'PASS' : 'FAIL'}`);
    console.log(`  Tab panels have text:    ${r.tabsOk ? 'PASS' : 'FAIL'}`);
    console.log(`  Imgs missing attrs:      ${r.imgsMissingAttrs} (must be 0) ${r.imgsMissingAttrs === 0 ? 'PASS' : 'FAIL'}`);
    console.log(`  Sticky rail in section:  ${JSON.stringify(r.stickyOk)}`);
    console.log(`  CTA band bg:             ${r.ctaBg}`);
    console.log('');
  }
  console.log(allPass ? '=== ALL CHECKS PASS ===' : '=== SOME CHECKS FAILED ===');
}

run().catch(err => { console.error(err); process.exit(1); });
