/**
 * Scroll motion grammar — GSAP + ScrollTrigger, Amsterdam Manor attributes.
 * Everything degrades to fully visible static content under reduced motion.
 */
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* Sunflower scroll-progress bar (scroll-linked state, kept under reduced motion) */
const updateProgress = () => {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const p = max > 0 ? Math.min(1, window.scrollY / max) : 0;
  document.documentElement.style.setProperty('--scroll-progress', p.toFixed(4));
};
updateProgress();
window.addEventListener('scroll', updateProgress, { passive: true });
window.addEventListener('resize', updateProgress);

if (!prefersReduced) {
  /* Hero entrance: masked lines + lead + docked reserve bar */
  const heroLines = gsap.utils.toArray<HTMLElement>('[data-hero-line] > span');
  if (heroLines.length) {
    gsap.set(heroLines, { yPercent: 112 });
    gsap.to(heroLines, {
      yPercent: 0,
      duration: 1.15,
      ease: 'power4.out',
      stagger: 0.1,
      delay: 0.35,
    });
  }
  const heroFade = gsap.utils.toArray<HTMLElement>('[data-hero-fade]');
  if (heroFade.length) {
    gsap.fromTo(
      heroFade,
      { y: 28, autoAlpha: 0 },
      { y: 0, autoAlpha: 1, duration: 0.9, ease: 'power3.out', stagger: 0.12, delay: 0.75 },
    );
  }

  /* Generic reveal */
  gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((el) => {
    gsap.fromTo(
      el,
      { y: 36, autoAlpha: 0 },
      {
        y: 0,
        autoAlpha: 1,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 86%', once: true },
      },
    );
  });

  /* Staggered groups */
  gsap.utils.toArray<HTMLElement>('[data-reveal-stagger]').forEach((group) => {
    const items = group.querySelectorAll<HTMLElement>('[data-reveal-item]');
    if (!items.length) return;
    gsap.fromTo(
      items,
      { y: 30, autoAlpha: 0 },
      {
        y: 0,
        autoAlpha: 1,
        duration: 0.85,
        ease: 'power3.out',
        stagger: 0.09,
        scrollTrigger: { trigger: group, start: 'top 84%', once: true },
      },
    );
  });

  /* Word-split headlines */
  gsap.utils.toArray<HTMLElement>('[data-split]').forEach((el) => {
    const words = el.textContent?.trim().split(/\s+/) ?? [];
    if (!words.length) return;
    el.setAttribute('aria-label', el.textContent ?? '');
    el.textContent = '';
    const inners: HTMLElement[] = [];
    words.forEach((word, i) => {
      const wrap = document.createElement('span');
      wrap.style.display = 'inline-block';
      wrap.style.overflow = 'hidden';
      wrap.style.verticalAlign = 'bottom';
      wrap.setAttribute('aria-hidden', 'true');
      const inner = document.createElement('span');
      inner.style.display = 'inline-block';
      inner.textContent = word;
      wrap.appendChild(inner);
      el.appendChild(wrap);
      if (i < words.length - 1) el.appendChild(document.createTextNode(' '));
      inners.push(inner);
    });
    gsap.fromTo(
      inners,
      { yPercent: 110 },
      {
        yPercent: 0,
        duration: 0.9,
        ease: 'power4.out',
        stagger: 0.045,
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      },
    );
  });

  /* Image wipes */
  gsap.utils.toArray<HTMLElement>('[data-image-reveal]').forEach((el) => {
    const img = el.querySelector('img, video');
    const tl = gsap.timeline({
      scrollTrigger: { trigger: el, start: 'top 85%', once: true },
    });
    tl.fromTo(
      el,
      { clipPath: 'inset(0 0 100% 0)' },
      { clipPath: 'inset(0 0 0% 0)', duration: 1.1, ease: 'power4.inOut' },
    );
    if (img) {
      tl.fromTo(img, { scale: 1.18 }, { scale: 1, duration: 1.4, ease: 'power3.out' }, 0);
    }
  });

  /* Counters */
  gsap.utils.toArray<HTMLElement>('[data-story-count]').forEach((el) => {
    const target = Number(el.dataset.storyCount ?? '0');
    if (!Number.isFinite(target)) return;
    const state = { value: 0 };
    gsap.to(state, {
      value: target,
      duration: 1.6,
      ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      onUpdate: () => {
        el.textContent = String(Math.round(state.value));
      },
    });
  });

  /* Parallax media */
  gsap.utils.toArray<HTMLElement>('[data-parallax]').forEach((el) => {
    gsap.fromTo(
      el,
      { yPercent: -8 },
      {
        yPercent: 8,
        ease: 'none',
        scrollTrigger: {
          trigger: el.parentElement ?? el,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      },
    );
  });
}
