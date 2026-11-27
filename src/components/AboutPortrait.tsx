'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';
import { FileArrowDownIcon } from '@phosphor-icons/react';
import { resumeDownload } from '../content/portfolio';
import { useSiteExperience } from './SiteExperienceProvider';

export function AboutPortrait() {
  const artRef = useRef<HTMLDivElement>(null);
  const { motion } = useSiteExperience();

  useEffect(() => {
    const art = artRef.current;
    const scroller = art?.closest<HTMLElement>('.about-scroll');
    const page = art?.closest<HTMLElement>('.about-premium-page');
    if (!art || !scroller || !page) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const mobile = window.matchMedia('(max-width: 760px)');
    let enabled = motion && !reducedMotion.matches;
    let frame = 0;
    let lastTime = 0;
    let needsMeasurement = false;
    let current = 0;
    let target = 0;

    const readProgress = () => {
      let distance = scroller.scrollHeight - scroller.clientHeight;
      if (mobile.matches) {
        // On phones the card scrolls away, so complete the movement while it is visible.
        const rect = art.getBoundingClientRect();
        const top = rect.top - scroller.getBoundingClientRect().top + scroller.scrollTop;
        distance = top + rect.height - 120;
      }
      return Math.max(0, Math.min(1, scroller.scrollTop / Math.max(1, distance)));
    };

    const paint = () => art.style.setProperty('--about-portrait-progress', current.toFixed(5));
    const stop = () => {
      window.cancelAnimationFrame(frame);
      frame = 0;
      lastTime = 0;
    };
    const animate = (time: number) => {
      frame = 0;
      if (!enabled || document.hidden) return;
      if (needsMeasurement) {
        target = readProgress();
        needsMeasurement = false;
      }

      // Time-based damping feels consistent on both 60 Hz and high-refresh displays.
      const elapsed = lastTime ? Math.min(time - lastTime, 64) : 1000 / 60;
      lastTime = time;
      current += (target - current) * (1 - Math.exp(-elapsed / 140));
      if (Math.abs(target - current) < .0001) current = target;
      paint();

      if (current !== target) frame = window.requestAnimationFrame(animate);
      else lastTime = 0;
    };
    const schedule = () => {
      if (!enabled || document.hidden) return;
      needsMeasurement = true;
      if (!frame) frame = window.requestAnimationFrame(animate);
    };
    const syncMotionPreference = () => {
      stop();
      enabled = motion && !reducedMotion.matches;
      current = target = enabled ? readProgress() : 0;
      paint();
    };
    const handleVisibility = () => {
      if (document.hidden) stop();
      else schedule();
    };

    const resizeObserver = new ResizeObserver(schedule);
    resizeObserver.observe(scroller);
    resizeObserver.observe(page);
    resizeObserver.observe(art);
    scroller.addEventListener('scroll', schedule, { passive: true });
    reducedMotion.addEventListener('change', syncMotionPreference);
    mobile.addEventListener('change', schedule);
    document.addEventListener('visibilitychange', handleVisibility);
    syncMotionPreference();

    return () => {
      stop();
      resizeObserver.disconnect();
      scroller.removeEventListener('scroll', schedule);
      reducedMotion.removeEventListener('change', syncMotionPreference);
      mobile.removeEventListener('change', schedule);
      document.removeEventListener('visibilitychange', handleVisibility);
      art.style.removeProperty('--about-portrait-progress');
    };
  }, [motion]);

  return (
    <aside className="about-premium-portrait" aria-label="Tayab Malik profile and resume">
      <div className="about-premium-portrait-art" ref={artRef}>
        <div className="about-premium-portrait-light" aria-hidden="true" />
        <div className="about-premium-portrait-image">
          <Image src="/portrait/tayab-professional-cutout.png" alt="Professional monochrome portrait of Tayab Malik" fill sizes="(max-width: 760px) 90vw, 30vw" priority />
        </div>
        <div className="about-premium-portrait-sheen" aria-hidden="true" />
        <div className="about-premium-portrait-shade" aria-hidden="true" />
        <span className="about-premium-portrait-index">TM / 2026</span>
      </div>
      <div className="about-premium-portrait-caption"><span>SOFTWARE QUALITY ASSURANCE</span><b>TAYAB MALIK</b><small>SQA Engineer · Pakistan / PKT</small>
        <a className="about-premium-resume" href={resumeDownload.href} download={resumeDownload.filename}><FileArrowDownIcon size={19} aria-hidden="true" /><span>Download resume</span><small>PDF</small></a>
      </div>
    </aside>
  );
}
