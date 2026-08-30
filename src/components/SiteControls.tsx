'use client';

import { useEffect, useRef, useState, type CSSProperties, type MouseEvent as ReactMouseEvent } from 'react';
import { useRouter } from 'next/navigation';
import {
  FileTextIcon,
  GearSixIcon,
  HouseIcon,
  PaperPlaneTiltIcon,
  SparkleIcon,
  SquaresFourIcon,
  UserCircleIcon,
  type Icon,
} from '@phosphor-icons/react';
import { useSiteExperience } from './SiteExperienceProvider';
import type { AudioTrack, CoreTheme, PerformanceTier } from '../lib/sitePreferences';

export type ControlPanel = 'menu' | 'settings' | null;
export type { PerformanceTier } from '../lib/sitePreferences';

export type PageKey = 'home' | 'about' | 'projects' | 'contact';

interface SiteControlsProps {
  currentPage: PageKey;
  panel: ControlPanel;
  onPanelChange: (panel: ControlPanel) => void;
}

const pages: Array<{ key: PageKey; href: string; index: string; label: string; icon: Icon }> = [
  { key: 'contact', href: '/contact', index: '04', label: 'Contact', icon: PaperPlaneTiltIcon },
  { key: 'projects', href: '/projects', index: '03', label: 'Projects', icon: SquaresFourIcon },
  { key: 'about', href: '/about', index: '02', label: 'About', icon: UserCircleIcon },
  { key: 'home', href: '/', index: '01', label: 'Home', icon: HouseIcon },
];

const scrambleCharacters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&';

const coreThemes: Array<{ key: CoreTheme; label: string; color: string }> = [
  { key: 'mono', label: 'Mono', color: '#f5f5f5' },
  { key: 'cyan', label: 'Cyan', color: '#22d3ee' },
  { key: 'emerald', label: 'Emerald', color: '#2cf2a0' },
  { key: 'solar', label: 'Solar', color: '#ffe11a' },
  { key: 'crimson', label: 'Crimson', color: '#ff174f' },
];

const audioTracks: Array<{ key: AudioTrack; label: string; meta: string }> = [
  { key: 'lofi-focus', label: 'Lofi Focus', meta: 'AMBIENT / DEEP WORK' },
  { key: 'neon-nights', label: 'Neon Nights', meta: 'SYNTHWAVE / RETRO' },
];

export function ScrambleText({ text, run, enabled, delay = 0 }: { text: string; run: number; enabled: boolean; delay?: number }) {
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

function MenuLink({ page, open, motion, delay, onNavigate }: {
  page: (typeof pages)[number];
  open: boolean;
  motion: boolean;
  delay: number;
  onNavigate: (href: string) => void;
}) {
  const [run, setRun] = useState(0);
  const animate = () => {
    if (open && motion) setRun((value) => value + 1);
  };

  const navigate = (event: ReactMouseEvent<HTMLAnchorElement>) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    onNavigate(page.href);
  };

  return (
    <a className="icon-hover-scope" href={page.href} aria-label={`Open ${page.label} page`} onClick={navigate} onPointerEnter={animate} onFocus={animate}>
      <small>[{page.index}]</small>
      <strong><ScrambleText text={page.label} run={run} enabled={open && motion} delay={run === 0 ? delay : 0} /></strong>
      <span className="menu-link-icon"><MorphIcon icon={page.icon} size={17} /></span>
    </a>
  );
}

export function SiteControls({ currentPage, panel, onPanelChange }: SiteControlsProps) {
  const router = useRouter();
  const { theme, setTheme, audioEnabled, audioTrack, toggleAudio, selectAudioTrack, motion, tier, setTier } = useSiteExperience();
  const current = pages.find((page) => page.key === currentPage) ?? pages[3];
  const menuOpen = panel === 'menu';
  const settingsOpen = panel === 'settings';
  const [dockRun, setDockRun] = useState(0);
  const dockExpanded = panel !== null;
  const dock = settingsOpen
    ? { index: 'SYS', label: 'Settings', icon: GearSixIcon }
    : current;
  const navigateTo = (href: string) => {
    onPanelChange(null);
    router.push(href);
  };

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
            <MenuLink page={page} open={menuOpen} motion={motion} delay={210 + index * 65} onNavigate={navigateTo} key={page.key} />
          ))}
        </nav>

        <div className="panel-foot"><span><i /> INTERFACE READY</span><b>TM / 2026</b></div>
      </aside>

      <aside id="global-settings-panel" className={`control-panel settings-panel ${settingsOpen ? 'is-open' : ''}`} aria-hidden={!settingsOpen}>
        <div className="panel-head">
          <div><h2>System</h2><span>GLOBAL CONFIGURATION</span></div>
          <b><i /> SET</b>
        </div>

        <section className="settings-section theme-settings-section">
          <header><span>[01] CORE THEME</span><small>V_1.0</small></header>
          <div className="theme-options" role="radiogroup" aria-label="Core color theme">
            {coreThemes.map((option) => (
              <button
                className={theme === option.key ? 'active' : ''}
                data-label={option.label}
                style={{ '--theme-swatch': option.color } as CSSProperties}
                onClick={() => setTheme(option.key)}
                role="radio"
                aria-checked={theme === option.key}
                aria-label={`${option.label} theme`}
                key={option.key}
              ><i /></button>
            ))}
          </div>
        </section>

        <section className="settings-section audio-settings-section">
          <header>
            <span>[02] AUDIO ENGINE</span>
            <button className={audioEnabled ? 'audio-master is-on' : 'audio-master'} onClick={toggleAudio} aria-pressed={audioEnabled}>{audioEnabled ? 'ON' : 'OFF'}</button>
          </header>
          <div className="audio-track-list">
            {audioTracks.map((track) => {
              const active = audioTrack === track.key;
              const playing = active && audioEnabled;
              return (
                <button className={active ? 'audio-track active' : 'audio-track'} onClick={() => selectAudioTrack(track.key)} aria-pressed={playing} key={track.key}>
                  <span><strong>{track.label}</strong><small>{track.meta}</small></span>
                  <i className={playing ? 'is-playing' : ''} aria-hidden="true"><b /><b /><b /></i>
                </button>
              );
            })}
          </div>
        </section>

        <section className="settings-section performance-settings-section">
          <header><span>[03] PERFORMANCE TIER</span><small>SYS</small></header>
          <div className="tier-buttons">
            {(['high', 'balanced', 'saver'] as PerformanceTier[]).map((option) => (
              <button className={tier === option ? 'active' : ''} onClick={() => setTier(option)} aria-pressed={tier === option} key={option}>
                <span>{option === 'balanced' ? 'Medium' : option}</span><i />
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
          onClick={() => onPanelChange(dockExpanded ? null : 'menu')}
          onPointerEnter={() => motion && setDockRun((value) => value + 1)}
          onFocus={() => motion && setDockRun((value) => value + 1)}
          aria-expanded={dockExpanded}
          aria-controls={settingsOpen ? 'global-settings-panel' : 'global-menu-panel'}
          aria-label={dockExpanded ? 'Close current panel' : 'Open menu'}
        >
          <small>[{dock.index}]</small>
          <span className="dock-page-icon"><MorphIcon icon={dock.icon} size={17} /></span>
          <strong><ScrambleText text={dock.label} run={dockRun} enabled={motion && dockRun > 0} /></strong>
          <b><MenuGlyph open={dockExpanded} /></b>
        </button>
      </div>
    </div>
  );
}
