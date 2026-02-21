#!/usr/bin/env node

/**
 * Check which books have missing covers on Open Library.
 * Open Library returns a 1x1 pixel image or redirects to a generic image when no cover exists.
 */

import fs from "fs";
import path from "path";

const projectRoot = path.resolve(import.meta.dirname, "..");
const booksFile = path.join(projectRoot, "content", "books.json");
const books = JSON.parse(fs.readFileSync(booksFile, "utf-8"));

const withIsbn = books.filter((b) => b.isbn13);
console.log(`Checking ${withIsbn.length} books for covers...\n`);

const missing = [];

for (const book of withIsbn) {
  const url = `https://covers.openlibrary.org/b/isbn/${book.isbn13}-M.jpg?default=false`;
  try {
    const res = await fetch(url, { method: "HEAD", redirect: "follow" });
    if (!res.ok) {
      missing.push(book);
      console.log(`  MISSING: ${book.title} (${book.isbn13})`);
    }
  } catch (err) {
    missing.push(book);
    console.log(`  ERROR: ${book.title} - ${err.message}`);
  }
  await new Promise((r) => setTimeout(r, 100));
}

console.log(`\n${missing.length} books missing covers out of ${withIsbn.length}`);
