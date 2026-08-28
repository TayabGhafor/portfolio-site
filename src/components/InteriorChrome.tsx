'use client';

import Link from 'next/link';
import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent, type ReactNode, type UIEvent } from 'react';
import { IdentityMark } from './IdentityMark';
import { SharedFooterContent } from './SharedFooterContent';
import { SiteControls, type ControlPanel, type PerformanceTier, type PageKey } from './SiteControls';
import { readSitePreferences } from '../lib/sitePreferences';

interface InteriorChromeProps {
  currentPage: Exclude<PageKey, 'home'>;
  index: string;
  label: string;
  wide?: boolean;
  aside?: ReactNode;
  showIndex?: boolean;
  children: ReactNode;
}

export function InteriorChrome({ currentPage, index, label, wide = false, aside, showIndex = true, children }: InteriorChromeProps) {
  const shellRef = useRef<HTMLDivElement>(null);
  const [panel, setPanel] = useState<ControlPanel>(null);
  const [motion, setMotion] = useState(true);
  const [tier, setTier] = useState<PerformanceTier>('high');
  const [scroll, setScroll] = useState(0);
  const [time, setTime] = useState('--:--');

  useEffect(() => {
    window.queueMicrotask(() => {
      const preferences = readSitePreferences();
      setTier(preferences.tier);
      setMotion(preferences.motion);
    });

    const updateTime = () => setTime(new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Asia/Karachi', hour: '2-digit', minute: '2-digit', hour12: false,
    }).format(new Date()));
    updateTime();
    const timer = window.setInterval(updateTime, 30_000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const closePanels = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setPanel(null);
    };
    window.addEventListener('keydown', closePanels);
    return () => window.removeEventListener('keydown', closePanels);
  }, []);

  const handleScroll = (event: UIEvent<HTMLDivElement>) => {
    const target = event.currentTarget;
    const available = target.scrollHeight - target.clientHeight;
    setScroll(available > 0 ? target.scrollTop / available : 0);
  };

  const handlePointer = (event: ReactPointerEvent<HTMLDivElement>) => {
    const shell = shellRef.current;
    if (!shell) return;
    shell.style.setProperty('--pointer-x', `${event.clientX}px`);
    shell.style.setProperty('--pointer-y', `${event.clientY}px`);
  };

  const toggleMotion = () => {
    const next = !motion;
    setMotion(next);
    window.localStorage.setItem('tm-motion', next ? 'full' : 'reduced');
  };

  const chooseTier = (next: PerformanceTier) => {
    setTier(next);
    window.localStorage.setItem('tm-performance', next);
  };

  return (
    <div
      ref={shellRef}
      className={`about-shell page-${currentPage} ${wide ? 'interior-wide' : ''} ${motion ? 'motion-full' : 'motion-reduced'} tier-${tier} ${scroll > .015 ? 'about-has-scrolled' : ''}`}
      onPointerMove={handlePointer}
    >
      <div className="about-grid" aria-hidden="true" />
      <div className="about-pointer-field" aria-hidden="true" />
      <div className="about-scan-lines" aria-hidden="true" />
      <div className="about-top-fade" aria-hidden="true" />
      <div className="about-bottom-fade" aria-hidden="true" />

      <header className="about-header">
        <IdentityMark motion={motion} />
        <div className="about-breadcrumb"><Link href="/">HOME</Link><i>/</i><b>{showIndex ? `[${index}] ` : ''}{label}</b></div>
      </header>

      {aside}

      <div className="about-scroll" onScroll={handleScroll}>
        {children}
      </div>

      <footer className="about-footer">
        <SharedFooterContent time={time} motion={motion} />
      </footer>

      <div className="about-scroll-progress" aria-hidden="true">
        <span>{String(Math.round(scroll * 100)).padStart(2, '0')}%</span>
        <i><b style={{ transform: `translateX(${scroll * 100}%)` }} /></i>
        <span>100%</span>
      </div>

      <SiteControls currentPage={currentPage} panel={panel} motion={motion} tier={tier} onPanelChange={setPanel} onToggleMotion={toggleMotion} onTierChange={chooseTier} />
    </div>
  );
}
