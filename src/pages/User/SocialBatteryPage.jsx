import { useEffect, useState } from "react";
import {
  getTodaySocialBattery,
  generateAiInsight,
} from "../../services/user/socialBatteryService";

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
      <div className="p-6">
        <p className="text-gray-500">Loading social battery...</p>
      </div>
    );
  }

  if (!battery) {
    return (
      <div className="p-6">
        <div className="rounded-xl border border-dashed border-gray-300 bg-white p-6 text-center">
          <h2 className="text-xl font-semibold text-gray-800">
            Belum ada data Social Battery
          </h2>
          <p className="mt-2 text-gray-500">
            Sync Google Calendar dulu untuk menghitung social battery hari ini.
          </p>
        </div>
      </div>
    );
  }

  const statusName = battery.batteryStatus?.name || "-";
  const statusColor = battery.batteryStatus?.color || "#6B7280";

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Social Battery</h1>
        <p className="text-gray-500">
          Ringkasan energi sosial kamu berdasarkan aktivitas kalender hari ini.
        </p>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="rounded-2xl bg-white p-6 shadow-sm lg:col-span-1">
          <p className="text-sm text-gray-500">Battery Score</p>

          <div className="mt-4 flex items-end gap-2">
            <h2 className="text-5xl font-bold text-gray-900">
              {battery.batteryScore?.toFixed?.(2) ?? battery.batteryScore}
            </h2>
            <span className="mb-2 text-gray-500">/ 100</span>
          </div>

          <div
            className="mt-4 inline-flex rounded-full px-4 py-1 text-sm font-semibold text-white"
            style={{ backgroundColor: statusColor }}
          >
            {statusName.toUpperCase()}
          </div>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm lg:col-span-2">
          <h3 className="text-lg font-semibold text-gray-900">
            Calculation Summary
          </h3>

          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="rounded-xl bg-gray-50 p-4">
              <p className="text-sm text-gray-500">Total Events</p>
              <p className="mt-2 text-2xl font-bold text-gray-900">
                {battery.totalEvents}
              </p>
            </div>

            <div className="rounded-xl bg-gray-50 p-4">
              <p className="text-sm text-gray-500">Total Duration</p>
              <p className="mt-2 text-2xl font-bold text-gray-900">
                {battery.totalDurationMinutes} min
              </p>
            </div>

            <div className="rounded-xl bg-gray-50 p-4">
              <p className="text-sm text-gray-500">Social Intensity</p>
              <p className="mt-2 text-2xl font-bold text-gray-900">
                {battery.socialIntensityScore?.toFixed?.(2) ??
                  battery.socialIntensityScore}
              </p>
            </div>
          </div>

          <div className="mt-4 rounded-xl bg-gray-50 p-4">
            <p className="text-sm font-medium text-gray-700">
              Calculation Notes
            </p>
            <p className="mt-2 text-sm text-gray-600">
              {battery.calculationNotes || "-"}
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">AI Insight</h3>
            <p className="text-sm text-gray-500">
              Insight dan saran recovery berdasarkan social battery kamu.
            </p>
          </div>

          <button
            onClick={handleGenerateAiInsight}
            disabled={aiLoading}
            className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {aiLoading ? "Generating..." : "Generate AI Insight"}
          </button>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="rounded-xl bg-gray-50 p-4">
            <p className="text-sm font-semibold text-gray-800">Insight</p>
            <p className="mt-2 text-sm text-gray-600">
              {battery.aiInsight ||
                "Belum ada AI insight. Klik tombol generate."}
            </p>
          </div>

          <div className="rounded-xl bg-gray-50 p-4">
            <p className="text-sm font-semibold text-gray-800">
              Score Explanation
            </p>
            <p className="mt-2 text-sm text-gray-600">
              {battery.aiScoreExplanation ||
                "Belum ada penjelasan score dari AI."}
            </p>
          </div>

          <div className="rounded-xl bg-gray-50 p-4">
            <p className="text-sm font-semibold text-gray-800">
              Recovery Suggestion
            </p>
            <p className="mt-2 text-sm text-gray-600">
              {battery.recoverySuggestion ||
                "Belum ada recovery suggestion dari AI."}
            </p>
          </div>
        </div>

        {battery.aiModelName && (
          <p className="mt-4 text-xs text-gray-400">
            Generated by: {battery.aiModelName}
          </p>
        )}
      </div>
    </div>
  );
}

export default SocialBatteryPage;
