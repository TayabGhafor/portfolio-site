'use client';

import Image from 'next/image';
import { InteriorChrome } from '../../src/components/InteriorChrome';
import { projects } from '../../src/content/projects';

export default function ProjectsPage() {
  return (
    <InteriorChrome currentPage="projects" index="03" label="PROJECTS" wide>
      <main className="about-content">
        <section className="about-intro about-block">
          <span className="about-section-id">[ ARCHIVE / 03 ]</span>
          <h1>Selected work</h1>
          <p className="about-lede">Nine live product interfaces</p>
          <h2>built for SaaS, commerce, and social products</h2>
          <p>Each case is a shipped frontend: responsive layouts, operational workflows, and product storytelling. Open a live build to inspect the actual interface.</p>
        </section>

        <section className="about-block project-index" aria-label="Project archive">
          {projects.map((project) => (
            <article className="project-card" key={project.id}>
              <a className="project-card-media" href={project.liveUrl} target="_blank" rel="noreferrer">
                <Image
                  src={project.assets.cover}
                  alt={`${project.name} desktop interface`}
                  width={1440}
                  height={900}
                  sizes="(max-width: 800px) 100vw, 42vw"
                />
              </a>
              <div className="project-card-copy">
                <span>[{project.id}] TIER_{project.tier}</span>
                <h3>{project.name}</h3>
                <small>{project.category}</small>
                <p>{project.summary}</p>
                <a href={project.liveUrl} target="_blank" rel="noreferrer">Open live build ↗</a>
              </div>
            </article>
          ))}
        </section>
      </main>
    </InteriorChrome>
  );
}
