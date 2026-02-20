import { notFound } from "next/navigation";
import { getAllPhotos, getPhotoByDate, getAdjacentPhotos, getPhotoSrcs } from "@/lib/photos";
import PhotoViewer from "@/components/PhotoViewer";

export function generateStaticParams() {
  return getAllPhotos().map((p) => ({ date: p.date }));
}

export async function generateMetadata({ params }) {
  const { date } = await params;
  const photo = getPhotoByDate(date);
  if (!photo) return {};
  const displayDate = new Date(date + "T12:00:00").toLocaleDateString(
    "en-US",
    { weekday: "long", year: "numeric", month: "long", day: "numeric" }
  );
  return { title: `${displayDate} — Daily Photo 2026` };
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
    <PhotoViewer
      photo={{ caption: photo.caption, date: photo.date }}
      srcs={srcs}
      displayDate={displayDate}
      prev={prev ? { date: prev.date } : null}
      next={next ? { date: next.date } : null}
    />
  );
}
