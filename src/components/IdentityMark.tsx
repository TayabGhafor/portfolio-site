'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ScrambleText } from './SiteControls';

export function IdentityMark({ motion = true }: { motion?: boolean }) {
  const [run, setRun] = useState(0);
  const animate = () => motion && setRun((value) => value + 1);

  return (
    <Link className="identity-mark" href="/" aria-label="Tayab Malik — Portfolio home" onPointerEnter={animate} onFocus={animate}>
      <span className="identity-name">
        <b><ScrambleText text="Tayab" run={run} enabled={motion && run > 0} /></b>
        <b><ScrambleText text="Malik" run={run} enabled={motion && run > 0} delay={45} /></b>
      </span>
      <i aria-hidden="true" />
      <span className="identity-meta">
        <b><ScrambleText text="Portfolio" run={run} enabled={motion && run > 0} delay={25} /></b>
        <b><ScrambleText text="2026" run={run} enabled={motion && run > 0} delay={70} /></b>
      </span>
    </Link>
  );
}
