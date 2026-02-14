import PhotoCard from "./PhotoCard";

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function daysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

export default function PhotoGrid({ photos, photoSrcs, photoCounts }) {
  const byMonth = {};
  for (const photo of photos) {
    const month = parseInt(photo.date.slice(5, 7), 10) - 1;
    if (!byMonth[month]) byMonth[month] = {};
    byMonth[month][parseInt(photo.date.slice(8, 10), 10)] = photo;
  }

  const monthsToShow = Object.keys(byMonth).map(Number).sort((a, b) => a - b);
  if (monthsToShow.length === 0) {
    monthsToShow.push(0);
  }
  const lastMonth = monthsToShow[monthsToShow.length - 1];
  const allMonths = [];
  for (let m = 0; m <= lastMonth; m++) {
    allMonths.push(m);
  }

  return (
    <div className="space-y-12">
      {allMonths.map((month) => {
        const total = daysInMonth(2026, month);
        const days = Array.from({ length: total }, (_, i) => i + 1);
        const monthPhotos = byMonth[month] || {};

        return (
          <section key={month}>
            <h2 className="mb-4 text-lg font-medium text-neutral-300">
              {MONTH_NAMES[month]}
            </h2>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-2">
              {days.map((day) => {
                const photo = monthPhotos[day];
                if (photo && photoSrcs[photo.date]) {
                  return (
                    <PhotoCard
                      key={day}
                      photo={photo}
                      src={photoSrcs[photo.date]}
                      count={photoCounts?.[photo.date] || 1}
                    />
                  );
                }
                return (
                  <div
                    key={day}
                    className="flex aspect-square items-center justify-center rounded-lg bg-neutral-800/40 text-sm text-neutral-600"
                  >
                    {day}
                  </div>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}
