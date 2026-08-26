export type ProjectTier = 'A' | 'B' | 'C';

export type Project = {
  id: string;
  slug: string;
  name: string;
  category: string;
  tier: ProjectTier;
  summary: string;
  purpose: string;
  highlights: string[];
  verifiedTechnologies: string[];
  implementationNote?: string;
  liveUrl: string;
  sourceUrl?: string;
  assets: {
    cover: string;
    mobile: string;
  };
  palette: string[];
};

export type PortfolioProfile = {
  name: string;
  primaryRole: string;
  secondaryRole: string;
  shortIntroduction: string;
  experience: {
    role: string;
    company: string;
    companyUrl: string;
    dates?: string;
    status: 'unverified' | 'active' | 'completed';
  }[];
  skills: string[];
  email?: string;
  location?: string;
  linkedIn?: string;
  github?: string;
  availability?: string;
};
