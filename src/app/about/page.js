export const metadata = {
  title: "About — Patrick Dineen",
  description: "About Patrick Dineen",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="mb-8 text-3xl font-bold tracking-tight">About</h1>
      <div className="space-y-4 text-neutral-300 leading-relaxed">
        <p>
          Hi, I&apos;m Patrick. Welcome to my corner of the internet.
        </p>
        <p>
          I&apos;m a software engineer who enjoys building things for the web.
          When I&apos;m not writing code, you can usually find me with a camera
          in hand — I&apos;m currently working on a daily photo project for 2026.
        </p>
        <p>
          This site is where I share my photos, projects, and occasional writing.
        </p>
      </div>
    </div>
  );
}
