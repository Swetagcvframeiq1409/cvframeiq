'use strict';

const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const SITE_ROOT = 'D:/CVFrameIQ/Frontend-UI/FrameIQ-Frontend/frameiq-site';
const OUT_DIR = 'D:/CVFrameIQ/_review';
const PAGE_URL = process.env.HERO_TEST_URL || 'file:///' + SITE_ROOT + '/index.html';
const VIEWPORTS = [
  { w: 1918, h: 988, label: '1918x988' },
  { w: 1440, h: 900, label: '1440x900' },
  { w: 1366, h: 768, label: '1366x768' },
  { w: 1024, h: 768, label: '1024x768' },
  { w: 768, h: 1024, label: '768x1024' },
  { w: 360, h: 800, label: '360x800' },
];
const THEMES = ['dark', 'light'];

fs.mkdirSync(OUT_DIR, { recursive: true });

async function installCLSObserver(page) {
  await page.addInitScript(() => {
    window.__heroCLS = 0;
    try {
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!entry.hadRecentInput) window.__heroCLS += entry.value;
        }
      }).observe({ type: 'layout-shift', buffered: true });
    } catch (error) {
      window.__heroCLS = 'unsupported';
    }
  });
}

async function measureHero(page) {
  return page.evaluate(() => {
    const rect = (selector) => {
      const element = document.querySelector(selector);
      if (!element) return null;
      const box = element.getBoundingClientRect();
      return { top: box.top, bottom: box.bottom, height: box.height, left: box.left, right: box.right };
    };
    const gap = (first, second) => first && second ? Math.round(second.top - first.bottom) : null;
    const badge = rect('#hero .hero-eyebrow-pill');
    const headline = rect('#hero .hero-headline');
    const subtitle = rect('#hero .hero-subtitle');
    const chips = rect('#hero .home-chips');
    const actions = rect('#hero .home-actions');
    const stats = rect('#hero .hero-stats');
    const caption = rect('#hero .hero-caption');
    const image = rect('#hero .hero-img-stack');
    const marqueeLabel = rect('#hero .hero-marquee-label');
    const marquee = rect('#hero .home-marquee');
    const copy = rect('#hero .home-hero__copy');
    const headingElement = document.querySelector('#hero .hero-headline');
    const headingStyle = headingElement ? getComputedStyle(headingElement) : null;
    const chipElements = Array.from(document.querySelectorAll('#hero .home-chips > span'));
    const chipRows = new Set(chipElements.map((element) => Math.round(element.getBoundingClientRect().top))).size;
    const statItems = Array.from(document.querySelectorAll('#hero .hero-stats__item'));
    const statWidths = statItems.map((element) => Math.round(element.getBoundingClientRect().width));
    const buttons = Array.from(document.querySelectorAll('#hero .home-actions .home-button'));
    const buttonHeights = buttons.map((element) => Math.round(element.getBoundingClientRect().height));
    const imageElement = document.querySelector('#hero .hero-img-main');
    const imageStyle = imageElement ? getComputedStyle(imageElement) : null;
    const animationTotalMs = Array.from(document.querySelectorAll('#hero .hero-reveal')).reduce((maximum, element) => {
      const style = getComputedStyle(element);
      const seconds = (value) => {
        const number = Number.parseFloat(value) || 0;
        return value.endsWith('ms') ? number / 1000 : number;
      };
      return Math.max(maximum, (seconds(style.animationDuration) + seconds(style.animationDelay)) * 1000);
    }, 0);
    const hero = rect('#hero');
    const bottoms = [badge, headline, subtitle, chips, actions, image, stats, caption, marqueeLabel, marquee]
      .filter(Boolean).map((box) => box.bottom);
    const lowestBottom = bottoms.length ? Math.max(...bottoms) : null;
    const statWidthsDiff = statWidths.length ? Math.max(...statWidths) - Math.min(...statWidths) : null;
    const chat = document.querySelector('#hero .home-marquee');
    const computedMarquee = chat ? getComputedStyle(chat) : null;
    const mobileOrder = [badge, headline, subtitle, chips, actions, image, stats, caption, marqueeLabel, marquee]
      .filter(Boolean);

    return {
      headlineFontSize: headingStyle ? headingStyle.fontSize : 'n/a',
      headlineLineHeight: headingStyle ? headingStyle.lineHeight : 'n/a',
      gaps: {
        badgeToHeadline: gap(badge, headline),
        headlineToParagraph: gap(headline, subtitle),
        paragraphToChips: gap(subtitle, chips),
        chipsToButtons: gap(chips, actions),
        buttonsToStats: gap(actions, stats),
        statsToLocation: gap(stats, caption),
      },
      chipRows,
      copyHeight: copy ? Math.round(copy.height) : null,
      imageHeight: image ? Math.round(image.height) : null,
      columnHeightDiff: copy && image ? Math.round(Math.abs(copy.height - image.height)) : null,
      actionsBottomVsFold: actions ? Math.round(actions.bottom - innerHeight) : null,
      statsTopVsFold: stats ? Math.round(stats.top - innerHeight) : null,
      statsBottomVsFold: stats ? Math.round(stats.bottom - innerHeight) : null,
      lowestHeroBottom: lowestBottom === null ? null : Math.round(lowestBottom),
      lowestHeroBottomVsFold: lowestBottom === null ? null : Math.round(lowestBottom - innerHeight),
      sectionBottomVsFold: hero ? Math.round(hero.bottom - innerHeight) : null,
      statWidths,
      statWidthsDiff,
      buttonHeights,
      minimumButtonHeight: buttonHeights.length ? Math.min(...buttonHeights) : null,
      mobileOrderValid: innerWidth > 767 || mobileOrder.every((box, index) => index === 0 || box.top >= mobileOrder[index - 1].bottom),
      imageAspectRatio: image ? Number((image.right - image.left) / image.height).toFixed(2) : 'n/a',
      imageObjectPosition: imageStyle ? imageStyle.objectPosition : 'n/a',
      latencyClipped: statItems.some((element) => {
        const value = element.textContent.replace(/\s+/g, '');
        return value.includes('<200ms') && element.scrollWidth > element.clientWidth + 2;
      }),
      animationTotalMs: Math.round(animationTotalMs),
      imageLoaded: Boolean(document.querySelector('#hero .hero-img-main')?.complete && document.querySelector('#hero .hero-img-main')?.naturalWidth),
      horizontalOverflow: document.documentElement.scrollWidth > innerWidth,
      cls: window.__heroCLS,
      tickerPaddingEnd: computedMarquee ? computedMarquee.paddingInlineEnd : 'n/a',
    };
  });
}

function printTable(theme, rows) {
  console.log(`\n${theme.toUpperCase()} THEME`);
  console.log('| Viewport | Headline (font/line) | Stacked gaps (badge/head/para/chips/buttons/stats) | Chip rows | Columns (copy/image/diff) | Buttons bottom vs fold | Stats top/bottom vs fold | Lowest hero bottom vs fold | Animation ms | CLS (3s) |');
  console.log('|---|---|---|---:|---|---:|---|---:|---:|---:|');
  for (const row of rows) {
    const d = row.data;
    const gaps = Object.values(d.gaps).map((value) => value === null ? 'n/a' : value).join('/');
    console.log(`| ${row.viewport.label} | ${d.headlineFontSize} / ${d.headlineLineHeight} | ${gaps} | ${d.chipRows} | ${d.copyHeight}/${d.imageHeight}/${d.columnHeightDiff} | ${d.actionsBottomVsFold} | ${d.statsTopVsFold}/${d.statsBottomVsFold} | ${d.lowestHeroBottom}/${d.lowestHeroBottomVsFold} | ${d.animationTotalMs} | ${d.cls} |`);
  }
  console.log('Additional checks (per viewport): stat widths/difference, latency clipping, image load, horizontal overflow, ticker end padding, section fold position.');
  for (const row of rows) {
    const d = row.data;
    console.log(`${row.viewport.label}: widths=${JSON.stringify(d.statWidths)} diff=${d.statWidthsDiff} latencyClipped=${d.latencyClipped} imageLoaded=${d.imageLoaded} imageAspectRatio=${d.imageAspectRatio} objectPosition=${d.imageObjectPosition} buttonHeights=${JSON.stringify(d.buttonHeights)} mobileOrderValid=${d.mobileOrderValid} horizontalOverflow=${d.horizontalOverflow} tickerPaddingEnd=${d.tickerPaddingEnd} sectionBottomVsFold=${d.sectionBottomVsFold}`);
  }
}

async function takeScrollVideo(browser) {
  const context = await browser.newContext({
    viewport: { width: 1918, height: 988 },
    recordVideo: { dir: OUT_DIR, size: { width: 1918, height: 988 } },
  });
  const page = await context.newPage();
  await page.goto(PAGE_URL, { waitUntil: 'networkidle' });
  await page.waitForTimeout(900);
  const maxScroll = await page.evaluate(() => Math.min(
    document.documentElement.scrollHeight - innerHeight,
    Math.ceil(document.querySelector('#hero').getBoundingClientRect().bottom + scrollY)
  ));
  for (let y = 0; y <= maxScroll; y += 100) {
    await page.evaluate((scrollY) => window.scrollTo(0, scrollY), y);
    await page.waitForTimeout(80);
  }
  await page.evaluate((scrollY) => window.scrollTo(0, scrollY), maxScroll);
  await page.waitForTimeout(250);
  const video = page.video();
  await context.close();
  const source = await video.path();
  const target = path.join(OUT_DIR, 'hero-scroll.webm');
  if (fs.existsSync(target)) fs.unlinkSync(target);
  fs.renameSync(source, target);
  console.log(`Scroll video saved: ${target}`);
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  await takeScrollVideo(browser);

  for (const theme of THEMES) {
    const rows = [];
    for (const viewport of VIEWPORTS) {
      const context = await browser.newContext({ viewport: { width: viewport.w, height: viewport.h } });
      const page = await context.newPage();
      await installCLSObserver(page);
      await page.goto(PAGE_URL, { waitUntil: 'networkidle' });
      await page.evaluate((selectedTheme) => {
        const meta = document.querySelector('meta[name="color-scheme"]');
        if (meta) meta.content = selectedTheme;
        document.documentElement.dataset.theme = selectedTheme;
        document.documentElement.style.colorScheme = selectedTheme;
      }, theme);
      await page.waitForTimeout(3100);
      const data = await measureHero(page);
      rows.push({ viewport, data });

      if (theme === 'dark' && [1918, 1366, 360].includes(viewport.w)) {
        const target = path.join(OUT_DIR, `hero-${viewport.w}.png`);
        await page.screenshot({ path: target, fullPage: false });
        console.log(`Screenshot saved: ${target}`);
      }
      await context.close();
    }
    printTable(theme, rows);
  }

  const reducedContext = await browser.newContext({
    viewport: { width: 360, height: 800 },
    reducedMotion: 'reduce',
  });
  const reducedPage = await reducedContext.newPage();
  await reducedPage.goto(PAGE_URL, { waitUntil: 'networkidle' });
  await reducedPage.waitForTimeout(700);
  const reducedMotion = await reducedPage.evaluate(() => {
    const reveals = Array.from(document.querySelectorAll('#hero .hero-reveal'));
    const animated = [
      document.querySelector('#hero .hero-orb'),
      document.querySelector('#hero .hero-eyebrow-dot'),
      document.querySelector('#hero .home-marquee__track'),
    ].filter(Boolean);
    return {
      revealsStatic: reveals.every((element) => {
        const style = getComputedStyle(element);
        return style.opacity === '1' && style.transform === 'none' && style.animationName === 'none';
      }),
      ambientMotionStopped: animated.every((element) => getComputedStyle(element).animationName === 'none'),
    };
  });
  console.log(`Reduced motion static: ${JSON.stringify(reducedMotion)}`);
  await reducedContext.close();

  await browser.close();
  console.log('\nHERO TEST COMPLETE');
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
