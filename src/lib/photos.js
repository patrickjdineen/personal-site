import fs from "fs";
import path from "path";

export const YEARS = [2026, 2024, 2020];

function photosFile(year) {
  return path.join(process.cwd(), "content", `photos-${year}.json`);
}

function yearFromDate(date) {
  return parseInt(date.slice(0, 4), 10);
}

export function getAllPhotos(year) {
  const raw = fs.readFileSync(photosFile(year), "utf-8");
  const photos = JSON.parse(raw);
  return photos.sort((a, b) => a.date.localeCompare(b.date));
}

export function getPhotoByDate(date) {
  const year = yearFromDate(date);
  const photos = getAllPhotos(year);
  return photos.find((p) => p.date === date) || null;
}

export function getAdjacentPhotos(date) {
  const year = yearFromDate(date);
  const photos = getAllPhotos(year);
  const idx = photos.findIndex((p) => p.date === date);
  return {
    prev: idx > 0 ? photos[idx - 1] : null,
    next: idx < photos.length - 1 ? photos[idx + 1] : null,
  };
}

export function getPhotoSrcs(photo) {
  if (photo.images && photo.images.length > 0) {
    const year = yearFromDate(photo.date);
    return photo.images.map((img) => `/photos/${year}/${img}`);
  }
  return [];
}
