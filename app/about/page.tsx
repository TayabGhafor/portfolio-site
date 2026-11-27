'use client';

import Link from 'next/link';
import { useEffect, useRef, useState, type MouseEvent } from 'react';
import { ArrowUpRightIcon, CalendarBlankIcon, EnvelopeSimpleIcon, MapPinIcon, ShieldCheckIcon, UserIcon } from '@phosphor-icons/react';
import { AboutPortrait } from '../../src/components/AboutPortrait';
import { InteriorChrome } from '../../src/components/InteriorChrome';
import { useSiteExperience } from '../../src/components/SiteExperienceProvider';
import { portfolio } from '../../src/content/portfolio';

const sections = [
  { id: 'profile', number: '01', label: 'Profile' },
  { id: 'skills', number: '02', label: 'Skills' },
  { id: 'experience', number: '03', label: 'Experience' },
  { id: 'contact', number: '04', label: 'Contact' },
] as const;

type SectionId = (typeof sections)[number]['id'];

const skillGroups = [
  { title: 'Quality assurance', items: ['Manual & Exploratory Testing', 'Functional Testing', 'Regression Testing', 'Smoke & Sanity Testing', 'Cross-browser Testing', 'API Testing', 'Test Case Design', 'Defect Reporting'] },
  { title: 'Automation & tools', items: ['Playwright', 'Cypress', 'Selenium WebDriver', 'Python', 'Postman', 'Jira', 'ClickUp', 'Git'] },
  { title: 'Frontend development', items: ['React', 'Next.js', 'JavaScript', 'TypeScript', 'HTML / CSS', 'Tailwind CSS', 'Responsive UI'] },
  { title: 'Additional perspective', items: ['Meta Ads', 'Performance Marketing', 'UI & Usability', 'Agile Collaboration'] },
];

const qaProjects = [
  { name: 'Nurmed.ai', domain: 'AI / HEALTHCARE', detail: 'Functional and API testing across patient, diagnosis, and hospital workflows, with RPA payload validation and authentication checks.' },
  { name: 'Fictionpub.ai', domain: 'AI / PUBLISHING', detail: 'Cross-browser quality checks and automated regression coverage for content generation, editing, and publishing journeys.' },
  { name: '9Squid', domain: 'FINTECH / IN DEVELOPMENT', detail: 'Deal lifecycle and transaction testing, automation of core workflows, and security and edge-case validation for financial operations.' },
];

function SectionHeading({ id, children }: { id: SectionId; children: string }) {
  return <header><h2 id={`${id}-heading`}>{children}</h2><i aria-hidden="true" /></header>;
}

export default function AboutPage() {
  const pageRef = useRef<HTMLElement>(null);
  const [activeSection, setActiveSection] = useState<SectionId>('profile');
  const { motion } = useSiteExperience();

  useEffect(() => {
    const page = pageRef.current;
    const scroller = page?.closest<HTMLElement>('.about-scroll');
    if (!page || !scroller) return;

    let frame = 0;
    const updateSection = () => {
      frame = 0;
      const readingLine = scroller.getBoundingClientRect().top + Math.min(230, scroller.clientHeight * .3);
      let current: SectionId = 'profile';
      for (const { id } of sections) {
        const section = page.querySelector<HTMLElement>(`#${id}`);
        if (section && section.getBoundingClientRect().top <= readingLine) current = id;
      }
      // Short final sections still become active when the reader reaches the end.
      if (scroller.scrollTop > 0 && scroller.scrollHeight - scroller.clientHeight - scroller.scrollTop < 3) current = 'contact';
      setActiveSection(current);
    };
    const scheduleUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(updateSection);
    };
    const resizeObserver = new ResizeObserver(scheduleUpdate);
    resizeObserver.observe(page);
    resizeObserver.observe(scroller);
    scroller.addEventListener('scroll', scheduleUpdate, { passive: true });
    scheduleUpdate();

    return () => {
      scroller.removeEventListener('scroll', scheduleUpdate);
      resizeObserver.disconnect();
      window.cancelAnimationFrame(frame);
    };
  }, []);

  const navigateSection = (event: MouseEvent<HTMLAnchorElement>, id: SectionId) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const target = pageRef.current?.querySelector<HTMLElement>(`#${id}`);
    if (!target) return;
    event.preventDefault();
    const reducedMotion = !motion || window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    target.scrollIntoView({ behavior: reducedMotion ? 'instant' : 'smooth', block: 'start' });
    target.focus({ preventScroll: true });
    window.history.replaceState(window.history.state, '', `#${id}`);
  };

  return <InteriorChrome currentPage="about" index="02" label="ABOUT" wide>
    <main className="about-premium-page" ref={pageRef}>
      <header className="about-premium-heading">
        <div className="about-premium-kicker"><span /> ABOUT / PROFILE</div>
        <h1>TAYAB MALIK</h1>
        <p><span>SQA ENGINEER</span><i aria-hidden="true" /> MANUAL &amp; AUTOMATION TESTING <i aria-hidden="true" /> QUALITY AT EVERY STEP</p>
      </header>

      <div className="about-premium-layout">
        <nav className="about-premium-rail" aria-label="About page sections">
          {sections.map(({ id, number, label }) => <div className="about-premium-rail-step" key={id}><a href={`#${id}`} className={activeSection === id ? 'is-active' : undefined} aria-current={activeSection === id ? 'location' : undefined} onClick={(event) => navigateSection(event, id)}><span>{number}</span><b>{label}</b></a></div>)}
        </nav>

        <div className="about-premium-content">
          <section className="about-premium-card about-premium-profile" id="profile" aria-labelledby="profile-heading" tabIndex={-1}>
            <SectionHeading id="profile">01 / PROFILE</SectionHeading>
            <p className="about-premium-intro">I find the risks before your users do.<br /><strong>And help turn complex products into confident releases.</strong></p>
            <p className="about-premium-copy">I&apos;m Tayab, an SQA Engineer combining hands-on manual testing, reliable automation, and API validation across AI healthcare, publishing, and fintech platforms. From designing meaningful test cases to documenting reproducible defects and verifying fixes, I help teams understand what&apos;s ready to ship—and what needs attention.</p>
            <p className="about-premium-copy about-premium-secondary">My frontend development and Meta Ads experience add a practical understanding of interfaces, usability, and the customer journey. Quality assurance is where I bring those perspectives together.</p>
            <div className="about-premium-facts">
              <div><UserIcon size={20} aria-hidden="true" /><span><small>CURRENT ROLE</small><b>{portfolio.primaryRole}</b></span></div>
              <div><MapPinIcon size={20} aria-hidden="true" /><span><small>BASED IN</small><b>Lahore, Pakistan</b></span></div>
              <div><ShieldCheckIcon size={20} aria-hidden="true" /><span><small>CORE FOCUS</small><b>Manual + Automation</b></span></div>
            </div>
          </section>

          <section className="about-premium-card about-premium-skills" id="skills" aria-labelledby="skills-heading" tabIndex={-1}>
            <SectionHeading id="skills">02 / SKILLS &amp; FOCUS</SectionHeading>
            <p className="about-premium-section-lead">The tools and thinking behind dependable software.</p>
            <div className="about-premium-skill-groups">{skillGroups.map(({ title, items }) => <div key={title}><h3>{title}</h3><ul>{items.map((item) => <li key={item}>{item}</li>)}</ul></div>)}</div>
          </section>

          <section className="about-premium-card about-premium-experience" id="experience" aria-labelledby="experience-heading" tabIndex={-1}>
            <SectionHeading id="experience">03 / EXPERIENCE</SectionHeading>
            <div className="about-premium-timeline">
              {portfolio.experience.map((job) => <article key={`${job.company}-${job.role}`}>
                <span className="about-premium-timeline-dot" aria-hidden="true" />
                <div><h3>{job.role}</h3><b>{job.company}</b><p><CalendarBlankIcon size={15} aria-hidden="true" />{job.dates}</p></div>
                <small>{job.status === 'active' ? 'CURRENT' : 'COMPLETED'}</small>
                {job.status === 'active' && <div className="about-premium-projects"><p className="about-premium-projects-label">SELECTED QA WORK</p>{qaProjects.map((project) => <div key={project.name}><h4>{project.name}<span>{project.domain}</span></h4><p>{project.detail}</p></div>)}</div>}
              </article>)}
            </div>
            <div className="about-premium-education"><small>EDUCATION / 2021–2025</small><b>BS Software Engineering</b><span>COMSATS University Islamabad, Lahore Campus</span></div>
          </section>

          <section className="about-premium-card about-premium-contact" id="contact" aria-labelledby="contact-heading" tabIndex={-1}>
            <SectionHeading id="contact">04 / GET IN TOUCH</SectionHeading>
            <h3>Building something people need to trust?</h3>
            <p className="about-premium-copy">Let&apos;s talk about your QA team, your next release, and how I can help.</p>
            <div className="about-premium-contact-actions">
              <a href={`mailto:${portfolio.email}`}><EnvelopeSimpleIcon size={20} aria-hidden="true" /><span>{portfolio.email}</span><ArrowUpRightIcon size={17} aria-hidden="true" /></a>
              <Link href="/contact"><span>Let&apos;s talk</span><ArrowUpRightIcon size={17} aria-hidden="true" /></Link>
            </div>
          </section>
        </div>

        <AboutPortrait />
      </div>
    </main>
  </InteriorChrome>;
}
