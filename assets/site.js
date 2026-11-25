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
  const languageGroup = navigation.querySelector('.lang');
  function positionLanguage() {
    if (mobile.matches) navigation.prepend(languageGroup);
    else navigation.append(languageGroup);
  }
  positionLanguage();
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
    positionLanguage();
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

  document.querySelectorAll('[data-carousel]').forEach(carousel => {
    const track = carousel.querySelector('[data-carousel-track]');
    const controls = carousel.querySelector('[data-carousel-controls]');
    const slides = [...track.children];
    const n = slides.length;
    if (!controls || n < 2) return;
    const previous = controls.querySelector('[data-carousel-prev]');
    const next = controls.querySelector('[data-carousel-next]');
    const count = controls.querySelector('[data-carousel-count]');
    const wrap = i => (i % n + n) % n;
    let index = 0;
    // A two-frame gallery needs a second copy of the side preview.
    const duplicate = n === 2 ? slides[1].cloneNode(true) : null;
    if (duplicate) {
      duplicate.dataset.clone = ''; duplicate.setAttribute('aria-hidden','true');
      duplicate.querySelector('a').removeAttribute('data-shot');
      duplicate.querySelector('a').tabIndex = -1; track.append(duplicate);
    }
    const dots = document.createElement('div');
    dots.className = 'carousel-dots'; dots.setAttribute('role','group');
    dots.setAttribute('aria-label',carousel.getAttribute('aria-label'));
    const buttons = slides.map((slide,i) => {
      slide.dataset.logical = i;
      const dot = document.createElement('button'); dot.type = 'button';
      dot.setAttribute('aria-label',(i+1)+' / '+n+' ? '+slide.querySelector('a').dataset.title);
      dot.addEventListener('click',()=>show(i)); dots.append(dot); return dot;
    });
    controls.append(dots);
    function role(slide, name) {
      slide.classList.toggle('is-current',name==='current');
      slide.classList.toggle('is-before',name==='before');
      slide.classList.toggle('is-after',name==='after');
      slide.classList.toggle('is-away',name==='away');
    }
    function show(position,focusSlide=false) {
      index=wrap(position);
      const left=wrap(index-1), right=wrap(index+1);
      slides.forEach((slide,i)=>{
        role(slide,i===index?'current':i===left?'before':i===right?'after':'away');
        slide.querySelector('a').tabIndex=i===index?0:-1;
        buttons[i].setAttribute('aria-pressed',String(i===index));
      });
      if(duplicate) {
        const original=slides[right], link=duplicate.querySelector('a'), source=original.querySelector('a');
        duplicate.dataset.logical=right; link.href=source.href;
        const img=link.querySelector('img'), src=source.querySelector('img');
        for(const attr of ['src','srcset','sizes','width','height','alt']) {
          if(src.hasAttribute(attr)) img.setAttribute(attr,src.getAttribute(attr)); else img.removeAttribute(attr);
        }
        duplicate.querySelector('figcaption').textContent=original.querySelector('figcaption').textContent;
        role(duplicate,'after');
      }
      count.textContent=(index+1)+' / '+n;
      if(focusSlide)slides[index].querySelector('a').focus({preventScroll:true});
    }
    const move=delta=>show(index+delta,track.contains(document.activeElement));
    carousel.classList.add('is-enhanced','is-coverflow','is-card-coverflow');
    controls.hidden=false;show(0);
    track.addEventListener('click',event=>{
      const slide=event.target.closest('figure'); if(!slide)return;
      if(slide.classList.contains('is-current'))return;
      if(event.ctrlKey||event.metaKey||event.altKey||event.shiftKey)return;
      event.preventDefault();event.stopPropagation();
      show(Number(slide.dataset.logical),track.contains(document.activeElement));
    },true);
    previous.addEventListener('click',()=>move(-1));
    next.addEventListener('click',()=>move(1));
    carousel.addEventListener('keydown',event=>{
      if(event.key!=='ArrowLeft'&&event.key!=='ArrowRight')return;
      event.preventDefault();move(event.key==='ArrowLeft'?-1:1);
    });
    let touch=null;
    track.addEventListener('touchstart',event=>{touch=event.touches.length===1?{x:event.touches[0].clientX,y:event.touches[0].clientY}:null;},{passive:true});
    track.addEventListener('touchend',event=>{
      if(!touch)return;
      const dx=event.changedTouches[0].clientX-touch.x,dy=event.changedTouches[0].clientY-touch.y;touch=null;
      if(Math.abs(dx)>45&&Math.abs(dx)>Math.abs(dy)*1.5){event.preventDefault();move(dx<0?1:-1);}
    },{passive:false});
    track.addEventListener('touchcancel',()=>{touch=null;},{passive:true});
  });

  const lightbox = document.querySelector('.lightbox');
  if (lightbox && typeof lightbox.showModal === 'function') {
    const title = lightbox.querySelector('#lightbox-title');
    const image = lightbox.querySelector('.lightbox-image');
    const viewport = lightbox.querySelector('[data-lightbox-viewport]');
    const thumbs = lightbox.querySelector('[data-lightbox-thumbs]');
    const count = lightbox.querySelector('[data-lightbox-count]');
    const close = lightbox.querySelector('[data-close]');
    const previous = lightbox.querySelector('[data-prev]');
    const next = lightbox.querySelector('[data-next]');
    const zoomIn = lightbox.querySelector('[data-zoom-in]');
    const zoomOut = lightbox.querySelector('[data-zoom-out]');
    let shots, index, opener, zoom = 1, drag = null, moved = false;
    function sizeImage() {
      if (!image.naturalWidth || !lightbox.open) return;
      viewport.classList.toggle('is-zoomed', zoom > 1);
      const fit = Math.min(viewport.offsetWidth / image.naturalWidth, viewport.offsetHeight / image.naturalHeight);
      image.style.width = Math.max(1, Math.round(image.naturalWidth * fit * zoom)) + 'px';
      image.style.height = Math.max(1, Math.round(image.naturalHeight * fit * zoom)) + 'px';
      zoomOut.disabled = zoom <= 1; zoomIn.disabled = zoom >= 3;
    }
    function setZoom(value) {
      const oldW = Math.max(1, viewport.scrollWidth), oldH = Math.max(1, viewport.scrollHeight);
      const cx = (viewport.scrollLeft + viewport.clientWidth / 2) / oldW;
      const cy = (viewport.scrollTop + viewport.clientHeight / 2) / oldH;
      zoom = Math.max(1, Math.min(3, value)); sizeImage();
      viewport.scrollLeft = cx * viewport.scrollWidth - viewport.clientWidth / 2;
      viewport.scrollTop = cy * viewport.scrollHeight - viewport.clientHeight / 2;
    }
    function showShot(position) {
      index = (position + shots.length) % shots.length;
      const shot = shots[index];
      title.textContent = shot.dataset.title;
      count.textContent = (index + 1) + ' / ' + shots.length;
      zoom = 1; drag = null; moved = false;
      viewport.classList.remove('is-zoomed','is-dragging');
      image.style.removeProperty('width'); image.style.removeProperty('height');
      viewport.scrollLeft = viewport.scrollTop = 0;
      zoomOut.disabled = true; zoomIn.disabled = false;
      image.alt = shot.dataset.title;
      image.src = shot.href;
      if(image.complete) sizeImage();
      [...thumbs.children].forEach((button,i) => {
        button.setAttribute('aria-pressed',String(i === index));
        button.classList.toggle('is-selected',i === index);
      });
      const active = thumbs.children[index];
      if(active) thumbs.scrollLeft = active.offsetLeft - (thumbs.clientWidth - active.offsetWidth) / 2;
    }
    function renderThumbs() {
      thumbs.replaceChildren();
      shots.forEach((shot,i) => {
        const button = document.createElement('button'); button.type = 'button';
        button.setAttribute('aria-label', (i+1) + '. ' + shot.dataset.title);
        const thumb = document.createElement('img');
        thumb.src = shot.querySelector('img').getAttribute('src'); thumb.alt = '';
        button.append(thumb); button.addEventListener('click', () => showShot(i)); thumbs.append(button);
      });
      thumbs.hidden = shots.length < 2;
    }
    document.querySelectorAll('[data-gallery]').forEach(gallery => {
      const items = [...gallery.querySelectorAll('[data-shot]')];
      items.forEach((shot, position) => shot.addEventListener('click', event => {
        if (event.ctrlKey || event.metaKey || event.altKey || event.shiftKey) return;
        event.preventDefault(); shots = items; opener = shot;
        previous.hidden = next.hidden = items.length < 2;
        renderThumbs();
        opener.focus({preventScroll:true});
        lightbox.showModal(); document.body.classList.add('lightbox-open');
        showShot(position); close.focus();
      }));
    });
    image.addEventListener('load',sizeImage);
    if (typeof ResizeObserver === 'function') new ResizeObserver(sizeImage).observe(viewport);
    zoomIn.addEventListener('click',()=>setZoom(zoom + .5));
    zoomOut.addEventListener('click',()=>setZoom(zoom - .5));
    image.addEventListener('click',()=>{ if(!moved) setZoom(zoom === 1 ? 2 : 1); moved = false; });
    viewport.addEventListener('wheel',event=>{
      if (!lightbox.open || !event.deltaY) return;
      event.preventDefault(); setZoom(zoom + (event.deltaY < 0 ? .25 : -.25));
    },{passive:false});
    viewport.addEventListener('pointerdown',event=>{
      if (event.pointerType !== 'mouse' || event.button !== 0 || zoom <= 1) return;
      drag = {id:event.pointerId,x:event.clientX,y:event.clientY,left:viewport.scrollLeft,top:viewport.scrollTop}; moved = false;
    });
    viewport.addEventListener('pointermove',event=>{
      if(!drag || drag.id !== event.pointerId) return;
      const dx=event.clientX-drag.x,dy=event.clientY-drag.y;
      if(Math.abs(dx)+Math.abs(dy)>4 && !moved){moved=true;viewport.setPointerCapture(event.pointerId);viewport.classList.add('is-dragging');}
      if(moved){viewport.scrollLeft=drag.left-dx;viewport.scrollTop=drag.top-dy;}
    });
    function endDrag(){drag=null;viewport.classList.remove('is-dragging');}
    viewport.addEventListener('pointerup',endDrag);viewport.addEventListener('pointercancel',endDrag);viewport.addEventListener('lostpointercapture',endDrag);
    let touch = null;
    viewport.addEventListener('touchstart',e=>{touch=zoom===1&&e.touches.length===1?{x:e.touches[0].clientX,y:e.touches[0].clientY}:null;},{passive:true});
    viewport.addEventListener('touchend',e=>{
      if(!touch||zoom!==1||shots.length<2)return;
      const dx=e.changedTouches[0].clientX-touch.x,dy=e.changedTouches[0].clientY-touch.y;touch=null;
      if(Math.abs(dx)>45&&Math.abs(dx)>Math.abs(dy)*1.5){e.preventDefault();showShot(index+(dx<0?1:-1));}
    },{passive:false});
    previous.addEventListener('click', () => showShot(index - 1));
    next.addEventListener('click', () => showShot(index + 1));
    close.addEventListener('click', () => lightbox.close());
    lightbox.addEventListener('close', () => {
      document.body.classList.remove('lightbox-open');
      requestAnimationFrame(() => requestAnimationFrame(() => opener?.focus({preventScroll:true})));
    });
    lightbox.addEventListener('keydown', event => {
      if(event.key==='+'||event.key==='='){event.preventDefault();setZoom(zoom+.5);}
      if(event.key==='-'){event.preventDefault();setZoom(zoom-.5);}
      if(shots.length<2)return;
      if(event.key==='ArrowLeft'||event.key==='ArrowRight'){event.preventDefault();showShot(index+(event.key==='ArrowLeft'?-1:1));}
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
