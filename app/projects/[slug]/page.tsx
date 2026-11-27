import { notFound } from 'next/navigation';
import { ProjectDetailClient } from '../../../src/components/ProjectDetailClient';
import { projects } from '../../../src/content/projects';
import { qaProjects } from '../../../src/content/qaProjects';
import { QAProjectDetail } from '../../../src/components/QAProjectDetail';

export function generateStaticParams() {
  return [...qaProjects, ...projects].map(({ slug }) => ({ slug }));
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const qaProject = qaProjects.find((entry) => entry.slug === slug);
  if (qaProject) return <QAProjectDetail project={qaProject} />;
  const project = projects.find((entry) => entry.slug === slug);
  if (!project) notFound();
  return <ProjectDetailClient project={project} />;
}
