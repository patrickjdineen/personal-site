"use client";

import { useRouter } from "next/navigation";
import { useEffect, useCallback } from "react";
import Image from "next/image";

export default function PhotoModal({ photo, srcs, displayDate, prev, next }) {
  const router = useRouter();

  const dismiss = useCallback(() => {
    router.back();
  }, [router]);

  const navigate = useCallback(
    (date) => {
      router.replace(`/day/${date}`);
    },
    [router]
  );

  useEffect(() => {
    function onKeyDown(e) {
      if (e.key === "Escape") dismiss();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [dismiss]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/80"
      onClick={dismiss}
    >
      <div
        className="mx-auto w-full max-w-4xl px-6 py-10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-6 space-y-1 text-center">
          <h1 className="text-2xl font-bold">{photo.title}</h1>
          <p className="text-sm text-neutral-400">{displayDate}</p>
          {photo.caption && (
            <p className="mt-3 text-neutral-300">{photo.caption}</p>
          )}
        </div>

        <div className="mb-6 flex items-center justify-between">
          {prev ? (
            <button
              onClick={() => navigate(prev.date)}
              className="text-sm text-neutral-400 hover:text-white transition-colors"
            >
              &larr; {prev.date}
            </button>
          ) : (
            <span />
          )}
          {next ? (
            <button
              onClick={() => navigate(next.date)}
              className="text-sm text-neutral-400 hover:text-white transition-colors"
            >
              {next.date} &rarr;
            </button>
          ) : (
            <span />
          )}
        </div>

        <div className={srcs.length > 1 ? "flex gap-4" : ""}>
          {srcs.map((src, i) => (
            <div key={src} className={srcs.length > 1 ? "flex-1 flex justify-center" : "flex justify-center"}>
              <Image
                src={src}
                alt={
                  srcs.length > 1
                    ? `${photo.title} (${i + 1}/${srcs.length})`
                    : photo.title
                }
                width={1200}
                height={1200}
                sizes={srcs.length > 1 ? `(max-width: 896px) ${Math.round(100 / srcs.length)}vw, ${Math.round(896 / srcs.length)}px` : "(max-width: 896px) 100vw, 896px"}
                className="max-h-[80vh] w-auto rounded-xl object-contain"
                priority={i === 0}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
