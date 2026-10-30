(() => {
  window.__siteReady = true;
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const hasGsap = Boolean(window.gsap && window.ScrollTrigger);

  $('#year').textContent = new Date().getFullYear();

  const timeFormatter = new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Kathmandu',
  });
  const timeEl = $('#localTime');
  const updateTime = () => { timeEl.textContent = `${timeFormatter.format(new Date())} NPT`; };
  updateTime();
  window.setInterval(updateTime, 15000);

  const splitIntoCharacters = (element) => {
    [...element.childNodes].forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        const fragment = document.createDocumentFragment();
        [...node.textContent].forEach((character) => {
          const span = document.createElement('span');
          span.className = 'char';
          span.textContent = character === ' ' ? '\u00a0' : character;
          fragment.appendChild(span);
        });
        node.replaceWith(fragment);
      } else if (node.nodeType === Node.ELEMENT_NODE && !node.classList.contains('hl__bg')) {
        splitIntoCharacters(node);
      }
    });
  };
  $$('[data-split]').forEach(splitIntoCharacters);

  $$('[data-split-lines]').forEach((element) => {
    const text = element.textContent.trim();
    element.setAttribute('aria-label', text);
    element.innerHTML = text
      .split(/\s+/)
      .map((word) => `<span class="line" aria-hidden="true"><span class="char">${word}</span></span>`)
      .join(' ');
  });

  $$('[data-words]').forEach((element) => {
    element.innerHTML = element.textContent.trim()
      .split(/\s+/)
      .map((word) => `<span class="word">${word}</span>`)
      .join(' ');
  });

  const menu = $('#menu');
  const menuButton = $('#menuBtn');
  const menuLabel = $('.nav__menu-label');
  const setMenu = (open) => {
    menu.classList.toggle('is-open', open);
    menu.setAttribute('aria-hidden', String(!open));
    menuButton.setAttribute('aria-expanded', String(open));
    menuLabel.textContent = open ? 'Close' : 'Menu';
    if (window.__lenis) open ? window.__lenis.stop() : window.__lenis.start();
  };
  menuButton.addEventListener('click', () => setMenu(!menu.classList.contains('is-open')));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') setMenu(false);
  });

  $$('[data-scroll]').forEach((link) => {
    link.addEventListener('click', (event) => {
      const target = $(link.getAttribute('href'));
      if (!target) return;
      event.preventDefault();
      setMenu(false);
      if (window.__lenis) window.__lenis.scrollTo(target, { duration: 1.4 });
      else target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  });

  const filterButtons = $$('.project-filters [data-filter]');
  const projectTiles = $$('.project-tile[data-category]');
  $$('.project-art').forEach((artwork) => {
    artwork.dataset.cursor = 'Reference';
    const index = $('strong', artwork);
    if (index) index.setAttribute('aria-hidden', 'true');
  });
  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const category = button.dataset.filter;
      filterButtons.forEach((filter) => {
        const active = filter === button;
        filter.classList.toggle('is-active', active);
        filter.setAttribute('aria-pressed', String(active));
      });
      projectTiles.forEach((tile) => {
        const visible = category === 'All' || tile.dataset.category === category;
        tile.hidden = !visible;
        if (visible && !reduceMotion) {
          tile.classList.remove('project-reveal');
          void tile.offsetWidth;
          tile.classList.add('project-reveal');
        }
      });
      if (window.ScrollTrigger) window.ScrollTrigger.refresh();
    });
  });

  const loader = $('#loader');
  const fxCanvas = $('#fx');
  if (!hasGsap || reduceMotion) {
    loader.remove();
    fxCanvas.remove();
    return;
  }

  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.clearScrollMemory('manual');
  window.scrollTo(0, 0);

  let lenis = null;
  if (window.Lenis) {
    lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 1 });
    window.__lenis = lenis;
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  const nav = $('#nav');
  let lastY = 0;
  const updateNav = (y) => {
    const scrollingDown = y > lastY && y > 240;
    nav.classList.toggle('is-hidden', scrollingDown && !menu.classList.contains('is-open'));
    lastY = y;
  };
  if (lenis) lenis.on('scroll', ({ scroll }) => updateNav(scroll));
  else window.addEventListener('scroll', () => updateNav(window.scrollY), { passive: true });

  const heroChars = $$('.hero__name .char');
  const heroFades = $$('.hero__top > *, .hero .fade-up');
  gsap.set(heroChars, { yPercent: 115 });
  gsap.set(heroFades, { opacity: 0, y: 24 });
  const highlight = $('#heroHl');
  const highlightBg = $('.hl__bg', highlight);
  const highlightChars = $$('.char', highlight);
  gsap.set(highlightBg, { scaleX: 0, transformOrigin: '0% 50%' });
  gsap.set(highlightChars, { color: '#121212' });

  const intro = gsap.timeline({ paused: true })
    .to(heroChars, { yPercent: 0, duration: 1.5, ease: 'expo.out', stagger: 0.04 })
    .to(heroFades, { opacity: 1, y: 0, duration: 1.2, ease: 'expo.out', stagger: 0.08 }, '-=1.2')
    .to(highlightBg, { scaleX: 1, duration: 0.9, ease: 'expo.inOut' }, 0.95)
    .to(highlightChars, { color: '#f2f0eb', duration: 0.25, ease: 'none', stagger: 0.09 }, 1.15);

  let highlightBusy = false;
  highlight.addEventListener('mouseenter', () => {
    if (highlightBusy || intro.isActive()) return;
    highlightBusy = true;
    gsap.timeline({ onComplete: () => { highlightBusy = false; } })
      .to(highlightBg, { scaleX: 0, transformOrigin: '100% 50%', duration: 0.5, ease: 'expo.in' })
      .to(highlightChars, { color: '#121212', duration: 0.2, stagger: 0.05 }, 0.15)
      .set(highlightBg, { transformOrigin: '0% 50%' })
      .to(highlightBg, { scaleX: 1, duration: 0.7, ease: 'expo.out' })
      .to(highlightChars, { color: '#f2f0eb', duration: 0.2, stagger: 0.06 }, '<0.05');
  });

  const isCrawler = /bot|crawl|spider|slurp|facebookexternalhit|embedly|preview/i.test(navigator.userAgent);
  const shouldPlayIntro = window.__playIntro === true;

  if (shouldPlayIntro && !isCrawler && window.CRIntro) {
    if (lenis) lenis.stop();
    window.CRIntro.run({
      onReveal: () => {
        document.documentElement.classList.add('intro-complete');
        loader.style.pointerEvents = 'none';
        intro.play();
        if (lenis) lenis.start();
      },
    });
  } else {
    loader.remove();
    fxCanvas.remove();
    intro.play();
  }

  gsap.to('.hero__name', {
    yPercent: -18,
    ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true },
  });

  $$('[data-words]').forEach((element) => {
    gsap.fromTo($$('.word', element), { opacity: 0.16 }, {
      opacity: 1,
      ease: 'none',
      stagger: 0.04,
      scrollTrigger: { trigger: element, start: 'top 78%', end: 'bottom 50%', scrub: 0.6 },
    });
  });

  $$('[data-count]').forEach((element) => {
    const target = Number(element.dataset.count);
    const counter = { value: 0 };
    element.textContent = '0';
    ScrollTrigger.create({
      trigger: element,
      start: 'top 90%',
      once: true,
      onEnter: () => gsap.to(counter, {
        value: target,
        duration: 1.8,
        ease: 'expo.out',
        onUpdate: () => { element.textContent = Math.round(counter.value); },
      }),
    });
  });

  $$('[data-split-lines]').forEach((element) => {
    gsap.from($$('.char', element), {
      yPercent: 110,
      duration: 1.4,
      ease: 'expo.out',
      stagger: 0.06,
      scrollTrigger: { trigger: element, start: 'top 88%' },
    });
  });

  $$('.contact__big .line').forEach((line, index) => {
    gsap.from($$('.char', line), {
      yPercent: 115,
      duration: 1.4,
      ease: 'expo.out',
      stagger: 0.025,
      delay: index * 0.1,
      scrollTrigger: { trigger: '.contact__big', start: 'top 85%' },
    });
  });

  $$('.fade-up').filter((element) => !element.closest('.hero')).forEach((element) => {
    gsap.from(element, {
      y: 36,
      opacity: 0,
      duration: 1.3,
      ease: 'expo.out',
      scrollTrigger: { trigger: element, start: 'top 90%' },
    });
  });

  const marquee = gsap.to('#marquee', {
    xPercent: -50,
    duration: 28,
    ease: 'none',
    repeat: -1,
  });
  if (lenis) {
    lenis.on('scroll', ({ velocity }) => {
      gsap.to(marquee, {
        timeScale: 1 + Math.min(Math.abs(velocity) / 6, 5),
        duration: 0.3,
        overwrite: true,
      });
      gsap.to(marquee, { timeScale: 1, duration: 1.2, delay: 0.3 });
    });
  }

  $$('.row').forEach((row) => {
    const rule = document.createElement('span');
    rule.className = 'row__line';
    row.prepend(rule);
    const timeline = gsap.timeline({ scrollTrigger: { trigger: row, start: 'top 90%' } });
    timeline.from(rule, { scaleX: 0, duration: 1.4, ease: 'expo.out' })
      .from($$('.row__n, h3, p', row), { y: 24, opacity: 0, duration: 1.1, ease: 'expo.out', stagger: 0.06 }, 0.1);
  });

  if (finePointer) {
    $$('[data-magnetic]').forEach((element) => {
      const xTo = gsap.quickTo(element, 'x', { duration: 0.6, ease: 'power3.out' });
      const yTo = gsap.quickTo(element, 'y', { duration: 0.6, ease: 'power3.out' });
      element.addEventListener('mousemove', (event) => {
        const rect = element.getBoundingClientRect();
        xTo((event.clientX - rect.left - rect.width / 2) * 0.35);
        yTo((event.clientY - rect.top - rect.height / 2) * 0.35);
      });
      element.addEventListener('mouseleave', () => {
        gsap.to(element, { x: 0, y: 0, duration: 1, ease: 'elastic.out(1, 0.4)' });
      });
    });

    const cursor = $('#cursor');
    const cursorLabel = $('#cursorLabel');
    const xTo = gsap.quickTo(cursor, 'x', { duration: 0.45, ease: 'power3.out' });
    const yTo = gsap.quickTo(cursor, 'y', { duration: 0.45, ease: 'power3.out' });
    window.addEventListener('mousemove', (event) => {
      xTo(event.clientX);
      yTo(event.clientY);
      cursor.classList.remove('is-hidden');
    });
    document.addEventListener('mouseleave', () => cursor.classList.add('is-hidden'));
    document.addEventListener('mouseover', (event) => {
      const target = event.target.closest('[data-cursor]');
      if (target) {
        cursorLabel.textContent = target.dataset.cursor;
        cursor.classList.add('is-label');
      } else {
        cursor.classList.remove('is-label');
      }
    });
  }

  window.addEventListener('load', () => ScrollTrigger.refresh());
})();
