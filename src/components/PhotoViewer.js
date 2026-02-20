"use client";

import { useRouter } from "next/navigation";
import { useEffect, useCallback, useRef } from "react";
import Image from "next/image";

export default function PhotoViewer({ photo, srcs, displayDate, prev, next, isModal }) {
  const router = useRouter();

  const navigate = useCallback(
    (date) => {
      if (isModal) {
        router.replace(`/day/${date}`);
      } else {
        router.push(`/day/${date}`);
      }
    },
    [router, isModal]
  );

  const dismiss = useCallback(() => {
    if (isModal) router.back();
  }, [router, isModal]);

  const touchStartX = useRef(null);

  useEffect(() => {
    function onKeyDown(e) {
      if (e.key === "Escape" && isModal) dismiss();
      if (e.key === "ArrowLeft" && prev) navigate(prev.date);
      if (e.key === "ArrowRight" && next) navigate(next.date);
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [dismiss, navigate, prev, next, isModal]);

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

  const content = (
    <div className="mx-auto w-full max-w-4xl px-4 sm:px-6 py-3 sm:py-6">
      <div className="mb-3 flex items-center justify-between gap-2">
        {prev ? (
          <button
            onClick={() => navigate(prev.date)}
            className="shrink-0 text-sm text-neutral-400 hover:text-white transition-colors"
          >
            &larr;
          </button>
        ) : (
          <span className="w-4" />
        )}
        <div className="min-w-0 text-center">
          <h1 className="text-base sm:text-xl font-bold leading-tight">{displayDate}</h1>
          {photo.caption && (
            <p className="text-sm text-neutral-400 truncate">{photo.caption}</p>
          )}
        </div>
        {next ? (
          <button
            onClick={() => navigate(next.date)}
            className="shrink-0 text-sm text-neutral-400 hover:text-white transition-colors"
          >
            &rarr;
          </button>
        ) : (
          <span className="w-4" />
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
  );

  if (isModal) {
    return (
      <div
        className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/80"
        onClick={dismiss}
      >
        <div onClick={(e) => e.stopPropagation()}>
          {content}
        </div>
      </div>
    );
  }

  return content;
}
