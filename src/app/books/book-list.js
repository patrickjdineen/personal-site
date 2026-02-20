"use client";

import { useState } from "react";
import Image from "next/image";

function Stars({ rating }) {
  if (!rating) return null;
  return (
    <span className="text-sm text-neutral-400">
      {"★".repeat(rating)}
      {"☆".repeat(5 - rating)}
    </span>
  );
}

function Review({ text }) {
  const [expanded, setExpanded] = useState(false);
  if (!text) return null;

  const lines = text.split("\n").filter(Boolean);
  const isLong = lines.length > 2 || text.length > 200;

  return (
    <div className="mt-3">
      <p
        className={`text-sm text-neutral-400 whitespace-pre-line ${
          !expanded && isLong ? "line-clamp-3" : ""
        }`}
      >
        {text}
      </p>
      {isLong && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-1 text-xs text-neutral-500 hover:text-neutral-300 transition-colors"
        >
          {expanded ? "Show less" : "Show more"}
        </button>
      )}
    </div>
  );
}

function formatDate(dateStr) {
  if (!dateStr) return "";
  // Format: YYYY/MM/DD -> Month YYYY
  const [y, m] = dateStr.split("/");
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  return `${months[parseInt(m, 10) - 1]} ${y}`;
}

export default function BookList({ books }) {
  if (!books.length) {
    return <p className="text-neutral-400">No books yet.</p>;
  }

  return (
    <div className="space-y-6">
      {books.map((book, i) => (
        <div
          key={`${book.isbn13 || book.title}-${i}`}
          className="flex gap-4 rounded-lg border border-white/10 p-4"
        >
          {book.isbn13 ? (
            <Image
              src={`https://covers.openlibrary.org/b/isbn/${book.isbn13}-M.jpg`}
              alt={`Cover of ${book.title}`}
              width={80}
              height={120}
              className="h-[120px] w-[80px] shrink-0 rounded object-cover bg-neutral-800"
            />
          ) : (
            <div className="flex h-[120px] w-[80px] shrink-0 items-center justify-center rounded bg-neutral-800 text-xs text-neutral-500">
              No cover
            </div>
          )}

          <div className="min-w-0 flex-1">
            <h3 className="font-semibold leading-tight">{book.title}</h3>
            <p className="mt-1 text-sm text-neutral-400">{book.author}</p>
            <div className="mt-1 flex items-center gap-3">
              <Stars rating={book.rating} />
              {book.dateRead && (
                <span className="text-xs text-neutral-500">
                  {formatDate(book.dateRead)}
                </span>
              )}
              {book.pageCount > 0 && (
                <span className="text-xs text-neutral-500">
                  {book.pageCount}p
                </span>
              )}
            </div>
            <Review text={book.review} />
          </div>
        </div>
      ))}
    </div>
  );
}
