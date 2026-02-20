"use client";

import { useState } from "react";
import PhotoGrid from "@/components/PhotoGrid";

export default function PhotosPageClient({ years, yearData }) {
  const [activeYear, setActiveYear] = useState(years[0]);
  const { photos, photoSrcs } = yearData[activeYear];

  return (
    <div className="mx-auto max-w-[76rem] px-6 py-10">
      <div className="mb-8 flex items-center gap-4">
        {years.map((year) => (
          <button
            key={year}
            onClick={() => setActiveYear(year)}
            className={`text-3xl font-bold tracking-tight transition-colors ${
              year === activeYear
                ? "text-white"
                : "text-neutral-600 hover:text-neutral-400"
            }`}
          >
            {year}
          </button>
        ))}
      </div>
      <PhotoGrid photos={photos} photoSrcs={photoSrcs} year={activeYear} />
    </div>
  );
}
