'use client';

import Link from 'next/link';
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import {
  ArrowUpRightIcon, BookOpenIcon, BracketsCurlyIcon, CheckCircleIcon, CodeIcon,
  CrosshairIcon, EnvelopeSimpleIcon, FileTextIcon, GaugeIcon, GithubLogoIcon,
  HandshakeIcon, LightningIcon, LinkedinLogoIcon, MapPinIcon, RocketLaunchIcon,
  SquaresFourIcon, StackIcon, UserFocusIcon, UsersThreeIcon,
} from '@phosphor-icons/react';
import { InteriorChrome } from '../../src/components/InteriorChrome';
import { ScrambleText } from '../../src/components/SiteControls';

type Icon = typeof CodeIcon;

const aboutSections = [
  { id: 'profile', number: '01', title: 'Profile', shortTitle: 'Profile' },
  { id: 'build', number: '02', title: 'What I Build', shortTitle: 'Build' },
  { id: 'weapons', number: '03', title: 'My Weapons', shortTitle: 'Weapons' },
  { id: 'learning', number: '04', title: 'Learning by Building', shortTitle: 'Learning' },
  { id: 'connect', number: '05', title: 'Have a Project in Mind?', shortTitle: 'Connect' },
] as const;

const buildItems: Array<{ title: string; detail: string; icon: Icon }> = [
  { title: 'Responsive interfaces', detail: 'Pixel-perfect across all devices.', icon: SquaresFourIcon },
  { title: 'Scalable components', detail: 'Reusable, modular, maintainable.', icon: StackIcon },
  { title: 'Fast & real performance', detail: 'Optimized for speed and UX.', icon: GaugeIcon },
  { title: 'API & system integration', detail: 'Connecting data with purpose.', icon: LightningIcon },
  { title: 'Accessibility first', detail: 'Inclusive, usable, thoughtful.', icon: UserFocusIcon },
];

const approachItems: Array<{ title: string; detail: string; icon: Icon }> = [
  { title: 'Understand', detail: 'Discover problems worth solving.', icon: CrosshairIcon },
  { title: 'Design', detail: 'Plan experiences with clarity.', icon: SquaresFourIcon },
  { title: 'Build', detail: 'Write clean, efficient code.', icon: CodeIcon },
  { title: 'Optimize', detail: 'Refine for performance and quality.', icon: GaugeIcon },
  { title: 'Deliver', detail: 'Ship value, iterate, improve.', icon: RocketLaunchIcon },
];

const frontendSkills = ['JavaScript', 'TypeScript', 'React', 'Next.js', 'Tailwind CSS', 'HTML5', 'CSS3'];
const dataSkills = ['Redux Toolkit', 'TanStack Query', 'Axios', 'React Hook Form', 'Recharts'];
const backendSkills = ['Node.js', 'Express', 'PostgreSQL', 'Supabase', 'Prisma', 'REST APIs'];
const toolingSkills = ['Git', 'Docker', 'GSAP', 'ShadCN UI', 'Radix UI', 'Production UI'];

const learningItems = [
  'Building responsive and accessible interfaces',
  'Developing reusable components and UI systems',
  'Integrating REST APIs',
  'Collaborating with engineering teams',
  'Writing clean, maintainable frontend code',
];

const focusItems: Array<{ title: string; icon: Icon }> = [
  { title: 'Solve real problems', icon: CrosshairIcon },
  { title: 'Build with purpose', icon: BracketsCurlyIcon },
  { title: 'Keep learning', icon: BookOpenIcon },
  { title: 'Collaborate & grow', icon: UsersThreeIcon },
  { title: 'Ship quality work that creates impact', icon: CheckCircleIcon },
];

const particles = Array.from({ length: 18 }, (_, index) => ({
  left: `${51 + (index * 13) % 18}%`, top: `${14 + (index * 19) % 67}%`,
  delay: `${-(index % 7) * .64}s`, duration: `${5.2 + (index % 5) * .7}s`,
  size: `${2 + (index % 3)}px`, tone: index % 3 === 0 ? 'blue' : 'red',
}));

function InteractiveScramble({ text, run = 0, active = true, className = '' }: { text: string; run?: number; active?: boolean; className?: string }) {
  const [hoverRun, setHoverRun] = useState(0);
  const animate = () => active && setHoverRun((value) => value + 1);
  return <span className={`cinematic-scramble ${className}`} tabIndex={0} onPointerEnter={animate} onFocus={animate}><ScrambleText text={text} run={run + hoverRun} enabled={active && run + hoverRun > 0} /></span>;
}

function HudPanel({ label, run, active, className = '', children }: { label: string; run: number; active: boolean; className?: string; children: ReactNode }) {
  return <section className={`cinematic-hud-panel ${className}`}><header><InteractiveScramble text={`/ ${label}`} run={run} active={active} /><i aria-hidden="true" /></header>{children}</section>;
}

function HudRows({ items, active }: { items: Array<{ title: string; detail?: string; icon: Icon }>; active: boolean }) {
  return <div className="cinematic-hud-rows">{items.map(({ title, detail, icon: ItemIcon }, index) => <div className="cinematic-hud-row" key={title}><span className="cinematic-row-icon"><ItemIcon size={17} weight="light" /></span><span><InteractiveScramble text={title} active={active} /><small>{detail}</small></span><i aria-hidden="true">{String(index + 1).padStart(2, '0')}</i></div>)}</div>;
}

function SkillCell({ name, index, active }: { name: string; index: number; active: boolean }) {
  const [run, setRun] = useState(0);
  const animate = () => active && setRun((value) => value + 1);
  return <button className="cinematic-skill-cell" type="button" onPointerEnter={animate} onFocus={animate}><small>{String(index + 1).padStart(2, '0')}</small><strong><ScrambleText text={name} run={run} enabled={active && run > 0} /></strong><i aria-hidden="true" /></button>;
}

function SkillGroup({ title, skills, offset, active }: { title: string; skills: readonly string[]; offset: number; active: boolean }) {
  return <div className="cinematic-skill-group"><h3>/ {title}</h3><div className="cinematic-skill-grid">{skills.map((skill, index) => <SkillCell key={skill} name={skill} index={offset + index} active={active} />)}</div></div>;
}

function SectionHeading({ title, run, active }: { title: string; run: number; active: boolean }) {
  return <h2><InteractiveScramble text={title} run={run} active={active} /></h2>;
}

function SectionContent({ id, run, active }: { id: (typeof aboutSections)[number]['id']; run: number; active: boolean }) {
  if (id === 'profile') return <>
    <aside className="cinematic-side cinematic-side-left">
      <HudPanel label="PROFILE" run={run} active={active} className="cinematic-profile-card"><strong className="cinematic-section-number">01</strong><h2>Frontend Developer</h2><p>I engineer responsive, accessible and high-performance web experiences with clean code and thoughtful interactions.</p></HudPanel>
      <HudPanel label="LOCATION" run={run} active={active}><div className="cinematic-single-line"><MapPinIcon size={16} /><strong>Pakistan / PKT</strong></div></HudPanel>
      <HudPanel label="STATUS" run={run} active={active}><div className="cinematic-single-line"><i className="cinematic-status-dot" /><strong>Open for opportunities</strong></div></HudPanel>
    </aside>
    <aside className="cinematic-side cinematic-side-right">
      <HudPanel label="CORE PHILOSOPHY" run={run} active={active} className="cinematic-philosophy"><p>Code is <b>design.</b><br />Design is <b>solution.</b></p><span className="cinematic-data-bar" aria-hidden="true" /></HudPanel>
      <HudPanel label="FOCUS" run={run} active={active}><ul className="cinematic-focus-list"><li>Clean Code</li><li>Performance</li><li>Accessibility</li><li>User Experience</li><li>Product Thinking</li></ul></HudPanel>
      <HudPanel label="CURRENT ROLE" run={run} active={active}><div className="cinematic-role"><strong>Frontend Developer Intern</strong><span>SoftAccess</span><small>May 2026 → July 2026</small></div></HudPanel>
    </aside>
  </>;

  if (id === 'build') return <>
    <aside className="cinematic-side cinematic-side-left"><HudPanel label="MODULE 02" run={run} active={active}><SectionHeading title="What I Build" run={run} active={active} /><p>Crafting interfaces that are fast, intuitive and built for scale.</p><HudRows items={buildItems} active={active} /></HudPanel></aside>
    <aside className="cinematic-side cinematic-side-right"><HudPanel label="APPROACH" run={run} active={active}><HudRows items={approachItems} active={active} /></HudPanel></aside>
  </>;

  if (id === 'weapons') return <>
    <aside className="cinematic-side cinematic-side-left"><HudPanel label="CAPABILITY INDEX" run={run} active={active}><SectionHeading title="My Weapons" run={run} active={active} /><p className="cinematic-red-copy">Technical Arsenal</p><SkillGroup title="Frontend" skills={frontendSkills} offset={0} active={active} /><SkillGroup title="State & Data" skills={dataSkills} offset={frontendSkills.length} active={active} /></HudPanel></aside>
    <aside className="cinematic-side cinematic-side-right cinematic-side-wide"><HudPanel label="BACKEND & SYSTEMS" run={run} active={active}><SkillGroup title="Backend & Systems" skills={backendSkills} offset={12} active={active} /></HudPanel><HudPanel label="TOOLS & UI" run={run} active={active}><SkillGroup title="Tooling & UI" skills={toolingSkills} offset={18} active={active} /></HudPanel></aside>
  </>;

  if (id === 'learning') return <>
    <aside className="cinematic-side cinematic-side-left"><HudPanel label="EXPERIENCE LOG" run={run} active={active}><SectionHeading title="Learning by Building" run={run} active={active} /><div className="cinematic-role cinematic-role-large"><strong>Frontend Developer Intern</strong><span>SoftAccess</span><small>May 2026 → July 2026</small></div><ul className="cinematic-bullet-list">{learningItems.map((item) => <li key={item}>{item}</li>)}</ul></HudPanel></aside>
    <aside className="cinematic-side cinematic-side-right"><HudPanel label="WHAT I FOCUS ON" run={run} active={active}><HudRows items={focusItems} active={active} /></HudPanel></aside>
  </>;

  return <>
    <aside className="cinematic-side cinematic-side-left"><HudPanel label="NEXT CONNECTION" run={run} active={active}><SectionHeading title="Have a Project in Mind?" run={run} active={active} /><p>Let&apos;s build something meaningful together. I&apos;m open to new opportunities, collaborations and interesting frontend products.</p><div className="cinematic-availability"><span>/ AVAILABILITY</span><strong><i /> Available for work</strong><b aria-hidden="true"><em /><em /><em /><em /><em /><em /><em /></b></div></HudPanel></aside>
    <aside className="cinematic-side cinematic-side-right"><HudPanel label="LET'S CONNECT" run={run} active={active}><nav className="cinematic-connect-links" aria-label="Contact and portfolio links"><a href="mailto:tayabghafor@gmail.com"><EnvelopeSimpleIcon size={18} /><span><small>Email me</small><strong>tayabghafor@gmail.com</strong></span><ArrowUpRightIcon size={14} /></a><a href="/Tayab-Malik.pdf" target="_blank" rel="noreferrer"><FileTextIcon size={18} /><span><small>Open resume</small><strong>Profile / PDF</strong></span><ArrowUpRightIcon size={14} /></a><Link href="/projects"><CodeIcon size={18} /><span><small>View projects</small><strong>Selected work</strong></span><ArrowUpRightIcon size={14} /></Link></nav><div className="cinematic-socials"><span>/ LET&apos;S CHAT</span><div><a href="https://github.com/TayabGhafor" target="_blank" rel="noreferrer" aria-label="GitHub"><GithubLogoIcon size={19} /></a><a href="https://www.linkedin.com/in/tayabmalik" target="_blank" rel="noreferrer" aria-label="LinkedIn"><LinkedinLogoIcon size={19} /></a><a href="mailto:tayabghafor@gmail.com" aria-label="Email"><EnvelopeSimpleIcon size={19} /></a><a href="/contact" aria-label="Contact page"><HandshakeIcon size={19} /></a></div></div></HudPanel></aside>
  </>;
}

export default function AboutPage() {
  const trackRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [nameGlitch, setNameGlitch] = useState(false);
  const [pageHidden, setPageHidden] = useState(false);

  useEffect(() => {
    const track = trackRef.current;
    const scroller = track?.closest('.about-scroll') as HTMLDivElement | null;
    if (!track || !scroller) return;
    scrollerRef.current = scroller;
    let frame = 0;
    const update = () => {
      frame = 0;
      const available = Math.max(1, track.offsetHeight - scroller.clientHeight);
      const progress = Math.max(0, Math.min(1, scroller.scrollTop / available));
      track.style.setProperty('--scene-progress', `${progress}`);
      setActiveIndex((current) => {
        const next = Math.min(aboutSections.length - 1, Math.floor(progress * aboutSections.length + .0001));
        return current === next ? current : next;
      });
    };
    const onScroll = () => { if (!frame) frame = window.requestAnimationFrame(update); };
    update();
    scroller.addEventListener('scroll', onScroll, { passive: true });
    return () => { scroller.removeEventListener('scroll', onScroll); window.cancelAnimationFrame(frame); };
  }, []);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage || !window.matchMedia('(pointer: fine)').matches || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let frame = 0; let targetX = 0; let targetY = 0; let currentX = 0; let currentY = 0;
    const move = (event: PointerEvent) => {
      if (stage.closest('.motion-reduced')) return;
      targetX = (event.clientX / window.innerWidth - .5) * 2;
      targetY = (event.clientY / window.innerHeight - .5) * 2;
    };
    const tick = () => {
      currentX += (targetX - currentX) * .055; currentY += (targetY - currentY) * .055;
      stage.style.setProperty('--cinematic-x', `${currentX * 4}px`);
      stage.style.setProperty('--cinematic-y', `${currentY * 3}px`);
      frame = window.requestAnimationFrame(tick);
    };
    stage.addEventListener('pointermove', move, { passive: true });
    frame = window.requestAnimationFrame(tick);
    return () => { stage.removeEventListener('pointermove', move); window.cancelAnimationFrame(frame); };
  }, []);

  useEffect(() => {
    let eventTimer = 0; let clearTimer = 0; let disposed = false;
    const schedule = () => {
      eventTimer = window.setTimeout(() => {
        if (!disposed && !document.hidden && !stageRef.current?.closest('.motion-reduced')) {
          setNameGlitch(true);
          clearTimer = window.setTimeout(() => setNameGlitch(false), 150);
        }
        if (!disposed) schedule();
      }, 3000 + Math.random() * 4000);
    };
    schedule();
    return () => { disposed = true; window.clearTimeout(eventTimer); window.clearTimeout(clearTimer); };
  }, []);

  useEffect(() => {
    const startTimer = window.setTimeout(() => setNameGlitch(true), 0);
    const endTimer = window.setTimeout(() => setNameGlitch(false), 190);
    return () => { window.clearTimeout(startTimer); window.clearTimeout(endTimer); };
  }, [activeIndex]);

  useEffect(() => {
    const update = () => setPageHidden(document.hidden);
    document.addEventListener('visibilitychange', update);
    return () => document.removeEventListener('visibilitychange', update);
  }, []);

  const jumpTo = (index: number) => {
    const scroller = scrollerRef.current; const track = trackRef.current;
    if (!scroller || !track) return;
    const available = track.offsetHeight - scroller.clientHeight;
    scroller.scrollTo({ top: available * Math.min(.99, index / aboutSections.length + .015), behavior: 'smooth' });
  };

  return <InteriorChrome currentPage="about" index="02" label="ABOUT" wide>
    <main ref={trackRef} className="about-cinematic-track">
      <div ref={stageRef} className={`about-cinematic-stage ${pageHidden ? 'is-paused' : ''}`}>
        <div className="cinematic-environment" aria-hidden="true"><video className="cinematic-background-video" autoPlay loop muted playsInline preload="auto" poster="/about-cinematic-hero-v1.webp"><source src="/about-digital-eyes-background.mp4" type="video/mp4" /></video><span className="cinematic-environment-shade" /><span className="cinematic-red-matrix" /><span className="cinematic-blue-haze" /></div>
        <h1 className={`cinematic-name ${nameGlitch ? 'is-glitching' : ''}`} data-text="TAYAB MALIK">TAYAB MALIK</h1>
        <div className="cinematic-particles" aria-hidden="true">{particles.map((particle, index) => <i key={index} className={`is-${particle.tone}`} style={{ '--particle-left': particle.left, '--particle-top': particle.top, '--particle-delay': particle.delay, '--particle-duration': particle.duration, '--particle-size': particle.size } as CSSProperties} />)}</div>
        <nav className="cinematic-section-progress" aria-label="About sections"><span className="cinematic-progress-line"><i /></span>{aboutSections.map((section, index) => <button key={section.id} className={index === activeIndex ? 'is-active' : ''} onClick={() => jumpTo(index)} aria-current={index === activeIndex ? 'step' : undefined}><b>{section.number}</b><span>{section.shortTitle}</span><i /></button>)}</nav>
        <div className="cinematic-states">{aboutSections.map((section, index) => <div key={section.id} className={`cinematic-state ${index === activeIndex ? 'is-active' : index < activeIndex ? 'is-before' : 'is-after'}`} aria-hidden={index !== activeIndex}><SectionContent id={section.id} run={activeIndex + 1} active={index === activeIndex} /></div>)}</div>
        <div className="cinematic-state-readout" aria-live="polite"><span>MODULE</span><strong>{aboutSections[activeIndex].number}</strong><i /><b>{aboutSections[activeIndex].title}</b></div>
      </div>
    </main>
  </InteriorChrome>;
}
