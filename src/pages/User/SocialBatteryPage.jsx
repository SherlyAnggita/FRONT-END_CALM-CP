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
      <div className="min-h-screen bg-[#E6F0FA] p-6">
        <p className="text-gray-500">Loading social battery...</p>
      </div>
    );
  }

  if (!battery) {
    return (
      <div className="min-h-screen bg-[#E6F0FA] p-6 flex items-center justify-center">
        <div className="rounded-2xl border border-[#B9D0EB] bg-[#D7E6FF] p-8 text-center shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900">
            Belum ada data Social Battery
          </h2>
          <p className="mt-2 text-gray-500">
            Sync Google Calendar dulu untuk menghitung social battery hari ini.
          </p>

          <Link
            to="/user/social-battery/history"
            className="mt-4 inline-flex rounded-full bg-[#C7DBFF] px-4 py-2 text-xs font-semibold text-[#2D4F73] hover:bg-[#A2C5FF]"
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
    <div className="min-h-screen bg-[#fffff] p-6 space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Social Battery</h1>
          <p className="text-gray-500">
            Ringkasan energi sosial kamu berdasarkan aktivitas kalender hari ini.
          </p>
        </div>

        <Link
          to="/user/social-battery/history"
          className="rounded-full bg-[#0a4174] px-4 py-2 text-xs font-semibold text-[#ffffff] hover:bg-[#A2C5FF]"
        >
          View History
        </Link>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Card utama */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
       {/* Battery Score Card */}
        <div className="rounded-2xl bg-[#D6EBFF] p-6 shadow-sm border border-[#B9D0EB] flex flex-col items-start">
          {/* Title */}
          <p className="text-lg font-semibold text-gray-900 mb-1">Battery Score</p>

          {/* Score numeric */}
          <p className="text-xl font-semibold text-gray-800 mb-3">
            {battery.batteryScore?.toFixed(2) || 0} / 100
          </p>

          {/* Battery icon */}
          <div className="relative w-48 h-20">
            {/* Outline battery */}
            <div className="absolute inset-0 border-2 border-gray-400 rounded-lg bg-white"></div>

            {/* Fill bar */}
            <div
              className="absolute top-1 left-1 h-18 rounded-l-lg flex items-center justify-center text-sm font-semibold text-gray-900"
              style={{
                width: `calc(${battery.batteryScore || 0}% - 4px)`,
                background: battery.batteryScore <= 20
                  ? "linear-gradient(90deg, #FCA5A5, #F87171)"
                  : battery.batteryScore <= 50
                  ? "linear-gradient(90deg, #FDE68A, #FBBF24)"
                  : "linear-gradient(90deg, #86EFAC, #34D399)",
                boxShadow: "inset 0 2px 6px rgba(255,255,255,0.4)",
                transition: "width 1s ease-in-out",
              }}
            >
              {battery.batteryScore?.toFixed(0)}%
            </div>

            {/* Tip battery */}
            <div className="absolute top-1/4 right-[-6px] h-1/2 w-3 rounded-r-md border-2 border-gray-300 bg-gray-100"></div>
          </div>

          {/* Status label */}
          <div
            className="mt-3 inline-block rounded-full px-3 py-1 text-sm font-semibold text-white shadow"
            style={{ backgroundColor: statusColor }}
          >
            {statusName.toUpperCase()}
          </div>
        </div>

        {/* Calculation Summary */}
        <div className="rounded-2xl bg-[#D7E6FF] p-6 shadow-sm border border-[#B9D0EB] lg:col-span-2">
          <h3 className="text-lg font-semibold text-gray-900">Ringkasan Kalkulasi</h3>
          <div className="mt-4 grid grid-cols-3 gap-4">
            <div className="flex items-center gap-4 flex-1 rounded-xl bg-white p-4 shadow-sm">
              <FiCalendar className="text-3xl text-[#4C8FEF]" />
              <div className="flex flex-col">
                <p className="text-xs text-gray-700">Total Acara</p>
                <p className="mt-1 text-xl font-bold text-gray-900">{battery.totalEvents}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 flex-1 rounded-xl bg-white p-4 shadow-sm">
              <FiClock className="text-3xl text-[#4C8FEF]" />
              <div className="flex flex-col">
                <p className="text-xs text-gray-700">Total Durasi</p>
                <p className="mt-1 text-xl font-bold text-gray-900">{battery.totalDurationMinutes} mnt</p>
              </div>
            </div>

            <div className="flex items-center gap-4 flex-1 rounded-xl bg-white p-4 shadow-sm">
              <FiUsers className="text-3xl text-[#4C8FEF]" />
              <div className="flex flex-col">
                <p className="text-xs text-gray-700">Intensitas Sosial</p>
                <p className="mt-1 text-xl font-bold text-gray-900">
                  {battery.socialIntensityScore?.toFixed?.(2) ?? battery.socialIntensityScore}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 rounded-xl bg-white p-4 shadow-sm">
            <p className="text-xs font-medium text-gray-700">Calculation Notes</p>
            <p className="mt-1 text-sm text-gray-600">{battery.calculationNotes || "-"}</p>
          </div>
        </div>
      </div>

      {/* AI Insight */}
      <div className="rounded-2xl bg-[#D7E6FF] p-6 shadow-sm border border-[#B9D0EB]">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Ruang Refleksi</h3>
            <p className="text-sm text-gray-500">
              Insight dan saran recovery berdasarkan social battery kamu.
            </p>
          </div>
          <button
            onClick={handleGenerateAiInsight}
            disabled={aiLoading}
            className="rounded-full bg-[#0a4174] px-4 py-2 text-xs font-semibold text-[#ffffff] hover:bg-[#A2C5FF] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {aiLoading ? "Generating..." : "Pesan Hari Ini"}
          </button>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="rounded-xl bg-white p-4 shadow-sm">
            <p className="text-xs font-semibold text-gray-800">Insight</p>
            <p className="mt-1 text-sm text-gray-600">{battery.aiInsight || "-"}</p>
          </div>

          <div className="rounded-xl bg-white p-4 shadow-sm">
            <p className="text-xs font-semibold text-gray-800">Explanation</p>
            <p className="mt-1 text-sm text-gray-600">{battery.aiScoreExplanation || "-"}</p>
          </div>

          <div className="rounded-xl bg-white p-4 shadow-sm">
            <p className="text-xs font-semibold text-gray-800">Suggestion</p>
            <p className="mt-1 text-sm text-gray-600">{battery.recoverySuggestion || "-"}</p>
          </div>
        </div>

        {battery.aiModelName && (
          <p className="mt-4 text-xs text-gray-400">Generated by: {battery.aiModelName}</p>
        )}
      </div>
    </div>
  );
}

export default SocialBatteryPage;