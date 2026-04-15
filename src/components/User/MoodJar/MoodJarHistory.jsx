import { getMoodPaperStyle } from "../../../utils/User/moodJar";

export default function MoodJarHistory({
  entries,
  onClickEntry,
  formatMoodDate,
  pagination,
  onPrevPage,
  onNextPage,
  loading,
}) {
  if (loading) {
    return (
      <div className="rounded-xl bg-base-200 p-6 text-center text-base-content/70">
        Loading history mood...
      </div>
    );
  }

  if (!entries.length) {
    return (
      <div className="rounded-xl bg-base-200 p-6 text-center text-base-content/70">
        Belum ada history mood.
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-2">
      {entries.map((entry) => (
        <button
          key={entry.id}
          type="button"
          onClick={() => onClickEntry(entry)}
          style={getMoodPaperStyle(entry)}
          className="w-full rounded-xl border border-base-300 p-4 text-left text-slate-800 transition hover:brightness-95"
        >
          <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
            <div className="badge badge-primary badge-outline">
              {entry.moodLabel?.emoji ? `${entry.moodLabel.emoji} ` : ""}
              {entry.moodLabel?.name || "Mood"}
            </div>

            <p className="text-sm text-slate-500">
              {formatMoodDate(entry.entryDate)}
            </p>
          </div>

          <p className="mb-3 text-sm leading-relaxed text-slate-700">
            {entry.feelingText}
          </p>

          {entry.encouragementResult?.supportMessage && (
            <div className="rounded-lg bg-slate-900 p-3 text-white">
              <p className="text-xs font-semibold uppercase tracking-wide text-white/60">
                Support Message
              </p>
              <p className="mt-1 text-sm text-white">
                {entry.encouragementResult.supportMessage}
              </p>
            </div>
          )}
        </button>
      ))}

      <div className="flex items-center justify-between border-t border-base-200 pt-4">
        <button
          type="button"
          className="btn btn-outline btn-sm"
          onClick={onPrevPage}
          disabled={!pagination?.hasPreviousPage}
        >
          Prev
        </button>

        <p className="text-sm text-base-content/70">
          Halaman {pagination?.page || 1} dari {pagination?.totalPages || 1}
        </p>

        <button
          type="button"
          className="btn btn-outline btn-sm"
          onClick={onNextPage}
          disabled={!pagination?.hasNextPage}
        >
          Next
        </button>
      </div>
    </div>
  );
}