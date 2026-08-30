'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowUUpLeftIcon, ArrowUpRightIcon, CaretLeftIcon, CaretRightIcon, CaretUpIcon } from '@phosphor-icons/react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { InteriorChrome } from './InteriorChrome';
import { projects } from '../content/projects';
import type { Project } from '../types/portfolio';

const defaultCapabilities = ['FRONTEND UI', 'RESPONSIVE DESIGN', 'UX FLOWS', 'PRODUCT STORY'];

function getProjectType(category: string) {
  return category.split(' / ')[0].toUpperCase();
}

function ProjectTicker({ name }: { name: string }) {
  const labels = Array.from({ length: 12 }, (_, index) => <span key={`${name}-${index}`}>{name}</span>);

  return (
    <div className="project-detail-ticker" aria-hidden="true">
      <div className="project-detail-ticker-track">
        <div>{labels}</div>
        <div>{labels}</div>
      </div>
    </div>
  );
}

export function ProjectDetailClient({ project }: { project: Project }) {
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState(false);
  const projectIndex = useMemo(() => projects.findIndex((entry) => entry.slug === project.slug), [project.slug]);
  const previous = projects[(projectIndex - 1 + projects.length) % projects.length];
  const next = projects[(projectIndex + 1) % projects.length];
  const capabilities = project.verifiedTechnologies.length ? project.verifiedTechnologies : defaultCapabilities;

  const navigate = useCallback((target: Project) => {
    if (isNavigating || target.slug === project.slug) return;
    setIsNavigating(true);
    window.setTimeout(() => router.push(`/projects/${target.slug}`), 210);
  }, [isNavigating, project.slug, router]);

  useEffect(() => {
    const handleKeyboard = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target?.matches('input, textarea, select, [contenteditable="true"]')) return;
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        navigate(previous);
      }
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        navigate(next);
      }
    };
    window.addEventListener('keydown', handleKeyboard);
    return () => window.removeEventListener('keydown', handleKeyboard);
  }, [navigate, next, previous]);

  return (
    <InteriorChrome
      currentPage="projects"
      index="03"
      label="PROJECTS"
      wide
      showIndex={false}
      breadcrumb={<><Link href="/">HOME</Link><i>/</i><Link href="/projects">PROJECTS</Link><i>/</i><b>{project.name.toUpperCase()}</b></>}
    >
      <main className={`project-detail ${isNavigating ? 'is-navigating' : ''}`}>
        <section className="project-detail-hero" aria-labelledby="project-detail-title">
          <div className="project-detail-heading">
            <Link href="/projects" className="project-detail-back" aria-label="Back to all projects"><ArrowUUpLeftIcon size={22} weight="light" /></Link>
            <h1 id="project-detail-title">{project.name}</h1>
          </div>

          <div className="project-detail-overview">
            <div className="project-detail-copy">
              <h2>Project Overview</h2>
              <i />
              <p>{project.purpose}</p>
              {project.implementationNote && <p className="project-detail-note">{project.implementationNote}</p>}
              <a className="project-detail-live-link" href={project.liveUrl} target="_blank" rel="noreferrer">Live Site <ArrowUpRightIcon size={18} weight="regular" /></a>
            </div>

            <aside className="project-detail-facts" aria-label={`${project.name} project facts`}>
              <dl>
                <div><dt>PROJECT_TYPE</dt><dd>{getProjectType(project.category)}</dd></div>
                <div><dt>ENTRY_YEAR</dt><dd>2026</dd></div>
                <div><dt>TARGET_PLATFORM</dt><dd>WEB</dd></div>
                <div><dt>PRIMARY_ROLE</dt><dd>DESIGN &amp; DEVELOPMENT</dd></div>
              </dl>
              <section>
                <h2>{project.verifiedTechnologies.length ? 'DEPLOYED_TECHNOLOGIES' : 'PROJECT_CAPABILITIES'}</h2>
                <div className="project-detail-chip-list">{capabilities.map((capability) => <span key={capability}>{capability}</span>)}</div>
              </section>
              <section>
                <h2>COLOR_PALETTE</h2>
                <div className="project-detail-palette">{project.palette.map((color) => <i style={{ backgroundColor: color }} key={color} aria-label={color} />)}</div>
              </section>
            </aside>
          </div>

          <div className="project-detail-image" aria-hidden="true">
            <Image src={project.assets.cover} alt="" fill priority sizes="(max-width: 760px) 90vw, 49vw" />
            <span />
          </div>
        </section>

        <div className="project-detail-keyboard" aria-label="Browse project details">
          <i className="project-detail-key-up" aria-hidden="true"><CaretUpIcon size={10} weight="bold" /></i>
          <div>
            <button onClick={() => navigate(previous)} disabled={isNavigating} aria-label={`Previous project: ${previous.name}`}><CaretLeftIcon size={11} weight="bold" /></button>
            <button onClick={() => navigate(next)} disabled={isNavigating} aria-label={`Next project: ${next.name}`}><CaretRightIcon size={11} weight="bold" /></button>
          </div>
        </div>

        <ProjectTicker name={project.name} />
      </main>
    </InteriorChrome>
  );
}
