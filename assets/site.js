(() => {
  'use strict';
  const q = (selector, root = document) => root.querySelector(selector);
  const all = (selector, root = document) => [...root.querySelectorAll(selector)];
  const page = document.body.dataset.page;
  const vi = document.body.dataset.language === 'vi';
  const prefix = vi ? 'vi/' : '';
  const routes = { home: '', coffee: 'coffee/', poultry: 'poultry/', contact: 'contact/', naturals: 'naturals/', agrisolution: 'agrisolutions/', enviroflight: 'agrisolutions/enviroflight/', enviropro: 'agrisolutions/enviroflight/enviropro/', 'equipment-system': 'agrisolutions/equipment-systems/', 'equipment-systems': 'agrisolutions/equipment-systems/' };
  const legacy = location.hash.match(/^#\/(home|coffee|poultry|contact|naturals|agrisolution|enviroflight|enviropro|equipment-systems?)$/);
  if (legacy) {
    location.replace(new URL(prefix + routes[legacy[1]], document.baseURI));
    return;
  }

  function toggleMenu(groupSelector, buttonSelector, className = 'open', hover = false) {
    const group = q(groupSelector), button = q(buttonSelector);
    if (!group || !button) return;
    const close = () => { group.classList.remove(className); button.setAttribute('aria-expanded', 'false'); };
    button.addEventListener('click', event => {
      event.stopPropagation();
      button.setAttribute('aria-expanded', String(group.classList.toggle(className)));
    });
    document.addEventListener('click', event => { if (!group.contains(event.target)) close(); });
    document.addEventListener('keydown', event => { if (event.key === 'Escape') close(); });
    if (hover) {
      const desktopHover = matchMedia('(min-width: 931px) and (hover: hover) and (pointer: fine)');
      group.addEventListener('mouseenter', () => {
        if (!desktopHover.matches) return;
        group.classList.add(className);
        button.setAttribute('aria-expanded', 'true');
      });
      group.addEventListener('mouseleave', () => {
        if (desktopHover.matches && !group.contains(document.activeElement)) close();
      });
      group.addEventListener('focusout', event => {
        if (desktopHover.matches && !group.contains(event.relatedTarget) && !group.matches(':hover')) close();
      });
      desktopHover.addEventListener('change', close);
    }
  }
  toggleMenu('#agrisolutionsGroup', '#agrisolutionsToggle', 'open', true);
  toggleMenu('#naturalGroup', '#naturalToggle', 'open', true);
  toggleMenu('#languageSwitch', '#languageToggle');
  toggleMenu('#nav', '#mobileToggle', 'show');

  // The base URL keeps assets portable; section links stay on the current page.
  document.addEventListener('click', event => {
    const anchor = event.target.closest('a[href]');
    if (!anchor) return;
    const href = anchor.getAttribute('href');
    if (!href.startsWith('#') || href.startsWith('#/')) return;
    const target = document.getElementById(href.slice(1));
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' });
    history.pushState(null, '', location.pathname + location.search + href);
  });

  function openDialog(dialog) { if (dialog && !dialog.open) dialog.showModal(); }
  function bindDialog(dialog) {
    if (!dialog || dialog.dataset.bound) return;
    dialog.dataset.bound = 'true';
    dialog.addEventListener('click', event => {
      if (event.target === dialog || event.target.closest('.modal-close, .gallery-v4-lightbox button')) dialog.close();
    });
  }
  all('dialog').forEach(bindDialog);
  function details(title, content) {
    let dialog = q('#detailDialog');
    if (!dialog) {
      dialog = document.createElement('dialog'); dialog.id = 'detailDialog'; dialog.className = 'editorial-modal';
      document.body.appendChild(dialog); bindDialog(dialog);
    }
    const panel = document.createElement('div'); panel.className = 'modal-content';
    const header = document.createElement('div'); header.className = 'modal-header';
    const heading = document.createElement('h2'); heading.id = 'detailDialogTitle'; heading.textContent = title;
    const close = document.createElement('button'); close.type = 'button'; close.className = 'modal-close'; close.textContent = '\u00d7'; close.setAttribute('aria-label', vi ? 'Đóng' : 'Close details');
    header.append(heading, close); panel.append(header, content); dialog.replaceChildren(panel);
    dialog.setAttribute('aria-labelledby', heading.id); openDialog(dialog);
  }
  q('#openLetter')?.addEventListener('click', () => openDialog(q('#letterDialog')));
  q('#openInvestmentContact')?.addEventListener('click', () => openDialog(q('#investmentContactDialog')));
  q('#coffeeProcess')?.addEventListener('click', event => {
    event.preventDefault();
    q('#coffee-collection')?.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' });
  });
  all('.cf-doc-model-card').forEach(card => {
    const button = q('.cf-model-learn-more', card);
    button?.addEventListener('click', () => {
      const copy = document.createElement('div'); copy.className = 'cf-model-detail-copy';
      all('h4,p', card).forEach(item => copy.appendChild(item.cloneNode(true)));
      details(q('h3', card)?.textContent || '', copy);
    });
  });
  all('.ax-feature-button').forEach(button => button.addEventListener('click', () => {
    const copy = document.createElement('p'); copy.textContent = q('.ax-feature-detail', button)?.textContent || '';
    details(q('strong', button)?.textContent || '', copy);
  }));

  const productData = q('#coffee-products-data');
  const products = productData ? JSON.parse(productData.textContent) : [];
  all('.coffee-product').forEach(button => button.addEventListener('click', () => {
    const product = products.find(item => item.id === button.dataset.coffee); if (!product) return;
    const content = document.createElement('div');
    const addText = (tag, value) => { if (!value) return; const element = document.createElement(tag); element.textContent = value; content.appendChild(element); };
    addText('p', product.short); addText('p', product.description);
    const grid = document.createElement('div'); grid.className = 'detail-spec-grid';
    const fields = [['Target score', product.score || product.cupping], ['Varietal', product.varietal], ['Processing', product.processing], ['Elevation', product.elevation], ['Flavor direction', product.flavour], ['Recommended use', product.application], ['Grading', product.grade], ['Growing approach', product.agronomy]];
    fields.forEach(([label, value]) => { if (!value) return; const cell = document.createElement('div'); cell.className = 'detail-spec'; const small = document.createElement('small'); small.textContent = label; const strong = document.createElement('b'); strong.textContent = value; cell.append(small, strong); grid.appendChild(cell); });
    content.appendChild(grid); addText('p', product.note);
    const contact = document.createElement('a'); contact.className = 'modal-cta'; contact.href = prefix + routes.contact; contact.textContent = vi ? 'Liên hệ về sản phẩm này ↗' : 'Enquire about this coffee ↗'; content.appendChild(contact);
    details(product.name, content);
  }));

  const gallery = q('.coffee-gallery-v4');
  if (gallery) {
    const thumbs = all('.gallery-v4-thumb', gallery), image = q('.gallery-v4-image', gallery); let active = 0;
    function show(index) {
      if (!thumbs.length) return;
      active = (index + thumbs.length) % thumbs.length; const thumb = thumbs[active], photo = q('img', thumb);
      image.src = photo.src; image.alt = thumb.dataset.alt || thumb.getAttribute('aria-label') || '';
      const blur = q('.gallery-v4-blur', gallery); if (blur) blur.style.backgroundImage = `url("${photo.src}")`;
      const counter = q('#coffeeGalleryCounter', gallery); if (counter) counter.textContent = `${String(active + 1).padStart(2, '0')} / ${String(thumbs.length).padStart(2, '0')}`;
      const title = q('.gallery-v4-caption b', gallery), caption = q('.gallery-v4-caption span', gallery);
      if (title) title.textContent = thumb.dataset.title || ''; if (caption) caption.textContent = thumb.dataset.caption || '';
      const progress = q('.gallery-v4-progress span', gallery); if (progress) progress.style.width = `${((active + 1) / thumbs.length) * 100}%`;
      thumbs.forEach((item, i) => item.setAttribute('aria-current', String(i === active)));
      thumb.scrollIntoView({ behavior: 'instant', block: 'nearest', inline: 'nearest' });
    }
    thumbs.forEach((thumb, index) => thumb.addEventListener('click', () => show(index)));
    q('#coffeePrev', gallery)?.addEventListener('click', () => show(active - 1));
    q('#coffeeNext', gallery)?.addEventListener('click', () => show(active + 1));
    q('.gallery-v4-expand, .gallery-v4-open', gallery)?.addEventListener('click', () => {
      const lightbox = q('.gallery-v4-lightbox', gallery); if (!lightbox) return;
      const target = q('img', lightbox); target.src = image.src; target.alt = image.alt; openDialog(lightbox);
    });
  }

  const farmGallery = q('.cf-farm-swiper');
  if (farmGallery && typeof window.Swiper === 'function') {
    const total = all('.swiper-slide', farmGallery).length;
    const update = swiper => { const counter = q('#cfGalleryCounter'); if (counter) counter.textContent = `${String(swiper.realIndex + 1).padStart(2, '0')} / ${String(total).padStart(2, '0')}`; };
    const swiper = new window.Swiper(farmGallery, { loop: true, speed: matchMedia('(prefers-reduced-motion: reduce)').matches ? 1 : 900, grabCursor: true, autoplay: { delay: 2000, disableOnInteraction: false }, on: { init: update, slideChange: update } });
    q('.cf-gallery-main')?.addEventListener('keydown', event => { if (event.key === 'ArrowRight') { event.preventDefault(); swiper.slideNext(); } if (event.key === 'ArrowLeft') { event.preventDefault(); swiper.slidePrev(); } });
  }
  const farmPhoto = q('#galleryMain'), farmThumbs = all('.gallery-thumb');
  if (farmPhoto && farmThumbs.length) {
    let current = 0;
    const show = index => { current = (index + farmThumbs.length) % farmThumbs.length; const thumb = farmThumbs[current]; farmPhoto.src = thumb.dataset.full || q('img', thumb).src; farmPhoto.alt = q('img', thumb).alt; farmThumbs.forEach((item, i) => { item.classList.toggle('chosen', i === current); item.setAttribute('aria-pressed', String(i === current)); }); const counter = q('#galleryCounter'); if (counter) counter.textContent = `${String(current + 1).padStart(2, '0')} / ${farmThumbs.length}`; };
    farmThumbs.forEach((thumb, i) => thumb.addEventListener('click', () => show(i)));
    q('#galleryPrev')?.addEventListener('click', () => show(current - 1)); q('#galleryNext')?.addEventListener('click', () => show(current + 1));
    document.addEventListener('keydown', event => { if (q('dialog[open]')) return; if (event.key === 'ArrowRight') show(current + 1); if (event.key === 'ArrowLeft') show(current - 1); });
  }

  let copyTimer;
  all('[data-copy-email]').forEach(button => button.addEventListener('click', async () => {
    const email = q('.general-enquiry-link')?.textContent.trim() || 'info@centrofarms.com'; let copied = false;
    try { await navigator.clipboard.writeText(email); copied = true; } catch {
      const field = document.createElement('textarea'); field.value = email; field.style.cssText = 'position:fixed;opacity:0;pointer-events:none'; document.body.appendChild(field); field.select();
      try { copied = document.execCommand('copy'); } catch {} field.remove(); button.focus({ preventScroll: true });
    }
    const status = q('.contact-copy-status'); if (!status) return;
    const message = document.createElement('span');
    if (copied) message.innerHTML = '<svg viewBox="0 0 16 16" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="m3 8 3 3 7-7"/></svg>';
    message.append(document.createTextNode(copied ? (vi ? 'Đã sao chép email' : 'Email copied') : (vi ? 'Không thể sao chép email' : 'Could not copy email')));
    status.replaceChildren(message);
    clearTimeout(copyTimer); copyTimer = setTimeout(() => { status.textContent = ''; }, 2500);
  }));
})();


      (() => {
        const contentSelector =
          "p, li, td, th, blockquote, figcaption, dd, dt, .desc, .panel-desc, .steps-mini, .agri-trace-elements, .agri-disclaimer, .contact-detail, .note, .stat span";
        const adjusted = new Map();

        function restore(element, property, original) {
          if (original.value) {
            element.style.setProperty(property, original.value, original.priority);
          } else {
            element.style.removeProperty(property);
          }
        }

        function enforceMinimum(element) {
          if (!(element instanceof HTMLElement)) return;

          const previous = adjusted.get(element);
          if (previous) {
            restore(element, "font-size", previous.fontSize);
            restore(element, "line-height", previous.lineHeight);
            adjusted.delete(element);
          }

          if (!element.textContent.trim() && !element.matches("input, select, textarea")) {
            return;
          }

          const minimum = element.closest(contentSelector) ? 14 : 12;
          const styles = getComputedStyle(element);
          const fontSize = parseFloat(styles.fontSize);
          if (fontSize >= minimum) return;

          const original = {
            fontSize: {
              value: element.style.getPropertyValue("font-size"),
              priority: element.style.getPropertyPriority("font-size"),
            },
            lineHeight: {
              value: element.style.getPropertyValue("line-height"),
              priority: element.style.getPropertyPriority("line-height"),
            },
          };
          adjusted.set(element, original);
          const lineHeight = parseFloat(styles.lineHeight);
          element.style.setProperty("font-size", `${minimum}px`, "important");
          if (Number.isFinite(lineHeight) && lineHeight < minimum) {
            element.style.setProperty("line-height", "1.4", "important");
          }
        }

        function enforceTree(root) {
          if (root instanceof HTMLElement) enforceMinimum(root);
          root.querySelectorAll?.("*").forEach((element) => {
            if (element instanceof HTMLElement) enforceMinimum(element);
          });
        }

        function refreshMinimums() {
          for (const element of adjusted.keys()) {
            if (!element.isConnected) {
              adjusted.delete(element);
              continue;
            }
            restore(element, "font-size", adjusted.get(element).fontSize);
            restore(element, "line-height", adjusted.get(element).lineHeight);
            adjusted.delete(element);
          }
          enforceTree(document.body);
        }

        refreshMinimums();
        window.addEventListener("resize", refreshMinimums);
        new MutationObserver((records) => {
          for (const record of records) {
            if (record.type === "attributes") {
              enforceTree(record.target);
            } else if (record.type === "characterData") {
              if (record.target.parentElement) enforceTree(record.target.parentElement);
            } else {
              record.addedNodes.forEach(enforceTree);
            }
          }
        }).observe(document.body, {
          subtree: true,
          childList: true,
          characterData: true,
          attributes: true,
          attributeFilter: ["class"],
        });
      })();
    
