import { getMoodPaperStyle } from "../../../utils/User/moodJar";

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
      <div className="rounded-2xl bg-[#f8f6f2] p-6 text-center text-[#7b7280] shadow-sm">
        Loading history mood...
      </div>
    );
  }

  if (!entries.length) {
    return (
      <div className="rounded-2xl bg-[#f8f6f2] p-6 text-center text-[#7b7280] shadow-sm">
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
          className="w-full rounded-[24px] border border-[#0a4174] bg-[#ffffff] p-5 text-left shadow-sm transition-all duration-300 hover:shadow-md"
        >
          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="inline-flex w-fit items-center gap-2 rounded-full bg-white/70 px-4 py-1.5 text-m font-medium text-[#6d5ba3] backdrop-blur-sm">
              <span>{entry.moodLabel?.emoji || "🙂"}</span>
              <span>{entry.moodLabel?.name || "Mood"}</span>
            </div>

            <p className="w-fit rounded-full bg-white/60 px-3 py-1 text-xs font-medium text-[#7c7285]">
              {formatMoodDate(entry.entryDate)}
            </p>
          </div>

          <div className="rounded-2xl border border-[#0a4174] bg-[#ffffff]  p-4 backdrop-blur-sm">
            <p className="text-sm leading-relaxed text-[#51465a]">
              {entry.feelingText}
            </p>
          </div>

          {entry.encouragementResult?.supportMessage && (
            <div className="mt-4 rounded-2xl bg-[#3f4d67]/95 p-4 text-white shadow-sm">
              <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-white/60">
                Support Message
              </p>

              <p className="mt-2 text-sm leading-relaxed text-white/95">
                {entry.encouragementResult.supportMessage}
              </p>
            </div>
          )}
        </button>
      ))}

      <div className="sticky bottom-0 flex items-center justify-between rounded-t-2xl border-t border-white/40 bg-[#faf8f5]/95 pt-4 backdrop-blur">
        <button
          type="button"
          className="btn btn-sm border-none bg-white/70 text-[#6d5ba3] shadow-sm hover:bg-white"
          onClick={onPrevPage}
          disabled={!pagination?.hasPreviousPage}
        >
          Prev
        </button>

        <p className="text-sm font-medium text-[#7c7285]">
          Halaman {pagination?.page || 1} dari{" "}
          {pagination?.totalPages || 1}
        </p>

        <button
          type="button"
          className="btn btn-sm border-none bg-white/70 text-[#6d5ba3] shadow-sm hover:bg-white"
          onClick={onNextPage}
          disabled={!pagination?.hasNextPage}
        >
          Next
        </button>
      </div>
    </div>
  );
}