'use client';

import Image from 'next/image';
import { useState } from 'react';
import { InteriorChrome } from '../../src/components/InteriorChrome';
import { ScrambleText } from '../../src/components/SiteControls';
import { projects } from '../../src/content/projects';

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
        <a className="project-reference-title" href={project.liveUrl} target="_blank" rel="noreferrer">
          <span className="project-scramble-static">{project.name}</span>
          <span className="project-scramble-live" aria-hidden="true">
            <ScrambleText text={project.name} run={run} enabled={run > 0} />
          </span>
        </a>
        <div className="project-reference-tags">
          {getProjectTags(project.category).map((tag) => <span key={tag}>{tag}</span>)}
        </div>
        <p>{project.summary}</p>
      </div>
      <a className="project-reference-preview" href={project.liveUrl} target="_blank" rel="noreferrer" aria-label={`Open ${project.name} live website`}>
        <Image
          src={project.assets.cover}
          alt={`${project.name} desktop interface`}
          fill
          sizes="176px"
          priority={index < 4}
        />
      </a>
    </article>
  );
}

export default function ProjectsPage() {
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
        <h1 className="contact-seo-title">Projects by Tayab Malik</h1>
        <section className="project-reference-list" aria-label="Project archive">
          {projects.map((project, index) => <ProjectRow project={project} index={index} key={project.id} />)}
        </section>
      </main>
    </InteriorChrome>
  );
}
