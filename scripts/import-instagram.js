#!/usr/bin/env node

/**
 * Import Instagram export data into the daily photo project.
 *
 * Usage:
 *   node scripts/import-instagram.js <instagram-json-path> <year>
 *
 * The Instagram export JSON is expected to contain an array (or an object with
 * an array) of posts. Each post typically has:
 *   - media (array of { uri, creation_timestamp })  OR  media_url / uri at top level
 *   - title (caption text)
 *   - creation_timestamp (unix seconds)
 *
 * The script will:
 *   1. Parse each post, extract date + caption + image paths
 *   2. Copy images to public/photos/{year}/
 *   3. Write content/photos-{year}.json
 */

import fs from "fs";
import path from "path";

const args = process.argv.slice(2);
if (args.length < 2) {
  console.error("Usage: node scripts/import-instagram.js <instagram-json-path> <year>");
  process.exit(1);
}

const [jsonPath, yearArg] = args;
const year = parseInt(yearArg, 10);

if (isNaN(year)) {
  console.error(`Invalid year: ${yearArg}`);
  process.exit(1);
}

const projectRoot = path.resolve(import.meta.dirname, "..");
const photosDir = path.join(projectRoot, "public", "photos", String(year));
const contentFile = path.join(projectRoot, "content", `photos-${year}.json`);

fs.mkdirSync(photosDir, { recursive: true });

const raw = fs.readFileSync(path.resolve(jsonPath), "utf-8");
let parsed = JSON.parse(raw);

// Instagram exports can be a bare array or wrapped in an object
let posts = Array.isArray(parsed) ? parsed : parsed.posts || parsed.media || Object.values(parsed).find(Array.isArray);

if (!Array.isArray(posts)) {
  console.error("Could not find posts array in the Instagram export JSON.");
  process.exit(1);
}

// URIs in the export are relative to the export root (e.g. "media/posts/202410/...")
// The JSON lives at <export-root>/your_instagram_activity/media/posts_1.json
const jsonDir = path.dirname(path.resolve(jsonPath));
const instagramRoot = path.resolve(jsonDir, "..", "..");
const photoEntries = [];
const seenDates = new Set();

for (const post of posts) {
  // Extract timestamp
  const timestamp = post.creation_timestamp
    || (post.media && post.media[0] && post.media[0].creation_timestamp)
    || null;

  if (!timestamp) {
    console.warn("Skipping post with no timestamp:", JSON.stringify(post).slice(0, 100));
    continue;
  }

  const dateObj = new Date(timestamp * 1000);
  const postYear = dateObj.getFullYear();

  if (postYear !== year) continue;

  const dateStr = [
    postYear,
    String(dateObj.getMonth() + 1).padStart(2, "0"),
    String(dateObj.getDate()).padStart(2, "0"),
  ].join("-");

  if (seenDates.has(dateStr)) {
    console.warn(`Duplicate date ${dateStr}, skipping.`);
    continue;
  }
  seenDates.add(dateStr);

  // Extract caption — post.title for multi-media, otherwise on first media item
  let caption = post.title
    || (post.media && post.media[0] && post.media[0].title)
    || "";

  // Strip trailing " - NNN/365 #hashtag" patterns from daily photo captions
  caption = caption.replace(/\s*-\s*\d+\/365\s*#\S*$/, "").trim();

  // Extract media URIs
  let mediaItems = [];
  if (post.media && Array.isArray(post.media)) {
    mediaItems = post.media.map((m) => m.uri).filter(Boolean);
  } else if (post.uri) {
    mediaItems = [post.uri];
  } else if (post.media_url) {
    mediaItems = [post.media_url];
  }

  if (mediaItems.length === 0) {
    console.warn(`No media found for ${dateStr}, skipping.`);
    continue;
  }

  // Copy images
  const images = [];
  for (const uri of mediaItems) {
    const srcPath = path.resolve(instagramRoot, uri);
    const filename = path.basename(srcPath);
    const destPath = path.join(photosDir, filename);

    if (fs.existsSync(srcPath)) {
      fs.copyFileSync(srcPath, destPath);
      images.push(filename);
    } else {
      console.warn(`Image not found: ${srcPath}`);
    }
  }

  if (images.length > 0) {
    photoEntries.push({ date: dateStr, caption, images });
  }
}

// Sort by date
photoEntries.sort((a, b) => a.date.localeCompare(b.date));

fs.writeFileSync(contentFile, JSON.stringify(photoEntries, null, 2) + "\n");

console.log(`Imported ${photoEntries.length} photos for ${year}`);
console.log(`  JSON: ${contentFile}`);
console.log(`  Images: ${photosDir}`);
