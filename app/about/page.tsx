'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent, type UIEvent } from 'react';
import { SiteControls, type ControlPanel, type PerformanceTier } from '../../src/components/SiteControls';

const skillGroups = [
  { sector: 'Sector_01', title: 'Core & Frameworks', skills: ['JavaScript', 'TypeScript', 'React', 'Next.js', 'Tailwind CSS'] },
  { sector: 'Sector_02', title: 'Interface Engineering', skills: ['Responsive UI', 'Frontend Architecture', 'GSAP', 'ShadCN UI', 'Radix UI'] },
  { sector: 'Sector_03', title: 'State & Data', skills: ['Redux Toolkit', 'TanStack Query', 'Axios', 'React Hook Form', 'Recharts'] },
  { sector: 'Sector_04', title: 'Backend & Systems', skills: ['Node.js', 'Express', 'PostgreSQL', 'Supabase', 'Prisma', 'REST APIs'] },
  { sector: 'Sector_05', title: 'Tooling & Delivery', skills: ['Git', 'Docker', 'API Integration', 'Production UI'] },
];

export default function AboutPage() {
  const shellRef = useRef<HTMLDivElement>(null);
  const [panel, setPanel] = useState<ControlPanel>(null);
  const [motion, setMotion] = useState(true);
  const [tier, setTier] = useState<PerformanceTier>('high');
  const [scroll, setScroll] = useState(0);
  const [time, setTime] = useState('--:--');

  useEffect(() => {
    const storedTier = window.localStorage.getItem('tm-performance') as PerformanceTier | null;
    const storedMotion = window.localStorage.getItem('tm-motion');
    window.queueMicrotask(() => {
      if (storedTier) setTier(storedTier);
      if (storedMotion === 'reduced' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) setMotion(false);
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

      <SiteControls currentPage="about" panel={panel} motion={motion} tier={tier} onPanelChange={setPanel} onToggleMotion={toggleMotion} onTierChange={chooseTier} />
    </div>
  );
}
