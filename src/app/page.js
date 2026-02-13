import { getAllPhotos, getPhotoSrc } from "@/lib/photos";
import PhotoGrid from "@/components/PhotoGrid";

export default function Home() {
  const photos = getAllPhotos();
  const photoSrcs = {};
  for (const photo of photos) {
    const src = getPhotoSrc(photo.date);
    if (src) photoSrcs[photo.date] = src;
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="mb-8 text-3xl font-bold tracking-tight">2026</h1>
      <PhotoGrid photos={photos} photoSrcs={photoSrcs} />
    </div>
  );
}
