import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getAllPhotos, getPhotoByDate, getAdjacentPhotos, getPhotoSrcs } from "@/lib/photos";

export function generateStaticParams() {
  return getAllPhotos().map((p) => ({ date: p.date }));
}

export async function generateMetadata({ params }) {
  const { date } = await params;
  const photo = getPhotoByDate(date);
  if (!photo) return {};
  return { title: `${photo.title} — Daily Photo 2026` };
}

export default async function DayPage({ params }) {
  const { date } = await params;
  const photo = getPhotoByDate(date);
  if (!photo) notFound();

  const srcs = getPhotoSrcs(photo);
  if (srcs.length === 0) notFound();

  const { prev, next } = getAdjacentPhotos(date);

  const displayDate = new Date(photo.date + "T12:00:00").toLocaleDateString(
    "en-US",
    { weekday: "long", year: "numeric", month: "long", day: "numeric" }
  );

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <div className="mb-6 space-y-1 text-center">
        <h1 className="text-2xl font-bold">{photo.title}</h1>
        <p className="text-sm text-neutral-400">{displayDate}</p>
        {photo.caption && (
          <p className="mt-3 text-neutral-300">{photo.caption}</p>
        )}
      </div>

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

      <div className={srcs.length > 1 ? "flex gap-4" : ""}>
        {srcs.map((src, i) => (
          <div key={src} className={srcs.length > 1 ? "flex-1 flex justify-center" : "flex justify-center"}>
            <Image
              src={src}
              alt={srcs.length > 1 ? `${photo.title} (${i + 1}/${srcs.length})` : photo.title}
              width={1200}
              height={1200}
              sizes={srcs.length > 1 ? `(max-width: 896px) ${Math.round(100 / srcs.length)}vw, ${Math.round(896 / srcs.length)}px` : "(max-width: 896px) 100vw, 896px"}
              className="max-h-[80vh] w-auto rounded-xl object-contain"
              priority={i === 0}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
