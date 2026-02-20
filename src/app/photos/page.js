import { getAllPhotos, getPhotoSrcs, YEARS } from "@/lib/photos";
import PhotosPageClient from "./PhotosPageClient";

export const metadata = {
  title: "Photos — Patrick Dineen",
  description: "A photo every day",
};

export default function PhotosPage() {
  const yearData = {};
  for (const year of YEARS) {
    const photos = getAllPhotos(year);
    const photoSrcs = {};
    for (const photo of photos) {
      const srcs = getPhotoSrcs(photo);
      if (srcs.length > 0) {
        photoSrcs[photo.date] = srcs;
      }
    }
    yearData[year] = { photos, photoSrcs };
  }

  return <PhotosPageClient years={YEARS} yearData={yearData} />;
}
