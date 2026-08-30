'use client';

import { useCallback, useEffect, useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent } from 'react';
import dynamic from 'next/dynamic';
import { IdentityMark } from '../src/components/IdentityMark';
import { SharedFooterContent } from '../src/components/SharedFooterContent';
import { ScrambleText, SiteControls, type ControlPanel } from '../src/components/SiteControls';
import { useSiteExperience } from '../src/components/SiteExperienceProvider';
import { projects } from '../src/content/projects';
import type { PerformanceTier } from '../src/lib/sitePreferences';

const ParticlePortrait = dynamic(
  () => import('../src/components/ParticlePortrait').then((module) => module.ParticlePortrait),
  { ssr: false, loading: () => <div className="face-scene face-fallback" aria-hidden="true" /> },
);

const homeStatusItems = [
  ['[ ROLE ]', 'FRONTEND DEVELOPER'],
  ['[ MODE ]', 'CREATIVE ENGINEERING'],
  ['[ SYS ]', 'REACT / NEXT.JS'],
  ['[ STATUS ]', 'AVAILABLE'],
] as const;

const loaderExitDuration = 1320;

function Loader({ progress, ready, leaving, audioEnabled, tier, onToggleAudio, onTierChange, onEnter }: { progress: number; ready: boolean; leaving: boolean; audioEnabled: boolean; tier: PerformanceTier; onToggleAudio: () => void; onTierChange: (tier: PerformanceTier) => void; onEnter: () => void }) {
  const loadPercent = Math.min(100, Math.round(progress));
  return (
    <section className={`loader-screen ${ready ? 'is-ready' : ''} ${leaving ? 'is-leaving' : ''}`} aria-label="Portfolio introduction" aria-live="polite">
      <div className="loader-collapse-field">
        <div className="loader-grid" aria-hidden="true"><i /><i /><i /><i /></div>
        <div className="loader-grid-labels" aria-hidden="true">
          <span>GRID_L1_R1</span><span>GRID_L2_R1</span><span>GRID_RIGHT_SIMPLE</span>
          <span>GRID_L1_R2</span><span>GRID_L2_MASTER</span><span>GRID_L1_R3</span><span>GRID_L2_R4</span>
        </div>
        <div className="loader-counter">{String(loadPercent).padStart(2, '0')}%</div>
        <div className="loader-performance"><span>PERFORMANCE TIER</span>{(['high', 'balanced', 'saver'] as PerformanceTier[]).map((option) => <button className={tier === option ? 'active' : ''} onClick={() => onTierChange(option)} aria-pressed={tier === option} key={option}>{option === 'balanced' ? 'MED' : option.toUpperCase()}</button>)}</div>
        <button className={`loader-music ${audioEnabled ? 'is-on' : 'is-off'}`} onClick={onToggleAudio} aria-pressed={audioEnabled} aria-label={`Turn background music ${audioEnabled ? 'off' : 'on'}`}>
          <span>On</span><b>MUSIC</b><span>Off</span>
        </button>
        <div className={`loader-track ${ready ? 'is-ready' : ''}`} style={{ '--load': `${Math.min(100, progress) / 100}` } as CSSProperties}>
          <span />
          <b aria-label={ready ? 'Loaded' : 'Loading'}>
            <span aria-hidden="true">LOADING</span>
            <span aria-hidden="true">LOADED</span>
          </b>
        </div>
        <div className="loader-system"><i className={ready ? 'ready' : ''} /><span>{ready ? 'SYSTEM_READY' : 'INITIALIZING_ENGINE'}</span><em>{loadPercent}%</em></div>
      </div>
      <div className="loader-singularity" aria-hidden="true"><i /></div>
      <button className="loader-enter" disabled={!ready} onClick={onEnter}>
        <strong className="loader-enter-click">{ready ? 'CLICK' : 'WAIT'}</strong>
        <i className="loader-enter-divider" aria-hidden="true" />
        <span className="loader-enter-action">{ready ? 'TO ENTER' : 'INITIALIZING'}</span>
      </button>
    </section>
  );
}

export default function Home() {
  const shellRef = useRef<HTMLElement>(null);
  const loadStartRef = useRef(0);
  const displayProgressRef = useRef(0);
  const { theme, audioEnabled, toggleAudio, motion, tier, setTier } = useSiteExperience();
  const [panel, setPanel] = useState<ControlPanel>(null);
  const [time, setTime] = useState('--:--:--');
  const [assetProgress, setAssetProgress] = useState(0);
  const [displayProgress, setDisplayProgress] = useState(0);
  const [modelReady, setModelReady] = useState(false);
  const [sceneFallbackReady, setSceneFallbackReady] = useState(false);
  const [entered, setEntered] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [roleRun, setRoleRun] = useState(0);

  useEffect(() => {
    loadStartRef.current = performance.now();
    displayProgressRef.current = 0;
    const sceneFallback = window.setTimeout(() => setSceneFallbackReady(true), 4500);

    const update = () => setTime(new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Asia/Karachi', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false,
    }).format(new Date()));
    update();
    const timer = window.setInterval(update, 1000);
    return () => {
      window.clearInterval(timer);
      window.clearTimeout(sceneFallback);
    };
  }, []);

  useEffect(() => {
    let frame = 0;
    let previousFrame = performance.now();
    const tick = (now: number) => {
      const delta = Math.min(now - previousFrame, 64);
      previousFrame = now;
      const elapsed = now - loadStartRef.current;
      const revealCurve = Math.min(99, 100 * (1 - Math.exp(-elapsed / 520)));
      const sceneCanEnter = modelReady || sceneFallbackReady;
      const available = sceneCanEnter ? 99 : Math.min(assetProgress, 99);
      let target = Math.min(revealCurve, available);

      if (sceneCanEnter && elapsed >= 1650) {
        target = 100;
      }

      const current = displayProgressRef.current;
      const next = target > current
        ? Math.min(target, current + delta * .075)
        : target;
      displayProgressRef.current = next;
      setDisplayProgress(next);
      if (next < 100) frame = window.requestAnimationFrame(tick);
    };
    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, [assetProgress, modelReady, sceneFallbackReady]);

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setPanel(null);
      if (event.key === 'Enter' && displayProgress >= 100 && !entered && !leaving) {
        setLeaving(true);
        window.setTimeout(() => setEntered(true), motion ? loaderExitDuration : 0);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [displayProgress, entered, leaving, motion]);

  const handleSceneProgress = useCallback((progress: number) => setAssetProgress(progress), []);
  const handleSceneReady = useCallback(() => setModelReady(true), []);

  const enterPortfolio = () => {
    if (displayProgress < 100 || leaving) return;
    setLeaving(true);
    window.setTimeout(() => setEntered(true), motion ? loaderExitDuration : 0);
  };

  const handlePointer = (event: ReactPointerEvent<HTMLElement>) => {
    const shell = shellRef.current;
    if (!shell) return;
    shell.style.setProperty('--pointer-x', `${event.clientX}px`);
    shell.style.setProperty('--pointer-y', `${event.clientY}px`);
    shell.style.setProperty('--portrait-shift-x', `${(event.clientX / window.innerWidth - 0.5) * 7}px`);
    shell.style.setProperty('--portrait-shift-y', `${(event.clientY / window.innerHeight - 0.5) * 5}px`);
  };

  const ready = (modelReady || sceneFallbackReady) && displayProgress >= 100;

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
          <IdentityMark motion={motion} />
        </header>

        <div className="status-stream" aria-label="Portfolio system status">
          <div className="status-stream-track">
            {[false, true].map((duplicate) => (
              <div className="status-stream-group" aria-hidden={duplicate || undefined} key={String(duplicate)}>
                {homeStatusItems.map(([label, value]) => <span key={label}><b>{label}</b> {value}</span>)}
              </div>
            ))}
          </div>
        </div>

        <section id="content" className="hero-copy">
          <span className="hero-kicker"><i /> PORTFOLIO / INDEX_01</span>
          <h1
            aria-label="Frontend Developer"
            tabIndex={0}
            onPointerEnter={() => motion && setRoleRun((value) => value + 1)}
            onFocus={() => motion && setRoleRun((value) => value + 1)}
          >
            <span className="hero-role-line"><ScrambleText text="FRONTEND" run={roleRun} enabled={motion && roleRun > 0} /></span>
            <span className="hero-role-line"><ScrambleText text="DEVELOPER" run={roleRun} enabled={motion && roleRun > 0} delay={75} /></span>
          </h1>
          <div className="info-log">
            <i aria-hidden="true" />
            <p><b>[ INFO_LOG ]</b>ENGINEERING RESPONSIVE INTERFACES<br />FOR PRODUCTS BUILT TO SCALE.</p>
          </div>
        </section>

        <section className="face-stage">
          <div className="portrait-aura" aria-hidden="true" />
          <ParticlePortrait theme={theme} motion={motion} tier={tier} onProgress={handleSceneProgress} onReady={handleSceneReady} />
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
          <SharedFooterContent time={time} motion={motion} />
        </footer>

        <SiteControls currentPage="home" panel={panel} onPanelChange={setPanel} />
      </div>

      {!entered && <Loader progress={displayProgress} ready={ready} leaving={leaving} audioEnabled={audioEnabled} tier={tier} onToggleAudio={toggleAudio} onTierChange={setTier} onEnter={enterPortfolio} />}
    </main>
  );
}
