export default function MoodJarForm({
  hasTodayEntry,
  todayEntry,
  timeLeft,
  formatMoodDate,
  submitError,
  successMessage,
  handleSubmit,
  labels,
  form,
  handleChange,
  submitLoading,
}) {
  return (
    <div className="rounded-2xl bg-base-100 p-6 shadow">
      <h2 className="mb-4 text-lg font-semibold">Input Mood Hari Ini</h2>

      {hasTodayEntry && (
        <div className="alert alert-warning mb-4">
          <span>
            Kamu sudah mengisi mood hari ini
            {todayEntry ? ` (${formatMoodDate(todayEntry.entryDate)})` : ""}.
            <br />
            Bisa mengisi lagi dalam <b>{timeLeft}</b>
          </span>
        </div>
      )}

      {submitError && (
        <div className="alert alert-error mb-4">
          <span>{submitError}</span>
        </div>
      )}

      {successMessage && (
        <div className="alert alert-success mb-4">
          <span>{successMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="form-control">
          <label className="mb-2 label">
            <span className="label-text">Pilih Mood</span>
          </label>

          <select
            name="moodLabelId"
            value={form.moodLabelId}
            onChange={handleChange}
            disabled={hasTodayEntry || submitLoading}
            className="select select-bordered w-full"
            required
          >
            <option value="">Pilih mood kamu</option>
            {labels.map((label) => (
              <option key={label.id} value={label.id}>
                {label.emoji ? `${label.emoji} ` : ""}
                {label.name}
                {label.description ? ` - ${label.description}` : ""}
              </option>
            ))}
          </select>
        </div>

        <div className="form-control">
          <label className="mb-2 label">
            <span className="label-text">Ceritakan Perasaanmu</span>
          </label>

          <textarea
            name="feelingText"
            value={form.feelingText}
            onChange={handleChange}
            disabled={hasTodayEntry || submitLoading}
            className="textarea textarea-bordered min-h-32 w-full"
            placeholder="Tulis apa yang kamu rasakan hari ini..."
            required
          />
        </div>

        <button
          type="submit"
          disabled={hasTodayEntry || submitLoading}
          className="btn btn-primary w-full"
        >
          {submitLoading ? "Menyimpan..." : "Simpan Mood Hari Ini"}
        </button>
      </form>
    </div>
  );
}