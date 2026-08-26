'use client';

import Link from 'next/link';
import { useEffect, useRef, useState, type CSSProperties } from 'react';
import {
  CursorClickIcon,
  FileTextIcon,
  GearSixIcon,
  HouseIcon,
  PaperPlaneTiltIcon,
  SparkleIcon,
  SquaresFourIcon,
  UserCircleIcon,
  type Icon,
} from '@phosphor-icons/react';

export type ControlPanel = 'menu' | 'settings' | null;
export type PerformanceTier = 'high' | 'balanced' | 'saver';

type PageKey = 'home' | 'about' | 'projects' | 'contact';

interface SiteControlsProps {
  currentPage: PageKey;
  panel: ControlPanel;
  motion: boolean;
  tier: PerformanceTier;
  onPanelChange: (panel: ControlPanel) => void;
  onToggleMotion: () => void;
  onTierChange: (tier: PerformanceTier) => void;
}

const pages: Array<{ key: PageKey; href: string; index: string; label: string; icon: Icon }> = [
  { key: 'contact', href: '/contact', index: '04', label: 'Contact', icon: PaperPlaneTiltIcon },
  { key: 'projects', href: '/projects', index: '03', label: 'Projects', icon: SquaresFourIcon },
  { key: 'about', href: '/about', index: '02', label: 'About', icon: UserCircleIcon },
  { key: 'home', href: '/', index: '01', label: 'Home', icon: HouseIcon },
];

const scrambleCharacters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&';

function ScrambleText({ text, run, enabled, delay = 0 }: { text: string; run: number; enabled: boolean; delay?: number }) {
  const textRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const node = textRef.current;
    if (!node) return;

    let frame = 0;
    let timeout = 0;
    node.textContent = text;

    if (!enabled || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    timeout = window.setTimeout(() => {
      const glyphs = Array.from(text);
      const glyphCount = glyphs.filter((glyph) => glyph !== ' ').length;
      const duration = 600 + Math.min(text.length * 14, 190);
      const startedAt = performance.now();
      let lastPaint = 0;

      const paint = (now: number) => {
        const progress = Math.min((now - startedAt) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);

        if (now - lastPaint > 28 || progress === 1) {
          const lockedGlyphs = Math.floor(eased * glyphCount);
          let glyphIndex = 0;
          node.textContent = glyphs.map((glyph) => {
            if (glyph === ' ') return ' ';
            const isLocked = glyphIndex < lockedGlyphs;
            glyphIndex += 1;
            return isLocked ? glyph : scrambleCharacters[Math.floor(Math.random() * scrambleCharacters.length)];
          }).join('');
          lastPaint = now;
        }

        if (progress < 1) frame = requestAnimationFrame(paint);
        else node.textContent = text;
      };

      frame = requestAnimationFrame(paint);
    }, delay);

    return () => {
      window.clearTimeout(timeout);
      cancelAnimationFrame(frame);
      node.textContent = text;
    };
  }, [delay, enabled, run, text]);

  return (
    <span className="scramble-text" aria-label={text}>
      <span ref={textRef} aria-hidden="true">{text}</span>
      <span className="scramble-measure" aria-hidden="true">{text}</span>
    </span>
  );
}

function MorphIcon({ icon: IconComponent, size = 18 }: { icon: Icon; size?: number }) {
  return (
    <span className="morph-icon" style={{ '--icon-size': `${size}px` } as CSSProperties} aria-hidden="true">
      <IconComponent className="icon-outline" size={size} weight="light" />
      <IconComponent className="icon-fill" size={size} weight="fill" />
    </span>
  );
}

function MenuGlyph({ open }: { open: boolean }) {
  return <span className={`menu-glyph ${open ? 'is-open' : ''}`} aria-hidden="true"><i /><i /><i /></span>;
}

function UtilityLink({ href, eyebrow, label, icon, open, motion, delay, external = false }: {
  href: string;
  eyebrow: string;
  label: string;
  icon: Icon;
  open: boolean;
  motion: boolean;
  delay: number;
  external?: boolean;
}) {
  const [run, setRun] = useState(0);
  const animate = () => {
    if (open && motion) setRun((value) => value + 1);
  };

  return (
    <a className="icon-hover-scope" href={href} target={external ? '_blank' : undefined} rel={external ? 'noreferrer' : undefined} onPointerEnter={animate} onFocus={animate}>
      <span className="utility-icon"><MorphIcon icon={icon} size={17} /></span>
      <small><ScrambleText text={eyebrow} run={run} enabled={open && motion} delay={run === 0 ? delay : 0} /></small>
      <strong><ScrambleText text={label} run={run} enabled={open && motion} delay={run === 0 ? delay + 35 : 0} /></strong>
    </a>
  );
}

function MenuLink({ page, open, motion, delay }: { page: (typeof pages)[number]; open: boolean; motion: boolean; delay: number }) {
  const [run, setRun] = useState(0);
  const animate = () => {
    if (open && motion) setRun((value) => value + 1);
  };

  return (
    <Link className="icon-hover-scope" href={page.href} onPointerEnter={animate} onFocus={animate}>
      <small>[{page.index}]</small>
      <strong><ScrambleText text={page.label} run={run} enabled={open && motion} delay={run === 0 ? delay : 0} /></strong>
      <span className="menu-link-icon"><MorphIcon icon={page.icon} size={17} /></span>
    </Link>
  );
}

export function SiteControls({ currentPage, panel, motion, tier, onPanelChange, onToggleMotion, onTierChange }: SiteControlsProps) {
  const current = pages.find((page) => page.key === currentPage) ?? pages[3];
  const menuOpen = panel === 'menu';
  const settingsOpen = panel === 'settings';
  const [dockRun, setDockRun] = useState(0);

  return (
    <div className="site-controls">
      <button
        className="settings-trigger"
        onClick={() => onPanelChange(settingsOpen ? null : 'settings')}
        aria-expanded={settingsOpen}
        aria-controls="global-settings-panel"
        aria-label="Open system configuration"
      >
        <span className="settings-trigger-core icon-hover-scope"><MorphIcon icon={GearSixIcon} size={17} /></span>
      </button>

      <aside id="global-menu-panel" className={`control-panel menu-panel ${menuOpen ? 'is-open' : ''}`} aria-hidden={!menuOpen}>
        <div className="panel-head">
          <div><h2><ScrambleText text="Menu" run={0} enabled={menuOpen && motion} delay={35} /></h2><span>GLOBAL NAVIGATION</span></div>
          <b><i /> DIR</b>
        </div>

        <div className="menu-utility-grid">
          <UtilityLink href="/Tayab-Malik.pdf" eyebrow="PROFILE" label="RESUME" icon={FileTextIcon} open={menuOpen} motion={motion} delay={90} external />
          <UtilityLink href="https://syntaxguild.vercel.app/" eyebrow="DEV LAB" label="SYNTAX GUILD" icon={SparkleIcon} open={menuOpen} motion={motion} delay={145} external />
        </div>

        <nav aria-label="Primary navigation">
          {pages.filter((page) => page.key !== currentPage).map((page, index) => (
            <MenuLink page={page} open={menuOpen} motion={motion} delay={210 + index * 65} key={page.key} />
          ))}
        </nav>

        <div className="panel-foot"><span><i /> INTERFACE READY</span><b>TM / 2026</b></div>
      </aside>

      <aside id="global-settings-panel" className={`control-panel settings-panel ${settingsOpen ? 'is-open' : ''}`} aria-hidden={!settingsOpen}>
        <div className="panel-head">
          <div><h2>System</h2><span>GLOBAL CONFIGURATION</span></div>
          <b><i /> SET</b>
        </div>

        <section className="settings-section">
          <header><span>[01] MOTION SYSTEM</span><small>{motion ? 'FULL' : 'REDUCED'}</small></header>
          <button className="motion-setting icon-hover-scope" onClick={onToggleMotion} aria-pressed={motion}>
            <span className="setting-icon"><MorphIcon icon={CursorClickIcon} size={19} /></span>
            <span><strong>{motion ? 'Full motion' : 'Reduced motion'}</strong><small>{motion ? 'POINTER / CORE / HOVERS' : 'ESSENTIAL STATE ONLY'}</small></span>
            <i className={motion ? 'is-on' : ''}><b /></i>
          </button>
        </section>

        <section className="settings-section">
          <header><span>[02] PERFORMANCE TIER</span><small>RENDER</small></header>
          <div className="tier-buttons">
            {(['high', 'balanced', 'saver'] as PerformanceTier[]).map((option) => (
              <button className={tier === option ? 'active' : ''} onClick={() => onTierChange(option)} key={option}>
                <span>{option === 'balanced' ? 'MED' : option}</span><i />
              </button>
            ))}
          </div>
        </section>

        <p className="system-active"><i /> SYSTEM ACTIVE <b>{tier.toUpperCase()}</b></p>
      </aside>

      <div className="nav-dock">
        <span className="wave" aria-hidden="true"><i /><i /><i /><i /><i /></span>
        <button
          className="icon-hover-scope"
          onClick={() => onPanelChange(menuOpen ? null : 'menu')}
          onPointerEnter={() => motion && setDockRun((value) => value + 1)}
          onFocus={() => motion && setDockRun((value) => value + 1)}
          aria-expanded={menuOpen}
          aria-controls="global-menu-panel"
          aria-label="Toggle menu"
        >
          <small>[{current.index}]</small>
          <span className="dock-page-icon"><MorphIcon icon={current.icon} size={17} /></span>
          <strong><ScrambleText text={current.label} run={dockRun} enabled={motion && dockRun > 0} /></strong>
          <b><MenuGlyph open={menuOpen} /></b>
        </button>
      </div>
    </div>
  );
}
