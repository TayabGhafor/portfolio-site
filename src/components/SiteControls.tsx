'use client';

import Link from 'next/link';

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

const pages: Array<{ key: PageKey; href: string; index: string; label: string; icon: string }> = [
  { key: 'contact', href: '/contact', index: '04', label: 'Contact', icon: '↗' },
  { key: 'projects', href: '/projects', index: '03', label: 'Projects', icon: '▦' },
  { key: 'about', href: '/about', index: '02', label: 'About', icon: '◉' },
  { key: 'home', href: '/', index: '01', label: 'Home', icon: '⌂' },
];

function GearIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 8.2a3.8 3.8 0 1 0 0 7.6 3.8 3.8 0 0 0 0-7.6Zm8.3 5.2v-2.8l-2.2-.6a7.4 7.4 0 0 0-.7-1.6l1.1-2-2-2-2 1.1a7.4 7.4 0 0 0-1.6-.7L12.3 2H9.5l-.6 2.2a7.4 7.4 0 0 0-1.6.7l-2-1.1-2 2 1.1 2a7.4 7.4 0 0 0-.7 1.6l-2.2.6v2.8l2.2.6c.2.6.4 1.1.7 1.6l-1.1 2 2 2 2-1.1c.5.3 1 .5 1.6.7l.6 2.2h2.8l.6-2.2c.6-.2 1.1-.4 1.6-.7l2 1.1 2-2-1.1-2c.3-.5.5-1 .7-1.6l2.2-.6Z" /></svg>;
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
        <span className="settings-trigger-core"><GearIcon /></span>
        <span className="settings-trigger-label">SYSTEM</span>
      </button>

      <aside id="global-menu-panel" className={`control-panel menu-panel ${menuOpen ? 'is-open' : ''}`} aria-hidden={!menuOpen}>
        <div className="panel-head">
          <div><h2>Menu</h2><span>GLOBAL NAVIGATION</span></div>
          <b><i /> DIR</b>
        </div>

        <div className="menu-utility-grid">
          <a href="/Tayab-Malik.pdf" target="_blank" rel="noreferrer"><span className="utility-icon">↗</span><small>PROFILE</small><strong>RESUME</strong></a>
          <a href="https://syntaxguild.vercel.app/" target="_blank" rel="noreferrer"><span className="utility-icon">✦</span><small>DEV LAB</small><strong>SYNTAX GUILD</strong></a>
        </div>

        <nav aria-label="Primary navigation">
          {pages.filter((page) => page.key !== currentPage).map((page) => (
            <Link href={page.href} key={page.key}>
              <small>[{page.index}]</small>
              <strong>{page.label}</strong>
              <span className="menu-link-icon" aria-hidden="true">{page.icon}</span>
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
          <button className="motion-setting" onClick={onToggleMotion} aria-pressed={motion}>
            <span className="setting-icon" aria-hidden="true">◎</span>
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
          onClick={() => onPanelChange(menuOpen ? null : 'menu')}
          aria-expanded={menuOpen}
          aria-controls="global-menu-panel"
          aria-label="Toggle menu"
        >
          <small>[{current.index}]</small>
          <span className="dock-page-icon" aria-hidden="true">{current.icon}</span>
          <strong>{current.label}</strong>
          <b><MenuGlyph open={menuOpen} /></b>
        </button>
      </div>
    </div>
  );
}
