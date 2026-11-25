import assert from 'node:assert/strict';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { languages, orderReleases, origin, pages, route } from './registry.mjs';

const require = createRequire(import.meta.url);
const { chromium, devices } = require(process.env.PLAYWRIGHT_MODULE ?? 'playwright');
const base = process.argv[2] ?? 'http://127.0.0.1:18170';
const evidence = process.argv[3];
const root = fileURLToPath(new URL('../', import.meta.url));
const [{ version }] = orderReleases(JSON.parse(await readFile(join(root, 'website/releases.json'), 'utf8')));
const ids = ['home', 'morse', 'download', 'about'];
const pagesToShow = pages.filter(page => ids.includes(page.id));
const browser = await chromium.launch(process.env.EDGE_PATH ? { executablePath: process.env.EDGE_PATH } : {});
const counts = { layouts: 0, images: 0, interaction: 0 };
const performance = [];
const checks = [];
const pass = name => { counts.interaction++; checks.push(name); };
if (evidence) await mkdir(evidence, { recursive: true });

function interceptGoalNavigation() {
  // Let the site's click handler run before preventing the test browser from leaving.
  document.addEventListener('DOMContentLoaded', () => {
    document.addEventListener('click', event => {
      if (event.target.closest('[data-metrika-goal]')) event.preventDefault();
    });
  });
}

async function layout(context, { id }, lang, width) {
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('response', response => { if (response.status() >= 400) errors.push(response.url()); });
  try {
    await page.setViewportSize({ width, height: width < 550 ? 850 : 900 });
    const response = await page.goto(base + route(id, lang), { waitUntil: 'load' });
    assert.equal(response.status(), 200);
    assert.equal(await page.locator('h1').count(), 1);
    const geometry = await page.evaluate(async () => {
      const images = [...document.querySelectorAll('main img')];
      await Promise.all(images.map(image => {
        image.loading = 'eager';
        return image.decode();
      }));
      return { width: document.documentElement.scrollWidth, count: images.length,
        headings: [...document.querySelectorAll('main h1,main h2')].map(node => node.getBoundingClientRect()) };
    });
    assert(geometry.width <= width, 'Horizontal overflow at ' + id + '/' + lang + ' ' + width + ': ' + geometry.width);
    assert(geometry.headings.every(rect => rect.left >= -1 && rect.right <= width + 1), 'Heading overflow');
    assert.deepEqual(errors, []);
    counts.layouts++;
    counts.images += geometry.count;

    if (evidence && ids.includes(id) && [1440, 390].includes(width)) {
      const dismiss = page.locator('.cookie-notice button');
      if (await dismiss.isVisible()) await dismiss.click();
      await page.screenshot({ path: join(evidence, lang + '-' + id + '-' + width + '.png'), animations: 'disabled', fullPage: true });
    }
  } finally {
    await page.close();
  }
}

async function selectAndCheck(page, selector, key = 'Enter') {
  await page.locator(selector).focus();
  await page.keyboard.press(key);
}

async function interactions() {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
  await context.addInitScript(interceptGoalNavigation);
  const external = [];
  await context.route(/https:\/\//, request => {
    external.push(request.request().url());
    return request.abort();
  });
  const page = await context.newPage();
  await page.goto(base + '/?lang=en&utm_source=qa&utm_content=run#tool-auto-run');
  await page.waitForURL(base + '/en/?utm_source=qa&utm_content=run#tool-auto-run');
  await page.locator('#tool-auto-run').waitFor();
  pass('Legacy language URL retains campaign parameters and anchor');

  await page.locator('.cookie-notice button').click();
  assert.equal(await page.locator('.cookie-notice').isVisible(), false);
  await page.goto(base + '/en/?utm_source=qa#preview');
  assert.equal(await page.locator('.cookie-notice').isVisible(), false);
  await selectAndCheck(page, '.mobile-menu', 'Space');
  assert.equal(await page.locator('.mobile-menu').getAttribute('aria-expanded'), 'true');
  await selectAndCheck(page, '.nav-tools summary', 'Space');
  assert.equal(await page.locator('.tool-pop a').count(), 9);
  assert.equal(await page.locator('.tool-pop a').first().isVisible(), true);
  await page.keyboard.press('Escape');
  assert.equal(await page.locator('.nav-tools summary').evaluate(el => el === document.activeElement), true);
  await page.keyboard.press('Escape');
  assert.equal(await page.locator('.mobile-menu').evaluate(el => el === document.activeElement), true);
  await page.keyboard.press('Enter');
  await page.locator('[data-language-link]').click();
  await page.waitForURL(base + '/?utm_source=qa#preview');
  assert.equal(await page.locator('.cookie-notice').isVisible(), false);
  pass('Mobile menu, keyboard focus, language pair and shared cookie state');

  await page.goto(base + '/tools/morse/?utm_source=qa#guide');
  await page.locator('.mobile-menu').click();
  assert.match(await page.locator('[data-language-link]').getAttribute('href'), /\/en\/tools\/morse\/\?utm_source=qa#guide$/);
  await page.evaluate(() => { location.hash = 'missing'; });
  await page.waitForFunction(() => !document.querySelector('[data-language-link]').hash);
  await page.locator('[data-language-link]').click();
  await page.waitForURL(base + '/en/tools/morse/?utm_source=qa');
  await page.locator('.feature-hero a[href="/en/download/"]').click();
  await page.waitForURL(base + '/en/download/');
  await page.goto(base + '/en/tools/morse/?utm_source=qa#guide');
  assert.equal(new URL(page.url()).hash, '#guide');
  assert(await page.locator('#guide h2').evaluate(el => el.getBoundingClientRect().top >= 0));
  pass('Deep language pairs and matching anchors, with unknown anchors removed');

  const galleryLink = page.locator('[data-shot]').first();
  await galleryLink.focus();
  await page.keyboard.press('Enter');
  assert.equal(await page.locator('dialog').isVisible(), true);
  const first = await page.locator('.lightbox-image').getAttribute('src');
  await page.keyboard.press('ArrowRight');
  assert.notEqual(await page.locator('.lightbox-image').getAttribute('src'), first);
  await page.keyboard.press('ArrowLeft');
  assert.equal(await page.locator('.lightbox-image').getAttribute('src'), first);
  await page.keyboard.press('Escape');
  await page.waitForFunction(() => document.activeElement.matches('[data-shot]'));
  assert.equal(await page.locator('dialog').isVisible(), false);
  const summaries = page.locator('.questions summary');
  assert.equal(await page.locator('.questions details[open]').count(), 1);
  await summaries.nth(0).focus();
  await page.keyboard.press('Space');
  assert.equal(await page.locator('.questions details[open]').count(), 0);
  await summaries.nth(0).focus();
  await page.keyboard.press('Space');
  await summaries.nth(1).focus();
  await page.keyboard.press('Enter');
  assert.equal(await page.locator('.questions details[open]').count(), 2);
  assert.equal(await page.locator('.hero-copy').evaluate(el => parseFloat(getComputedStyle(el).animationDuration) < .01), true);
  pass('Gallery keyboard controls and focus return, independent FAQ and reduced motion');

  await page.goto(base + '/');
  await page.keyboard.press('Tab');
  assert.equal(await page.locator('.skip').evaluate(el => el === document.activeElement), true);
  await page.keyboard.press('Enter');
  assert.equal(await page.locator('#main').evaluate(el => el === document.activeElement), true);
  assert.equal(await page.locator('#tools .tool-card').count(), 9);
  const card = page.locator('#tool-magnifier');
  assert.equal(await card.getAttribute('href'), '/tools/magnifier/');
  await card.click();
  await page.waitForURL(base + '/tools/magnifier/');
  pass('Skip link and whole-card navigation');

  await page.goto(base + '/');
  await page.locator('.hero a[href="#donate"]').click();
  assert.equal(await page.evaluate(() => window.dayzPreviewEvents.length), 0);
  await page.locator('#donate [data-metrika-goal]').click({ noWaitAfter: true });
  assert.deepEqual(await page.evaluate(() => window.dayzPreviewEvents), [{ goal: 'donate_click' }]);
  await page.locator('#feedback [data-metrika-goal]').click({ noWaitAfter: true });
  assert.deepEqual(await page.evaluate(() => window.dayzPreviewEvents.map(event => event.goal)), ['donate_click', 'support_click']);
  await page.locator('.home-hero [data-metrika-goal="download_click"]').click({ noWaitAfter: true });
  assert.deepEqual(await page.evaluate(() => window.dayzPreviewEvents.at(-1)), { goal: 'download_click', version });
  await page.locator('.catalog-download [data-metrika-goal="download_click"]').click({ noWaitAfter: true });
  assert.deepEqual(await page.evaluate(() => window.dayzPreviewEvents.at(-1)), { goal: 'download_click', version });
  await page.locator('.hero a[href="/download/"]').click();
  await page.waitForURL(base + '/download/');
  assert.deepEqual(await page.evaluate(() => window.dayzPreviewEvents), []);
  assert.equal(await page.locator('.download-links').count(), 0);
  assert.equal(await page.locator('#history').count(), 1);
  await page.locator('.release-panel [data-metrika-goal]').click({ noWaitAfter: true });
  assert.deepEqual(await page.evaluate(() => window.dayzPreviewEvents), [{ goal: 'download_click', version }]);
  assert.equal(external.some(url => url.includes('mc.yandex.ru')), false);
  pass('Preview goals fire once per external action, with no requests to Metrica');
  await context.close();

  const noScript = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  const staticPage = await noScript.newPage();
  await staticPage.goto(base + '/en/');
  assert(await staticPage.locator('a[data-language-link]').isVisible());
  await staticPage.locator('.nav-tools summary').click();
  assert(await staticPage.locator('.tool-pop a[href="/en/tools/morse/"]').isVisible());
  await staticPage.locator('.tool-pop a[href="/en/tools/morse/"]').click();
  await staticPage.waitForURL(base + '/en/tools/morse/');
  assert.equal(await staticPage.locator('.questions details[open]').count(), 1);
  await staticPage.locator('.questions summary').first().click();
  assert.equal(await staticPage.locator('.questions details[open]').count(), 0);
  assert.match(await staticPage.locator('[data-shot]').first().getAttribute('href'), /\.webp$/);
  await staticPage.goto(base + '/en/download/');
  assert.match(await staticPage.locator('.release-panel a.btn').getAttribute('href'), /\.zip$/);
  await noScript.close();
  pass('Navigation, language, gallery links, ZIP and FAQ available without JavaScript');
}

async function navigationTargets() {
  for (const width of [1440, 390, 320]) {
    const page = await browser.newPage({ viewport: { width, height: 850 } });
    await page.goto(base + '/en/tools/morse/');
    if (width <= 820) await page.locator('.mobile-menu').click();
    const trigger = page.locator('.nav-tools summary');
    await trigger.focus();
    await page.keyboard.press('Enter');
    const current = page.locator('.tool-pop a[aria-current="page"]');
    assert.equal(await current.getAttribute('href'), '/en/tools/morse/');
    const sizes = await page.evaluate(() => [...document.querySelectorAll(
      '.mobile-menu, .wordmark, .navigation > a, .nav-tools summary, .tool-pop a, .lang a, ' +
      '.jump a, .questions summary, .cookie-notice button, .actions .btn, .footer-row nav a',
    )].map(el => ({ name: el.textContent.trim(), width: el.offsetWidth, height: el.offsetHeight }))
      .filter(target => target.width && target.height));
    for (const target of sizes) assert(target.width >= 44 && target.height >= 44,
      target.name + ' is ' + target.width + '×' + target.height + ' at ' + width);
    await current.focus();
    await page.keyboard.press('Escape');
    assert.equal(await trigger.evaluate(el => el === document.activeElement), true);
    assert.equal(await page.locator('.tool-pop').isVisible(), false);
    await page.close();
  }
  pass('Desktop and mobile navigation focus, current tool, and 44×44 targets');
}

async function analytics() {
  for (const javaScriptEnabled of [true, false]) {
    const ctx = await browser.newContext({ javaScriptEnabled });
    if (javaScriptEnabled) await ctx.addInitScript(interceptGoalNavigation);
    const calls = [];
    await ctx.route('**/*', async request => {
      const url = new URL(request.request().url());
      if (url.origin === origin) {
        const file = url.pathname.endsWith('/') ? url.pathname + 'index.html' : url.pathname;
        const mime = file.endsWith('.html') ? 'text/html; charset=utf-8' :
          file.endsWith('.js') ? 'text/javascript' : file.endsWith('.css') ? 'text/css' : undefined;
        return request.fulfill({ path: join(root, file.slice(1)), contentType: mime });
      }
      if (url.origin === 'https://mc.yandex.ru') {
        calls.push(url.pathname);
        return url.pathname.endsWith('.js') ? request.fulfill({
          contentType: 'text/javascript', body: 'window.qaMetrika = window.ym.a;',
        }) : request.fulfill({ status: 204 });
      }
      return request.abort();
    });
    const page = await ctx.newPage();
    await page.goto(origin + '/en/download/', { waitUntil: 'networkidle' });
    if (javaScriptEnabled) {
      assert.deepEqual(calls, ['/metrika/tag.js']);
      const init = await page.evaluate(() => window.qaMetrika);
      assert.equal(init.length, 1);
      assert.equal(init[0][0], 114496162);
      assert.equal(init[0][1], 'init');
      assert.equal(init[0][2].webvisor, true);
      assert.equal(init[0][2].trackLinks, false);
      await page.locator('.release-panel a.btn').click({ noWaitAfter: true });
      const goal = await page.evaluate(() => window.qaMetrika[1]);
      assert.deepEqual(goal, [114496162, 'reachGoal', 'download_click', { version }]);
    } else {
      assert.deepEqual(calls, ['/watch/114496162']);
    }
    await ctx.close();
  }
  pass('Production init and noscript fallback separately verified with intercepted requests');
}

async function measure(pageInfo, lang) {
  const context = await browser.newContext(devices['Pixel 7']);
  const page = await context.newPage();
  const cdp = await context.newCDPSession(page);
  await cdp.send('Network.enable');
  await cdp.send('Network.emulateNetworkConditions', {
    offline: false, latency: 150, downloadThroughput: 200000, uploadThroughput: 93750,
  });
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
  await page.addInitScript(() => {
    window.qaVitals = { lcp: 0, cls: 0, input: 0 };
    new PerformanceObserver(list => {
      for (const entry of list.getEntries()) window.qaVitals.lcp = entry.startTime;
    }).observe({ type: 'largest-contentful-paint', buffered: true });
    new PerformanceObserver(list => {
      for (const entry of list.getEntries()) if (!entry.hadRecentInput) window.qaVitals.cls += entry.value;
    }).observe({ type: 'layout-shift', buffered: true });
    new PerformanceObserver(list => {
      for (const entry of list.getEntries()) if (entry.interactionId) window.qaVitals.input = Math.max(window.qaVitals.input, entry.duration);
    }).observe({ type: 'event', durationThreshold: 16, buffered: true });
  });
  await page.goto(base + route(pageInfo.id, lang), { waitUntil: 'load' });
  await page.waitForFunction(() => window.qaVitals.lcp > 0);
  await page.locator('.mobile-menu').click();
  await page.locator('.mobile-menu').click();
  await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
  const metrics = await page.evaluate(() => ({
    LCP_ms: Math.round(window.qaVitals.lcp), CLS: Number(window.qaVitals.cls.toFixed(3)),
    sample_input_ms: window.qaVitals.input || '<16',
  }));
  performance.push({ template: pageInfo.id, lang, ...metrics });
  await context.close();
}

try {
  const context = await browser.newContext({ reducedMotion: 'reduce' });
  for (const page of pages) {
    for (const lang of languages) {
      const widths = ids.includes(page.id) ? [1440, 1024, 768, 390, 320] : [1440, 390, 320];
      if (['home', 'morse'].includes(page.id)) widths.push(360, 430);
      for (const width of widths) await layout(context, page, lang, width);
    }
  }
  await context.close();
  await interactions();
  await navigationTargets();
  await analytics();
  for (const page of pagesToShow) for (const lang of languages) await measure(page, lang);
  const report = { counts, checks, performance };
  if (evidence) await writeFile(join(evidence, 'browser-results.json'), JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
} finally {
  await browser.close();
}
