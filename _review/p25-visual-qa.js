const { chromium } = require('playwright');

const pages = ['pcb-guardian.html', 'beejhealth.html', 'autolabel.html', 'ppe-safety.html'];
const themes = ['dark', 'light'];
const sizes = [
  { width: 1918, height: 990 },
  { width: 360, height: 800 }
];

async function getTextOverlap(page) {
  return page.evaluate(() => {
    const nodes = [...document.querySelectorAll('h1, h2, h3, h4, p, li, a, button, label')].filter((el) => {
      const style = window.getComputedStyle(el);
      if (!style || style.visibility === 'hidden') return false;
      const rect = el.getBoundingClientRect();
      return rect.width > 0 && rect.height > 0;
    });
    const pairs = [];
    for (let i = 0; i < nodes.length; i++) {
      const a = nodes[i];
      const ar = a.getBoundingClientRect();
      for (let j = i + 1; j < nodes.length; j++) {
        const b = nodes[j];
        const br = b.getBoundingClientRect();
        if (a.contains(b) || b.contains(a)) continue;
        const overlapX = Math.min(ar.right, br.right) - Math.max(ar.left, br.left);
        const overlapY = Math.min(ar.bottom, br.bottom) - Math.max(ar.top, br.top);
        if (overlapX > 2 && overlapY > 2) {
          pairs.push({
            a: (a.tagName + '.' + (a.className || '')).replace(/\s+/g, '.'),
            b: (b.tagName + '.' + (b.className || '')).replace(/\s+/g, '.'),
            aText: (a.textContent || '').trim().slice(0, 40),
            bText: (b.textContent || '').trim().slice(0, 40)
          });
        }
      }
    }
    return pairs.slice(0, 25);
  });
}

async function getHeadingHit(page) {
  return page.evaluate(() => {
    const headings = [...document.querySelectorAll('h1, h2, h3, h4')];
    const results = [];
    for (const h of headings) {
      const r = h.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const hit = document.elementFromPoint(cx, cy);
      const ok = !!hit && (hit === h || h.contains(hit));
      results.push({ text: (h.textContent || '').trim(), ok });
    }
    return results;
  });
}

async function getGapMax(page) {
  return page.evaluate(() => {
    const sections = [...document.querySelectorAll('.pp-section, section.gk-band, section')].filter((el) => el.offsetParent !== null);
    let maxGap = 0;
    for (let i = 1; i < sections.length; i++) {
      const prev = sections[i - 1];
      const current = sections[i];
      const prevRect = prev.getBoundingClientRect();
      const currentRect = current.getBoundingClientRect();
      const gap = currentRect.top - prevRect.bottom;
      if (gap > maxGap) maxGap = gap;
    }
    return maxGap;
  });
}

async function getBandBackgrounds(page) {
  return page.evaluate(() => {
    const bands = [...document.querySelectorAll('.gk-band, .pp-cta-band, .ais-spotlight-band, .ais-catalog-band')];
    return bands.map((band) => ({
      selector: band.className || band.tagName,
      bg: getComputedStyle(band).backgroundColor
    }));
  });
}

async function getPendingCount(page) {
  return page.evaluate(() => [...document.querySelectorAll('.pp-draft-chip, .bh-tag--unconfirmed')].filter((n) => /Draft — pending content|Unconfirmed/i.test(n.textContent || '')).length);
}

async function getImageReuse(page) {
  return page.evaluate(() => {
    const map = new Map();
    [...document.querySelectorAll('img')].forEach((img) => {
      const src = (img.currentSrc || img.src || '').trim();
      if (!src) return;
      map.set(src, (map.get(src) || 0) + 1);
    });
    return [...map.entries()].filter(([, count]) => count > 1).map(([src, count]) => ({ src, count }));
  });
}

async function getImageFiles(page) {
  return page.evaluate(() => {
    const images = [...document.querySelectorAll('img, source')].map((node) => (node.getAttribute('srcset') || node.getAttribute('src') || '')).filter(Boolean);
    return images;
  });
}

async function getFade(page) {
  await page.waitForTimeout(450);
  return page.evaluate(() => {
    const main = document.querySelector('main');
    return main ? getComputedStyle(main).opacity : 'missing';
  });
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  const base = 'http://127.0.0.1:5501';

  console.log('P25 visual QA');
  for (const file of pages) {
    for (const theme of themes) {
      for (const size of sizes) {
        await page.setViewportSize(size);
        await page.goto(`${base}/pages/${file}`);
        await page.evaluate((mode) => {
          const body = document.body;
          if (body) body.dataset.theme = mode;
          const main = document.querySelector('main');
          if (main) main.style.opacity = '1';
        }, theme);
        await page.waitForTimeout(400);

        const overlap = await getTextOverlap(page);
        const hitChecks = await getHeadingHit(page);
        const gapMax = await getGapMax(page);
        const bands = await getBandBackgrounds(page);
        const pending = await getPendingCount(page);
        const reused = await getImageReuse(page);
        const fade = await getFade(page);

        console.log(JSON.stringify({
          file,
          theme,
          size,
          overlap: overlap.length,
          hitFail: hitChecks.filter((x) => !x.ok).length,
          gapMax,
          bandBackgrounds: bands.slice(0, 5).map((b) => b.bg),
          pending,
          reused: reused.length,
          fade
        }, null, 2));
      }
    }
  }

  await browser.close();
})();
