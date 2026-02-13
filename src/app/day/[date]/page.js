import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getAllPhotos, getPhotoByDate, getAdjacentPhotos, getPhotoSrc } from "@/lib/photos";

export function generateStaticParams() {
  return getAllPhotos().map((p) => ({ date: p.date }));
}

export function generateMetadata({ params }) {
  const photo = getPhotoByDate(params.date);
  if (!photo) return {};
  return { title: `${photo.title} — Daily Photo 2026` };
}

export default function DayPage({ params }) {
  const photo = getPhotoByDate(params.date);
  if (!photo) notFound();

  const src = getPhotoSrc(params.date);
  if (!src) notFound();

  const { prev, next } = getAdjacentPhotos(params.date);

  const displayDate = new Date(photo.date + "T12:00:00").toLocaleDateString(
    "en-US",
    { weekday: "long", year: "numeric", month: "long", day: "numeric" }
  );

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <div className="mb-6 flex items-center justify-between">
        {prev ? (
          <Link
            href={`/day/${prev.date}`}
            className="text-sm text-neutral-400 hover:text-white transition-colors"
          >
            &larr; {prev.date}
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link
            href={`/day/${next.date}`}
            className="text-sm text-neutral-400 hover:text-white transition-colors"
          >
            {next.date} &rarr;
          </Link>
        ) : (
          <span />
        )}
      </div>

      <div className="relative aspect-[3/2] w-full overflow-hidden rounded-xl bg-neutral-800">
        <Image
          src={src}
          alt={photo.title}
          fill
          sizes="(max-width: 896px) 100vw, 896px"
          className="object-cover"
          priority
        />
      </div>

      <div className="mt-6 space-y-1">
        <h1 className="text-2xl font-bold">{photo.title}</h1>
        <p className="text-sm text-neutral-400">{displayDate}</p>
        {photo.caption && (
          <p className="mt-3 text-neutral-300">{photo.caption}</p>
        )}
      </div>
    </div>
  );
}
