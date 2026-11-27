'use client';

import Link from 'next/link';
import { ArrowLeftIcon, ArrowRightIcon, ArrowUpRightIcon, GithubLogoIcon, ShieldCheckIcon } from '@phosphor-icons/react';
import { InteriorChrome } from './InteriorChrome';
import { qaProjects, type QAProject } from '../content/qaProjects';

export function QAProjectDetail({ project }: { project: QAProject }) {
  const index = qaProjects.findIndex((entry) => entry.slug === project.slug);
  const next = qaProjects[(index + 1) % qaProjects.length];

  return (
    <InteriorChrome currentPage="projects" index="03" label="PROJECTS" wide showIndex={false}
      breadcrumb={<><Link href="/">HOME</Link><i>/</i><Link href="/projects">QA PROJECTS</Link></>}>
      <main className="qa-detail">
        <Link href="/projects" className="qa-detail-back"><ArrowLeftIcon size={16} aria-hidden="true" /> All QA projects</Link>
        <header className="qa-detail-header">
          <div className="qa-project-meta"><span>{project.domain}</span><span>{project.status}</span></div>
          <h1>{project.name}</h1>
          <p>{project.summary}</p>
          <div className="qa-detail-role"><ShieldCheckIcon size={18} aria-hidden="true" /><span>{project.role}</span><span>{project.context}</span></div>
        </header>
        <dl className="qa-detail-metrics">{project.metrics.map((metric) => <div key={metric.label}><dt>{metric.label}</dt><dd>{metric.value}</dd></div>)}</dl>
        <div className="qa-detail-grid">
          <section className="qa-detail-section">
            <h2><span>01 /</span> Project context</h2>
            <p>{project.overview}</p>
            <ul className="qa-coverage-tags" aria-label="Testing coverage">{project.coverage.map((item) => <li key={item}>{item}</li>)}</ul>
            <a className="qa-source-link" href={project.sourceUrl} target="_blank" rel="noreferrer"><GithubLogoIcon size={19} aria-hidden="true" /> Explore test repository <ArrowUpRightIcon size={16} aria-hidden="true" /></a>
          </section>
          <section className="qa-detail-section">
            <h2><span>02 /</span> My QA contribution</h2>
            <ul className="qa-detail-points">{project.contributions.map((item) => <li key={item}>{item}</li>)}</ul>
          </section>
          <section className="qa-detail-section qa-detail-outcomes">
            <h2><span>03 /</span> {project.context === 'Professional work' ? 'Outcomes & impact' : 'Practice & takeaways'}</h2>
            <ul className="qa-detail-points">{project.outcomes.map((item) => <li key={item}>{item}</li>)}</ul>
          </section>
        </div>
        <nav className="qa-detail-navigation" aria-label="More QA work"><Link href="/projects">Back to QA projects</Link><Link href={`/projects/${next.slug}`}><small>NEXT PROJECT</small>{next.name}<ArrowRightIcon size={20} aria-hidden="true" /></Link></nav>
      </main>
    </InteriorChrome>
  );
}
