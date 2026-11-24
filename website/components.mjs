import { links, localizedLinks, origin, route, screenshotRelease, tools } from './registry.mjs';

export const html = value => String(value).replace(/[&<>"']/g, char => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
})[char]);
export const asset = file => '/assets/' + file;
export const icon = (file, className = '', lazy = false) =>
  '<img' + (className ? ' class="' + className + '"' : '') + ' src="' + asset('icons-v2/' + file) + '" alt=""' +
  (lazy ? ' loading="lazy"' : '') + '>';
const arrow = '<span class="arrow" aria-hidden="true">›</span>';

const externalGoals = { form: 'support_click', cloudtips: 'donate_click', zip: 'download_click' };

export function components({ lang, copy, release }) {
  const { ui } = copy;
  const url = (id, section) => route(id, lang) + (section ? '#' + section : '');
  const values = { version: release.version, capture: screenshotRelease };
  const escape = value => html(value.replace(/\{(version|capture)\}/g, (_, key) => values[key]));
  function href(target) {
    if (target.startsWith('#')) return target;
    if (target === 'release') return release.url;
    if (target === 'zip') return release.zip;
    if (Object.hasOwn(localizedLinks, target)) return localizedLinks[target][lang];
    if (Object.hasOwn(links, target)) return links[target];
    return url(...target.split('#'));
  }
  function link(target, label, className = '', prefix = '') {
    const goal = Object.hasOwn(externalGoals, target) ? externalGoals[target] : null;
    return '<a href="' + html(href(target)) + '"' + (className ? ' class="' + className + '"' : '') +
      (goal ? ' data-metrika-goal="' + goal + '"' : '') +
      (target === 'zip' ? ' data-release-version="' + html(release.version) + '"' : '') +
      '>' + prefix + escape(label) + '</a>';
  }
  function rich(text) {
    let output = '', offset = 0;
    for (const match of text.matchAll(/\[([^\]]+)\]\(([a-z0-9#-]+)\)/g)) {
      output += escape(text.slice(offset, match.index)) + link(match[2], match[1], 'text-link');
      offset = match.index + match[0].length;
    }
    return output + escape(text.slice(offset));
  }
  const p = text => '<p>' + rich(text) + '</p>';
  const heading = (level, text) => '<h' + level + '>' + escape(text) + '</h' + level + '>';
  const section = (id, body, extra = '') => '<section' + (id ? ' id="' + id + '"' : '') +
    ' class="band' + (extra ? ' ' + extra : '') + '"><div class="wrap">\n' + body + '\n</div></section>';
  const head = (title, description) => '<div class="section-head' + (description ? '' : ' single') + '">' +
    heading(2, title) + (description ? p(description) : '') + '</div>';
  const split = (title, content, lead = '') => '<div class="split">' +
    (lead ? '<div class="stack">' + heading(2, title) + '<p class="lead">' + rich(lead) + '</p></div>' : heading(2, title)) +
    content + '</div>';
  const prose = paragraphs => '<div class="copy">' + paragraphs.map(p).join('') + '</div>';
  const features = (items, type = 'facts') => {
    const tag = type === 'steps' ? 'ol' : 'ul';
    return '<' + tag + ' class="' + type + '">' + items.map(([title, description]) =>
      '<li>' + heading(3, title) + p(description) + '</li>').join('\n') + '</' + tag + '>';
  };
  const faq = items => section('faq', split(ui.faq, '<div class="questions">' + items.map(([question, answer]) =>
    '<details><summary>' + escape(question) + '</summary>' + p(answer) + '</details>').join('\n') + '</div>'), 'alt');
  const jump = (items, label = ui.jump, className = '') =>
    '<nav class="wrap jump' + (className ? ' ' + className : '') + '" aria-label="' + escape(label) + '">' +
    items.map(([id, label]) => link('#' + id, label)).join('') + '</nav>';
  const button = (target, label = ui.download, style = 'primary', prefix) =>
    link(target, label, 'btn ' + style, prefix);
  const callout = (title, description, action, className = '') =>
    '<div class="callout' + (className ? ' ' + className : '') + '"><div>' + heading(2, title) + p(description) +
    '</div>' + action + '</div>';
  const list = items => '<ul class="material-list">' + items.map(([id, section, label, desc]) =>
    '<li><a href="' + url(id, section) + '"><strong>' + escape(label) + '</strong><span>' +
    escape(desc) + '</span>' + arrow + '</a></li>').join('\n') + '</ul>';
  function cards(items, catalog = false) {
    return '<div class="tool-grid' + (catalog ? ' tool-catalog' : '') + '">' + items.map(page => {
      const t = copy[page.id];
      const content = icon(page.icon) + '<div><b>' + escape(t.name) + '</b>' + p(t.card) + '</div>' + arrow;
      return '<a class="tool-card"' + (catalog ? ' id="tool-' + page.id + '"' : '') + ' href="' + url(page.id) + '">' +
        (catalog ? '<div class="tool-media"><img src="' + asset(page.cardArt) +
          '" alt="" loading="lazy" decoding="async" fetchpriority="low"></div><div class="tool-card-content">' + content + '</div>' : content) + '</a>';
    }).join('\n') + '</div>';
  }
  function image(shot, label, isHero = false, className = '') {
    return '<img src="' + asset(shot.thumb) + '"' + (className ? ' class="' + className + '"' : '') +
      ' width="' + shot.width + '" height="' + shot.height + '" alt="' + escape(label) + '"' +
      (isHero ? ' srcset="' + asset(shot.mobile) + ' 480w, ' + asset(shot.thumb) + ' 800w" sizes="(max-width: 740px) 90vw, 660px"' : '') +
      (isHero ? ' fetchpriority="high"' : ' loading="lazy" decoding="async"') + '>';
  }
  function gallery(items, equal = false) {
    const figures = items.map(({ shot, label, caption }) => '<figure><a class="shot-btn" href="' + asset(shot.file) +
      '" data-shot data-title="' + escape(label) + '" aria-label="' + escape(ui.zoom + ': ' + label) + '">' +
      image(shot, label, false, equal ? 'contain' : '') + '</a><figcaption>' + escape(caption ?? label) + '</figcaption></figure>');
    const layout = !equal && figures.length > 1 ?
      figures[0] + '<div class="gallery-side">' + figures.slice(1).join('\n') + '</div>' : figures.join('\n');
    const className = equal ? ' equal' : figures.length === 1 ? ' solo' : '';
    return '<div class="gallery' + className + '" data-gallery>' + layout + '</div>';
  }
  return { url, escape, rich, link, p, heading, section, head, split, prose, features, faq, jump, button, callout, list, cards, image, gallery };
}

export function shell({ lang, copy, page, release, content, anchors, cssVersion, jsVersion, social }) {
  const { ui } = copy;
  const { url, escape, link, rich } = components({ lang, copy, release });
  const t = copy[page.id];
  const canonical = origin + url(page.id);
  const altLang = lang === 'ru' ? 'en' : 'ru';
  const current = id => id === page.id ? ' aria-current="page"' : '';
  const navLink = id => '<a href="' + url(id) + '"' + current(id) + '>' + escape(copy[id].name) + '</a>';
  const wordmark = '<a class="wordmark" href="' + url('home') + '"><img src="' +
    asset('dayz-logo-mark.png') + '" alt="" width="42" height="32">DayZ Companion</a>';
  const languageLink = '<a data-language-link data-anchors="' + html(anchors.join(' ')) + '" href="' +
    route(page.id, altLang) + '" lang="' + altLang + '" hreflang="' + altLang + '">' + altLang.toUpperCase() + '</a>';
  const currentLanguage = '<span aria-current="true">' + lang.toUpperCase() + '</span>';
  const language = [currentLanguage, languageLink];
  if (lang === 'en') language.reverse();
  const title = escape(t.title), description = escape(t.description);
  const landscape = page.id === 'home' || page.id === 'download' ?
    '  <link rel="preload" as="image" href="/assets/home-valley-960.webp" media="(max-width: 820px)">\n' +
    '  <link rel="preload" as="image" href="/assets/home-valley.webp" media="(min-width: 821px)">\n' : '';
  return '<!doctype html>\n<html lang="' + lang + '">\n<head>\n' +
    '  <meta charset="utf-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1">\n' +
    '  <meta name="theme-color" content="#0d0f10">\n  <title>' + title + '</title>\n' +
    '  <meta name="description" content="' + description + '">\n' +
    '  <link rel="canonical" href="' + canonical + '">\n' +
    ['ru', 'en', 'x-default'].map(locale => '  <link rel="alternate" hreflang="' + locale +
      '" href="' + origin + route(page.id, locale === 'x-default' ? 'ru' : locale) + '">').join('\n') + '\n' +
    '  <meta property="og:type" content="website">\n  <meta property="og:site_name" content="DayZ Companion">\n' +
    '  <meta property="og:locale" content="' + (lang === 'ru' ? 'ru_RU' : 'en_US') + '">\n' +
    '  <meta property="og:url" content="' + canonical + '">\n' +
    '  <meta property="og:title" content="' + title + '">\n  <meta property="og:description" content="' + description + '">\n' +
    '  <meta property="og:image" content="' + origin + asset(social.file) + '">\n' +
    '  <meta property="og:image:alt" content="' + escape(social.label) + '">\n' +
    '  <meta name="twitter:card" content="summary_large_image">\n  <meta name="twitter:title" content="' + title + '">\n' +
    '  <meta name="twitter:description" content="' + description + '">\n  <meta name="twitter:image" content="' + origin + asset(social.file) + '">\n' +
    '  <meta name="twitter:image:alt" content="' + escape(social.label) + '">\n' +
    '  <link rel="icon" href="/favicon.ico">\n  <link rel="apple-touch-icon" href="/assets/apple-touch-icon.png">\n' +
    '  <link rel="stylesheet" href="/assets/site.css?v=' + cssVersion + '">\n' + landscape +
    '  <noscript><style>@media(max-width:820px){.shell-row{flex-wrap:wrap}.mobile-menu{display:none}.navigation{display:flex;flex-wrap:wrap;align-items:center;gap:0 12px;position:static;flex-basis:100%;max-height:none;overflow:visible}}</style></noscript>\n' +
    '  <script src="/assets/site.js?v=' + jsVersion + '" defer></script>\n</head>\n<body>\n' +
    '<a class="skip" href="#main">' + escape(ui.skip) + '</a>\n' +
    '<header class="shell"><div class="wrap shell-row">' + wordmark +
    '<button type="button" class="mobile-menu" aria-expanded="false" aria-controls="navigation" data-open="' +
    escape(ui.openMenu) + '" data-close="' + escape(ui.closeMenu) + '">' + escape(ui.menu) + '</button>\n' +
    '<nav class="navigation" id="navigation" aria-label="' + escape(ui.nav) + '">' + navLink('home') +
    '<details class="nav-tools"><summary' + (page.template === 'tool' ? ' class="current-group"' : '') + '>' +
    escape(ui.tools) + '</summary><div class="tool-pop">' + tools.map(tool =>
      '<a href="' + url(tool.id) + '"' + current(tool.id) + '>' + icon(tool.icon, '', true) + escape(copy[tool.id].name) + '</a>').join('\n') +
    '</div></details>' + navLink('about') + navLink('download') +
    '<span class="lang" role="group" aria-label="' + escape(ui.language) + '">' +
    language.join('<span aria-hidden="true">/</span>') + '</span></nav></div></header>\n' +
    '<main id="main" tabindex="-1">\n' + content + '\n</main>\n' +
    '<footer class="site-footer"><div class="wrap footer-row"><div>' + wordmark + '<p class="caption">' +
    escape(ui.footerNote) + '</p></div><nav aria-label="' + escape(ui.footer) + '">' + link('home#tools', ui.tools) +
    link('about', copy.about.name) + link('download', ui.download) + link('form', ui.feedback) + '</nav></div></footer>\n' +
    (content.includes('data-gallery') ? '<dialog class="lightbox" aria-labelledby="lightbox-title">' +
      '<div class="lightbox-bar"><p id="lightbox-title" aria-live="polite"></p><div class="lightbox-keys">' +
      [['prev', ui.prev, '←'], ['next', ui.next, '→'], ['close', ui.close, '×']].map(([id, label, key]) =>
        '<button type="button" data-' + id + ' aria-label="' + escape(label) + '">' + key + '</button>').join('') +
      '</div></div><img class="lightbox-image" alt=""></dialog>\n' : '') +
    '<aside class="cookie-notice" aria-labelledby="cookie-notice-title" hidden><div><strong id="cookie-notice-title">' +
    escape(ui.cookieTitle) + '</strong><p>' + rich(ui.cookie) + '</p></div><button class="btn secondary" type="button">' +
    escape(ui.dismiss) + '</button></aside>\n' +
    '<!-- production-metrika --><noscript><div><img src="https://mc.yandex.ru/watch/114496162" class="metrika-fallback" alt=""></div></noscript><!-- /production-metrika -->\n' +
    '</body>\n</html>\n';
}
