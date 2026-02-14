import { getAllPhotos, getPhotoSrcs } from "@/lib/photos";
import PhotoGrid from "@/components/PhotoGrid";

export const metadata = {
  title: "Photos — Patrick Dineen",
  description: "A photo every day in 2026",
};

export default function PhotosPage() {
  const photos = getAllPhotos();
  const photoSrcs = {};
  const photoCounts = {};
  for (const photo of photos) {
    const srcs = getPhotoSrcs(photo);
    if (srcs.length > 0) {
      photoSrcs[photo.date] = srcs[0];
      photoCounts[photo.date] = srcs.length;
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="mb-8 text-3xl font-bold tracking-tight">2026</h1>
      <PhotoGrid photos={photos} photoSrcs={photoSrcs} photoCounts={photoCounts} />
    </div>
  );
}
