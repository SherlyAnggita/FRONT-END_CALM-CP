import { getMoodPaperStyle } from "../../../utils/User/moodJar";

function getReadableTextColor(style) {
  const color = style?.backgroundColor || style?.background || "#ffffff";
  const hex = color.replace("#", "");

  if (hex.length !== 6) return "#111827";

  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  const brightness = (r * 299 + g * 587 + b * 114) / 1000;

  return brightness < 140 ? "#ffffff" : "#111827";
}

export default function MoodJarDetail({ entry, formatMoodDate }) {
  if (!entry) return null;

  const paperStyle = getMoodPaperStyle(entry);
  const textColor = getReadableTextColor(paperStyle);

  return (
    <div>
      <p className="text-sm text-base-content/60">
        {formatMoodDate(entry.entryDate)}
      </p>

      <div
        className="mt-4 rounded-lg border border-base-300 p-4"
        style={{
          ...paperStyle,
          color: textColor,
        }}
      >
        <p className="text-sm leading-relaxed font-medium">
          {entry.feelingText}
        </p>
      </div>

      {entry.analysisStatus === "pending" && !entry.encouragementResult && (
        <div className="mt-4 rounded-3xl bg-[#d8dfe8]/95 p-5 text-black shadow-sm">
          <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-black/50">
            AI Mood Analysis
          </p>

          <h3 className="mt-1 text-lg font-bold">Sedang menganalisis...</h3>

          <p className="mt-2 text-sm leading-relaxed text-black/70">
            CALM sedang membaca perasaanmu. Hasil analisis akan muncul sebentar
            lagi.
          </p>

          <div className="mt-4 text-xs text-black/50">Status: pending</div>
        </div>
      )}

      {entry.analysisStatus === "failed" && !entry.encouragementResult && (
        <div className="mt-4 rounded-3xl bg-[#d8dfe8]/95 p-5 text-black shadow-sm">
          <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-black/50">
            AI Mood Analysis
          </p>

          <h3 className="mt-1 text-lg font-bold">Analisis gagal</h3>

          <p className="mt-2 text-sm leading-relaxed text-black/70">
            Mood kamu sudah tersimpan, tapi AI belum berhasil menganalisisnya.
          </p>

          <div className="mt-4 text-xs text-black/50">Status: failed</div>
        </div>
      )}

      {entry.encouragementResult && (
        <div className="mt-4 rounded-3xl bg-[#d8dfe8]/95 p-5 text-black shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-black/50">
                AI Mood Analysis
              </p>

              <h3 className="mt-1 text-lg font-bold">
                {entry.encouragementResult.predictedLabel ||
                  "Mood tidak terdeteksi"}
              </h3>

              <p className="mt-1 text-sm text-black/60">
                AI melihat perasaanmu cenderung ke mood ini
              </p>
            </div>

            <div className="rounded-2xl bg-white/70 px-3 py-2 text-center shadow-sm">
              <p className="text-[10px] uppercase tracking-wide text-black/40">
                Akurasi
              </p>

              <p className="text-sm font-bold text-black/80">
                {Math.round(
                  (entry.encouragementResult.confidenceScore || 0) * 100,
                )}
                %
              </p>
            </div>
          </div>

          {entry.encouragementResult.supportMessage && (
            <div className="mt-4 rounded-2xl bg-white/60 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-black/50">
                Pesan Dukungan
              </p>

              <p className="mt-2 text-sm leading-relaxed text-black/90">
                {entry.encouragementResult.supportMessage}
              </p>
            </div>
          )}

          <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-black/50">
            <span>Model: {entry.encouragementResult.modelName || "-"}</span>

            <span>•</span>

            <span>Status: {entry.analysisStatus || "-"}</span>
          </div>
        </div>
      )}
    </div>
  );
}
