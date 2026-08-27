import type { PortfolioProfile } from '../types/portfolio';

export const portfolio: PortfolioProfile = {
  name: 'Tayab Malik',
  primaryRole: 'Frontend Developer',
  secondaryRole: 'Frontend Engineer / Full-Stack Capable Developer',
  shortIntroduction:
    'Frontend developer focused on polished, responsive interfaces, SaaS products, and production-minded user experiences.',
  experience: [
    {
      role: 'Frontend Developer Intern',
      company: 'SoftAccess',
      companyUrl: 'https://softaccess.co.uk/',
      status: 'unverified',
    },
  ],
  github: 'https://github.com/TayabGhafor',
  skills: [
    'React',
    'Next.js',
    'JavaScript',
    'TypeScript',
    'Tailwind CSS',
    'Responsive UI Engineering',
    'Frontend Architecture',
    'State Management',
    'API Integration',
    'GSAP',
    'Redux Toolkit',
    'TanStack Query',
    'Axios',
    'ShadCN UI',
    'Radix UI',
    'Recharts',
    'React Hook Form',
    'Node.js',
    'Express',
    'PostgreSQL',
    'Supabase',
    'Prisma',
    'Docker',
    'Git',
    'REST APIs',
  ],
};

export const unverifiedProfileFields = [
  'email',
  'location',
  'LinkedIn URL',
  'education',
  'SoftAccess dates',
  'availability status',
] as const;
