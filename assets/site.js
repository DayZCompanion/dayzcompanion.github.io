(() => {
  const pageUrl = new URL(location.href);
  if (document.documentElement.lang === 'ru' && pageUrl.searchParams.get('lang') === 'en') {
    pageUrl.pathname = '/en/';
    pageUrl.searchParams.delete('lang');
    location.replace(pageUrl);
    return;
  }

  const languageLinks = document.querySelectorAll('[data-language-link]');
  function updateLanguageLinks() {
    languageLinks.forEach(link => {
      link.hash = location.hash;
    });
  }
  updateLanguageLinks();
  window.addEventListener('hashchange', updateLanguageLinks);

  const notice = document.querySelector('.cookie-notice');
  const dismiss = notice.querySelector('button');
  const noticeKey = 'dayz-companion-cookie-notice-dismissed';
  try {
    notice.hidden = localStorage.getItem(noticeKey) === '1';
  } catch {
    // Browsers can block access to local storage.
  }
  if (!notice.hidden) {
    notice.classList.add('is-floating');
    dismiss.hidden = false;
    dismiss.addEventListener('click', () => {
      notice.hidden = true;
      try {
        localStorage.setItem(noticeKey, '1');
      } catch {
        // The notice still closes for the current page.
      }
    });
  }

  (function(m,e,t,r,i,k,a){
          m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
          m[i].l=1*new Date();
          for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
          k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
      })(window, document,'script','https://mc.yandex.ru/metrika/tag.js?id=114496162', 'ym');

      ym(114496162, 'init', {ssr:true, webvisor:true, clickmap:true, ecommerce:"dataLayer", referrer: document.referrer, url: location.href, accurateTrackBounce:true, trackLinks:true});

  // Native pointer hover is handled in CSS. On touch screens, cards toggle on tap.
  document.querySelectorAll('.tool').forEach(card => {
    const control = card.querySelector('.tool-toggle');
    control.addEventListener('click', () => {
      const opened = card.classList.toggle('is-open');
      control.setAttribute('aria-expanded', String(opened));
      const english = document.documentElement.lang === 'en';
      const action = english ? (opened ? 'Hide details' : 'Show details') : (opened ? 'Свернуть' : 'Показать подробности');
      control.setAttribute('aria-label', `${action}: ${card.querySelector('h3').textContent}`);
    });
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.tool.is-open').forEach(card => {
        card.classList.remove('is-open');
        const control = card.querySelector('.tool-toggle');
        control.setAttribute('aria-expanded', 'false');
        const action = document.documentElement.lang === 'en' ? 'Show details' : 'Показать подробности';
        control.setAttribute('aria-label', `${action}: ${card.querySelector('h3').textContent}`);
      });
    }
  });

  // Small copy rotator only; background and CTA buttons never change.
  (() => {
    const slides = [...document.querySelectorAll('.hero-slide')];
    const dots = [...document.querySelectorAll('.hero-dot')];
    const hero = document.querySelector('.hero-inner');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let index = 0;
    let timer = null;
    let paused = false;
    function show(next) {
      index = (next + slides.length) % slides.length;
      slides.forEach((slide, i) => {
        const active = i === index;
        slide.classList.toggle('is-active', active);
        slide.setAttribute('aria-hidden', String(!active));
        dots[i].classList.toggle('is-active', active);
        dots[i].setAttribute('aria-pressed', String(active));
      });
    }
    function stop() { if (timer !== null) { clearInterval(timer); timer = null; } }
    function start() {
      stop();
      if (!reduceMotion.matches && !paused && !document.hidden) {
        timer = setInterval(() => show(index + 1), 6500);
      }
    }
    dots.forEach((dot, i) => dot.addEventListener('click', () => { show(i); start(); }));
    hero.addEventListener('mouseenter', () => { paused = true; stop(); });
    hero.addEventListener('mouseleave', () => { paused = false; start(); });
    hero.addEventListener('focusin', () => { paused = true; stop(); });
    hero.addEventListener('focusout', () => {
      if (!hero.contains(document.activeElement)) { paused = false; start(); }
    });
    document.addEventListener('visibilitychange', start);
    reduceMotion.addEventListener('change', () => {
      if (reduceMotion.matches) show(0);
      start();
    });
    start();
  })();

  document.querySelectorAll('a[data-metrika-goal]').forEach((link) => {
      link.addEventListener('click', () => {
        if (typeof ym === 'function') {
          ym(114496162, 'reachGoal', link.dataset.metrikaGoal);
        }
      });
    });
})();
