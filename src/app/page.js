import Link from "next/link";
import Image from "next/image";
import { getAllPhotos, getPhotoSrcs } from "@/lib/photos";
import { getAllPosts } from "@/lib/blog";
import { getBooksByShelf } from "@/lib/books";

export default function Home() {
  const photos = getAllPhotos(2026);
  const latestPhoto = photos[0];
  const latestPhotoSrc = latestPhoto ? getPhotoSrcs(latestPhoto)[0] : null;

  const posts = getAllPosts();
  const latestPost = posts[0];

  const readBooks = getBooksByShelf("read");
  const latestBook = readBooks[0];

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <section className="mb-16 text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Patrick Dineen
        </h1>
        <p className="mt-4 text-lg text-neutral-400">
          A Man, a Plan, A Website, Panama
        </p>
      </section>

      <div className="grid gap-8 sm:grid-cols-3">
        <Link
          href="/photos"
          className="group block rounded-xl border border-white/10 p-6 transition-colors hover:border-white/25"
        >
          {latestPhoto && latestPhotoSrc && (
            <div className="relative mb-4 aspect-[3/2] overflow-hidden rounded-lg bg-neutral-800">
              <Image
                src={latestPhotoSrc}
                alt={latestPhoto.title}
                fill
                sizes="(max-width: 640px) 100vw, 33vw"
                className="object-cover"
              />
            </div>
          )}
          <h2 className="text-lg font-semibold group-hover:text-neutral-300 transition-colors">
            Photos
          </h2>
          <p className="mt-1 text-sm text-neutral-400">
            My yearly Project 365's
          </p>
        </Link>

        <Link
          href="/blog"
          className="group block rounded-xl border border-white/10 p-6 transition-colors hover:border-white/25"
        >
          {latestPost && (
            <div className="mb-4 rounded-lg bg-white/5 p-4">
              <p className="text-sm font-medium">{latestPost.title}</p>
              <p className="mt-1 text-xs text-neutral-500">{latestPost.date}</p>
            </div>
          )}
          <h2 className="text-lg font-semibold group-hover:text-neutral-300 transition-colors">
            Blog
          </h2>
          <p className="mt-1 text-sm text-neutral-400">
            Thoughts and writing
          </p>
        </Link>

        <Link
          href="/books"
          className="group block rounded-xl border border-white/10 p-6 transition-colors hover:border-white/25"
        >
          {latestBook && (
            <div className="mb-4 rounded-lg bg-white/5 p-4">
              <p className="text-sm font-medium">{latestBook.title}</p>
              <p className="mt-1 text-xs text-neutral-500">{latestBook.author}</p>
            </div>
          )}
          <h2 className="text-lg font-semibold group-hover:text-neutral-300 transition-colors">
            Books
          </h2>
          <p className="mt-1 text-sm text-neutral-400">
            What I've been reading
          </p>
        </Link>
      </div>
    </div>
  );
}
