import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiCalendar, FiClock, FiUsers } from "react-icons/fi";
import {
  getTodaySocialBattery,
  generateAiInsight,
} from "../../services/User/socialBatteryService";

function SocialBatteryPage() {
  const [battery, setBattery] = useState(null);
  const [loading, setLoading] = useState(true);
  const [aiLoading, setAiLoading] = useState(false);
  const [error, setError] = useState("");

  async function fetchTodaySocialBattery() {
    try {
      setLoading(true);
      setError("");

      const response = await getTodaySocialBattery();
      setBattery(response.data);
    } catch (err) {
      setError(
        err.response?.data?.message || "Gagal mengambil data social battery",
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleGenerateAiInsight() {
    try {
      setAiLoading(true);
      setError("");

      const response = await generateAiInsight();
      setBattery(response.data.socialBattery);
    } catch (err) {
      setError(err.response?.data?.message || "Gagal generate AI insight");
    } finally {
      setAiLoading(false);
    }
  }

  useEffect(() => {
    fetchTodaySocialBattery();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f4ebe9] p-4 dark:bg-gradient-to-br dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 sm:p-6">
        <p className="text-gray-500 dark:text-slate-300">
          Loading social battery...
        </p>
      </div>
    );
  }

  if (!battery) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f4ebe9] p-4 dark:bg-gradient-to-br dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 sm:p-6">
        <div className="rounded-2xl border border-[#B9D0EB] bg-[#D7E6FF] p-6 text-center shadow-sm dark:border-slate-700 dark:bg-slate-900 sm:p-8">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white sm:text-xl">
            Belum ada data Social Battery
          </h2>

          <p className="mt-2 text-sm text-gray-500 dark:text-slate-300 sm:text-base">
            Sync Google Calendar dulu untuk menghitung social battery hari ini.
          </p>

          <Link
            to="/user/social-battery/history"
            className="mt-4 inline-flex w-full justify-center rounded-full bg-[#C7DBFF] px-4 py-2 text-xs font-semibold text-[#2D4F73] hover:bg-[#A2C5FF] dark:bg-slate-700 dark:text-slate-100 dark:hover:bg-slate-600 sm:w-auto"
          >
            View History
          </Link>
        </div>
      </div>
    );
  }

  const statusName = battery.batteryStatus?.name || "-";
  const statusColor = battery.batteryStatus?.color || "#6B7280";

  return (
    <div className="min-h-screen space-y-6 bg-[#f4ebe9] p-4 dark:bg-gradient-to-br dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 sm:p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white sm:text-2xl">
            Social Battery
          </h1>

          <p className="text-sm text-gray-500 dark:text-slate-300 sm:text-base">
            Ringkasan energi sosial kamu berdasarkan aktivitas kalender hari ini.
          </p>
        </div>

        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
          <Link
            to="/user/calendar"
            className="w-full rounded-full bg-[#49769F] px-4 py-2 text-center text-xs font-semibold text-white shadow-md transition hover:bg-[#3d6487] sm:w-auto"
          >
            Synchronize Calendar
          </Link>

          <Link
            to="/user/social-battery/history"
            className="w-full rounded-full bg-[#0a4174] px-4 py-2 text-center text-xs font-semibold text-white transition hover:bg-[#0E5A92] sm:w-auto"
          >
            View History
          </Link>
        </div>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-300">
          {error}
        </div>
      )}

      {/* Card utama */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Battery Score Card */}
        <div className="flex flex-col items-start rounded-[28px] border border-[#B8D8EF] bg-gradient-to-br from-[#D9F3FF] via-[#BFE8FA] to-[#A9D9F2] p-5 shadow-[0_10px_24px_rgba(70,130,180,0.25),inset_0_1px_0_rgba(255,255,255,0.85)] dark:border-slate-700 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 sm:p-6">
          {/* Title */}
          <p className="mb-1 text-lg font-bold text-[#1F2A44] dark:text-white">
            Battery Score
          </p>

          {/* Score numeric */}
          <p className="mb-3 text-lg font-semibold text-[#1E3557] dark:text-slate-200 sm:text-xl">
            {battery.batteryScore?.toFixed(2) || 0} / 100
          </p>

          {(() => {
            const score =
            battery.totalEvents === 0
              ? 100
              : battery.batteryScore || 0;

            const statusName =
              score < 50 ? "Low" : score <= 70 ? "Medium" : "High";

            const statusColor =
              score < 50 ? "#ef4444" : score <= 70 ? "#facc15" : "#22c55e";

            return (
              <>
                {/* Battery icon */}
                <div className="relative w-full overflow-hidden rounded-[24px] border border-[#B9D8EB] bg-gradient-to-br from-[#F3FBFF] via-[#E2F5FF] to-[#D0ECFA] p-4 shadow-[0_6px_12px_rgba(58,111,153,0.25),inset_0_2px_3px_rgba(255,255,255,0.95),inset_0_-3px_6px_rgba(104,153,190,0.18)] dark:border-slate-700 dark:from-slate-800 dark:via-slate-800 dark:to-slate-900">
                  <div className="relative rounded-[18px] border-4 border-[#78A9D2] bg-gradient-to-br from-[#CFEFFF] to-[#8FC8E8] p-2 shadow-[inset_0_2px_4px_rgba(255,255,255,0.75),inset_0_-3px_6px_rgba(58,111,153,0.22)] dark:border-slate-600 dark:from-slate-700 dark:to-slate-900">
                    <div
                      className="relative h-18 overflow-hidden rounded-[14px] bg-[#F7FCFF] shadow-[inset_0_3px_6px_rgba(58,111,153,0.25)] dark:bg-slate-950"
                      style={{
                        border: `4px solid ${statusColor}`,
                      }}
                    >
                      <div
                        className="h-full rounded-lg transition-all duration-500"
                        style={{
                          width: `${score}%`,
                          background:
                            score < 50
                              ? "repeating-linear-gradient(135deg,#fecaca 0px,#fecaca 8px,#ffffff 8px,#ffffff 16px)"
                              : score <= 70
                              ? "repeating-linear-gradient(135deg,#fde68a 0px,#fde68a 8px,#ffffff 8px,#ffffff 16px)"
                              : "repeating-linear-gradient(135deg,#bbf7d0 0px,#bbf7d0 8px,#ffffff 8px,#ffffff 16px)",
                        }}
                      />

                      <div className="absolute inset-0 flex items-center justify-center text-xl font-extrabold text-[#1E3557] drop-shadow-sm dark:text-blue-300 sm:text-2xl">
                        {score.toFixed(0)}%
                      </div>
                    </div>
                  </div>

                  <div
                    className="mt-3 inline-block rounded-full px-3 py-1 text-sm font-semibold text-white shadow-[0_4px_8px_rgba(58,111,153,0.25),inset_0_1px_2px_rgba(255,255,255,0.35)]"
                    style={{ backgroundColor: statusColor }}
                  >
                    {statusName.toUpperCase()}
                  </div>
                </div>
              </>
            );
          })()}
        </div>

        {/* Calculation Summary */}
        <div className="rounded-[28px] border border-[#B8D8EF] bg-gradient-to-br from-[#D9F3FF] via-[#BFE8FA] to-[#A9D9F2] p-5 shadow-[0_10px_24px_rgba(70,130,180,0.25),inset_0_1px_0_rgba(255,255,255,0.85)] dark:border-slate-700 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 lg:col-span-2 sm:p-6">
          <h3 className="text-lg font-bold text-[#1F2A44] dark:text-white">
            Ringkasan Kalkulasi
          </h3>

          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="flex items-center gap-3 rounded-2xl border border-[#B9D8EB] bg-gradient-to-br from-[#F3FBFF] via-[#E2F5FF] to-[#D0ECFA] p-4 shadow-[0_6px_12px_rgba(58,111,153,0.25),inset_0_2px_3px_rgba(255,255,255,0.95),inset_0_-3px_6px_rgba(104,153,190,0.18)] dark:border-slate-700 dark:from-slate-800 dark:via-slate-800 dark:to-slate-900">
              <FiCalendar className="text-2xl text-[#5B8CCB] drop-shadow-sm sm:text-3xl" />

              <div className="flex flex-col">
                <p className="text-[11px] font-medium text-[#5D6B82] dark:text-slate-300 sm:text-xs">
                  Total Acara
                </p>

                <p className="mt-1 text-lg font-bold text-[#1E3557] dark:text-white sm:text-xl">
                  {battery.totalEvents}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-2xl border border-[#B9D8EB] bg-gradient-to-br from-[#F3FBFF] via-[#E2F5FF] to-[#D0ECFA] p-4 shadow-[0_6px_12px_rgba(58,111,153,0.25),inset_0_2px_3px_rgba(255,255,255,0.95),inset_0_-3px_6px_rgba(104,153,190,0.18)] dark:border-slate-700 dark:from-slate-800 dark:via-slate-800 dark:to-slate-900">
              <FiClock className="text-2xl text-[#5B8CCB] drop-shadow-sm sm:text-3xl" />

              <div className="flex flex-col">
                <p className="text-[11px] font-medium text-[#5D6B82] dark:text-slate-300 sm:text-xs">
                  Total Durasi
                </p>

                <p className="mt-1 text-lg font-bold text-[#1E3557] dark:text-white sm:text-xl">
                  {battery.totalDurationMinutes} mnt
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-2xl border border-[#B9D8EB] bg-gradient-to-br from-[#F3FBFF] via-[#E2F5FF] to-[#D0ECFA] p-4 shadow-[0_6px_12px_rgba(58,111,153,0.25),inset_0_2px_3px_rgba(255,255,255,0.95),inset_0_-3px_6px_rgba(104,153,190,0.18)] dark:border-slate-700 dark:from-slate-800 dark:via-slate-800 dark:to-slate-900">
              <FiUsers className="text-2xl text-[#5B8CCB] drop-shadow-sm sm:text-3xl" />

              <div className="flex flex-col">
                <p className="text-[11px] font-medium text-[#5D6B82] dark:text-slate-300 sm:text-xs">
                  Intensitas Sosial
                </p>

                <p className="mt-1 text-lg font-bold text-[#1E3557] dark:text-white sm:text-xl">
                  {battery.socialIntensityScore?.toFixed?.(2) ??
                    battery.socialIntensityScore}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-5 rounded-2xl border border-[#5D8FBD] bg-gradient-to-br from-[#6FA0CC] via-[#5B8FC2] to-[#4F7EAE] p-5 shadow-[0_6px_12px_rgba(58,111,153,0.25),inset_0_2px_3px_rgba(255,255,255,0.28),inset_0_-4px_8px_rgba(24,63,103,0.22)] dark:border-slate-700 dark:from-slate-800 dark:via-slate-900 dark:to-slate-950">
            <p className="text-xs font-semibold tracking-wide text-[#EAF7FF] dark:text-slate-300">
              Calculation Notes
            </p>

            <p className="mt-2 text-sm leading-relaxed text-white/90 dark:text-slate-400">
              {battery.calculationNotes || "-"}
            </p>
          </div>
        </div>
      </div>

      {/* AI Insight */}
      <div className="overflow-hidden rounded-[24px] border border-[#9FC9E3] bg-gradient-to-b from-[#063B60] via-[#72BCE0] to-[#B8E7F8] p-4 shadow-[0_10px_24px_rgba(70,130,180,0.22),inset_0_1px_0_rgba(255,255,255,0.55)] dark:border-slate-700 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 sm:p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white">
              Ruang Refleksi
            </h3>

            <p className="text-sm text-[#E3F6FF] dark:text-slate-300">
              Insight dan saran recovery berdasarkan social battery kamu.
            </p>
          </div>

          <button
            onClick={handleGenerateAiInsight}
            disabled={aiLoading}
            className="w-full rounded-full border border-white/30 bg-[#E7F7FF]/80 px-4 py-2 text-xs font-semibold text-black shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_3px_8px_rgba(0,0,0,0.18)] hover:bg-[#CDEBFA] disabled:cursor-not-allowed disabled:opacity-60 dark:bg-blue-600 dark:text-white dark:hover:bg-blue-500 sm:w-auto"
          >
            {aiLoading ? "Generating..." : "Pesan Hari Ini"}
          </button>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-3">
          <div className="rounded-2xl border border-white/70 bg-gradient-to-br from-[#F5FCFF]/95 via-[#E7F7FF]/90 to-[#CDEBFA]/90 p-5 shadow-[0_8px_16px_rgba(58,111,153,0.25),inset_0_2px_3px_rgba(255,255,255,0.95),inset_0_-3px_6px_rgba(104,153,190,0.18)] dark:border-slate-700 dark:from-slate-800 dark:via-slate-800 dark:to-slate-900">
            <p className="text-xs font-semibold text-[#1E3557] dark:text-white">
              Insight
            </p>

            <p className="mt-1 text-sm leading-relaxed text-[#41546B] dark:text-slate-300">
              {battery.aiInsight || "-"}
            </p>
          </div>

          <div className="rounded-2xl border border-white/70 bg-gradient-to-br from-[#F5FCFF]/95 via-[#E7F7FF]/90 to-[#CDEBFA]/90 p-5 shadow-[0_8px_16px_rgba(58,111,153,0.25),inset_0_2px_3px_rgba(255,255,255,0.95),inset_0_-3px_6px_rgba(104,153,190,0.18)] dark:border-slate-700 dark:from-slate-800 dark:via-slate-800 dark:to-slate-900">
            <p className="text-xs font-semibold text-[#1E3557] dark:text-white">
              Explanation
            </p>

            <p className="mt-1 text-sm leading-relaxed text-[#41546B] dark:text-slate-300">
              {battery.aiScoreExplanation || "-"}
            </p>
          </div>

          <div className="rounded-2xl border border-white/70 bg-gradient-to-br from-[#F5FCFF]/95 via-[#E7F7FF]/90 to-[#CDEBFA]/90 p-5 shadow-[0_8px_16px_rgba(58,111,153,0.25),inset_0_2px_3px_rgba(255,255,255,0.95),inset_0_-3px_6px_rgba(104,153,190,0.18)] dark:border-slate-700 dark:from-slate-800 dark:via-slate-800 dark:to-slate-900">
            <p className="text-xs font-semibold text-[#1E3557] dark:text-white">
              Suggestion
            </p>

            <p className="mt-1 text-sm leading-relaxed text-[#41546B] dark:text-slate-300">
              {battery.recoverySuggestion || "-"}
            </p>
          </div>
        </div>

        {battery.aiModelName && (
          <p className="mt-5 text-xs text-[#6D92AA] dark:text-slate-500">
            Generated by: {battery.aiModelName}
          </p>
        )}
      </div>
    </div>
  );
}

export default SocialBatteryPage;