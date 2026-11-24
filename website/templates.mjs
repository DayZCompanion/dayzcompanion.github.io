import { asset, components, html, icon } from './components.mjs';
import { pages, shots, tools } from './registry.mjs';

function home(ctx, c) {
  const { copy, lang, release } = ctx;
  const t = copy.home, { ui } = copy;
  const screenshots = Object.entries(shots[lang]).map(([id, shot]) => ({ shot, label: t.shots[id] }));
  return [
    '<span id="top"></span><section class="hero hero-art home-hero"><div class="wrap hero-grid"><div class="hero-copy">' +
    '<p class="eyebrow">' + c.escape(t.eyebrow) + '</p><h1>' + t.headline.map(c.escape).join('<br> ') +
    '</h1><p class="lead">' + c.escape(t.lead) +
    '</p><div class="actions">' + c.button('download') + c.button('#donate', ui.support, 'secondary') +
    '</div><p class="caption">' + c.escape(t.version) + ' ' + html(release.version) + ' ' + html(release.channel) +
    ' · Portable ZIP</p></div><figure class="hero-shot">' +
    c.image(shots[lang].home, t.shots.home, true) + '</figure></div></section>',
    c.section('tools', c.head(ui.tools, t.catalog) + c.cards(tools, true), 'alt'),
    c.section('hotkeys', '<div class="hotkeys">' + icon('keyboard.svg', 'feature-icon') +
      '<div>' + c.heading(2, t.hotkeys[0]) + c.p(t.hotkeys[1]) + '</div></div>', 'compact'),
    c.section('preview', '<span id="screens"></span>' + c.head(...t.gallery) + c.demoCarousel(screenshots)),
    c.section('download', c.callout(...t.download, c.button('download')), 'alt'),
    c.section('donate', c.callout(t.donate[0], t.donate[1], c.button('cloudtips', t.donate[2], 'primary',
      '<span class="heart" aria-hidden="true">♡</span>'), 'donate'), 'compact'),
    c.section('support', '<span id="feedback"></span>' + c.split(ui.feedback, '<div class="copy">' +
      c.p(t.feedback) + c.button('form', ui.form, 'secondary') + '</div>'), 'alt'),
    c.section('materials', c.head(t.materialsTitle) + c.list(t.materials)),
    c.faq(t.faq),
  ].join('\n');
}

export function socialDemoFor(ctx) {
  const { page, lang, copy, demo } = ctx;
  const t = copy[page.id];
  const file = demo[page.id]?.[lang] ?? demo[page.id]?.ru;
  return file ? {
    shot: file,
    label: page.id === 'morse' ? t.capture : t.name + ' · {capture} STABLE',
  } : {
    shot: shots[lang].tools,
    label: copy.home.shots.tools,
  };
}

function demoFor(ctx) {
  const { page, lang, copy, demo } = ctx;
  const t = copy[page.id];
  const localizedInterface = lang === 'en' ? demo.interfaceEn?.[page.id] : null;
  const preview = (localizedInterface ?? demo.interface[page.id] ?? []).map(shot => {
    const label = shot.label?.[lang] ?? t.name + ' · {capture} STABLE';
    const caption = label + (lang === 'en' && !localizedInterface ? ' (Russian interface)' : '');
    return { shot, label, caption: shot.note ? caption + '. ' + shot.note[lang] : caption };
  });
  if (preview.length === 0) throw new Error('Missing interface screenshot for ' + page.id);
  if (page.id === 'morse') preview.push({ shot: demo.hud, label: t.hud[0], caption: t.hud[1] });
  const localizedGameplay = lang === 'en' ? demo.gameplayEn?.[page.id] : null;
  for (const shot of localizedGameplay ?? demo.gameplay?.[page.id] ?? []) {
    preview.push({ shot, label: shot.label[lang], caption: shot.caption[lang] });
  }
  return preview;
}

function tool(ctx, c) {
  const { copy, page, lang } = ctx;
  const { ui } = copy;
  const t = copy[page.id];
  const [demoTitle, demoText] = t.demo ?? (lang === 'ru' ?
    ['Интерфейс Companion', 'Откройте снимок, чтобы рассмотреть интерфейс.'] :
    ['Companion interface', 'Open the screenshot to take a closer look at the interface.']);
  const gallery = demoFor(ctx);
  let bandIndex = 0;
  const nextBand = (extra = '') => [bandIndex++ % 2 ? 'alt' : '', extra].filter(Boolean).join(' ');
  const section = (id, body, extra = '') => c.section(id, body, nextBand(extra));
  return [
    '<section class="hero hero-art feature-hero" style="--hero-image: url(' + asset(page.art) +
    ')"><div class="wrap hero-grid"><div class="hero-copy"><div class="hero-identity">' + icon(page.icon) +
    c.escape(ui.tool) + '</div>' + c.heading(1, t.h1) +
    '<p class="lead">' + c.escape(t.lead) + '</p><div class="actions">' + c.button('#guide', ui.toGuide) +
    c.button('#demo', t.demo ? (lang === 'ru' ? 'Посмотреть интерфейс' : 'View the interface') : ui.toDemo, 'secondary') +
    '</div></div>' + (t.visual ? '<div class="hero-visual"><strong>' + c.escape(t.visual[0]) + '</strong>' + c.p(t.visual[1]) + '</div>' : '') + '</div></section>',
    section('capabilities', c.split(t.capabilityTitle ?? ui.capabilities, c.features(t.capabilities))),
    section('demo', c.head(demoTitle, demoText) + c.demoCarousel(gallery)),
    section('guide', c.head(t.guide[0]) + c.features(t.guide[1], 'steps')),
    t.processing ? section('processing', c.split(t.technical?.[0] ?? ui.processing, c.features(t.processing), t.technical?.[1])) : '<span id="processing"></span>',
    t.nasdara ? section('nasdara', c.split(t.nasdara[0], c.prose([t.nasdara[1]])), 'compact') : '',
    c.faq(t.faq, nextBand()),
    section('related', c.head(ui.related) + c.cards(page.related.map(id => pages.find(page => page.id === id)))),
    section('download', c.callout(t.callout ?? copy.home.download[0],
      lang === 'ru' ? 'На странице скачивания доступны актуальная сборка и инструкция первого запуска.' :
      'Find the current build and first-run instructions on the download page.', c.button('download'))),
  ].join('\n');
}

function download(ctx, c) {
  const { lang, copy, release, releases } = ctx;
  const t = copy.download, { ui } = copy;
  const date = new Intl.DateTimeFormat(lang, { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' });
  const releaseHistory = '<ul class="releases">' + releases.map(r =>
    '<li><a href="' + html(r.url) + '"><strong' + (r === release ? ' class="release-version"' : '') + '>' +
    html(r.version) + ' <span class="release-channel">' + html(r.channel) +
    '</span><time datetime="' + html(r.date) + '">' + html(date.format(new Date(r.date))) +
    '</time></strong>' + c.p(r.notes[lang]) + '<span class="arrow" aria-hidden="true">›</span></a></li>').join('\n') + '</ul>';
  const checksum = release.sha256 ? '<details class="release-checksum"><summary>' + c.escape(t.checksum) +
    '</summary><code>' + html(release.sha256) + '</code></details>' : '';
  return [
    '<section class="hero hero-art download-hero download-shell"><div class="wrap"><div class="intro hero-copy">' +
    c.heading(1, t.h1) + '<p class="lead">' + c.escape(t.lead) + '</p></div><article class="release-panel"><div>' +
    '<p class="eyebrow">' + c.escape(t.stable) + '</p>' + c.heading(2, ui.latest + ' {version}') +
    '<p class="release-meta">' + c.escape(t.fullZip) + ' ' + html(release.platform) + ' · ' +
    Math.round(release.bytes / 1e6) + '&nbsp;' + c.escape(ui.mb) + '</p></div><div>' +
    c.button('zip', t.zipButton) + c.link('release', t.source, 'text-link release-source') +
    '</div></article></div></section>',
    c.jump([['requirements', t.requirementsLink], ['first', t.first], ['update', t.update], ['history', t.history]],
      t.jump, 'download-links'),
    c.section('requirements', c.split(t.requirements, c.features(t.facts)), 'alt'),
    c.section('first', c.head(t.first) + c.features(t.steps, 'steps')),
    c.section('update', c.head(t.update) + c.features(t.updateSteps, 'steps') + '<div class="update-note">' + c.p(t.updateNote) + '</div>', 'alt'),
    c.section('history', c.head(t.history, t.historyText) + releaseHistory + checksum +
      '<div class="actions archive-action">' + c.button('archive', t.archive, 'secondary') + '</div>'),
    c.faq(t.faq),
  ].join('\n');
}

function about(ctx, c) {
  const { copy } = ctx;
  const t = copy.about, { ui } = copy;
  const [storyTitle, ...story] = t.story;
  const principles = '<div class="editorial-principles">' + t.principlesList.map(([title, text]) =>
    '<article>' + c.heading(3, title) + c.p(text) + '</article>').join('\n') + '</div>';
  return [
    '<section class="hero hero-art about-hero"><div class="wrap intro hero-copy">' + c.heading(1, t.h1) +
    '<p class="lead">' + c.escape(t.lead) + '</p></div></section>',
    c.section('story', c.split(storyTitle, c.prose(story))),
    c.section('principles', c.head(t.principles) + principles, 'alt'),
    c.section('technology', c.split(t.technology[0], c.features(t.technologyList), t.technology[1])),
    c.section('battleye', c.split('BattlEye', c.prose(t.battleye)), 'alt'),
    c.section('server-rules', c.split(t.rules[0], c.prose([t.rules[1]])), 'compact'),
    c.section('services', c.split(t.services, c.features(t.serviceList)), 'mid'),
    c.section('support', c.callout(...t.donate, c.button('home#donate', ui.support, 'primary',
      '<span class="heart" aria-hidden="true">♡</span>'), 'donate'), 'compact'),
    c.section('download', c.split(ui.latest + ' {version}', '<div class="copy">' + c.p(t.release) +
      c.button('download', ui.download, 'secondary') + '</div>'), 'alt'),
  ].join('\n');
}

const templates = { home, tool, download, about };
export function render(ctx) {
  return templates[ctx.page.template](ctx, components(ctx));
}
