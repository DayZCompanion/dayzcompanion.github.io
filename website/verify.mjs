import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { mkdtemp, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import { archive, languages, localizedLinks, orderReleases, origin, pages, route, screenshotRelease } from './registry.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const base = process.argv[2] ?? 'http://127.0.0.1:18170';
const allRoutes = pages.flatMap(page => languages.map(lang => ({ page, lang, url: route(page.id, lang) })));
const initial = await readFile(join(root, 'website/releases.json'), 'utf8');
const records = orderReleases(JSON.parse(initial));
const current = records[0];
const expected = new Set(allRoutes.map(({ url }) => origin + url));

function content(path) {
  return readFile(join(root, path.slice(1) + 'index.html'), 'utf8');
}

for (const { page, lang, url } of allRoutes) {
  const actual = await fetch(base + url);
  assert.equal(actual.status, 200, url);
  assert.equal(actual.headers.get('x-robots-tag'), 'noindex');
  const text = await actual.text();
  assert(text.includes('<html lang="' + lang + '">'), url);
  assert(text.includes('href="' + localizedLinks.form[lang] + '" data-metrika-goal="support_click"'), url);
  assert(!text.includes(localizedLinks.form[lang === 'ru' ? 'en' : 'ru']), 'Wrong form language on ' + url);
  assert(text.includes('href="' + route('privacy', lang) + '"'), url);
  assert(text.includes('href="https://f5-studio.ru/"'), url);
  assert(text.includes('rel="canonical" href="' + origin + url + '"'), url);
  for (const alternate of ['ru', 'en', 'x-default']) {
    const href = origin + route(page.id, alternate === 'x-default' ? 'ru' : alternate);
    assert(text.includes('hreflang="' + alternate + '" href="' + href + '"'), url);
  }
  assert(text.includes('property="og:url" content="' + origin + url + '"'), url);
  const social = text.match(/property="og:image" content="([^"]+)"/)[1];
  assert(social.startsWith(origin + '/assets/'), url);
  assert.equal((await fetch(base + new URL(social).pathname, { method: 'HEAD' })).status, 200);
  assert(!text.includes('mc.yandex.ru/watch/'), 'Preview still contains the noscript pixel');
  assert(!/<meta name="robots"[^>]*noindex/.test(text), 'Public HTML contains noindex');
  assert((await content(url)).includes('mc.yandex.ru/watch/114496162'), 'Missing production noscript fallback');
}
const sitemap = await (await fetch(base + '/sitemap.xml')).text();
const entries = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => match[1]);
assert.equal(entries.length, pages.length * languages.length);
assert.deepEqual(new Set(entries), expected);
assert.match(await (await fetch(base + '/robots.txt')).text(), /Sitemap: https:\/\/dayz-mod.ru\/sitemap.xml/);
for (const url of ['/404.html', '/en/missing/', '/unknown/']) {
  const response = await fetch(base + url);
  assert.equal(response.status, 404);
  assert.match(await response.text(), /name="robots" content="noindex"/);
}
for (const url of ['/en', '/tools/morse', '/en/download']) {
  const response = await fetch(base + url + '?utm_source=qa', { redirect: 'manual' });
  assert.equal(response.status, 308);
  assert.equal(response.headers.get('location'), url + '/?utm_source=qa');
}

const temporary = await mkdtemp(join(tmpdir(), 'dayz-site-version-'));
const hypothetical = '99.0.0';
const output = join(temporary, 'output');
const testReleases = join(temporary, 'releases.json');
const testRecord = {
  ...current, version: hypothetical, date: '2099-01-01', bytes: 321000000,
  url: archive + '/tag/v' + hypothetical,
  zip: archive + '/download/v' + hypothetical + '/DayZCompanion-' + hypothetical + '-Windows.zip',
};
await writeFile(testReleases, JSON.stringify([testRecord, ...records]));
const hash = text => createHash('sha256').update(text).digest('hex');
const baseline = await Promise.all(allRoutes.map(({ url }) => content(url).then(hash)));
const result = spawnSync(process.execPath, [join(root, 'website/build.mjs')], {
  encoding: 'utf8', env: { ...process.env, DAYZ_SITE_RELEASES: testReleases, DAYZ_SITE_OUTPUT: output },
});
assert.equal(result.status, 0, result.stderr || result.stdout);
for (const lang of languages) {
  const read = id => readFile(join(output, route(id, lang).slice(1) + 'index.html'), 'utf8');
  const [home, download, about, morse] = await Promise.all(['home', 'download', 'about', 'morse'].map(read));
  assert(!home.includes(hypothetical + ' STABLE'), 'Home hero must not display the release label');
  assert.equal(home.split(testRecord.zip).length - 1, 2, 'Both home download buttons use the current STABLE ZIP');
  assert.equal(home.split('data-release-version="' + hypothetical + '"').length - 1, 2);
  assert(!home.includes(current.zip), 'Home must not keep the previous ZIP URL');
  assert(!home.includes(screenshotRelease + ' STABLE.'), 'Home preview must not display the version instruction');
  assert(morse.includes(screenshotRelease + ' STABLE'));
  assert(about.includes(hypothetical));
  assert(download.includes(testRecord.zip) && download.includes('321&nbsp;'));
  assert(download.includes('data-release-version="' + hypothetical + '"'));
  assert(download.includes(hypothetical + ' STABLE') && download.includes('datetime="' + current.date + '"'));
  for (const release of records) {
    assert(download.includes(release.url) && download.includes('datetime="' + release.date + '"'));
  }
  assert(!download.includes(current.zip));
}
assert.equal(await readFile(join(root, 'website/releases.json'), 'utf8'), initial);
assert.deepEqual(await Promise.all(allRoutes.map(({ url }) => content(url).then(hash))), baseline);
console.log('PASS: ' + allRoutes.length + ' routes, ' + allRoutes.length + ' SEO pairs, sitemap, 404, redirects, preview isolation, and STABLE substitution on RU/EN.');
