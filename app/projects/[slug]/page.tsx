import { notFound } from 'next/navigation';
import { ProjectDetailClient } from '../../../src/components/ProjectDetailClient';
import { projects } from '../../../src/content/projects';

export function generateStaticParams() {
  return projects.map(({ slug }) => ({ slug }));
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = projects.find((entry) => entry.slug === slug);
  if (!project) notFound();
  return <ProjectDetailClient project={project} />;
}
