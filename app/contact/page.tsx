'use client';

import { InteriorChrome } from '../../src/components/InteriorChrome';
import { portfolio } from '../../src/content/portfolio';

const channels = [
  { id: '01', label: 'GitHub', value: 'TayabGhafor', href: portfolio.github ?? 'https://github.com/TayabGhafor' },
  { id: '02', label: 'Resume', value: 'Tayab-Malik.pdf', href: '/Tayab-Malik.pdf' },
  { id: '03', label: 'Dev lab', value: 'Syntax Guild', href: 'https://syntaxguild.vercel.app/' },
];

export default function ContactPage() {
  return (
    <InteriorChrome currentPage="contact" index="04" label="CONTACT" wide footerNote="Available for frontend work">
      <main className="about-content">
        <section className="about-intro about-block">
          <span className="about-section-id">[ SIGNAL / 04 ]</span>
          <h1>Start a brief</h1>
          <p className="about-lede">Open to frontend opportunities</p>
          <h2>React, Next.js, and product interfaces</h2>
          <p>If you have a product, a rebuild, or a SaaS interface that needs to feel sharper in production, reach out through one of the channels below.</p>
        </section>

        <section className="about-block contact-channels" aria-label="Contact channels">
          {channels.map((channel) => (
            <a className="contact-channel" href={channel.href} target="_blank" rel="noreferrer" key={channel.id}>
              <small>CH_{channel.id}</small>
              <strong>{channel.label}</strong>
              <span>{channel.value}</span>
            </a>
          ))}
        </section>
      </main>
    </InteriorChrome>
  );
}
