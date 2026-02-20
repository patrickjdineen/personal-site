import PhotoCard from "./PhotoCard";

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const DAY_HEADERS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function PhotoGrid({ photos, photoSrcs, year }) {
  const byMonth = {};
  for (const photo of photos) {
    if (!photoSrcs[photo.date]) continue;
    const month = parseInt(photo.date.slice(5, 7), 10) - 1;
    if (!byMonth[month]) byMonth[month] = [];
    byMonth[month].push(photo);
  }

  const currentYear = new Date().getFullYear();
  const months = Object.keys(byMonth).map(Number).sort((a, b) =>
    year < currentYear ? a - b : b - a
  );

  return (
    <div className="space-y-12">
      {months.map((month) => {
        const monthPhotos = byMonth[month];
        const photosByDay = {};
        for (const photo of monthPhotos) {
          const day = parseInt(photo.date.slice(8, 10), 10);
          photosByDay[day] = photo;
        }

        const firstDayOfWeek = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        return (
          <section key={month}>
            <h2 className="mb-4 text-lg font-medium text-neutral-300">
              {MONTH_NAMES[month]}
            </h2>
            <div className="grid grid-cols-7 gap-2">
              {DAY_HEADERS.map((day) => (
                <div
                  key={day}
                  className="text-center text-xs font-medium text-neutral-500 pb-1"
                >
                  {day}
                </div>
              ))}

              {Array.from({ length: firstDayOfWeek }, (_, i) => (
                <div key={`empty-${i}`} />
              ))}

              {Array.from({ length: daysInMonth }, (_, i) => {
                const day = i + 1;
                const photo = photosByDay[day];

                if (photo) {
                  return (
                    <PhotoCard
                      key={photo.date}
                      photo={photo}
                      srcs={photoSrcs[photo.date]}
                    />
                  );
                }

                return (
                  <div
                    key={`placeholder-${day}`}
                    className="aspect-square rounded-lg border border-neutral-800 flex items-center justify-center"
                  >
                    <span className="text-xs text-neutral-600">{day}</span>
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
