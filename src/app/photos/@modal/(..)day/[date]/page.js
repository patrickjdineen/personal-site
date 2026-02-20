import { notFound } from "next/navigation";
import { getPhotoByDate, getAdjacentPhotos, getPhotoSrcs } from "@/lib/photos";
import PhotoModal from "@/components/PhotoModal";

export default async function InterceptedDayPage({ params }) {
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
    <PhotoModal
      photo={{ caption: photo.caption, date: photo.date }}
      srcs={srcs}
      displayDate={displayDate}
      prev={prev ? { date: prev.date } : null}
      next={next ? { date: next.date } : null}
    />
  );
}
