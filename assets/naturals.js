(() => {
  const header = document.querySelector('.site-head');
  if (header) {
    const updateHeaderOffset = () => {
      document.documentElement.style.setProperty('--nt-header-height', `${Math.ceil(header.getBoundingClientRect().height)}px`);
    };
    updateHeaderOffset();
    new ResizeObserver(updateHeaderOffset).observe(header);
  }
  const carousel = document.querySelector('[data-nt-carousel]');
  if (!carousel) return;
  const panels = [...carousel.querySelectorAll('[data-nt-panel]')];
  const selectors = [...carousel.querySelectorAll('[data-nt-select]')];
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let active = 0;
  let paused = reducedMotion.matches;
  let timer;
  function show(index) {
    active = index;
    panels.forEach((panel, i) => {
      panel.classList.toggle('is-active', i === active);
      panel.setAttribute('aria-hidden', String(i !== active));
      panel.inert = i !== active;
    });
    selectors.forEach((button, i) => button.setAttribute('aria-pressed', String(i === active)));
  }
  function schedule() {
    clearInterval(timer);
    if (paused || document.hidden || carousel.matches(':hover') || carousel.contains(document.activeElement)) return;
    timer = setInterval(() => show((active + 1) % panels.length), 3000);
  }
  selectors.forEach((button, i) => button.addEventListener('click', () => { show(i); schedule(); }));
  carousel.addEventListener('mouseenter', () => clearInterval(timer));
  carousel.addEventListener('mouseleave', schedule);
  carousel.addEventListener('focusin', () => clearInterval(timer));
  carousel.addEventListener('focusout', () => setTimeout(schedule, 0));
  document.addEventListener('visibilitychange', schedule);
  reducedMotion.addEventListener('change', () => { paused = reducedMotion.matches; schedule(); });
  schedule();
})();
