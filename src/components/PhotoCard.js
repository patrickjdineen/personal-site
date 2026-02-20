import Link from "next/link";
import Image from "next/image";

export default function PhotoCard({ photo, srcs }) {
  const day = new Date(photo.date + "T12:00:00").getDate();

  return (
    <Link
      href={`/day/${photo.date}`}
      className="group relative aspect-square overflow-hidden rounded-lg bg-neutral-800"
    >
      <div className="absolute inset-0 flex">
        {srcs.map((src, i) => (
          <div key={src} className="relative flex-1 overflow-hidden">
            <Image
              src={src}
              alt={i === 0 ? photo.title : `${photo.title} (${i + 1})`}
              fill
              sizes={`(max-width: 640px) ${Math.round(33 / srcs.length)}vw, (max-width: 1024px) ${Math.round(14 / srcs.length)}vw, ${Math.round(120 / srcs.length)}px`}
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        ))}
      </div>
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
      <span className="absolute top-2 left-2 hidden sm:block rounded-md bg-black/70 px-2 py-0.5 text-sm font-bold text-white drop-shadow-md">
        {day}
      </span>
    </Link>
  );
}
