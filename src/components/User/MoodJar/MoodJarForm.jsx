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

  const moodColors = [
    "bg-red-100 border-red-300 text-red-600",
    "bg-yellow-100 border-yellow-300 text-yellow-600",
    "bg-blue-100 border-blue-300 text-blue-600",
    "bg-purple-100 border-purple-300 text-purple-600",
    "bg-green-100 border-green-300 text-green-600",
  ];

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

          <div className="grid grid-cols-2 gap-3">
            {labels.map((label, index) => {
              const isSelected = form.moodLabelId === label.id;

              return (
                <button
                  key={label.id}
                  type="button"
                  onClick={() =>
                    handleChange({
                      target: {
                        name: "moodLabelId",
                        value: label.id,
                      },
                    })
                  }
                  disabled={hasTodayEntry || submitLoading}
                  className={`
                    flex items-center gap-2 rounded-xl border p-3 text-left transition

                    ${
                      isSelected
                        ? moodColors[index % moodColors.length]
                        : "border-base-300 bg-base-200 text-base-content/40 grayscale opacity-70"
                    }

                    ${
                      hasTodayEntry || submitLoading
                        ? "cursor-not-allowed opacity-50"
                        : "hover:border-primary hover:opacity-100"
                    }
                  `}
                >
                  <span className={isSelected ? "text-xl" : "text-xl grayscale"}>
                    {label.emoji || "🙂"}
                  </span>

                  <span className="font-medium">{label.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="form-control">
            <label className="mb-2 label">
              <span className="label-text">Ceritakan Perasaanmu</span>
            </label>

            <div className="relative overflow-hidden rounded-2xl border border-[#ead7b8] bg-[#fff8e7] shadow-[0_10px_24px_rgba(120,90,45,0.15)] transition focus-within:border-[#d6a85f] focus-within:shadow-[0_12px_30px_rgba(214,168,95,0.28)]">
              {/* garis notes */}
              <div
                className="pointer-events-none absolute inset-0 opacity-45"
                style={{
                  backgroundImage:
                    "linear-gradient(to bottom, transparent 27px, #e7d3aa 28px)",
                  backgroundSize: "100% 28px",
                }}
              />

              {/* margin kiri kayak buku */}
              <div className="pointer-events-none absolute left-10 top-0 h-full w-px bg-[#e9b1a7]/70" />

              {/* lubang binder */}
              <div className="pointer-events-none absolute left-4 top-6 h-3 w-3 rounded-full bg-[#ead7b8] shadow-inner" />
              <div className="pointer-events-none absolute left-4 top-20 h-3 w-3 rounded-full bg-[#ead7b8] shadow-inner" />
              <div className="pointer-events-none absolute left-4 top-36 h-3 w-3 rounded-full bg-[#ead7b8] shadow-inner" />

              {/* lipatan pojok */}
              <div className="pointer-events-none absolute right-0 top-0 h-14 w-14 bg-gradient-to-bl from-[#ead7b8] via-[#fff1cf] to-transparent" />
              <div className="pointer-events-none absolute right-0 top-0 h-14 w-14 rounded-bl-2xl shadow-[-4px_4px_10px_rgba(120,90,45,0.12)]" />

              {/* highlight */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/50 via-transparent to-black/5" />

              <textarea
                name="feelingText"
                value={form.feelingText}
                onChange={handleChange}
                disabled={hasTodayEntry || submitLoading}
                placeholder="Tulis apa yang kamu rasakan hari ini..."
                required
                maxLength={500}
                className="
                  relative z-10
                  min-h-40 w-full
                  resize-none
                  bg-transparent
                  py-4 pl-14 pr-5
                  text-sm leading-[28px]
                  text-slate-700
                  placeholder:text-slate-400
                  outline-none
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                "
              />

              <div className="relative z-10 flex justify-end px-4 pb-3 text-xs text-slate-400">
                {form.feelingText.length}/500
              </div>
            </div>
          </div>

        <button
          type="submit"
          disabled={hasTodayEntry || submitLoading}
          className="
            w-full rounded-xl bg-[#49769F] py-3
            font-medium text-[#FFFFFF]
            shadow-md
            transition
            hover:bg-[#BDD8E9]
            active:scale-[0.98] disabled:opacity-50 " >
          {submitLoading ? "Menyimpan..." : "Simpan Mood Hari Ini"}
        </button>
      </form>
    </div>
  );
}