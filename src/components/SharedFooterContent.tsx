'use client';

import { Fragment, useState } from 'react';
import { ScrambleText } from './SiteControls';

export function SharedFooterContent({ time, motion = true, showHoverCue = false }: { time: string; motion?: boolean; showHoverCue?: boolean }) {
  const [emailRun, setEmailRun] = useState(0);
  const [timeRun, setTimeRun] = useState(0);
  const animateEmail = () => motion && setEmailRun((value) => value + 1);
  const animateTime = () => motion && setTimeRun((value) => value + 1);

  return (
    <Fragment>
      <a className="footer-scramble-scope" href="mailto:tayabghafor@gmail.com" onPointerEnter={animateEmail} onFocus={animateEmail}>
        <span>Wanna say Hello?</span>
        <strong><ScrambleText text="tayabghafor@gmail.com" run={emailRun} enabled={motion && emailRun > 0} /></strong>
      </a>
      <div className="footer-scramble-scope" tabIndex={0} aria-label={`Local time Pakistan ${time}`} onPointerEnter={animateTime} onFocus={animateTime}>
        {showHoverCue && <small className="footer-hover-cue" aria-hidden="true">HOVER: ONE PASS</small>}
        <span><ScrambleText text="Local Time" run={timeRun} enabled={motion && timeRun > 0} /></span>
        <strong><ScrambleText text={`Pakistan / PKT  ${time}`} run={timeRun} enabled={motion && timeRun > 0} delay={55} /></strong>
      </div>
    </Fragment>
  );
}
