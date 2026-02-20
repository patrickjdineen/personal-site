"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";

export default function PhotoViewer({ photo, srcs, displayDate, prev, next, isModal }) {
  const router = useRouter();
  // null = overview (side-by-side), number = single photo view
  const [activeIndex, setActiveIndex] = useState(srcs.length > 1 ? null : 0);

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
      if (e.key === "Escape") {
        if (activeIndex !== null && srcs.length > 1) {
          setActiveIndex(null);
        } else if (isModal) {
          dismiss();
        }
        return;
      }
      if (e.key === "ArrowLeft") {
        if (activeIndex !== null && activeIndex > 0) {
          setActiveIndex(activeIndex - 1);
        } else if (activeIndex === 0 && srcs.length > 1) {
          setActiveIndex(null);
        } else if (prev) {
          navigate(prev.date);
        }
      }
      if (e.key === "ArrowRight") {
        if (activeIndex !== null && activeIndex < srcs.length - 1) {
          setActiveIndex(activeIndex + 1);
        } else if (activeIndex === srcs.length - 1 && srcs.length > 1) {
          setActiveIndex(null);
        } else if (next) {
          navigate(next.date);
        }
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [dismiss, navigate, prev, next, isModal, srcs.length, activeIndex]);

  // Reset to overview when navigating to a new day
  useEffect(() => {
    setActiveIndex(srcs.length > 1 ? null : 0);
  }, [photo.date, srcs.length]);

  const onTouchStart = useCallback((e) => {
    touchStartX.current = e.touches[0].clientX;
  }, []);

  const onTouchEnd = useCallback((e) => {
    if (touchStartX.current === null) return;
    const diff = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(diff) < 50) return;
    if (activeIndex === null) {
      // In overview mode, swipe navigates between days
      if (diff > 0 && prev) navigate(prev.date);
      if (diff < 0 && next) navigate(next.date);
    } else {
      if (diff > 0) {
        if (activeIndex > 0) setActiveIndex(activeIndex - 1);
        else setActiveIndex(null);
      } else {
        if (activeIndex < srcs.length - 1) setActiveIndex(activeIndex + 1);
        else setActiveIndex(null);
      }
    }
  }, [navigate, prev, next, srcs.length, activeIndex]);

  const isOverview = activeIndex === null;

  const content = (
    <div className="mx-auto w-full max-w-4xl px-4 sm:px-6 py-3 sm:py-6" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
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

      {isOverview ? (
        <div className="flex gap-4">
          {srcs.map((src, i) => (
            <button
              key={src}
              onClick={() => setActiveIndex(i)}
              className="flex-1 flex justify-center cursor-pointer"
            >
              <Image
                src={src}
                alt={`${displayDate} (${i + 1}/${srcs.length})`}
                width={1200}
                height={1200}
                sizes={`(max-width: 896px) ${Math.round(100 / srcs.length)}vw, ${Math.round(896 / srcs.length)}px`}
                className="max-h-[80vh] w-auto rounded-xl object-contain hover:opacity-90 transition-opacity"
                priority={i === 0}
              />
            </button>
          ))}
        </div>
      ) : (
        <>
          <div className="relative">
            <div className="flex justify-center">
              <Image
                src={srcs[activeIndex]}
                alt={
                  srcs.length > 1
                    ? `${displayDate} (${activeIndex + 1}/${srcs.length})`
                    : displayDate
                }
                width={1200}
                height={1200}
                sizes="(max-width: 896px) 100vw, 896px"
                className="max-h-[80vh] w-auto rounded-xl object-contain"
                priority
              />
            </div>
            <button
              onClick={() => {
                if (srcs.length > 1 && activeIndex > 0) {
                  setActiveIndex(activeIndex - 1);
                } else if (srcs.length > 1) {
                  setActiveIndex(null);
                } else if (prev) {
                  navigate(prev.date);
                }
              }}
              className="absolute left-0 top-0 h-full w-1/4 cursor-w-resize opacity-0"
              aria-label="Previous photo"
            />
            <button
              onClick={() => {
                if (srcs.length > 1 && activeIndex < srcs.length - 1) {
                  setActiveIndex(activeIndex + 1);
                } else if (srcs.length > 1) {
                  setActiveIndex(null);
                } else if (next) {
                  navigate(next.date);
                }
              }}
              className="absolute right-0 top-0 h-full w-1/4 cursor-e-resize opacity-0"
              aria-label="Next photo"
            />
          </div>

          {srcs.length > 1 && (
            <div className="mt-3 flex justify-center gap-2">
              <button
                onClick={() => setActiveIndex(null)}
                className="text-xs text-neutral-400 hover:text-white transition-colors"
              >
                View all
              </button>
              {srcs.map((src, i) => (
                <button
                  key={src}
                  onClick={() => setActiveIndex(i)}
                  className={`h-2 w-2 rounded-full transition-colors ${
                    i === activeIndex ? "bg-white" : "bg-neutral-600 hover:bg-neutral-400"
                  }`}
                  aria-label={`View photo ${i + 1}`}
                />
              ))}
            </div>
          )}
        </>
      )}
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
