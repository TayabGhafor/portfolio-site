import type { PortfolioProfile } from '../types/portfolio';

export const resumeDownload = {
  href: '/Tayab-Malik.pdf',
  filename: 'Tayab-Malik-Resume.pdf',
} as const;

export const portfolio: PortfolioProfile = {
  name: 'Tayab Malik',
  primaryRole: 'SQA Engineer',
  secondaryRole: 'Software Testing / Quality Assurance',
  shortIntroduction:
    'SQA Engineer focused on manual testing, automation, and API validation across AI healthcare, publishing, and fintech platforms.',
  experience: [
    {
      role: 'SQA Engineer',
      company: 'Tallysis.Inc',
      dates: 'December 2025 - Present',
      status: 'active',
    },
    {
      role: 'Frontend Development Intern',
      company: 'CodeAlpha',
      dates: 'August 2025 - November 2025',
      status: 'completed',
    },
  ],
  email: 'tayabghafor@gmail.com',
  location: 'Lahore, Punjab, Pakistan',
  linkedIn: 'https://www.linkedin.com/in/tayabmalik',
  github: 'https://github.com/TayabGhafor',
  skills: [
    'UI Automation',
    'Manual Testing',
    'UI & Usability Testing',
    'API Testing / Postman',
    'Test Case Execution',
    'Bug Reporting',
    'Software Development Life Cycle (SDLC)',
    'Software Testing Life Cycle (STLC)',
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
  'availability status',
] as const;
