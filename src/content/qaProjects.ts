export type QAProject = {
  id: string;
  slug: string;
  name: string;
  domain: string;
  status: 'Production' | 'In development' | 'Automation practice';
  context: 'Professional work' | 'Personal project';
  role: string;
  sourceUrl: string;
  summary: string;
  overview: string;
  coverage: string[];
  metrics: { value: string; label: string }[];
  contributions: string[];
  outcomes: string[];
};

// QA contributions and figures from Tayab's updated resume. Frameworks are
// named per project only where the resume explicitly identifies them.
export const qaProjects: QAProject[] = [
  {
    id: '01', slug: 'nurmed-qa', name: 'Nurmed.ai', domain: 'AI / Healthcare',
    status: 'Production', context: 'Professional work', role: 'SQA Engineer · Tallysis.Inc',
    sourceUrl: 'https://github.com/TayabGhafor/Nurmed-Staging-E2E-',
    summary: 'Testing diagnosis workflows, patient data, and hospital operations—with API, authentication, and RPA validation.',
    overview: 'An AI-powered healthcare management platform for diagnosis, patient records, and hospital operations. My QA work focused on reliable clinical workflows, accurate data, and secure access from development through release.',
    coverage: ['End-to-end testing', 'API & authentication', 'RPA validation', 'Data integrity'],
    metrics: [{ value: '~60', label: 'Test cases' }, { value: '08', label: 'Modules covered' }, { value: '12', label: 'API endpoints' }],
    contributions: [
      'Designed and executed end-to-end test strategies for AI-assisted diagnosis workflows across eight modules.',
      'Validated RPA payload structures and medical data models across more than 15 fields, catching six accuracy and compliance issues before production.',
      'Built API and authentication coverage for 12 endpoints, with automation to support repeatable regression checks.',
    ],
    outcomes: [
      'Contributed to an estimated 20% reduction in post-release defects.',
      'Reduced manual regression time by roughly 25% through automation.',
      'Supported a release cycle with zero critical post-release incidents through data integrity and patient record security checks.',
    ],
  },
  {
    id: '02', slug: 'fictionpub-qa', name: 'Fictionpub.ai', domain: 'AI / Publishing',
    status: 'Production', context: 'Professional work', role: 'SQA Engineer · Tallysis.Inc',
    sourceUrl: 'https://github.com/TayabGhafor/fictionpub-playwright',
    summary: 'Cross-browser testing and automated regression for the complete book journey: generate, edit, and publish.',
    overview: 'An AI-based book generation and publishing platform. I worked across functional testing, UI and usability checks, cross-browser coverage, and automation of the journeys authors rely on.',
    coverage: ['Functional & UI testing', 'Cross-browser QA', 'Regression automation', 'Performance validation'],
    metrics: [{ value: '04', label: 'Browsers covered' }, { value: '08', label: 'Automated flows' }, { value: '20+', label: 'Pre-launch defects found' }],
    contributions: [
      'Led functional, UI/UX, and cross-browser testing across Chrome, Firefox, Safari, and Edge.',
      'Automated eight critical user flows across content generation, editing, and publishing.',
      'Conducted performance and load validation for AI content generation, identifying three bottlenecks before release.',
    ],
    outcomes: [
      'Identified more than 20 defects before launch.',
      'Cut regression cycle time from approximately two days to under six hours.',
      'Contributed to an approximately 15% reduction in post-release defects through improved coverage.',
    ],
  },
  {
    id: '03', slug: '9squid-qa', name: '9Squid', domain: 'Fintech / Investments',
    status: 'In development', context: 'Professional work', role: 'SQA Engineer · Tallysis.Inc',
    sourceUrl: 'https://github.com/TayabGhafor/9squid-playwright',
    summary: 'Validating deal lifecycles, investment workflows, and financial transactions with security and edge-case coverage.',
    overview: 'A fintech investment platform connecting originators and investors through deal-based financial transactions. My work supports release readiness through transaction validation, automation, and early identification of financial workflow risks.',
    coverage: ['Test scenario design', 'Transaction validation', 'Security & edge cases', 'Workflow automation'],
    metrics: [{ value: '40+', label: 'Test scenarios' }, { value: '06', label: 'Automated flows' }, { value: '05', label: 'High-severity issues found' }],
    contributions: [
      'Defined more than 40 scenarios covering the deal lifecycle, investment workflows, and transaction validation.',
      'Performed security and edge-case testing across ten financial operation types, surfacing five high-severity issues before launch.',
      'Built automation coverage for six critical financial flows and collaborated with developers on compliance and risk fixes.',
    ],
    outcomes: [
      'Reduced manual testing effort by an estimated 30% through automation.',
      'Helped resolve eight compliance and risk issues ahead of production launch.',
      'Established coverage for core financial journeys while the platform remained in development.',
    ],
  },
  {
    id: '04', slug: 'cypress-nextjs-qa', name: 'Cypress / Next.js', domain: 'Web / E2E Automation',
    status: 'Automation practice', context: 'Personal project', role: 'QA Automation',
    sourceUrl: 'https://github.com/TayabGhafor/Cypress-Course',
    summary: 'A Cypress end-to-end suite for critical Next.js application flows, with headless execution and visual run evidence.',
    overview: 'A personal automation project focused on dependable end-to-end coverage for a Next.js application. The emphasis is on repeatable critical-flow checks and a test structure that is easy to maintain.',
    coverage: ['Cypress', 'Next.js', 'End-to-end testing', 'Headless execution'],
    metrics: [{ value: 'E2E', label: 'Critical user flows' }, { value: 'Headless', label: 'Test execution' }, { value: 'Visual', label: 'Screenshots & video' }],
    contributions: [
      'Developed end-to-end test cases with Cypress for critical application journeys.',
      'Executed tests in headless mode with screenshots and video recording.',
      'Organized the suite around regression stability and a maintainable test structure.',
    ],
    outcomes: [
      'Created repeatable regression checks for critical flows.',
      'Captured screenshots and video to support investigation of test failures.',
      'Practiced maintainable automation design in a Next.js application context.',
    ],
  },
  {
    id: '05', slug: 'saucedemo-qa', name: 'SauceDemo Automation', domain: 'E-commerce / Automation',
    status: 'Automation practice', context: 'Personal project', role: 'QA Automation',
    sourceUrl: 'https://github.com/TayabGhafor/Selenium-Practice',
    summary: 'Python and Selenium automation covering login, navigation, form handling, and functional validations.',
    overview: 'A personal Python and Selenium WebDriver suite for the SauceDemo e-commerce site. This project develops practical browser automation skills, from locator selection to structured functional scenarios.',
    coverage: ['Python', 'Selenium WebDriver', 'Functional testing', 'Locator strategies'],
    metrics: [{ value: 'Python', label: 'Test scripts' }, { value: 'Selenium', label: 'Browser automation' }, { value: 'UI', label: 'Functional coverage' }],
    contributions: [
      'Automated core user flows including login, navigation, form handling, and validations.',
      'Used ID, CSS, and XPath locators, with handling for dynamic elements, alerts, popups, checkboxes, and dropdowns.',
      'Structured scripts from basic to intermediate scenarios to develop test design and functional coverage.',
    ],
    outcomes: [
      'Built a reusable foundation for browser-based functional automation.',
      'Developed practical experience with locator reliability and interactive UI states.',
      'Demonstrated progression from basic checks to more involved functional scenarios.',
    ],
  },
];
