'use client';

import { lazy, Suspense, useCallback, useEffect, useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent } from 'react';
import { projects } from '../src/content/projects';

const ParticlePortrait = lazy(() => import('../src/components/ParticlePortrait').then((module) => ({ default: module.ParticlePortrait })));

type Panel = 'menu' | 'settings' | null;
type PerformanceTier = 'high' | 'balanced' | 'saver';

function GearIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 8.2a3.8 3.8 0 1 0 0 7.6 3.8 3.8 0 0 0 0-7.6Zm8.3 5.2v-2.8l-2.2-.6a7.4 7.4 0 0 0-.7-1.6l1.1-2-2-2-2 1.1a7.4 7.4 0 0 0-1.6-.7L12.3 2H9.5l-.6 2.2a7.4 7.4 0 0 0-1.6.7l-2-1.1-2 2 1.1 2a7.4 7.4 0 0 0-.7 1.6l-2.2.6v2.8l2.2.6c.2.6.4 1.1.7 1.6l-1.1 2 2 2 2-1.1c.5.3 1 .5 1.6.7l.6 2.2h2.8l.6-2.2c.6-.2 1.1-.4 1.6-.7l2 1.1 2-2-1.1-2c.3-.5.5-1 .7-1.6l2.2-.6Z" /></svg>;
}

function MenuGlyph({ open }: { open: boolean }) {
  return <span className={`menu-glyph ${open ? 'is-open' : ''}`} aria-hidden="true"><i /><i /><i /></span>;
}

function Loader({ progress, ready, leaving, onEnter }: { progress: number; ready: boolean; leaving: boolean; onEnter: () => void }) {
  return (
    <section className={`loader-screen ${ready ? 'is-ready' : ''} ${leaving ? 'is-leaving' : ''}`} aria-label="Portfolio introduction" aria-live="polite">
      <div className="loader-grid" aria-hidden="true"><i /><i /><i /><i /></div>
      <div className="loader-counter">{String(Math.round(progress)).padStart(2, '0')}%</div>
      <button className="loader-enter" disabled={!ready} onClick={onEnter}>
        <strong>{ready ? 'CLICK' : 'WAIT'}</strong><span>{ready ? 'TO ENTER' : 'INITIALIZING'}</span>
      </button>
      <div className="loader-performance"><span>PERFORMANCE</span><b>HIGH</b><i /><b className="muted">MED</b><i /><b className="muted">SAVER</b></div>
      <div className="loader-track"><span style={{ '--load': `${progress}%` } as CSSProperties} /><b>{ready ? 'LOADED' : 'LOADING'}</b></div>
      <div className="loader-system"><span>{ready ? 'SYSTEM_READY' : 'INITIALIZING_ENGINE'}</span><i className={ready ? 'ready' : ''} /></div>
    </section>
  );
}

export default function Home() {
  const shellRef = useRef<HTMLElement>(null);
  const loadStartRef = useRef(0);
  const [panel, setPanel] = useState<Panel>(null);
  const [time, setTime] = useState('--:--:--');
  const [tier, setTier] = useState<PerformanceTier>('high');
  const [motion, setMotion] = useState(true);
  const [assetProgress, setAssetProgress] = useState(0);
  const [displayProgress, setDisplayProgress] = useState(0);
  const [modelReady, setModelReady] = useState(false);
  const [entered, setEntered] = useState(false);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    loadStartRef.current = performance.now();
    const storedTier = window.localStorage.getItem('tm-performance') as PerformanceTier | null;
    const storedMotion = window.localStorage.getItem('tm-motion');
    window.queueMicrotask(() => {
      if (storedTier) setTier(storedTier);
      if (storedMotion === 'reduced' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) setMotion(false);
    });

    const update = () => setTime(new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Asia/Karachi', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false,
    }).format(new Date()));
    update();
    const timer = window.setInterval(update, 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    let frame = 0;
    const tick = (now: number) => {
      const elapsed = now - loadStartRef.current;
      const revealCurve = Math.min(99, 100 * (1 - Math.exp(-elapsed / 520)));
      const available = modelReady ? 99 : Math.min(assetProgress, 99);
      const next = Math.min(revealCurve, available);

      if (modelReady && elapsed >= 1650) {
        setDisplayProgress(100);
        return;
      }

      setDisplayProgress(next);
      frame = window.requestAnimationFrame(tick);
    };
    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, [assetProgress, modelReady]);

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setPanel(null);
      if (event.key === 'Enter' && displayProgress >= 100 && !entered) {
        setLeaving(true);
        window.setTimeout(() => setEntered(true), motion ? 820 : 0);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [displayProgress, entered, motion]);

  const handleSceneProgress = useCallback((progress: number) => setAssetProgress(progress), []);
  const handleSceneReady = useCallback(() => setModelReady(true), []);

  const enterPortfolio = () => {
    if (displayProgress < 100) return;
    setLeaving(true);
    window.setTimeout(() => setEntered(true), motion ? 820 : 0);
  };

  const handlePointer = (event: ReactPointerEvent<HTMLElement>) => {
    const shell = shellRef.current;
    if (!shell) return;
    shell.style.setProperty('--pointer-x', `${event.clientX}px`);
    shell.style.setProperty('--pointer-y', `${event.clientY}px`);
    shell.style.setProperty('--portrait-shift-x', `${(event.clientX / window.innerWidth - 0.5) * 7}px`);
    shell.style.setProperty('--portrait-shift-y', `${(event.clientY / window.innerHeight - 0.5) * 5}px`);
  };

  const chooseTier = (next: PerformanceTier) => {
    setTier(next);
    window.localStorage.setItem('tm-performance', next);
  };

  const toggleMotion = () => {
    const next = !motion;
    setMotion(next);
    window.localStorage.setItem('tm-motion', next ? 'full' : 'reduced');
  };

  const ready = modelReady && displayProgress >= 100;

  return (
    <main
      ref={shellRef}
      onPointerMove={handlePointer}
      className={`portfolio-shell tier-${tier} ${motion ? 'motion-full' : 'motion-reduced'} ${entered ? 'has-entered' : 'is-loading'}`}
    >
      <a className="skip-link" href="#content">Skip to content</a>

      <div className="home-layer">
        <div className="ambient-red" aria-hidden="true" />
        <div className="base-grid" aria-hidden="true" />
        <div className="pointer-field" aria-hidden="true" />
        <div className="pointer-reticle" aria-hidden="true"><i /><i /></div>
        <div className="frame-corners" aria-hidden="true"><i /><i /><i /><i /></div>
        <div className="grain" aria-hidden="true" />

        <header className="identity-block">
          <strong>Tayab&apos;s Portfolio</strong>
          <span>Build / 2026</span>
        </header>

        <div className="status-stream" aria-label="Portfolio system status">
          <span><b>[ ROLE ]</b> FRONTEND DEVELOPER</span>
          <span><b>[ MODE ]</b> CREATIVE ENGINEERING</span>
          <span><b>[ SYS ]</b> REACT / NEXT.JS</span>
          <span><b>[ STATUS ]</b> AVAILABLE</span>
        </div>

        <section id="content" className="hero-copy">
          <span className="hero-kicker"><i /> PORTFOLIO / INDEX_01</span>
          <h1 aria-label="Frontend Developer">
            <span data-text="FRONTEND">FRONTEND</span>
            <span data-text="DEVELOPER">DEVELOPER</span>
          </h1>
          <div className="info-log">
            <i aria-hidden="true" />
            <p><b>[ INFO_LOG ]</b>ENGINEERING RESPONSIVE INTERFACES<br />FOR PRODUCTS BUILT TO SCALE.</p>
          </div>
        </section>

        <section className="face-stage">
          <div className="portrait-aura" aria-hidden="true" />
          <div className="portrait-orbits" aria-hidden="true"><i /><i /><i /></div>
          <div className="portrait-axis" aria-hidden="true"><i /><i /></div>
          <Suspense fallback={<div className="face-scene face-fallback" aria-hidden="true" />}>
            <ParticlePortrait motion={motion} tier={tier} onProgress={handleSceneProgress} onReady={handleSceneReady} />
          </Suspense>
          <div className="face-scanline" aria-hidden="true" />
          <div className="portrait-lock" aria-hidden="true"><i /><span>IDENTITY LOCK</span><b>98.7%</b></div>
          <span className="face-coordinate coordinate-left">OBJ_01 // ACTIVE</span>
          <span className="face-coordinate coordinate-right">POINTER_REACTIVE</span>
        </section>

        <section className="developer-stats" aria-label="Developer statistics">
          <div className="stats-title"><span><i /> PROFILE STATUS</span><b>ACTIVE</b></div>
          <div className="stat-row"><span>PROJECTS</span><strong>{String(projects.length).padStart(2, '0')}</strong><i><em style={{ '--value': '92%' } as CSSProperties} /></i></div>
          <div className="stat-row"><span>PRIMARY FOCUS</span><strong>FE</strong><i><em style={{ '--value': '84%' } as CSSProperties} /></i></div>
          <p>&gt; ACTIVE_STACK: REACT_NEXT_TYPESCRIPT<br />&gt; INTERFACE_MODE: RESPONSIVE<br />&gt; PRODUCT_RANGE: SAAS_COMMERCE_SOCIAL<br />&gt; RENDER_TIER: [{tier.toUpperCase()}]</p>
        </section>

        <footer className="shell-footer">
          <a href="/Tayab-Malik.pdf" target="_blank" rel="noreferrer"><span>View my profile</span><strong>Resume / Open ↗</strong></a>
          <div><span>Local Time</span><strong>Pakistan / PKT&nbsp; {time}</strong></div>
        </footer>

        <button className="settings-trigger" onClick={() => setPanel(panel === 'settings' ? null : 'settings')} aria-expanded={panel === 'settings'} aria-label="Open system configuration"><GearIcon /></button>

        <aside className={`control-panel menu-panel ${panel === 'menu' ? 'is-open' : ''}`} aria-hidden={panel !== 'menu'}>
          <div className="panel-head"><div><h2>Menu</h2><span>NAVIGATION</span></div><b>DIR</b></div>
          <div className="social-links"><span>LINKEDIN</span><span>GITHUB</span><a href="/Tayab-Malik.pdf" target="_blank" rel="noreferrer">RESUME <b>↗</b></a></div>
          <a className="lab-row" href="https://syntaxguild.vercel.app/" target="_blank" rel="noreferrer"><span>DEV LAB</span><strong>SYNTAX GUILD</strong><b>↗</b></a>
          <nav aria-label="Primary navigation">
            <a href="/contact"><small>[04]</small><strong>CONTACT</strong><i>+</i></a>
            <a href="/projects"><small>[03]</small><strong>PROJECTS</strong><i>+</i></a>
            <a href="/about"><small>[02]</small><strong>ABOUT</strong><i>+</i></a>
          </nav>
        </aside>

        <aside className={`control-panel settings-panel ${panel === 'settings' ? 'is-open' : ''}`} aria-hidden={panel !== 'settings'}>
          <div className="panel-head"><div><h2>System</h2><span>GLOBAL CONFIG</span></div><b>SET</b></div>
          <section><header><span>[01] MOTION SYSTEM</span><small>{motion ? 'FULL' : 'REDUCED'}</small></header><button className="wide-setting" onClick={toggleMotion}><strong>{motion ? 'Full motion' : 'Reduced motion'}</strong><span>{motion ? 'POINTER / CORE / HOVERS' : 'ESSENTIAL STATE ONLY'}</span></button></section>
          <section><header><span>[02] PERFORMANCE TIER</span><small>SYS</small></header><div className="tier-buttons">{(['high', 'balanced', 'saver'] as PerformanceTier[]).map((option) => <button className={tier === option ? 'active' : ''} onClick={() => chooseTier(option)} key={option}>{option}</button>)}</div></section>
          <p className="system-active"><i /> SYSTEM ACTIVE</p>
        </aside>

        <div className="nav-dock">
          <span className="wave" aria-hidden="true"><i /><i /><i /><i /><i /></span>
          <button onClick={() => setPanel(panel === 'menu' ? null : 'menu')} aria-expanded={panel === 'menu'} aria-label="Toggle menu">
            <small>[01]</small><strong>HOME</strong><b><MenuGlyph open={panel === 'menu'} /></b>
          </button>
        </div>
      </div>

      {!entered && <Loader progress={displayProgress} ready={ready} leaving={leaving} onEnter={enterPortfolio} />}
    </main>
  );
}
