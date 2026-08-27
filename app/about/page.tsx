'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { ArrowUpRightIcon, BracketsCurlyIcon, ChartLineUpIcon, CodeIcon, DatabaseIcon, GaugeIcon, GitBranchIcon, InfinityIcon, LightningIcon, SquaresFourIcon, StackIcon, UserFocusIcon } from '@phosphor-icons/react';
import { InteriorChrome } from '../../src/components/InteriorChrome';
import { ScrambleText } from '../../src/components/SiteControls';

type Icon = typeof CodeIcon;

const capabilities: Array<{ index: string; title: string; body: string; icon: Icon }> = [
  { index: '01', title: 'Frontend development', body: 'Reusable React and Next.js interfaces that stay clear, responsive, and maintainable.', icon: CodeIcon },
  { index: '02', title: 'UI / UX engineering', body: 'Interaction systems that turn product intent into useful, confident user flows.', icon: SquaresFourIcon },
  { index: '03', title: 'Product focused', body: 'A practical bridge between visual direction, technical constraints, and shipping.', icon: UserFocusIcon },
  { index: '04', title: 'Performance driven', body: 'Fast-loading surfaces with deliberate motion, accessible structure, and resilient states.', icon: GaugeIcon },
];

const principles: Array<{ label: string; icon: Icon }> = [
  { label: 'CLEAN CODE', icon: BracketsCurlyIcon },
  { label: 'ACCESSIBILITY', icon: UserFocusIcon },
  { label: 'PERFORMANCE', icon: LightningIcon },
  { label: 'PRODUCT THINKING', icon: ChartLineUpIcon },
];

const skillSectors = [
  { id: '01', title: 'Core & Frameworks', illustration: '/about-page-illustrations/skills/Core-frameworks-transparent.png', icon: StackIcon, skills: [['JavaScript', 'The language layer behind expressive browser experiences.'], ['TypeScript', 'Safer interfaces through explicit, scalable contracts.'], ['React', 'Component architecture for interactive product surfaces.'], ['Next.js', 'Production-minded routing, rendering, and delivery.'], ['Tailwind CSS', 'Composable styling for fast, consistent iteration.']] },
  { id: '02', title: 'Interface Engineering', illustration: '/about-page-illustrations/skills/interface-engineering-transparent.png', icon: SquaresFourIcon, skills: [['Responsive UI', 'Layouts that remain intentional from phone to desktop.'], ['Frontend Architecture', 'Systems that keep complex interfaces understandable.'], ['GSAP', 'Narrative motion used with restraint and purpose.'], ['ShadCN UI', 'Flexible primitives for polished product workflows.'], ['Radix UI', 'Accessible behavior underneath custom visual systems.']] },
  { id: '03', title: 'State & Data', illustration: '/about-page-illustrations/skills/states-Data-transparent.png', icon: DatabaseIcon, skills: [['Redux Toolkit', 'Predictable shared state for growing product flows.'], ['TanStack Query', 'Reliable server-state fetching and synchronization.'], ['Axios', 'Clear request layers between interfaces and APIs.'], ['React Hook Form', 'Performant, focused form experiences.'], ['Recharts', 'Data made legible through purposeful visual summaries.']] },
  { id: '04', title: 'Backend & Systems', illustration: '/about-page-illustrations/skills/Backend-transparent.png', icon: InfinityIcon, skills: [['Node.js', 'JavaScript runtime foundations for full-stack work.'], ['Express', 'Focused routing and service composition.'], ['PostgreSQL', 'Structured data foundations for dependable products.'], ['Supabase', 'Practical hosted primitives for shipping quickly.'], ['Prisma', 'Typed database access that keeps models coherent.'], ['REST APIs', 'Stable contracts between product surfaces and services.']] },
  { id: '05', title: 'Tooling & Delivery', illustration: '/about-page-illustrations/skills/tools-transparent.png', icon: GitBranchIcon, skills: [['Git', 'A clear history for collaborative, reversible delivery.'], ['Docker', 'Repeatable environments from local work to production.'], ['API Integration', 'Connecting real workflows without hiding failure states.'], ['Production UI', 'The last mile where polish meets reliability.']] },
] as const;

function Reveal({ children, className = '' }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const node = ref.current;
    if (!node || typeof IntersectionObserver === 'undefined') { setVisible(true); return; }
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } }, { root: node.closest('.about-scroll'), threshold: 0.16 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  return <div ref={ref} className={`about-reveal ${visible ? 'is-visible' : ''} ${className}`}>{children}</div>;
}

function FloatingVisual({ src, alt, className = '', priority = false }: { src: string; alt: string; className?: string; priority?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const node = ref.current;
    if (!node || !window.matchMedia('(pointer: fine)').matches || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let targetX = 0; let targetY = 0; let currentX = 0; let currentY = 0; let frame = 0;
    const handleMove = (event: PointerEvent) => {
      const rect = node.getBoundingClientRect();
      targetX = Math.max(-1, Math.min(1, (event.clientX - rect.left) / rect.width * 2 - 1));
      targetY = Math.max(-1, Math.min(1, (event.clientY - rect.top) / rect.height * 2 - 1));
    };
    const handleLeave = () => { targetX = 0; targetY = 0; };
    const tick = () => {
      currentX += (targetX - currentX) * 0.055; currentY += (targetY - currentY) * 0.055;
      node.style.setProperty('--visual-x', `${currentX * 8}px`); node.style.setProperty('--visual-y', `${currentY * 6}px`);
      node.style.setProperty('--visual-rx', `${currentY * -1.5}deg`); node.style.setProperty('--visual-ry', `${currentX * 2}deg`);
      frame = window.requestAnimationFrame(tick);
    };
    node.addEventListener('pointermove', handleMove, { passive: true }); node.addEventListener('pointerleave', handleLeave); frame = window.requestAnimationFrame(tick);
    return () => { window.cancelAnimationFrame(frame); node.removeEventListener('pointermove', handleMove); node.removeEventListener('pointerleave', handleLeave); };
  }, []);
  return <div ref={ref} className={`about-visual ${className}`}><span className="about-visual-grid" aria-hidden="true" /><span className="about-visual-scan" aria-hidden="true" /><Image src={src} alt={alt} fill sizes="(max-width: 760px) 92vw, 52vw" priority={priority} /></div>;
}

function RevealHeading({ text, run }: { text: string; run: number }) {
  const [hoverRun, setHoverRun] = useState(0);
  const nextRun = Math.max(run, hoverRun);
  return <span className="about-scramble-line" onPointerEnter={() => setHoverRun((value) => Math.max(value, run) + 1)} onFocus={() => setHoverRun((value) => Math.max(value, run) + 1)} tabIndex={0}><ScrambleText text={text} run={nextRun} enabled={nextRun > 0} delay={nextRun === 1 ? 90 : 0} /></span>;
}

function AboutPortraitRail() {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const node = ref.current;
    if (!node || !window.matchMedia('(pointer: fine)').matches || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const move = (event: PointerEvent) => {
      const rect = node.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width - .5) * 2;
      const y = ((event.clientY - rect.top) / rect.height - .5) * 2;
      node.style.setProperty('--portrait-x', `${x * 9}px`);
      node.style.setProperty('--portrait-y', `${y * 7}px`);
    };
    const reset = () => { node.style.setProperty('--portrait-x', '0px'); node.style.setProperty('--portrait-y', '0px'); };
    node.addEventListener('pointermove', move, { passive: true });
    node.addEventListener('pointerleave', reset);
    return () => { node.removeEventListener('pointermove', move); node.removeEventListener('pointerleave', reset); };
  }, []);
  return <aside ref={ref} className="about-portrait-rail" aria-label="Tayab Malik particle portrait">
    <div className="about-portrait-art"><Image src="/portrait/tayab-about-particle-v2-transparent.png" alt="Particle portrait of Tayab Malik" fill priority sizes="(max-width: 760px) 220px, 400px" /></div>
    <div className="about-portrait-readout"><span>[ PROFILE_SIGNAL ]</span><b>TM_02</b><small>SUBJECT / TAYAB_MALIK</small><small>STATUS / ACTIVE</small></div>
  </aside>;
}

function SkillItem({ name, description, index, active, onActive }: { name: string; description: string; index: string; active: boolean; onActive: () => void }) {
  const [run, setRun] = useState(0);
  const activate = () => { onActive(); setRun((value) => value + 1); };
  return <button className={`skill-item ${active ? 'is-active' : ''}`} type="button" onPointerEnter={activate} onFocus={activate} onClick={activate} aria-pressed={active} title={description}><small>{index}</small><strong><ScrambleText text={name} run={run} enabled={run > 0} /></strong><i aria-hidden="true"><ArrowUpRightIcon size={14} weight="light" /></i></button>;
}

function SkillSector({ sector, open, onToggle }: { sector: (typeof skillSectors)[number]; open: boolean; onToggle: () => void }) {
  const [activeSkill, setActiveSkill] = useState<string>(sector.skills[0][0]);
  const ActiveIcon = sector.icon;
  const activeDescription = sector.skills.find(([name]) => name === activeSkill)?.[1];
  return <article className={`skill-sector ${open ? 'is-open' : ''}`}>
    <button className="sector-toggle" type="button" onClick={onToggle} aria-expanded={open}>
      <span className="sector-visual-wrap"><Image src={sector.illustration} alt="" fill sizes="(max-width: 760px) 72px, 190px" /><span className="sector-visual-sheen" aria-hidden="true" /></span>
      <span className="sector-heading"><small>SECTOR_{sector.id}</small><strong>{sector.title}</strong></span><span className="sector-icon"><ActiveIcon size={22} weight="light" /></span><span className="sector-plus" aria-hidden="true" />
    </button>
    <div className="sector-body"><div className="sector-skills">{sector.skills.map(([name, description], index) => <SkillItem key={name} name={name} description={description} index={`0x${(Number(sector.id) * 5 + index).toString(16).padStart(2, '0')}`} active={activeSkill === name} onActive={() => setActiveSkill(name)} />)}</div><div className="sector-detail" aria-live="polite"><span>{activeSkill}</span><p>{activeDescription}</p></div></div>
  </article>;
}

export default function AboutPage() {
  const [heroRun, setHeroRun] = useState(0);
  const [openSector, setOpenSector] = useState('01');
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => { const timer = window.setTimeout(() => setHeroRun(1), 260); return () => window.clearTimeout(timer); }, []);
  useEffect(() => {
    const media = window.matchMedia('(max-width: 760px)');
    const update = () => setIsMobile(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  return <InteriorChrome currentPage="about" index="02" label="ABOUT" wide aside={<AboutPortraitRail />} footerNote="Open to frontend opportunities">
    <main className="about-content about-redesign">
      <Reveal className="about-hero-redesign">
        <div className="about-hero-copy"><span className="about-section-id">[ PROFILE / 02 ]</span><p className="about-eyebrow">A FRONTEND DEVELOPER</p><h1><RevealHeading text="MEET TAYAB" run={heroRun} /></h1><h2><RevealHeading text="ENGINEERING POLISHED" run={heroRun} /><br /><RevealHeading text="WEB EXPERIENCES" run={heroRun} /></h2><p className="about-body-copy">I craft functional, responsive, and visually refined interfaces. My work combines frontend architecture, thoughtful interaction, accessibility, performance, and product thinking.</p><div className="about-meta-grid"><div><small>LOCATION</small><strong>Pakistan / PKT</strong></div><div><small>EXPERIENCE</small><strong>Frontend Developer Intern <em>SoftAccess</em></strong></div><div><small>AVAILABILITY</small><strong>Open for opportunities</strong></div></div><div className="about-principles" aria-label="Frontend principles">{principles.map(({ label, icon: PrincipleIcon }) => <span key={label}><i><PrincipleIcon size={15} weight="light" /></i><b>{label}</b></span>)}</div></div>
      </Reveal>

      <Reveal className="about-feature-panel core-direction-panel"><FloatingVisual src="/about-page-illustrations/modren-product-interface-transparent.png" alt="Transparent glass cube representing product architecture" className="core-direction-art" /><div className="feature-copy"><span className="about-section-id">[ CORE_DIRECTION ]</span><p className="about-eyebrow">FOCUSED ON</p><h2><RevealHeading text="MODERN PRODUCT" run={heroRun} /><br /><RevealHeading text="INTERFACES" run={heroRun} /></h2><p className="about-body-copy">I work across React, Next.js, TypeScript, state management, API integration, and full-stack foundations. The goal is always the same: create responsive products that are technically reliable and enjoyable to use.</p></div></Reveal>

      <Reveal className="about-block about-capabilities"><div className="about-section-heading"><div><span className="about-section-id">[ WHAT_I_DO ]</span><h2><RevealHeading text="WHAT I DO" run={heroRun} /></h2></div><p>Frontend engineering with a product point of view.</p></div><div className="capability-grid">{capabilities.map(({ index, title, body, icon: IconComponent }) => <article className="capability-card" key={index}><span className="capability-index">{index}</span><i><IconComponent size={24} weight="light" /></i><h3>{title}</h3><p>{body}</p><span className="capability-line" /></article>)}</div></Reveal>

      <Reveal className="about-block technical-arsenal"><div className="about-section-heading"><div><span className="about-section-id">[ CAPABILITY_INDEX ]</span><h2><RevealHeading text="TECHNICAL ARSENAL" run={heroRun} /></h2></div><p>Hover a capability to inspect the system.</p></div><div className="skill-sector-list">{skillSectors.map((sector) => <SkillSector key={sector.id} sector={sector} open={isMobile ? openSector === sector.id : true} onToggle={() => setOpenSector(openSector === sector.id ? '' : sector.id)} />)}</div></Reveal>

      <Reveal className="about-feature-panel experience-panel"><FloatingVisual src="/about-page-illustrations/learning-by-building-transparent.png" alt="Wireframe terrain representing learning through building" className="experience-art" /><div className="feature-copy"><span className="about-section-id">[ EXPERIENCE_LOG ]</span><p className="about-eyebrow">PROFESSIONAL FOUNDATION</p><h2><RevealHeading text="LEARNING BY BUILDING" run={heroRun} /></h2><div className="experience-record"><span>ROLE_01</span><strong>Frontend Developer Intern</strong><a href="https://softaccess.co.uk/" target="_blank" rel="noreferrer">SoftAccess <ArrowUpRightIcon size={14} /></a><small>Interface Engineering</small></div><p className="about-body-copy">My project work spans agency websites, commerce experiences, social products, scheduling platforms, and SaaS-style interfaces—each one sharpening the balance between visual craft and maintainable code.</p></div></Reveal>

      <Reveal className="about-feature-panel cta-panel"><FloatingVisual src="/about-page-illustrations/turn-into-reality-transparent.png" alt="Concentric orbital radar illustration" className="cta-art" /><div className="feature-copy"><span className="about-section-id">[ NEXT_ACTION ]</span><p className="about-eyebrow">HAVE A PRODUCT CONCEPT?</p><h2><RevealHeading text="LET'S TURN IT INTO" run={heroRun} /><br /><RevealHeading text="REALITY" run={heroRun} /></h2><p className="about-body-copy">Bring the idea. I&apos;ll bring frontend engineering, thoughtful interaction, and the persistence required to ship it properly.</p><div className="about-cta-row"><Link href="/contact">Contact <ArrowUpRightIcon size={15} /></Link></div></div></Reveal>
    </main>
  </InteriorChrome>;
}
