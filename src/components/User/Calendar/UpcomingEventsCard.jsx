export default function UpcomingEventsCard({ calendarEvents }) {
  return (
    <div className="rounded-[28px] bg-[#E3F3FD] p-5 shadow-md transition-colors dark:bg-slate-800">
      <h2 className="text-xl font-bold text-slate-800 dark:text-white">
        Upcoming Events
      </h2>

      <p className="mt-1 text-sm text-slate-500 dark:text-slate-300">
        Don't miss schedule
      </p>

      <div className="mt-6 space-y-4">
        {calendarEvents.length === 0 ? (
          <p className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-500 dark:bg-slate-700 dark:text-slate-300">
            Belum ada event calendar yang ditemukan.
          </p>
        ) : (
          calendarEvents.slice(0, 5).map((event, index) => {
            const startDate =
              event.startTime ||
              event.start?.dateTime ||
              event.start?.date;

            const endDate =
              event.endTime ||
              event.end?.dateTime ||
              event.end?.date;

            return (
              <div
                key={event.id}
                className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition hover:shadow-md dark:border-slate-700 dark:bg-slate-900"
              >
                <div className="mb-3 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-300">
                    <span
                      className={`h-2.5 w-2.5 rounded-full ${
                        index % 3 === 0
                          ? "bg-violet-500"
                          : index % 3 === 1
                          ? "bg-sky-400"
                          : "bg-emerald-400"
                      }`}
                    />

                    <span>
                      {startDate
                        ? new Date(startDate).toLocaleString("id-ID", {
                            dateStyle: "medium",
                            timeStyle: "short",
                          })
                        : "-"}
                    </span>
                  </div>

                  <span className="text-slate-300 dark:text-slate-500">
                    •••
                  </span>
                </div>

                <p className="font-bold text-slate-800 dark:text-white">
                  {event.summary || event.title || "Untitled Event"}
                </p>

                <p className="mt-1 text-sm text-slate-500 line-clamp-2 dark:text-slate-300">
                  {event.description || "No description available"}
                </p>

                {endDate && (
                  <p className="mt-3 text-xs font-medium text-indigo-500 dark:text-indigo-400">
                    Ends at{" "}
                    {new Date(endDate).toLocaleTimeString("id-ID", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}