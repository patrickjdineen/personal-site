import PhotoCard from "./PhotoCard";

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export default function PhotoGrid({ photos, photoSrcs, photoCounts }) {
  const byMonth = {};
  for (const photo of photos) {
    if (!photoSrcs[photo.date]) continue;
    const month = parseInt(photo.date.slice(5, 7), 10) - 1;
    if (!byMonth[month]) byMonth[month] = [];
    byMonth[month].push(photo);
  }

  const months = Object.keys(byMonth).map(Number).sort((a, b) => b - a);

  return (
    <div className="space-y-12">
      {months.map((month) => {
        const monthPhotos = byMonth[month].sort((a, b) => b.date.localeCompare(a.date));

        return (
          <section key={month}>
            <h2 className="mb-4 text-lg font-medium text-neutral-300">
              {MONTH_NAMES[month]}
            </h2>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-2">
              {monthPhotos.map((photo) => (
                <PhotoCard
                  key={photo.date}
                  photo={photo}
                  src={photoSrcs[photo.date]}
                  count={photoCounts?.[photo.date] || 1}
                />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
