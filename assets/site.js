(() => {
  const url = new URL(location.href);
  const onProduction = url.origin === 'https://dayz-mod.ru';
  if ((url.pathname === '/' || url.pathname === '/index.html') && url.searchParams.get('lang') === 'en') {
    url.pathname = '/en/';
    url.searchParams.delete('lang');
    location.replace(url);
    return;
  }

  const langLink = document.querySelector('[data-language-link]');
  const allowedAnchors = new Set(langLink.dataset.anchors.split(' '));
  function syncLanguageLink() {
    const alternate = new URL(langLink.href);
    const query = new URLSearchParams(location.search);
    query.delete('lang');
    alternate.search = query.toString();
    const anchor = location.hash.slice(1);
    alternate.hash = allowedAnchors.has(anchor) ? anchor : '';
    langLink.href = alternate.href;
  }
  syncLanguageLink();
  window.addEventListener('hashchange', syncLanguageLink);

  const navigation = document.querySelector('#navigation');
  const mobileMenu = document.querySelector('.mobile-menu');
  const toolsMenu = document.querySelector('.nav-tools');
  const toolTrigger = toolsMenu.querySelector('summary');
  const mobile = window.matchMedia('(max-width: 820px)');

  function setMobileMenu(open, restore = false) {
    const wasOpen = navigation.classList.contains('open');
    mobileMenu.setAttribute('aria-expanded', String(open));
    mobileMenu.setAttribute('aria-label', open ? mobileMenu.dataset.close : mobileMenu.dataset.open);
    navigation.classList.toggle('open', open);
    if (!open && mobile.matches) toolsMenu.open = false;
    if (!open && wasOpen && restore) mobileMenu.focus();
  }
  setMobileMenu(false);

  mobileMenu.addEventListener('click', () => setMobileMenu(!navigation.classList.contains('open'), true));
  document.addEventListener('click', event => {
    if (toolsMenu.open && !toolsMenu.contains(event.target)) {
      if (toolsMenu.contains(document.activeElement)) toolTrigger.focus();
      toolsMenu.open = false;
    }
    if (!event.target.closest('.shell')) {
      setMobileMenu(false, navigation.contains(document.activeElement));
    }
  });
  mobile.addEventListener('change', () => {
    const wasInNavigation = navigation.contains(document.activeElement);
    toolsMenu.open = false;
    setMobileMenu(false, mobile.matches && wasInNavigation);
    if (mobile.matches && wasInNavigation) mobileMenu.focus();
    if (!mobile.matches && document.activeElement === mobileMenu) navigation.querySelector('a').focus();
  });
  document.addEventListener('keydown', event => {
    if (event.key !== 'Escape' || document.querySelector('dialog[open]')) return;
    if (toolsMenu.open) {
      toolsMenu.open = false;
      toolTrigger.focus();
    } else {
      setMobileMenu(false, true);
    }
  });

  const lightbox = document.querySelector('.lightbox');
  if (lightbox && typeof lightbox.showModal === 'function') {
    const title = lightbox.querySelector('#lightbox-title');
    const image = lightbox.querySelector('.lightbox-image');
    const close = lightbox.querySelector('[data-close]');
    const previous = lightbox.querySelector('[data-prev]');
    const next = lightbox.querySelector('[data-next]');
    let shots, index, opener;

    function showShot(position) {
      index = (position + shots.length) % shots.length;
      const shot = shots[index];
      title.textContent = shot.dataset.title;
      image.alt = shot.dataset.title;
      image.src = shot.href;
    }
    document.querySelectorAll('[data-gallery]').forEach(gallery => {
      const items = [...gallery.querySelectorAll('[data-shot]')];
      items.forEach((shot, position) => shot.addEventListener('click', event => {
        if (event.ctrlKey || event.metaKey || event.altKey || event.shiftKey) return;
        event.preventDefault();
        shots = items;
        opener = shot;
        previous.hidden = next.hidden = items.length < 2;
        showShot(position);
        lightbox.showModal();
        close.focus();
      }));
    });
    previous.addEventListener('click', () => showShot(index - 1));
    next.addEventListener('click', () => showShot(index + 1));
    close.addEventListener('click', () => lightbox.close());
    lightbox.addEventListener('close', () => opener?.focus());
    lightbox.addEventListener('click', event => {
      if (event.target === lightbox) lightbox.close();
    });
    lightbox.addEventListener('keydown', event => {
      if (shots.length < 2) return;
      if (event.key === 'ArrowLeft') showShot(index - 1);
      if (event.key === 'ArrowRight') showShot(index + 1);
    });
  }

  const notice = document.querySelector('.cookie-notice');
  const noticeKey = 'dayz-companion-cookie-notice-dismissed';
  try {
    notice.hidden = localStorage.getItem(noticeKey) === '1';
  } catch {
    notice.hidden = false;
  }
  notice.querySelector('button').addEventListener('click', () => {
    notice.hidden = true;
    try {
      localStorage.setItem(noticeKey, '1');
    } catch {
      // Closing the notice still works for this page.
    }
  });

  const counter = 114496162;
  const isPreview = ['localhost', '127.0.0.1', '[::1]'].includes(location.hostname);
  if (onProduction) {
    window.ym = window.ym || function (...args) { (window.ym.a ||= []).push(args); };
    window.ym.l = Date.now();
    const tag = document.createElement('script');
    tag.async = true;
    tag.src = 'https://mc.yandex.ru/metrika/tag.js?id=' + counter;
    document.head.append(tag);
    window.ym(counter, 'init', {
      ssr: true, webvisor: true, clickmap: true, ecommerce: 'dataLayer',
      referrer: document.referrer, url: location.href, accurateTrackBounce: true,
      trackLinks: false,
    });
  } else if (isPreview) {
    window.dayzPreviewEvents = [];
  }

  function track(event) {
    const link = event.target.closest('a[data-metrika-goal]');
    if (!link || event.defaultPrevented) return;
    const goal = link.dataset.metrikaGoal;
    const params = link.dataset.releaseVersion ? { version: link.dataset.releaseVersion } : {};
    if (onProduction) window.ym(counter, 'reachGoal', goal, params);
    if (isPreview) window.dayzPreviewEvents.push({ goal, ...params });
  }
  document.addEventListener('click', track);
  document.addEventListener('auxclick', event => {
    if (event.button === 1) track(event);
  });
})();
