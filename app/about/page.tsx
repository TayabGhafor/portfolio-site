'use client';

import Image from 'next/image';
import Link from 'next/link';
import { InteriorChrome } from '../../src/components/InteriorChrome';

const skillGroups = [
  { sector: 'Sector_01', title: 'Core & Frameworks', skills: ['JavaScript', 'TypeScript', 'React', 'Next.js', 'Tailwind CSS'] },
  { sector: 'Sector_02', title: 'Interface Engineering', skills: ['Responsive UI', 'Frontend Architecture', 'GSAP', 'ShadCN UI', 'Radix UI'] },
  { sector: 'Sector_03', title: 'State & Data', skills: ['Redux Toolkit', 'TanStack Query', 'Axios', 'React Hook Form', 'Recharts'] },
  { sector: 'Sector_04', title: 'Backend & Systems', skills: ['Node.js', 'Express', 'PostgreSQL', 'Supabase', 'Prisma', 'REST APIs'] },
  { sector: 'Sector_05', title: 'Tooling & Delivery', skills: ['Git', 'Docker', 'API Integration', 'Production UI'] },
];

export default function AboutPage() {
  return (
    <InteriorChrome
      currentPage="about"
      index="02"
      label="ABOUT"
      aside={(
        <aside className="about-portrait-stack" aria-label="Particle portrait of Tayab Malik">
          <div className="about-portrait-meta"><span>IDENTITY_CAPTURE</span><b>TM_02</b></div>
          {[0, 1, 2].map((frame) => (
            <div className={`about-portrait-frame frame-${frame + 1}`} key={frame}>
              <Image src="/portrait/tayab-particle-map-v2.webp" alt="" width={680} height={816} priority={frame === 0} />
              <i aria-hidden="true" />
            </div>
          ))}
          <div className="about-portrait-readout"><span>SUBJECT</span><b>TAYAB_MALIK</b><span>STATUS</span><b>ACTIVE</b></div>
        </aside>
      )}
    >
      <main className="about-content">
        <section className="about-intro about-block">
          <span className="about-section-id">[ PROFILE / 02 ]</span>
          <h1>Meet Tayab</h1>
          <p className="about-lede">A frontend developer</p>
          <h2>engineering polished web experiences</h2>
          <p>with a focus on functional, responsive, and visually refined interfaces. His work blends careful frontend architecture with motion, accessibility, and product thinking—turning ideas into experiences that feel clear, fast, and intentional.</p>
        </section>

        <section className="about-block about-focus">
          <span className="about-section-id">[ CORE_DIRECTION ]</span>
          <p className="about-lede">Focused on</p>
          <h2>modern product interfaces</h2>
          <p>he works across React, Next.js, TypeScript, state management, API integration, and full-stack foundations. The goal is always the same: build responsive products that are technically reliable and genuinely enjoyable to use.</p>
        </section>

        <section className="about-stack about-block" aria-labelledby="stack-title">
          <span className="about-section-id">[ CAPABILITY_INDEX ]</span>
          <p className="about-lede">A practical stack for</p>
          <h2 id="stack-title">product-focused development</h2>
          <div className="about-tech-stack">
            {skillGroups.map((group, groupIndex) => (
              <article className="about-tech-category" key={group.sector}>
                <header><span>{group.sector}</span><h3>{group.title}</h3></header>
                <ul>
                  {group.skills.map((skill, skillIndex) => {
                    const index = groupIndex * 8 + skillIndex;
                    return <li key={skill}><small>0x{index.toString(16).padStart(2, '0')}</small><span>{skill}</span></li>;
                  })}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section className="about-block about-experience">
          <span className="about-section-id">[ EXPERIENCE_LOG ]</span>
          <p className="about-lede">Professional foundation</p>
          <h2>learning by building</h2>
          <div className="experience-record">
            <span>ROLE_01</span><strong>Frontend Developer Intern</strong><i>SoftAccess</i><b>Interface Engineering</b>
          </div>
          <p>His project work spans agency websites, commerce experiences, social products, scheduling platforms, and SaaS-style interfaces—each one sharpening the balance between visual craft and maintainable code.</p>
        </section>

        <section className="about-block about-cta">
          <span className="about-section-id">[ NEXT_ACTION ]</span>
          <p className="about-lede">Have a product concept?</p>
          <h2>let&apos;s turn it into reality</h2>
          <p>Bring the idea. Tayab will bring frontend engineering, thoughtful interaction, and the persistence required to ship it properly.</p>
          <div className="about-cta-row"><Link href="/contact">Contact</Link><a href="/Tayab-Malik.pdf" target="_blank" rel="noreferrer">Open Resume ↗</a></div>
        </section>
      </main>
    </InteriorChrome>
  );
}
