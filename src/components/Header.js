import Link from "next/link";

export default function Header() {
  return (
    <header className="border-b border-white/10 px-6 py-4">
      <div className="mx-auto flex max-w-6xl items-center justify-between">
        <Link href="/" className="text-xl font-semibold tracking-tight">
          Daily Photo 2026
        </Link>
        <nav>
          <Link href="/" className="text-sm text-neutral-400 hover:text-white transition-colors">
            Gallery
          </Link>
        </nav>
      </div>
    </header>
  );
}
