"use client";

import { useRouter } from "next/navigation";
import { useEffect, useCallback, useRef } from "react";
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

  const touchStartX = useRef(null);

  useEffect(() => {
    function onKeyDown(e) {
      if (e.key === "Escape") dismiss();
      if (e.key === "ArrowLeft" && prev) navigate(prev.date);
      if (e.key === "ArrowRight" && next) navigate(next.date);
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [dismiss, navigate, prev, next]);

  const onTouchStart = useCallback((e) => {
    touchStartX.current = e.touches[0].clientX;
  }, []);

  const onTouchEnd = useCallback((e) => {
    if (touchStartX.current === null) return;
    const diff = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(diff) < 50) return;
    if (diff > 0 && prev) navigate(prev.date);
    if (diff < 0 && next) navigate(next.date);
  }, [navigate, prev, next]);

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
          <h1 className="text-2xl font-bold">{displayDate}</h1>
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

        <div className="relative" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
          <div className={srcs.length > 1 ? "flex gap-4" : ""}>
            {srcs.map((src, i) => (
              <div key={src} className={srcs.length > 1 ? "flex-1 flex justify-center" : "flex justify-center"}>
                <Image
                  src={src}
                  alt={
                    srcs.length > 1
                      ? `${displayDate} (${i + 1}/${srcs.length})`
                      : displayDate
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
          {prev && (
            <button
              onClick={() => navigate(prev.date)}
              className="absolute left-0 top-0 h-full w-1/4 cursor-w-resize opacity-0"
              aria-label="Previous photo"
            />
          )}
          {next && (
            <button
              onClick={() => navigate(next.date)}
              className="absolute right-0 top-0 h-full w-1/4 cursor-e-resize opacity-0"
              aria-label="Next photo"
            />
          )}
        </div>
      </div>
    </div>
  );
}
