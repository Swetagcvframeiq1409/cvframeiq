// ai-store-test.js — Prompt 23 acceptance verification
// Run: node ai-store-test.js
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const URL = 'file:///' + path.resolve(__dirname, '..', 'pages', 'ai-store.html').replace(/\\/g, '/');
const OUT = path.resolve(__dirname);

async function run() {
  const browser = await chromium.launch();
  const results = {};

  // ── DARK THEME (default) ──────────────────────────────────────
  for (const theme of ['dark', 'light']) {
    const ctx = await browser.newContext({ viewport: { width: 1918, height: 990 } });
    const page = await ctx.newPage();
    if (theme === 'light') {
      await page.addInitScript(() => {
        document.addEventListener('DOMContentLoaded', () => {
          document.body.setAttribute('data-theme', 'light');
        });
      });
    }
    await page.goto(URL, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1200);

    // 1. Unique descriptions
    const descs = await page.$$eval('.ais-card-desc', els => els.map(e => e.textContent.trim()));
    const uniqueDescs = new Set(descs).size;

    // 2. Empty icon rings
    const emptyIcons = await page.$$eval('.ais-card-thumb', els =>
      els.filter(e => !e.querySelector('i') && !e.querySelector('img')).length
    );

    // 3. Filter chip counts
    const chipCounts = await page.evaluate(() => {
      const chips = Array.from(document.querySelectorAll('.ais-chip'));
      const results = {};
      chips.forEach(chip => {
        const cat = chip.dataset.category;
        const cards = Array.from(document.querySelectorAll('.ais-card'));
        if (cat === 'All') {
          results[cat] = cards.length;
        } else {
          results[cat] = cards.filter(c => {
            const catEl = c.querySelector('.ais-card-cat');
            return catEl && catEl.textContent.trim().includes(cat);
          }).length;
        }
      });
      return results;
    });

    // 4. Search PPE
    await page.fill('#ais-search', 'PPE');
    await page.waitForTimeout(300);
    const ppeCards = await page.$$eval('.ais-card h3', els => els.map(e => e.textContent.trim()));
    await page.fill('#ais-search', '');
    await page.waitForTimeout(300);

    // 5. Compare: select 3, try 4th
    const compareResult = await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('[data-ais-compare]'));
      if (btns.length < 4) return { error: 'not enough compare buttons: ' + btns.length };
      btns[0].click(); btns[1].click(); btns[2].click();
      const countEl = document.querySelector('#ais-tray-count');
      const count3 = countEl ? countEl.textContent.trim() : 'n/a';
      btns[3].click();
      const statusEl = document.querySelector('#ais-compare-status');
      const blocked = statusEl ? statusEl.textContent.trim() : '';
      return { count3, blocked };
    });

    // 6. Enquire href prefill
    const enquireHrefs = await page.$$eval('.ais-card-actions .ais-btn--primary', els =>
      els.map(e => e.getAttribute('href') || '')
    );
    const prefilled = enquireHrefs.filter(h => h.includes('product=')).length;

    // 7. Band backgrounds
    const bandBgs = await page.evaluate(() => {
      const bands = [
        { id: 'hero', sel: '.ais-hero-band' },
        { id: 'spotlight', sel: '.ais-spotlight-band' },
        { id: 'catalog', sel: '.ais-catalog-band' },
        { id: 'why', sel: '.ais-why-band' },
        { id: 'sectors', sel: '.ais-sectors-band' },
        { id: 'enquiry', sel: '.ais-enquiry-band' }
      ];
      return bands.map(b => {
        const el = document.querySelector(b.sel);
        return { id: b.id, bg: el ? getComputedStyle(el).backgroundColor : 'missing' };
      });
    });

    // 8. All imgs have alt, width, height
    const imgCheck = await page.$$eval('img', imgs => imgs.map(img => ({
      src: img.src.split('/').pop(),
      hasAlt: img.hasAttribute('alt'),
      hasWidth: img.hasAttribute('width'),
      hasHeight: img.hasAttribute('height'),
      naturalWidth: img.naturalWidth
    })));

    // 9. Toolbar sticky position
    const toolbarSticky = await page.evaluate(() => {
      const tb = document.querySelector('.ais-toolbar');
      return tb ? getComputedStyle(tb).position : 'missing';
    });

    // 10. Why cards have visible text
    const whyCards = await page.$$eval('.ais-why-card', els => els.map(el => ({
      num: el.querySelector('.ais-why-num')?.textContent.trim(),
      title: el.querySelector('h3')?.textContent.trim(),
      hasText: el.textContent.trim().length > 10
    })));

    results[theme] = {
      uniqueDescs,
      totalDescs: descs.length,
      emptyIcons,
      chipCounts,
      ppeSearch: ppeCards,
      compareResult,
      prefilled,
      bandBgs,
      imgsMissingAttrs: imgCheck.filter(i => !i.hasAlt || !i.hasWidth || !i.hasHeight).length,
      toolbarSticky,
      whyCards
    };

    await ctx.close();
  }

  // ── SCROLL FILM at 1918 ───────────────────────────────────────
  const scrollCtx = await browser.newContext({ viewport: { width: 1918, height: 990 } });
  const scrollPage = await scrollCtx.newPage();
  await scrollPage.goto(URL, { waitUntil: 'domcontentloaded' });
  await scrollPage.waitForTimeout(1200);
  const pageHeight = await scrollPage.evaluate(() => document.documentElement.scrollHeight);
  const scrollIssues = [];
  for (let y = 0; y < pageHeight; y += 120) {
    await scrollPage.evaluate(yy => window.scrollTo(0, yy), y);
    await scrollPage.waitForTimeout(30);
    const check = await scrollPage.evaluate(() => {
      // blank viewport check
      const allEls = Array.from(document.querySelectorAll('*'));
      const vw = window.innerWidth, vh = window.innerHeight;
      const visible = allEls.filter(el => {
        const r = el.getBoundingClientRect();
        return r.width > 0 && r.height > 0 && r.top < vh && r.bottom > 0 && r.left < vw && r.right > 0;
      });
      const hasText = visible.some(el => el.childNodes.length && Array.from(el.childNodes).some(n => n.nodeType === 3 && n.textContent.trim().length > 0));
      const hasImg = visible.some(el => el.tagName === 'IMG');
      return { blank: !hasText && !hasImg, y: window.scrollY };
    });
    if (check.blank) scrollIssues.push({ type: 'blank', y: check.y });
  }
  await scrollCtx.close();

  // ── SCROLL FILM at 360 ────────────────────────────────────────
  const mCtx = await browser.newContext({ viewport: { width: 360, height: 800 } });
  const mPage = await mCtx.newPage();
  await mPage.goto(URL, { waitUntil: 'domcontentloaded' });
  await mPage.waitForTimeout(1200);
  const mHeight = await mPage.evaluate(() => document.documentElement.scrollHeight);
  const mIssues = [];
  for (let y = 0; y < mHeight; y += 120) {
    await mPage.evaluate(yy => window.scrollTo(0, yy), y);
    await mPage.waitForTimeout(30);
    const check = await mPage.evaluate(() => {
      const allEls = Array.from(document.querySelectorAll('*'));
      const vw = window.innerWidth, vh = window.innerHeight;
      const visible = allEls.filter(el => {
        const r = el.getBoundingClientRect();
        return r.width > 0 && r.height > 0 && r.top < vh && r.bottom > 0 && r.left < vw && r.right > 0;
      });
      const hasText = visible.some(el => el.childNodes.length && Array.from(el.childNodes).some(n => n.nodeType === 3 && n.textContent.trim().length > 0));
      const hasImg = visible.some(el => el.tagName === 'IMG');
      return { blank: !hasText && !hasImg, y: window.scrollY };
    });
    if (check.blank) mIssues.push({ type: 'blank', y: check.y });
    // horizontal scroll check
    const hScroll = await mPage.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 2);
    if (hScroll) mIssues.push({ type: 'hscroll', y });
  }
  await mCtx.close();

  await browser.close();

  // ── PRINT REPORT ─────────────────────────────────────────────
  console.log('\n=== AI STORE ACCEPTANCE REPORT ===\n');

  for (const theme of ['dark', 'light']) {
    const r = results[theme];
    console.log(`\n── THEME: ${theme.toUpperCase()} ──`);
    console.log(`1. Unique descriptions: ${r.uniqueDescs} of ${r.totalDescs} cards ${r.uniqueDescs === r.totalDescs ? 'PASS' : 'FAIL'}`);
    console.log(`2. Empty icon rings:    ${r.emptyIcons} (must be 0) ${r.emptyIcons === 0 ? 'PASS' : 'FAIL'}`);
    console.log(`3. Filter chip counts:`);
    Object.entries(r.chipCounts).forEach(([cat, count]) => {
      console.log(`   ${cat}: ${count} visible cards`);
    });
    console.log(`4. Search "PPE" returns: ${JSON.stringify(r.ppeSearch)} ${r.ppeSearch.some(n => n.includes('PPE')) ? 'PASS' : 'FAIL'}`);
    console.log(`5. Compare: count=${r.compareResult.count3} blocked="${r.compareResult.blocked}" ${r.compareResult.count3 === '3' && r.compareResult.blocked ? 'PASS' : 'FAIL'}`);
    console.log(`6. Enquire prefilled:   ${r.prefilled} of ${r.totalDescs} ${r.prefilled === r.totalDescs ? 'PASS' : 'FAIL'}`);
    console.log(`7. Band backgrounds:`);
    r.bandBgs.forEach(b => console.log(`   ${b.id}: ${b.bg}`));
    console.log(`8. Imgs missing attrs:  ${r.imgsMissingAttrs} (must be 0) ${r.imgsMissingAttrs === 0 ? 'PASS' : 'FAIL'}`);
    console.log(`9. Toolbar sticky:      ${r.toolbarSticky} ${r.toolbarSticky === 'sticky' ? 'PASS' : 'FAIL'}`);
    console.log(`10. Why cards:`);
    r.whyCards.forEach(w => console.log(`    ${w.num}: "${w.title}" hasText=${w.hasText}`));
  }

  console.log(`\n── SCROLL FILM 1918px ──`);
  console.log(`Blank viewports: ${scrollIssues.filter(i => i.type === 'blank').length} ${scrollIssues.filter(i => i.type === 'blank').length === 0 ? 'PASS' : 'FAIL'}`);
  if (scrollIssues.length) console.log('Issues:', JSON.stringify(scrollIssues));

  console.log(`\n── SCROLL FILM 360px ──`);
  console.log(`Blank viewports: ${mIssues.filter(i => i.type === 'blank').length} ${mIssues.filter(i => i.type === 'blank').length === 0 ? 'PASS' : 'FAIL'}`);
  console.log(`Horizontal scroll: ${mIssues.filter(i => i.type === 'hscroll').length} ${mIssues.filter(i => i.type === 'hscroll').length === 0 ? 'PASS' : 'FAIL'}`);
  if (mIssues.length) console.log('Issues:', JSON.stringify(mIssues.slice(0, 10)));

  console.log('\n=== END REPORT ===');
}

run().catch(err => { console.error(err); process.exit(1); });
