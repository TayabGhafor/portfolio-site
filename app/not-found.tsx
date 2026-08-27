import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="not-found-shell">
      <span>[ 404 / SIGNAL_LOST ]</span>
      <h1>Page not found</h1>
      <p>That route is not in the portfolio index.</p>
      <Link href="/">Return home</Link>
    </main>
  );
}
