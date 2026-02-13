import fs from "fs";
import path from "path";

const PHOTOS_JSON = path.join(process.cwd(), "content", "photos.json");

export function getAllPhotos() {
  const raw = fs.readFileSync(PHOTOS_JSON, "utf-8");
  const photos = JSON.parse(raw);
  return photos.sort((a, b) => a.date.localeCompare(b.date));
}

export function getPhotoByDate(date) {
  const photos = getAllPhotos();
  return photos.find((p) => p.date === date) || null;
}

export function getAdjacentPhotos(date) {
  const photos = getAllPhotos();
  const idx = photos.findIndex((p) => p.date === date);
  return {
    prev: idx > 0 ? photos[idx - 1] : null,
    next: idx < photos.length - 1 ? photos[idx + 1] : null,
  };
}

export function getPhotoSrc(date) {
  const exts = ["jpg", "jpeg", "png", "webp"];
  for (const ext of exts) {
    const filePath = path.join(process.cwd(), "public", "photos", `${date}.${ext}`);
    if (fs.existsSync(filePath)) {
      return `/photos/${date}.${ext}`;
    }
  }
  return null;
}
