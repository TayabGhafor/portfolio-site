'use client';

import { lazy, Suspense, useCallback, useEffect, useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent } from 'react';
import { SiteControls, type ControlPanel, type PerformanceTier } from '../src/components/SiteControls';
import { projects } from '../src/content/projects';

const ParticlePortrait = lazy(() => import('../src/components/ParticlePortrait').then((module) => ({ default: module.ParticlePortrait })));

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
  const [panel, setPanel] = useState<ControlPanel>(null);
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
          <Suspense fallback={<div className="face-scene face-fallback" aria-hidden="true" />}>
            <ParticlePortrait motion={motion} tier={tier} onProgress={handleSceneProgress} onReady={handleSceneReady} />
          </Suspense>
          <div className="face-scanline" aria-hidden="true" />
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

        <SiteControls currentPage="home" panel={panel} motion={motion} tier={tier} onPanelChange={setPanel} onToggleMotion={toggleMotion} onTierChange={chooseTier} />
      </div>

      {!entered && <Loader progress={displayProgress} ready={ready} leaving={leaving} onEnter={enterPortfolio} />}
    </main>
  );
}
