'use client';

import { useState } from 'react';
import { InteriorChrome } from '../../src/components/InteriorChrome';
import { ScrambleText } from '../../src/components/SiteControls';

const socials = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/tayabmalik' },
  { label: 'Upwork', href: 'https://www.upwork.com/freelancers/~0103602940333795be' },
  { label: 'GitHub', href: 'https://github.com/TayabGhafor' },
];

function HoverScramble({ text, className = '' }: { text: string; className?: string }) {
  const [run, setRun] = useState(0);
  const animate = () => setRun((value) => value + 1);
  return <span className={`contact-scramble ${className}`} onPointerEnter={animate} onFocus={animate} tabIndex={0}><span className="contact-scramble-static">{text}</span><span className="contact-scramble-live" aria-hidden="true"><ScrambleText text={text} run={run} enabled={run > 0} /></span></span>;
}

export default function ContactPage() {
  return <InteriorChrome
    currentPage="contact"
    index="04"
    label="CONTACT"
    wide
    showIndex={false}
    aside={<div className="contact-corner-title" aria-hidden="true"><HoverScramble text="CONTACT" /></div>}
  >
    <main className="about-content contact-reference">
      <h1 className="contact-seo-title">Contact Tayab Malik</h1>
      <section className="contact-reference-rail" aria-label="Contact Tayab Malik">
        <span className="contact-reference-prompt">WANNA SAY HELLO?</span>
        <div className="contact-reference-rule contact-rule-before-email" />
        <a className="contact-primary contact-email" href="mailto:tayabghafor@gmail.com"><HoverScramble text="TAYABGHAFOR@GMAIL.COM" /></a>
        <div className="contact-reference-rule contact-rule-before-phone" />
        <a className="contact-primary contact-phone" href="tel:+92146209702"><HoverScramble text="+92 146209702" /></a>
        <div className="contact-reference-rule contact-rule-after-phone" />
        <p className="contact-copyright">© 2026 TAYAB MALIK</p>
        <nav className="contact-socials" aria-label="Social links">{socials.map((social) => <a key={social.label} href={social.href} target="_blank" rel="noreferrer"><HoverScramble text={social.label.toUpperCase()} /></a>)}</nav>
      </section>
    </main>
  </InteriorChrome>;
}
