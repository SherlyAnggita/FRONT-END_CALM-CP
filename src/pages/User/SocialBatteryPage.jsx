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
      <div className="min-h-screen bg-[#E6F0FA] p-4 dark:bg-slate-950 sm:p-6">
        <p className="text-gray-500 dark:text-slate-300">
          Loading social battery...
        </p>
      </div>
    );
  }

  if (!battery) {
    return (
      <div className="min-h-screen bg-[#E6F0FA] p-4 flex items-center justify-center dark:bg-slate-950 sm:p-6">
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
    <div className="min-h-screen bg-white p-4 space-y-6 dark:bg-slate-950 sm:p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white sm:text-2xl">
            Social Battery
          </h1>

          <p className="text-sm text-gray-500 dark:text-slate-300 sm:text-base">
            Ringkasan energi sosial kamu berdasarkan aktivitas kalender hari
            ini.
          </p>
        </div>

        <Link
          to="/user/social-battery/history"
          className="w-full rounded-full bg-[#0a4174] px-4 py-2 text-center text-xs font-semibold text-white hover:bg-[#A2C5FF] dark:bg-blue-600 dark:hover:bg-blue-500 sm:w-auto"
        >
          View History
        </Link>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-300">
          {error}
        </div>
      )}

      {/* Card utama */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Battery Score Card */}
        <div className="flex flex-col items-start rounded-2xl border border-[#B9D0EB] bg-[#D6EBFF] p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900 sm:p-6">
          {/* Title */}
          <p className="mb-1 text-lg font-semibold text-gray-900 dark:text-white">
            Battery Score
          </p>

          {/* Score numeric */}
          <p className="mb-3 text-lg font-semibold text-gray-800 dark:text-slate-200 sm:text-xl">
            {battery.batteryScore?.toFixed(2) || 0} / 100
          </p>

          {/* Battery icon */}
          <div className="relative w-full overflow-hidden rounded-[24px] border-2 border-[#8bb9e8] bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
            <div className="relative rounded-[18px] border-4 border-[#91b9e8] bg-white p-2 dark:border-slate-600 dark:bg-slate-900">
              <div
                className="relative h-18 overflow-hidden rounded-[14px] bg-[#fffaf2] dark:bg-slate-800"
                style={{
                  border: `4px solid ${
                    battery.batteryScore < 50
                      ? "#ef4444"
                      : battery.batteryScore <= 60
                      ? "#facc15"
                      : "#22c55e"
                  }`,
                }}
              >
                <div
                  className="h-full rounded-lg transition-all duration-500"
                  style={{
                    width: `${battery.batteryScore || 0}%`,
                    background:
                      battery.batteryScore < 50
                        ? "repeating-linear-gradient(135deg,#fecaca 0px,#fecaca 8px,#ffffff 8px,#ffffff 16px)"
                        : battery.batteryScore <= 60
                        ? "repeating-linear-gradient(135deg,#fde68a 0px,#fde68a 8px,#ffffff 8px,#ffffff 16px)"
                        : "repeating-linear-gradient(135deg,#bbf7d0 0px,#bbf7d0 8px,#ffffff 8px,#ffffff 16px)",
                  }}
                />

                <div className="absolute inset-0 flex items-center justify-center text-xl font-extrabold text-[#5e7ee8] dark:text-blue-300 sm:text-2xl">
                  {battery.batteryScore?.toFixed(0) || 0}%
                </div>
              </div>
            </div>

            <div
              className="mt-3 inline-block rounded-full px-3 py-1 text-sm font-semibold text-white shadow"
              style={{ backgroundColor: statusColor }}
            >
              {statusName.toUpperCase()}
            </div>
          </div>
        </div>

        {/* Calculation Summary */}
        <div className="rounded-2xl border border-[#B9D0EB] bg-[#D7E6FF] p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900 lg:col-span-2 sm:p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Ringkasan Kalkulasi
          </h3>

          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="flex items-center gap-3 rounded-xl bg-white p-4 shadow-sm dark:bg-slate-800">
              <FiCalendar className="text-2xl text-[#4C8FEF] sm:text-3xl" />

              <div className="flex flex-col">
                <p className="text-[11px] text-gray-700 dark:text-slate-300 sm:text-xs">
                  Total Acara
                </p>

                <p className="mt-1 text-lg font-bold text-gray-900 dark:text-white sm:text-xl">
                  {battery.totalEvents}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-xl bg-white p-4 shadow-sm dark:bg-slate-800">
              <FiClock className="text-2xl text-[#4C8FEF] sm:text-3xl" />

              <div className="flex flex-col">
                <p className="text-[11px] text-gray-700 dark:text-slate-300 sm:text-xs">
                  Total Durasi
                </p>

                <p className="mt-1 text-lg font-bold text-gray-900 dark:text-white sm:text-xl">
                  {battery.totalDurationMinutes} mnt
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-xl bg-white p-4 shadow-sm dark:bg-slate-800">
              <FiUsers className="text-2xl text-[#4C8FEF] sm:text-3xl" />

              <div className="flex flex-col">
                <p className="text-[11px] text-gray-700 dark:text-slate-300 sm:text-xs">
                  Intensitas Sosial
                </p>

                <p className="mt-1 text-lg font-bold text-gray-900 dark:text-white sm:text-xl">
                  {battery.socialIntensityScore?.toFixed?.(2) ??
                    battery.socialIntensityScore}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 rounded-xl bg-white p-4 shadow-sm dark:bg-slate-800">
            <p className="text-xs font-medium text-gray-700 dark:text-slate-300">
              Calculation Notes
            </p>

            <p className="mt-1 text-sm leading-relaxed text-gray-600 dark:text-slate-400">
              {battery.calculationNotes || "-"}
            </p>
          </div>
        </div>
      </div>

      {/* AI Insight */}
      <div className="rounded-2xl border border-[#B9D0EB] bg-[#D7E6FF] p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900 sm:p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Ruang Refleksi
            </h3>

            <p className="text-sm text-gray-500 dark:text-slate-300">
              Insight dan saran recovery berdasarkan social battery kamu.
            </p>
          </div>

          <button
            onClick={handleGenerateAiInsight}
            disabled={aiLoading}
            className="w-full rounded-full bg-[#0a4174] px-4 py-2 text-xs font-semibold text-white hover:bg-[#A2C5FF] disabled:cursor-not-allowed disabled:opacity-60 dark:bg-blue-600 dark:hover:bg-blue-500 sm:w-auto"
          >
            {aiLoading ? "Generating..." : "Pesan Hari Ini"}
          </button>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="rounded-xl bg-white p-4 shadow-sm dark:bg-slate-800">
            <p className="text-xs font-semibold text-gray-800 dark:text-white">
              Insight
            </p>

            <p className="mt-1 text-sm leading-relaxed text-gray-600 dark:text-slate-300">
              {battery.aiInsight || "-"}
            </p>
          </div>

          <div className="rounded-xl bg-white p-4 shadow-sm dark:bg-slate-800">
            <p className="text-xs font-semibold text-gray-800 dark:text-white">
              Explanation
            </p>

            <p className="mt-1 text-sm leading-relaxed text-gray-600 dark:text-slate-300">
              {battery.aiScoreExplanation || "-"}
            </p>
          </div>

          <div className="rounded-xl bg-white p-4 shadow-sm dark:bg-slate-800">
            <p className="text-xs font-semibold text-gray-800 dark:text-white">
              Suggestion
            </p>

            <p className="mt-1 text-sm leading-relaxed text-gray-600 dark:text-slate-300">
              {battery.recoverySuggestion || "-"}
            </p>
          </div>
        </div>

        {battery.aiModelName && (
          <p className="mt-4 text-xs text-gray-400 dark:text-slate-500">
            Generated by: {battery.aiModelName}
          </p>
        )}
      </div>
    </div>
  );
}

export default SocialBatteryPage;