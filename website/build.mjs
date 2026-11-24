import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { html, shell } from './components.mjs';
import { archive, languages, links, localizedLinks, orderReleases, origin, pages, route, shots, tools } from './registry.mjs';
import { demoFor, render } from './templates.mjs';
import ru from './ru.mjs';
import en from './en.mjs';
import toolsRu from './tools-ru.mjs';
import toolsEn from './tools-en.mjs';

export const root = fileURLToPath(new URL('../', import.meta.url));
const locales = { ru: { ...ru, ...toolsRu }, en: { ...en, ...toolsEn } };
const readJson = async path => JSON.parse(await readFile(path, 'utf8'));
const demo = await readJson(join(root, 'website/demos.json'));
const files = new Map();
const anchors = text => [...text.matchAll(/\sid="([^"]+)"/g)].map(match => match[1]);
const isHttps = value => typeof value === 'string' && URL.canParse(value) && new URL(value).protocol === 'https:';
const hash = async file => createHash('sha256').update(await readFile(join(root, file))).digest('hex').slice(0, 12);

function validateCopy(a, b, label) {
  if (typeof a === 'string') {
    assert(typeof b === 'string' && a.trim() && b.trim(), 'Missing translation: ' + label);
    return;
  }
  assert(a && b && typeof a === 'object' && typeof b === 'object', 'Missing section: ' + label);
  assert.deepEqual(Object.keys(a).sort(), Object.keys(b).sort(), 'Locale fields differ: ' + label);
  for (const key of Object.keys(a)) validateCopy(a[key], b[key], label + '.' + key);
}

function validateReleases(records) {
  const versions = new Set();
  for (const r of records) {
    assert(/^\d+\.\d+\.\d+$/.test(r.version) && !versions.has(r.version), 'Invalid or duplicate version');
    versions.add(r.version);
    assert(r.channel === 'STABLE' && r.version !== '1.6.2', 'Unexpected public release: ' + r.version);
    assert(/^\d{4}-\d{2}-\d{2}$/.test(r.date) && !Number.isNaN(Date.parse(r.date)) &&
      new Date(r.date).toISOString().slice(0, 10) === r.date, 'Invalid release date: ' + r.version);
    assert(r.url === archive + '/tag/v' + r.version && isHttps(r.url), 'Invalid release URL: ' + r.version);
    assert(r.notes && languages.every(lang => typeof r.notes[lang] === 'string' && r.notes[lang].trim()),
      'Missing release notes: ' + r.version);
    if (r.sha256) assert(/^[\da-f]{64}$/i.test(r.sha256), 'Invalid SHA-256: ' + r.version);
  }
  const current = records[0];
  assert(current && current.platform === 'Windows x64' && Number.isSafeInteger(current.bytes) && current.bytes > 0,
    'Current STABLE needs a Windows x64 ZIP size');
  assert(isHttps(current.zip) && current.zip === archive + '/download/v' + current.version +
    '/DayZCompanion-' + current.version + '-Windows.zip', 'Current STABLE needs the official full Windows ZIP');
}

async function validateOutput() {
  const byRoute = new Map([...files].filter(([name]) => name.endsWith('index.html'))
    .map(([name, text]) => ['/' + name.slice(0, -'index.html'.length), text]));
  const localResources = new Set();
  const unique = { title: new Set(), description: new Set(), h1: new Set() };

  for (const [url, text] of byRoute) {
    const ids = anchors(text);
    assert.equal(new Set(ids).size, ids.length, 'Duplicate anchor in ' + url);
    for (const [key, pattern] of Object.entries({
      title: /<title>([^<]+)<\/title>/g,
      description: /<meta name="description" content="([^"]+)"/g,
      h1: /<h1>(.*?)<\/h1>/g,
    })) {
      const values = [...text.matchAll(pattern)].map(match => match[1]);
      assert(values.length === 1 && !unique[key].has(values[0]), 'Invalid or duplicate ' + key + ' at ' + url);
      unique[key].add(values[0]);
    }
    assert(!/\bTEST\b|\b1\.6\.2\b|data-planned-tool|assets\/ui-icons\//.test(text), 'Obsolete copy in ' + url);
    const zips = [...text.matchAll(/<a [^>]*href="https:[^"]+\.zip"[^>]*>/gi)];
    const isDownload = /(?:^|\/)download\/$/.test(url);
    assert.equal(zips.length, isDownload ? 1 : 0, 'Unexpected number of ZIP links on ' + url);
    if (isDownload) assert(text.match(/<article class="release-panel">.*?<\/article>/s)[0].includes(zips[0][0]),
      'ZIP must be in the STABLE card');
    for (const match of text.matchAll(/\s(?:href|src)="([^"]+)"/g)) {
      const target = new URL(match[1], origin + url);
      assert.equal(target.protocol, 'https:', 'Invalid link on ' + url);
      if (target.origin !== origin) continue;
      if (target.pathname.startsWith('/assets/') || target.pathname === '/favicon.ico') {
        localResources.add(target.pathname);
        continue;
      }
      const destination = byRoute.get(target.pathname);
      assert(destination, 'Broken link ' + match[1] + ' on ' + url);
      if (target.hash) assert(anchors(destination).includes(target.hash.slice(1)), 'Broken anchor ' + match[1] + ' on ' + url);
    }
  }
  await Promise.all([...localResources].map(file => readFile(join(root, file.slice(1)))));
  for (const value of Object.values(links)) assert(isHttps(value), 'Invalid external URL: ' + value);
  for (const group of Object.values(localizedLinks)) {
    for (const lang of languages) assert(isHttps(group[lang]), 'Missing localized external URL for ' + lang);
  }
  for (const lang of languages) await readFile(join(root, 'assets', shots[lang].home.mobile));
}

async function build() {
  const releasePath = process.env.DAYZ_SITE_RELEASES ?? join(root, 'website/releases.json');
  const records = await readJson(releasePath);
  const releases = orderReleases(records);
  validateReleases(releases);
  const release = releases[0];
  validateCopy(locales.ru, locales.en, 'copy');
  assert.equal(tools.length, 9);
  assert.equal(pages.length, 12);
  assert.equal(new Set(pages.map(page => page.id)).size, pages.length);
  const cssVersion = await hash('assets/site.css');
  const jsVersion = await hash('assets/site.js');
  const matrix = [], urls = new Set();
  for (const page of pages) {
    await readFile(join(root, 'assets', page.art));
    const pairs = Object.fromEntries(languages.map(lang => {
      const ctx = { lang, copy: locales[lang], page, release, releases, demo };
      return [lang, { ...ctx, content: render(ctx) }];
    }));
    for (const lang of languages) {
      const ctx = pairs[lang];
      const t = ctx.copy[page.id];
      for (const key of ['name', 'title', 'description', 'h1', 'intent']) assert(t[key], 'Missing ' + page.id + '.' + key);
      const url = route(page.id, lang);
      assert(/^\/(?:[a-z0-9-]+\/)*$/.test(url) && !urls.has(url), 'Invalid or duplicate route ' + url);
      urls.add(url);
      const social = page.template === 'tool' ? demoFor(ctx)[0] :
        { shot: shots[lang].home, label: ctx.copy.home.shots.home };
      const otherLang = lang === 'ru' ? 'en' : 'ru';
      const alternateAnchors = anchors(pairs[otherLang].content);
      const build = shell({
        ...ctx, anchors: ['main', ...alternateAnchors], cssVersion, jsVersion,
        social: { file: social.shot.file, label: social.label },
      });
      files.set(url.slice(1) + 'index.html', build);
      matrix.push([page.id, route(page.id, 'ru'), route(page.id, 'en'), lang, t.intent,
        t.title.replaceAll('{version}', release.version), t.description.replaceAll('{version}', release.version), t.h1]);
    }
  }

  await validateOutput();
  files.set('sitemap.xml', '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    [...urls].map(url => '  <url><loc>' + html(origin + url) + '</loc></url>').join('\n') + '\n</urlset>\n');
  files.set('robots.txt', 'User-agent: *\nAllow: /\n\nSitemap: ' + origin + '/sitemap.xml\n');
  files.set('docs/SEO_MATRIX.md', '# SEO-матрица Website 2.0\n\n' +
    '| pageId | RU URL | EN URL | Язык | Интент | Title | Description | H1 |\n' +
    '| --- | --- | --- | --- | --- | --- | --- | --- |\n' +
    matrix.map(row => '| ' + row.map(value => value.replaceAll('|', '\\|')).join(' | ') + ' |').join('\n') + '\n');

  // Override builds can only write to a separate directory.
  const output = process.env.DAYZ_SITE_OUTPUT ?? root;
  if (process.env.DAYZ_SITE_RELEASES) {
    assert(process.env.DAYZ_SITE_OUTPUT && resolve(output) !== resolve(root), 'Set a separate output for a release test');
  }
  for (const [file, text] of files) {
    const path = join(output, file);
    try {
      if ((await readFile(path, 'utf8')).replaceAll('\r\n', '\n') === text) continue;
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
    }
    await mkdir(dirname(path), { recursive: true });
    await writeFile(path, text);
  }
  console.log('Built ' + urls.size + ' pages (RU/EN), STABLE ' + release.version);
}

await build();
