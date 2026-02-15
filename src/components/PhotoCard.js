import Link from "next/link";
import Image from "next/image";

export default function PhotoCard({ photo, src, count }) {
  const day = new Date(photo.date + "T12:00:00").getDate();

  return (
    <Link
      href={`/day/${photo.date}`}
      className="group relative aspect-square overflow-hidden rounded-lg bg-neutral-800"
    >
      <Image
        src={src}
        alt={photo.title}
        fill
        sizes="(max-width: 640px) 33vw, (max-width: 1024px) 14vw, 120px"
        className="object-cover transition-transform duration-300 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
      <span className="absolute bottom-1 right-1.5 rounded bg-black/50 px-1.5 py-0.5 text-xs font-semibold text-white drop-shadow">
        {day}
      </span>
      {count > 1 && (
        <span className="absolute top-1.5 right-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-white/90 px-1 text-[10px] font-bold text-black">
          {count}
        </span>
      )}
    </Link>
  );
}
