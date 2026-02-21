#!/usr/bin/env node

/**
 * Fill missing ISBN13s in content/books.json by searching Open Library.
 *
 * Usage:
 *   node scripts/fill-missing-isbns.mjs
 */

import fs from "fs";
import path from "path";

const projectRoot = path.resolve(import.meta.dirname, "..");
const booksFile = path.join(projectRoot, "content", "books.json");

const books = JSON.parse(fs.readFileSync(booksFile, "utf-8"));
const missing = books.filter((b) => !b.isbn13);

console.log(`Found ${missing.length} books without ISBN13. Looking up...\n`);

let found = 0;
let notFound = 0;

for (const book of missing) {
  // Clean title for search (remove series info in parens)
  const cleanTitle = book.title.replace(/\s*\([^)]*\)\s*$/, "").trim();
  const query = `${cleanTitle} ${book.author}`.trim();
  const url = `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&fields=isbn,title,author_name&limit=3`;

  try {
    const res = await fetch(url);
    if (!res.ok) {
      console.log(`  SKIP (HTTP ${res.status}): ${book.title}`);
      notFound++;
      continue;
    }

    const data = await res.json();

    if (data.docs && data.docs.length > 0) {
      // Find first ISBN13 (starts with 978 or 979, 13 digits)
      let isbn13 = "";
      for (const doc of data.docs) {
        if (!doc.isbn) continue;
        isbn13 = doc.isbn.find((i) => /^97[89]\d{10}$/.test(i)) || "";
        if (isbn13) break;
      }

      if (isbn13) {
        book.isbn13 = isbn13;
        found++;
        console.log(`  FOUND: ${book.title} -> ${isbn13}`);
      } else {
        notFound++;
        console.log(`  NO ISBN13: ${book.title}`);
      }
    } else {
      notFound++;
      console.log(`  NOT FOUND: ${book.title}`);
    }
  } catch (err) {
    notFound++;
    console.log(`  ERROR: ${book.title} - ${err.message}`);
  }

  // Rate limit: be polite to Open Library
  await new Promise((r) => setTimeout(r, 200));
}

fs.writeFileSync(booksFile, JSON.stringify(books, null, 2) + "\n");

console.log(`\nDone. Found ${found}, not found ${notFound}.`);
