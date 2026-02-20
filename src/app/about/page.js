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
          I am a lifelong resident of the Chicago Area. I'm a dad, a husband, a photographer, a reader, a hockey player, a golfer, and an implementation engineer. 
        </p>
        <p>
          This is a place of my own to aggregate my experiences and posts across platforms into one place that is under my own control. 
        </p>
      </div>
    </div>
  );
}
