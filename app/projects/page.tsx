'use client';

import Image from 'next/image';
import { InteriorChrome } from '../../src/components/InteriorChrome';
import { projects } from '../../src/content/projects';

function getProjectTags(category: string) {
  const tags = category.split(' / ').slice(0, 2);
  return tags.length > 1 ? tags : [tags[0], 'Design & Development'];
}

export default function ProjectsPage() {
  return (
    <InteriorChrome
      currentPage="projects"
      index="03"
      label="PROJECTS"
      wide
      showIndex={false}
      aside={<div className="projects-corner-title" aria-hidden="true">PROJECTS</div>}
    >
      <main className="about-content projects-reference">
        <h1 className="contact-seo-title">Projects by Tayab Malik</h1>
        <section className="project-reference-list" aria-label="Project archive">
          {projects.map((project, index) => (
            <article className="project-reference-row" key={project.id}>
              <span className="project-reference-number">{project.id}</span>
              <div className="project-reference-copy">
                <a className="project-reference-title" href={project.liveUrl} target="_blank" rel="noreferrer">{project.name}</a>
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
          ))}
        </section>
      </main>
    </InteriorChrome>
  );
}
