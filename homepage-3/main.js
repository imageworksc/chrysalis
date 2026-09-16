/* Chrysalis Health — homepage concept, option 3
   Behaviour only. Nothing here writes a style: state goes into classes and
   data attributes, and the stylesheet decides what they look like. */

(() => {
  const d = document;

  /* ---- entrance: a block fades up the first time it comes into view ---- */
  const revealed = d.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    revealed.forEach((el) => io.observe(el));
  } else {
    revealed.forEach((el) => el.classList.add('is-in'));
  }

  /* ---- intake: who is the care for? filters two lists and retargets the CTA ---- */
  const LABEL = {
    adult: 'Showing care for adults',
    child: 'Showing care for children &amp; teens',
    other: 'Showing care for someone you support'
  };
  const CTA = {
    adult: { text: 'Start Care Today', href: '/request-services' },
    child: { text: 'Start Care Today', href: '/request-services' },
    other: { text: 'Make a Referral', href: '/make-referral' }
  };
  const out = d.getElementById('intake-out');
  const cta = d.getElementById('intake-cta');
  const chip = d.getElementById('chip');
  const chipText = d.getElementById('chip-text');
  const lists = [d.getElementById('concern-list'), d.getElementById('aud-list')].filter(Boolean);
  const options = d.querySelectorAll('.opt');

  const apply = (path) => {
    options.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.path === path)));
    lists.forEach((list) => {
      list.classList.toggle('is-filtered', Boolean(path));
      Array.from(list.children).forEach((li) => {
        const audiences = (li.getAttribute('data-aud') || '').split(' ');
        li.classList.toggle('is-match', !path || audiences.includes(path));
      });
    });
    if (path) {
      out.hidden = false;
      cta.innerHTML = CTA[path].text + ' <svg class="ico" aria-hidden="true"><use href="#i-arrow-right"/></svg>';
      cta.setAttribute('href', CTA[path].href);
      chip.hidden = false;
      chipText.innerHTML = LABEL[path];
    } else {
      out.hidden = true;
      chip.hidden = true;
    }
  };
  options.forEach((b) => {
    b.addEventListener('click', () => {
      apply(b.getAttribute('aria-pressed') === 'true' ? null : b.dataset.path);
    });
  });
  d.getElementById('chip-clear').addEventListener('click', () => apply(null));

  /* ---- faq: the open state is a class; the height animates in CSS ---- */
  d.querySelectorAll('.faq__item').forEach((item) => {
    const button = item.querySelector('.faq__q');
    const setOpen = (open) => {
      item.classList.toggle('is-open', open);
      button.setAttribute('aria-expanded', String(open));
    };
    setOpen(item.classList.contains('is-open'));
    button.addEventListener('click', () => setOpen(!item.classList.contains('is-open')));
  });

  /* ---- steps: the pointer walks the path; without one, the scroll does ---- */
  const list = d.getElementById('steps-list');
  const timeline = list ? list.closest('.path') : null;
  if (list && timeline) {
    const items = Array.from(list.children);
    const n = items.length;
    const pointer = window.matchMedia('(hover: hover)').matches;
    let queued = false;

    // data-step is how far the sequence has advanced; the stylesheet maps it
    // to the green along the path. is-live lights every step up to it.
    const setStep = (step) => {
      items.forEach((li, i) => {
        li.classList.toggle('is-live', i <= step);
        li.classList.toggle('is-passed', i < step);   // its connector to the next lights
      });
      timeline.dataset.step = String(Math.max(step, 0));
    };

    if (pointer) {
      items.forEach((li, i) => {
        li.addEventListener('mouseenter', () => setStep(i));
        li.addEventListener('focusin', () => setStep(i));
      });
      list.addEventListener('mouseleave', () => setStep(0));
      setStep(0);
    } else {
      // touch: each step lights as its own top crosses the reading line
      const tick = () => {
        const line = window.innerHeight * 0.6;
        let live = -1;
        items.forEach((li, i) => { if (li.getBoundingClientRect().top <= line) live = i; });
        setStep(live);
      };
      window.addEventListener('scroll', () => {
        if (queued) return;
        queued = true;
        requestAnimationFrame(() => { tick(); queued = false; });
      }, { passive: true });
      tick();
    }
  }
})();
