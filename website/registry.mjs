export const origin = 'https://dayz-mod.ru';
export const languages = ['ru', 'en'];
export const archive = 'https://github.com/Surik115/dayz-companion-releases/releases';
export const links = {
  archive,
  cloudtips: 'https://pay.cloudtips.ru/p/392ecf9b',
  battleye: 'https://www.battleye.com/support/faq/',
  xam: 'https://dayz.xam.nu/',
};
export const localizedLinks = {
  form: {
    ru: 'https://forms.yandex.ru/u/6af9b3a7974ab27c31e6bfa4/',
    en: 'https://forms.yandex.com/u/6b043ae2c45c078d022a1cd9/',
  },
  cookies: {
    ru: 'https://yandex.ru/support/metrica/ru/general/cookie-usage',
    en: 'https://yandex.com/support/metrica/en/general/cookie-usage',
  },
};

const tools = [
  ['magnifier', ['crosshair', 'gamma', 'auto-lean']],
  ['morse', ['xam-map', 'earplugs', 'magnifier']],
  ['gamma', ['magnifier', 'crosshair', 'earplugs']],
  ['earplugs', ['morse', 'gamma', 'auto-run']],
  ['auto-run', ['auto-lean', 'earplugs', 'code-lock']],
  ['crosshair', ['magnifier', 'gamma', 'auto-lean']],
  ['code-lock', ['auto-run', 'auto-lean', 'xam-map']],
  ['xam-map', ['morse', 'magnifier', 'auto-run']],
  ['auto-lean', ['auto-run', 'crosshair', 'magnifier']],
].map(([id, related]) => ({
  id, template: 'tool', path: '/tools/' + id + '/', related,
  art: 'tool-' + id + '.webp', cardArt: 'tool-' + id + '-560.webp', icon: id + '.svg',
}));

export const pages = [
  { id: 'home', template: 'home', path: '/', art: 'home-valley.webp' },
  ...tools,
  { id: 'download', template: 'download', path: '/download/', art: 'home-valley.webp' },
  { id: 'about', template: 'about', path: '/about/', art: 'hero.webp' },
];
export { tools };
export function route(id, lang) {
  const page = pages.find(page => page.id === id);
  if (!page || !languages.includes(lang)) throw new Error('Unknown route: ' + id + '/' + lang);
  return (lang === 'en' ? '/en' : '') + page.path;
}

export function orderReleases(records) {
  return [...records].sort((a, b) =>
    b.date.localeCompare(a.date) || b.version.localeCompare(a.version, 'en', { numeric: true }));
}

// Capture provenance is independent of the current release.
export const screenshotRelease = '1.7.0';
export const shots = Object.fromEntries(languages.map(lang => [
  lang,
  Object.fromEntries(['home', 'tools', 'diagnostics'].map(id => [
    id, {
      file: 'stable-' + id + (lang === 'ru' ? '.png' : '-en.jpg'),
      thumb: 'stable-' + id + '-' + lang + '-800.webp',
      ...(id === 'home' ? { mobile: 'stable-home-' + lang + '-480.webp' } : {}),
      width: lang === 'ru' ? 1440 : 1242, height: lang === 'ru' ? 900 : 792,
    },
  ])),
]));
