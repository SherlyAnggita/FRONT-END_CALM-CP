import { getMoodPaperStyle } from "../../../utils/User/moodJar";
import { FiChevronRight } from "react-icons/fi";

export default function MoodJarHistory({
  entries,
  onClickEntry,
  formatMoodDate,
  pagination,
  onPrevPage,
  onNextPage,
  loading,
  onClose,
}) {
  if (loading) {
    return (
      <div className="rounded-2xl bg-[#f8f6f2] p-6 text-center text-[#7b7280] shadow-sm dark:bg-slate-800 dark:text-slate-300">
        Loading history mood...
      </div>
    );
  }

  if (!entries.length) {
    return (
      <div className="rounded-2xl bg-[#f8f6f2] p-6 text-center text-[#7b7280] shadow-sm dark:bg-slate-800 dark:text-slate-300">
        Belum ada history mood.
      </div>
    );
  }

  return (
    <div className="relative space-y-4 pb-2">
      {entries.map((entry) => (
        <button
          key={entry.id}
          type="button"
          onClick={() => onClickEntry(entry)}
          className="w-full rounded-[24px] border border-[#0a4174] bg-[#ffffff] p-5 text-left shadow-sm transition-all duration-300 hover:shadow-md dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700"
        >
          <div className="mb-4 flex items-center justify-between gap-2">
            <div className="inline-flex w-fit shrink-0 items-center gap-2 rounded-full bg-white/70 px-4 py-1.5 text-sm font-medium text-[#6d5ba3] backdrop-blur-sm dark:bg-slate-900/70 dark:text-slate-100">
              <span>{entry.moodLabel?.emoji || "🙂"}</span>
              <span>{entry.moodLabel?.name || "Mood"}</span>
            </div>

            <p className="w-fit shrink-0 rounded-full bg-white/60 px-3 py-1 text-[10px] font-medium text-[#7c7285] dark:bg-slate-900/70 dark:text-slate-300 sm:text-xs">
              {formatMoodDate(entry.entryDate)}
            </p>
          </div>

          <div className="flex items-center justify-between gap-3 rounded-2xl border border-[#0a4174] bg-[#ffffff] p-4 backdrop-blur-sm dark:border-slate-600 dark:bg-slate-900">
            <p className="min-w-0 text-sm leading-relaxed text-[#51465a] dark:text-slate-200">
              {entry.feelingText}
            </p>

            <FiChevronRight className="shrink-0 text-[#0a4174] dark:text-slate-400" />
          </div>

          {entry.encouragementResult?.supportMessage && (
            <div className="mt-4 rounded-2xl bg-[#3f4d67]/95 p-4 text-white shadow-sm dark:bg-slate-950">
              <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-white/60 dark:text-slate-400">
                Support Message
              </p>

              <p className="mt-2 text-sm leading-relaxed text-white/95 dark:text-slate-100">
                {entry.encouragementResult.supportMessage}
              </p>
            </div>
          )}
        </button>
      ))}

      <div className="mt-2 flex items-center justify-between rounded-2xl border border-[#0a4174]/20 bg-[#faf8f5] p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <button
          type="button"
          className="btn btn-sm border-none bg-white/70 text-[#6d5ba3] shadow-sm hover:bg-white dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
          onClick={onPrevPage}
          disabled={!pagination?.hasPreviousPage}
        >
          Prev
        </button>

        <p className="text-sm font-medium text-[#7c7285] dark:text-slate-300">
          Halaman {pagination?.page || 1} dari {pagination?.totalPages || 1}
        </p>

        <button
          type="button"
          className="btn btn-sm border-none bg-white/70 text-[#6d5ba3] shadow-sm hover:bg-white dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
          onClick={onNextPage}
          disabled={!pagination?.hasNextPage}
        >
          Next
        </button>
      </div>
    </div>
  );
}