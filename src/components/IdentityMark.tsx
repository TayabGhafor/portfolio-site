import Link from 'next/link';

export function IdentityMark() {
  return (
    <Link className="identity-mark" href="/" aria-label="Tayab Malik — Portfolio home">
      <span className="identity-name"><b>Tayab</b><b>Malik</b></span>
      <i aria-hidden="true" />
      <span className="identity-meta"><b>Portfolio</b><b>2026</b></span>
    </Link>
  );
}
