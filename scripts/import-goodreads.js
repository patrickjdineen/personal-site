#!/usr/bin/env node

/**
 * Import Goodreads CSV export into content/books.json
 *
 * Usage:
 *   node scripts/import-goodreads.js <csv-path>
 */

import fs from "fs";
import path from "path";
import { parse } from "csv-parse/sync";

const args = process.argv.slice(2);
if (args.length < 1) {
  console.error("Usage: node scripts/import-goodreads.js <csv-path>");
  process.exit(1);
}

const csvPath = path.resolve(args[0]);
const projectRoot = path.resolve(import.meta.dirname, "..");
const outputFile = path.join(projectRoot, "content", "books.json");

const raw = fs.readFileSync(csvPath, "utf-8");
const records = parse(raw, { columns: true, skip_empty_lines: true });

function cleanIsbn(val) {
  if (!val) return "";
  // Strip ="..." wrapping from Goodreads export
  return val.replace(/^="/, "").replace(/"$/, "").trim();
}

function cleanReview(text) {
  if (!text) return "";
  // Convert <br/> tags to newlines, strip other HTML
  return text
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .trim();
}

const shelves = new Set(["read", "dnf"]);

const books = records
  .filter((row) => shelves.has(row["Exclusive Shelf"]))
  .map((row) => ({
    title: row["Title"] || "",
    author: row["Author"] || "",
    isbn13: cleanIsbn(row["ISBN13"]),
    rating: parseInt(row["My Rating"], 10) || 0,
    dateRead: row["Date Read"] || "",
    shelf: row["Exclusive Shelf"],
    review: cleanReview(row["My Review"]),
    pageCount: parseInt(row["Number of Pages"], 10) || 0,
    yearPublished: parseInt(row["Year Published"], 10) || 0,
  }))
  .sort((a, b) => {
    // Newest first; empty dates sort to end
    if (!a.dateRead && !b.dateRead) return 0;
    if (!a.dateRead) return 1;
    if (!b.dateRead) return -1;
    return b.dateRead.localeCompare(a.dateRead);
  });

fs.writeFileSync(outputFile, JSON.stringify(books, null, 2) + "\n");

const readCount = books.filter((b) => b.shelf === "read").length;
const dnfCount = books.filter((b) => b.shelf === "dnf").length;
console.log(`Imported ${books.length} books (${readCount} read, ${dnfCount} dnf)`);
console.log(`  Output: ${outputFile}`);
