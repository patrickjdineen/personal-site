import { getBooksByShelf } from "@/lib/books";
import BookList from "./book-list";

export const metadata = {
  title: "Books — Patrick Dineen",
  description: "What I've been reading",
};

export default function BooksPage() {
  const readBooks = getBooksByShelf("read");
  const dnfBooks = getBooksByShelf("dnf");

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="mb-8 text-3xl font-bold tracking-tight">Books</h1>

      <section className="mb-12">
        <h2 className="mb-6 text-xl font-semibold text-neutral-300">
          Read ({readBooks.length})
        </h2>
        <BookList books={readBooks} />
      </section>

      {dnfBooks.length > 0 && (
        <section>
          <h2 className="mb-6 text-xl font-semibold text-neutral-300">
            Did Not Finish ({dnfBooks.length})
          </h2>
          <BookList books={dnfBooks} />
        </section>
      )}
    </div>
  );
}
