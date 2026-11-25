import { asset, components, html, icon } from './components.mjs';
import { pages, shots, tools } from './registry.mjs';

function home(ctx, c) {
  const { copy, lang, release } = ctx;
  const t = copy.home, { ui } = copy;
  const downloadActions = c.button('zip') + c.link('download', t.downloadDetails, 'btn secondary');
  const screenshots = Object.entries(shots[lang]).map(([id, shot]) => ({ shot, label: t.shots[id] }));
  return [
    '<span id="top"></span><section class="hero hero-art home-hero"><div class="wrap hero-grid"><div class="hero-copy">' +
    '<p class="eyebrow">' + c.escape(t.eyebrow) + '</p><h1>' + t.headline.map(c.escape).join('<br> ') +
    '</h1><p class="lead">' + c.escape(t.lead) +
    '</p><div class="actions home-download-actions">' + downloadActions + '</div>' +
    c.link('#donate', ui.support, 'hero-support-link', '<span class="heart" aria-hidden="true">&#9825;</span>') +
    '</div><figure class="hero-shot">' +
    c.image(shots[lang].home, t.shots.home, true) + '</figure></div></section>',
    c.section('tools', '<div class="catalog-intro">' + c.heading(2, ui.tools) +
      '<p id="hotkeys">' + c.rich(t.hotkeys[1]) + '</p></div>' + c.cards(tools, true) +
      '<div id="download" class="catalog-download">' + c.callout(...t.download, '<div class="actions catalog-download-actions">' + downloadActions + '</div>') + '</div>', 'alt'),
    c.section('preview', '<span id="screens"></span>' + c.demoCarousel(screenshots)),
    '<span id="materials"></span>' + c.faq(t.faq),
    c.section('support', '<div class="community-grid">' +
      '<article id="donate" class="community-card donate">' + c.heading(2, t.donate[0]) + c.p(t.donate[1]) +
      c.button('cloudtips', t.donate[2], 'primary', '<span class="heart" aria-hidden="true">&#9825;</span>') + '</article>' +
      '<article id="feedback" class="community-card">' + c.heading(2, ui.feedback) + c.p(t.feedback) +
      c.button('form', ui.form, 'secondary') + '</article></div>', 'compact'),
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
  const gallery = demoFor(ctx);
  let bandIndex = 0;
  const nextBand = (extra = '') => [bandIndex++ % 2 ? 'alt' : '', extra].filter(Boolean).join(' ');
  const section = (id, body, extra = '') => c.section(id, body, nextBand(extra));
  return [
    '<section class="hero hero-art feature-hero" style="--hero-image: url(' + asset(page.art) +
    ')"><div class="wrap hero-grid"><div class="hero-copy"><div class="hero-identity">' + icon(page.icon) +
    c.escape(ui.tool) + '</div>' + c.heading(1, t.h1) +
    '<p class="lead">' + c.escape(t.lead) + '</p><div class="actions">' + c.button('download', lang === 'ru' ? 'Скачать DayZ Companion' : 'Download DayZ Companion') +
    '</div></div>' + (t.visual ? '<div class="hero-visual"><strong>' + c.escape(t.visual[0]) + '</strong>' + c.p(t.visual[1]) + '</div>' : '') + '</div></section>',
    section('capabilities', '<div class="capability-grid count-' + t.capabilities.length + (page.id === 'xam-map' ? ' map-capabilities' : '') + '" role="group" aria-label="' + c.escape(ui.capabilities) + '">' +
      t.capabilities.map(([title, description]) => '<article>' + c.heading(2,title) + c.p(description) + '</article>').join('') + '</div>', 'compact'),
    section('demo', c.demoCarousel(gallery), 'compact'),
    '<span id="download"></span>',
    page.id === 'xam-map' ? '<span id="nasdara"></span>' : '',
    section('guide', c.head(lang === 'ru' ? 'Как настроить' : 'How to set up') + c.features(t.guide[1], 'steps')),
    t.processing ? section('processing', c.split(t.technical?.[0] ?? ui.processing, c.features(t.processing), t.technical?.[1])) : '<span id="processing"></span>',
    c.faq(t.faq, page.id === 'xam-map' ? 'alt' : nextBand()),
    '<span id="related"></span>',
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
    c.section('requirements', c.head(t.requirements) + c.features(t.facts), 'alt'),
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
  const principles = '<div class="editorial-principles review-principles">' + t.principlesList.map(([title, text]) =>
    '<article>' + c.heading(3, title) + c.p(text) + '</article>').join('\n') +
    '<article id="battleye">' + c.heading(3, 'BattlEye') + t.battleye.map(c.p).join('') + '</article>' +
    '<article id="server-rules">' + c.heading(3, t.rules[0]) + c.p(t.rules[1]) + '</article></div>';
  const tech = '<div class="about-tech-grid">' + t.technologyList.map(([title, text], index) =>
    '<article' + (index === 2 ? ' id="services"' : '') + '>' + c.heading(3, title) + c.p(text) + '</article>').join('') + '</div>';
  return [
    '<section class="hero hero-art about-hero about-review"><div class="wrap"><div class="intro hero-copy">' +
    c.heading(1, t.h1) + '<p class="lead">' + c.escape(t.lead) + '</p></div>' +
    '<div id="technology" class="about-tech">' + c.heading(2, t.technology[0]) + c.p(t.technology[1]) + tech + '</div></div></section>',
    c.section('principles', c.head(t.principles) + principles, 'alt'),
    c.section('support', c.callout(...t.donate, c.button('cloudtips', ui.support, 'primary',
      '<span class="heart" aria-hidden="true">&#9825;</span>'), 'donate'), 'compact'),
    '<span id="story"></span>',
    c.section('download', c.split(ui.latest + ' {version}', '<div class="copy">' + c.p(t.release) +
      c.p(t.historyLink) + c.button('download', ui.download, 'secondary') + '</div>'), 'alt'),
  ].join('\n');
}

function privacy(ctx, c) {
  const t = ctx.copy.privacy;
  return '<section class="band privacy-page"><div class="wrap privacy-wrap">' +
    c.heading(1,t.h1) + '<p class="lead">' + c.escape(t.lead) + '</p>' +
    t.sections.map(([title, ...paragraphs]) => '<section class="privacy-section">' + c.heading(2,title) +
      c.prose(paragraphs) + '</section>').join('\n') + '</div></section>';
}

const templates = { home, tool, download, about, privacy };
export function render(ctx) {
  return templates[ctx.page.template](ctx, components(ctx));
}
