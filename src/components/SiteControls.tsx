'use client';

import Link from 'next/link';
import type { CSSProperties } from 'react';
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

export function SiteControls({ currentPage, panel, motion, tier, onPanelChange, onToggleMotion, onTierChange }: SiteControlsProps) {
  const current = pages.find((page) => page.key === currentPage) ?? pages[3];
  const menuOpen = panel === 'menu';
  const settingsOpen = panel === 'settings';

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
        <span className="settings-trigger-label">SYSTEM</span>
      </button>

      <aside id="global-menu-panel" className={`control-panel menu-panel ${menuOpen ? 'is-open' : ''}`} aria-hidden={!menuOpen}>
        <div className="panel-head">
          <div><h2>Menu</h2><span>GLOBAL NAVIGATION</span></div>
          <b><i /> DIR</b>
        </div>

        <div className="menu-utility-grid">
          <a className="icon-hover-scope" href="/Tayab-Malik.pdf" target="_blank" rel="noreferrer"><span className="utility-icon"><MorphIcon icon={FileTextIcon} size={17} /></span><small>PROFILE</small><strong>RESUME</strong></a>
          <a className="icon-hover-scope" href="https://syntaxguild.vercel.app/" target="_blank" rel="noreferrer"><span className="utility-icon"><MorphIcon icon={SparkleIcon} size={17} /></span><small>DEV LAB</small><strong>SYNTAX GUILD</strong></a>
        </div>

        <nav aria-label="Primary navigation">
          {pages.filter((page) => page.key !== currentPage).map((page) => (
            <Link className="icon-hover-scope" href={page.href} key={page.key}>
              <small>[{page.index}]</small>
              <strong>{page.label}</strong>
              <span className="menu-link-icon"><MorphIcon icon={page.icon} size={17} /></span>
            </Link>
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
          aria-expanded={menuOpen}
          aria-controls="global-menu-panel"
          aria-label="Toggle menu"
        >
          <small>[{current.index}]</small>
          <span className="dock-page-icon"><MorphIcon icon={current.icon} size={17} /></span>
          <strong>{current.label}</strong>
          <b><MenuGlyph open={menuOpen} /></b>
        </button>
      </div>
    </div>
  );
}
