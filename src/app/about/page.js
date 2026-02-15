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
          Hi, I'm Patrick. 
        </p>
        <p>
          This site is where I share my daily photos, and occasional writing.
        </p>
      </div>
    </div>
  );
}
