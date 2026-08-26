'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent, type UIEvent } from 'react';

const skillGroups = [
  { sector: 'Sector_01', title: 'Core & Frameworks', skills: ['JavaScript', 'TypeScript', 'React', 'Next.js', 'Tailwind CSS'] },
  { sector: 'Sector_02', title: 'Interface Engineering', skills: ['Responsive UI', 'Frontend Architecture', 'GSAP', 'ShadCN UI', 'Radix UI'] },
  { sector: 'Sector_03', title: 'State & Data', skills: ['Redux Toolkit', 'TanStack Query', 'Axios', 'React Hook Form', 'Recharts'] },
  { sector: 'Sector_04', title: 'Backend & Systems', skills: ['Node.js', 'Express', 'PostgreSQL', 'Supabase', 'Prisma', 'REST APIs'] },
  { sector: 'Sector_05', title: 'Tooling & Delivery', skills: ['Git', 'Docker', 'API Integration', 'Production UI'] },
];

function GearIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 8.2a3.8 3.8 0 1 0 0 7.6 3.8 3.8 0 0 0 0-7.6Zm8.3 5.2v-2.8l-2.2-.6a7.4 7.4 0 0 0-.7-1.6l1.1-2-2-2-2 1.1a7.4 7.4 0 0 0-1.6-.7L12.3 2H9.5l-.6 2.2a7.4 7.4 0 0 0-1.6.7l-2-1.1-2 2 1.1 2a7.4 7.4 0 0 0-.7 1.6l-2.2.6v2.8l2.2.6c.2.6.4 1.1.7 1.6l-1.1 2 2 2 2-1.1c.5.3 1 .5 1.6.7l.6 2.2h2.8l.6-2.2c.6-.2 1.1-.4 1.6-.7l2 1.1 2-2-1.1-2c.3-.5.5-1 .7-1.6l2.2-.6Z" /></svg>;
}

function MenuGlyph({ open }: { open: boolean }) {
  return <span className={`menu-glyph ${open ? 'is-open' : ''}`} aria-hidden="true"><i /><i /><i /></span>;
}

export default function AboutPage() {
  const shellRef = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [motion, setMotion] = useState(true);
  const [tier, setTier] = useState<'high' | 'medium' | 'saver'>('high');
  const [scroll, setScroll] = useState(0);
  const [time, setTime] = useState('--:--');

  useEffect(() => {
    const updateTime = () => setTime(new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Asia/Karachi', hour: '2-digit', minute: '2-digit', hour12: false,
    }).format(new Date()));
    updateTime();
    const timer = window.setInterval(updateTime, 30_000);
    return () => window.clearInterval(timer);
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

  const toggleSettings = () => {
    setSettingsOpen((open) => !open);
    setMenuOpen(false);
  };

  const toggleMenu = () => {
    setMenuOpen((open) => !open);
    setSettingsOpen(false);
  };

  return (
    <div ref={shellRef} className={`about-shell ${motion ? 'motion-full' : 'motion-reduced'} tier-${tier}`} onPointerMove={handlePointer}>
      <div className="about-grid" aria-hidden="true" />
      <div className="about-pointer-field" aria-hidden="true" />
      <div className="about-scan-lines" aria-hidden="true" />
      <div className="about-top-fade" aria-hidden="true" />
      <div className="about-bottom-fade" aria-hidden="true" />

      <header className="about-header">
        <Link href="/" aria-label="Tayab Malik - Home"><strong>Tayab Malik</strong><span>Portfolio / 2026</span></Link>
        <div className="about-breadcrumb"><Link href="/">HOME</Link><i>/</i><b>[02] ABOUT</b></div>
      </header>

      <aside className="about-portrait-stack" aria-label="Particle portrait of Tayab Malik">
        <div className="about-portrait-meta"><span>IDENTITY_CAPTURE</span><b>TM_02</b></div>
        {[0, 1, 2].map((frame) => (
          <div className={`about-portrait-frame frame-${frame + 1}`} key={frame}>
            <Image src="/portrait/tayab-particle-map-v2.webp" alt="" width={680} height={816} priority={frame === 0} />
            <i aria-hidden="true" />
          </div>
        ))}
        <div className="about-portrait-readout"><span>SUBJECT</span><b>TAYAB_MALIK</b><span>STATUS</span><b>ACTIVE</b></div>
      </aside>

      <div className="about-scroll" onScroll={handleScroll}>
        <main className="about-content">
          <section className="about-intro about-block">
            <span className="about-section-id">[ PROFILE / 02 ]</span>
            <h1>Meet Tayab</h1>
            <p className="about-lede">A frontend developer</p>
            <h2>engineering polished web experiences</h2>
            <p>with a focus on functional, responsive, and visually refined interfaces. His work blends careful frontend architecture with motion, accessibility, and product thinking—turning ideas into experiences that feel clear, fast, and intentional.</p>
          </section>

          <section className="about-block about-focus">
            <span className="about-section-id">[ CORE_DIRECTION ]</span>
            <p className="about-lede">Focused on</p>
            <h2>modern product interfaces</h2>
            <p>he works across React, Next.js, TypeScript, state management, API integration, and full-stack foundations. The goal is always the same: build responsive products that are technically reliable and genuinely enjoyable to use.</p>
          </section>

          <section className="about-stack about-block" aria-labelledby="stack-title">
            <span className="about-section-id">[ CAPABILITY_INDEX ]</span>
            <p className="about-lede">A practical stack for</p>
            <h2 id="stack-title">product-focused development</h2>
            <div className="about-tech-stack">
              {skillGroups.map((group, groupIndex) => (
                <article className="about-tech-category" key={group.sector}>
                  <header><span>{group.sector}</span><h3>{group.title}</h3></header>
                  <ul>
                    {group.skills.map((skill, skillIndex) => {
                      const index = groupIndex * 8 + skillIndex;
                      return <li key={skill}><small>0x{index.toString(16).padStart(2, '0')}</small><span>{skill}</span></li>;
                    })}
                  </ul>
                </article>
              ))}
            </div>
          </section>

          <section className="about-block about-experience">
            <span className="about-section-id">[ EXPERIENCE_LOG ]</span>
            <p className="about-lede">Professional foundation</p>
            <h2>learning by building</h2>
            <div className="experience-record">
              <span>ROLE_01</span><strong>Frontend Developer Intern</strong><i>SoftAccess</i><b>Interface Engineering</b>
            </div>
            <p>His project work spans agency websites, commerce experiences, social products, scheduling platforms, and SaaS-style interfaces—each one sharpening the balance between visual craft and maintainable code.</p>
          </section>

          <section className="about-block about-cta">
            <span className="about-section-id">[ NEXT_ACTION ]</span>
            <p className="about-lede">Have a product concept?</p>
            <h2>let&apos;s turn it into reality</h2>
            <p>Bring the idea. Tayab will bring frontend engineering, thoughtful interaction, and the persistence required to ship it properly.</p>
            <div className="about-cta-row"><Link href="/contact">Contact</Link><a href="/Tayab-Malik.pdf" target="_blank" rel="noreferrer">Open Resume ↗</a></div>
          </section>
        </main>
      </div>

      <footer className="about-footer"><div><span>Wanna work together?</span><strong>Open to frontend opportunities</strong></div><div><span>Local Time</span><strong>Pakistan / PKT&nbsp; {time}</strong></div></footer>

      <div className="about-scroll-progress" aria-hidden="true"><span>{String(Math.round(scroll * 100)).padStart(2, '0')}%</span><i><b style={{ transform: `translateX(${scroll * 100}%)` }} /></i><span>100%</span></div>

      <button className="settings-trigger about-settings-trigger" onClick={toggleSettings} aria-expanded={settingsOpen} aria-label="Open system configuration"><GearIcon /></button>

      <aside className={`control-panel about-menu-panel ${menuOpen ? 'is-open' : ''}`} aria-hidden={!menuOpen}>
        <div className="panel-head"><div><h2>Menu</h2><span>NAVIGATION</span></div><b>DIR</b></div>
        <div className="social-links"><span>LINKEDIN</span><span>GITHUB</span><a href="/Tayab-Malik.pdf" target="_blank" rel="noreferrer">RESUME <b>↗</b></a></div>
        <a className="lab-row" href="https://syntaxguild.vercel.app/" target="_blank" rel="noreferrer"><span>DEV LAB</span><strong>SYNTAX GUILD</strong><b>↗</b></a>
        <nav aria-label="Primary navigation"><Link href="/contact"><small>[04]</small><strong>CONTACT</strong><i>+</i></Link><Link href="/projects"><small>[03]</small><strong>PROJECTS</strong><i>+</i></Link><Link href="/"><small>[01]</small><strong>HOME</strong><i>+</i></Link></nav>
      </aside>

      <aside className={`control-panel settings-panel about-settings-panel ${settingsOpen ? 'is-open' : ''}`} aria-hidden={!settingsOpen}>
        <div className="panel-head"><div><h2>System</h2><span>GLOBAL CONFIG</span></div><b>SET</b></div>
        <section><header><span>[01] MOTION SYSTEM</span><small>{motion ? 'FULL' : 'REDUCED'}</small></header><button className="wide-setting" onClick={() => setMotion((value) => !value)}><strong>{motion ? 'Full motion' : 'Reduced motion'}</strong><span>{motion ? 'POINTER / SCROLL / HOVERS' : 'ESSENTIAL STATE ONLY'}</span></button></section>
        <section><header><span>[02] PERFORMANCE TIER</span><small>SYS</small></header><div className="tier-buttons">{(['high', 'medium', 'saver'] as const).map((option) => <button className={tier === option ? 'active' : ''} onClick={() => setTier(option)} key={option}>{option}</button>)}</div></section>
        <p className="system-active"><i /> SYSTEM ACTIVE</p>
      </aside>

      <div className="nav-dock about-nav-dock"><span className="wave" aria-hidden="true"><i /><i /><i /><i /><i /></span><button onClick={toggleMenu} aria-expanded={menuOpen} aria-label="Toggle menu"><small>[02]</small><strong>ABOUT</strong><b><MenuGlyph open={menuOpen} /></b></button></div>
    </div>
  );
}
