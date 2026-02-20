import fs from "fs";
import path from "path";

const booksFile = path.join(process.cwd(), "content", "books.json");

export function getAllBooks() {
  if (!fs.existsSync(booksFile)) return [];
  const raw = fs.readFileSync(booksFile, "utf-8");
  return JSON.parse(raw);
}

export function getBooksByShelf(shelf) {
  return getAllBooks().filter((b) => b.shelf === shelf);
}
