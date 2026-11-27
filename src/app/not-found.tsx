import Link from "next/link";

export default function NotFound() {
  return (
    <main className="grid min-h-[70vh] place-items-center bg-ivory px-6 text-center">
      <div className="flex flex-col items-center gap-4">
        <p className="font-display tracking-[0.2em] text-gold-dark">404</p>
        <h1 className="text-4xl">We couldn&apos;t find that page</h1>
        <p className="text-muted">It may have moved. Try the homepage or our programs.</p>
        <div className="flex gap-3">
          <Link href="/" className="btn-primary">Home</Link>
          <Link href="/programs" className="btn-outline">Programs</Link>
        </div>
      </div>
    </main>
  );
}
