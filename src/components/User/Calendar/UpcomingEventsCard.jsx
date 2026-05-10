import { useState } from "react";

export default function UpcomingEventsCard({ calendarEvents }) {
  const [page, setPage] = useState(1);
  const limit = 3;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcomingEvents = [...calendarEvents]
    .filter((event) => {
      const startDate =
        event.startTime ||
        event.start?.dateTime ||
        event.start?.date;

      if (!startDate) return false;

      const eventDate = new Date(startDate);
      eventDate.setHours(0, 0, 0, 0);

      return eventDate >= today;
    })
    .sort((a, b) => {
      const aDate = new Date(
        a.startTime || a.start?.dateTime || a.start?.date
      );

      const bDate = new Date(
        b.startTime || b.start?.dateTime || b.start?.date
      );

      return aDate - bDate;
    });

  const totalPages = Math.ceil(upcomingEvents.length / limit) || 1;
  const startIndex = (page - 1) * limit;
  const paginatedEvents = upcomingEvents.slice(startIndex, startIndex + limit);

  return (
    <div className="rounded-[28px] bg-[#E3F3FD] p-5 shadow-md transition-colors dark:bg-slate-800">
      <h2 className="text-xl font-bold text-slate-800 dark:text-white">
        Upcoming Events
      </h2>

      <p className="mt-1 text-sm text-slate-500 dark:text-slate-300">
        Don't miss schedule
      </p>

      <div className="mt-6 space-y-4">
        {paginatedEvents.length === 0 ? (
          <p className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-500 dark:bg-slate-700 dark:text-slate-300">
            Belum ada event calendar yang ditemukan.
          </p>
        ) : (
          paginatedEvents.map((event, index) => {
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
                <div className="mb-3 flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-300">
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

                <p className="font-bold text-slate-800 dark:text-white">
                  {event.summary || event.title || "Untitled Event"}
                </p>

                <p className="mt-1 text-sm text-slate-500 line-clamp-2 dark:text-slate-300">
                  {event.description || "No description available"}
                </p>

                {endDate && (
                  <div className="mt-4 flex justify-end">
                    <p className="text-xs font-medium text-indigo-500 dark:text-indigo-400">
                      Ends at{" "}
                      {new Date(endDate).toLocaleTimeString("id-ID", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {upcomingEvents.length > limit && (
        <div className="mt-5 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
            className="btn btn-sm rounded-full border-none bg-white px-4 text-slate-700 shadow disabled:opacity-50 dark:bg-slate-700 dark:text-white"
          >
            Prev
          </button>

          <p className="text-xs font-medium text-slate-500 dark:text-slate-300">
            {page} / {totalPages}
          </p>

          <button
            type="button"
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={page === totalPages}
            className="btn btn-sm rounded-full border-none bg-white px-4 text-slate-700 shadow disabled:opacity-50 dark:bg-slate-700 dark:text-white"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}