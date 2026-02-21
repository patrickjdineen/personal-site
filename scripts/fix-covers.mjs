#!/usr/bin/env node

/**
 * For books whose current ISBN13 has no cover on Open Library,
 * search for an alternative ISBN that does have a cover.
 */

import fs from "fs";
import path from "path";

const projectRoot = path.resolve(import.meta.dirname, "..");
const booksFile = path.join(projectRoot, "content", "books.json");
const books = JSON.parse(fs.readFileSync(booksFile, "utf-8"));

// First, identify which books are missing covers
async function hasCover(isbn) {
  const url = `https://covers.openlibrary.org/b/isbn/${isbn}-M.jpg?default=false`;
  try {
    const res = await fetch(url, { method: "HEAD", redirect: "follow" });
    return res.ok;
  } catch {
    return false;
  }
}

const missingCoverBooks = [];
for (const book of books) {
  if (!book.isbn13 || !(await hasCover(book.isbn13))) {
    missingCoverBooks.push(book);
  }
  await new Promise((r) => setTimeout(r, 50));
}

console.log(`${missingCoverBooks.length} books missing covers. Searching for alternatives...\n`);

let fixed = 0;

for (const book of missingCoverBooks) {
  const cleanTitle = book.title.replace(/\s*\([^)]*\)\s*$/, "").trim();
  const query = `${cleanTitle} ${book.author}`.trim();
  const url = `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&fields=isbn&limit=5`;

  try {
    const res = await fetch(url);
    if (!res.ok) {
      console.log(`  SKIP (HTTP ${res.status}): ${book.title}`);
      continue;
    }
    const data = await res.json();

    if (!data.docs || data.docs.length === 0) {
      console.log(`  NO RESULTS: ${book.title}`);
      continue;
    }

    // Collect all ISBN13s from all results
    const allIsbns = [];
    for (const doc of data.docs) {
      if (!doc.isbn) continue;
      for (const isbn of doc.isbn) {
        if (/^97[89]\d{10}$/.test(isbn)) {
          allIsbns.push(isbn);
        }
      }
    }

    // Try each ISBN until we find one with a cover
    let foundCover = false;
    for (const isbn of allIsbns) {
      if (await hasCover(isbn)) {
        book.isbn13 = isbn;
        fixed++;
        foundCover = true;
        console.log(`  FIXED: ${book.title} -> ${isbn}`);
        break;
      }
      await new Promise((r) => setTimeout(r, 50));
    }

    if (!foundCover) {
      console.log(`  NO COVER FOUND: ${book.title} (tried ${allIsbns.length} ISBNs)`);
    }
  } catch (err) {
    console.log(`  ERROR: ${book.title} - ${err.message}`);
  }

  await new Promise((r) => setTimeout(r, 200));
}

fs.writeFileSync(booksFile, JSON.stringify(books, null, 2) + "\n");
console.log(`\nDone. Fixed ${fixed} out of ${missingCoverBooks.length} missing covers.`);
