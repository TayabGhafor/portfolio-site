'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Suspense, useRef, useState, type KeyboardEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowUpRightIcon, CodeIcon, ShieldCheckIcon } from '@phosphor-icons/react';
import { InteriorChrome } from '../../src/components/InteriorChrome';
import { ScrambleText } from '../../src/components/SiteControls';
import { projects } from '../../src/content/projects';
import { qaProjects, type QAProject } from '../../src/content/qaProjects';

function getProjectTags(category: string) {
  const tags = category.split(' / ').slice(0, 2);
  return tags.length > 1 ? tags : [tags[0], 'Design & Development'];
}

function ProjectsCornerTitle() {
  const [run, setRun] = useState(0);
  const animate = () => setRun((value) => value + 1);

  return (
    <div className="projects-corner-title" aria-hidden="true" onPointerEnter={animate}>
      <span className="project-scramble-static">PROJECTS</span>
      <span className="project-scramble-live">
        <ScrambleText text="PROJECTS" run={run} enabled={run > 0} />
      </span>
    </div>
  );
}

function ProjectRow({ project, index }: { project: (typeof projects)[number]; index: number }) {
  const [run, setRun] = useState(0);
  const animate = () => setRun((value) => value + 1);

  return (
    <article className="project-reference-row" onPointerEnter={animate} onFocusCapture={animate}>
      <span className="project-reference-number">{project.id}</span>
      <div className="project-reference-copy">
        <Link className="project-reference-title" href={`/projects/${project.slug}`} aria-label={`View ${project.name} project details`}>
          <span className="project-scramble-static">{project.name}</span>
          <span className="project-scramble-live" aria-hidden="true">
            <ScrambleText text={project.name} run={run} enabled={run > 0} />
          </span>
        </Link>
        <div className="project-reference-tags">
          {getProjectTags(project.category).map((tag) => <span key={tag}>{tag}</span>)}
        </div>
        <p>{project.summary}</p>
      </div>
      <Link className="project-reference-preview" href={`/projects/${project.slug}`} aria-label={`View ${project.name} project details`}>
        <Image
          src={project.assets.cover}
          alt={`${project.name} desktop interface`}
          fill
          sizes="176px"
          priority={index < 4}
        />
      </Link>
    </article>
  );
}

function QAProjectRow({ project }: { project: QAProject }) {
  return (
    <article className="qa-project-row">
      <span className="qa-project-number" aria-hidden="true">{project.id}</span>
      <div className="qa-project-copy">
        <div className="qa-project-meta"><span>{project.domain}</span><span>{project.status}</span></div>
        <h2><Link href={`/projects/${project.slug}`}>{project.name}<ArrowUpRightIcon size={23} aria-hidden="true" /></Link></h2>
        <p>{project.summary}</p>
        <ul className="qa-coverage-tags" aria-label="Testing coverage">{project.coverage.map((item) => <li key={item}>{item}</li>)}</ul>
        <span className="qa-project-context">{project.context}{project.context === 'Professional work' ? ' · Tallysis.Inc' : ''}</span>
      </div>
      <Link href={`/projects/${project.slug}`} className="qa-project-highlight" aria-label={`Explore ${project.name} QA project`}>
        <ShieldCheckIcon size={22} weight="light" aria-hidden="true" />
        <strong>{project.metrics[0].value}</strong>
        <span>{project.metrics[0].label}</span>
        <small>VIEW QA WORK <ArrowUpRightIcon size={12} aria-hidden="true" /></small>
      </Link>
    </article>
  );
}

function ProjectsArchive() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const view = searchParams.get('view') === 'development' ? 'development' : 'qa';
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const selectView = (next: 'qa' | 'development') => {
    if (next !== view) router.replace(next === 'qa' ? '/projects' : '/projects?view=development', { scroll: false });
  };
  const handleTabKey = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    let next = index;
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') next = 1 - index;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = 1;
    else return;
    event.preventDefault();
    selectView(next === 0 ? 'qa' : 'development');
    tabRefs.current[next]?.focus();
  };

  return (
    <InteriorChrome
      currentPage="projects"
      index="03"
      label="PROJECTS"
      wide
      showIndex={false}
      aside={<ProjectsCornerTitle />}
    >
      <main className="about-content projects-reference">
        <header className="project-archive-heading">
          <span className="archive-eyebrow">SELECTED WORK / TAYAB MALIK</span>
          <h1>Quality in practice.</h1>
          <p>From finding the edge cases to building dependable automation.<br />Explore my QA work, or switch to the interfaces I&apos;ve built.</p>
        </header>
        <div className="project-archive-toolbar">
          <div className={`project-view-switch is-${view}`} role="tablist" aria-label="Project category">
            <span className="project-switch-indicator" aria-hidden="true" />
            {(['qa', 'development'] as const).map((category, index) => (
              <button
                type="button" role="tab" id={`${category}-tab`} aria-controls={`${category}-projects`}
                aria-selected={view === category} tabIndex={view === category ? 0 : -1}
                ref={(element) => { tabRefs.current[index] = element; }}
                onClick={() => selectView(category)} onKeyDown={(event) => handleTabKey(event, index)} key={category}
              >
                {category === 'qa' ? <ShieldCheckIcon size={17} aria-hidden="true" /> : <CodeIcon size={17} aria-hidden="true" />}
                {category === 'qa' ? 'QA & Testing' : 'Development'}
                <span>{String(category === 'qa' ? qaProjects.length : projects.length).padStart(2, '0')}</span>
              </button>
            ))}
          </div>
          <p className="project-view-count" role="status">{view === 'qa' ? '03 professional · 02 personal' : `${projects.length} development projects`}</p>
        </div>
        <section id="qa-projects" role="tabpanel" aria-labelledby="qa-tab" tabIndex={0} hidden={view !== 'qa'} className="project-archive-panel">
          {view === 'qa' && <div className="project-list-reveal" key="qa">{qaProjects.map((project) => <QAProjectRow project={project} key={project.slug} />)}</div>}
        </section>
        <section id="development-projects" role="tabpanel" aria-labelledby="development-tab" tabIndex={0} hidden={view !== 'development'} className="project-archive-panel">
          {view === 'development' && <div className="project-reference-list project-list-reveal" key="development">{projects.map((project, index) => <ProjectRow project={project} index={index} key={project.id} />)}</div>}
        </section>
      </main>
    </InteriorChrome>
  );
}

export default function ProjectsPage() {
  return <Suspense fallback={<InteriorChrome currentPage="projects" index="03" label="PROJECTS"><main className="about-content"><p>Loading projects…</p></main></InteriorChrome>}><ProjectsArchive /></Suspense>;
}
