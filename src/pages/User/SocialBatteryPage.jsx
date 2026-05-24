import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FiCalendar,
  FiClock,
  FiUsers,
  FiRefreshCw,
  FiChevronRight,
  FiChevronDown,
} from "react-icons/fi";
import {
  getTodaySocialBattery,
  generateAiInsight,
} from "../../services/User/socialBatteryService";
import googleCalendarService from "../../services/User/googleCalendarService";

function SocialBatteryPage() {
  const [battery, setBattery] = useState(null);
  const [loading, setLoading] = useState(true);
  const [aiLoading, setAiLoading] = useState(false);
  const [error, setError] = useState("");
  const [syncing, setSyncing] = useState(false);
  const [calendarConnected, setCalendarConnected] = useState(null);
  const [openCard, setOpenCard] = useState({
    insight: false,
    explanation: false,
    suggestion: false,
  });

  const toggleCard = (cardName) => {
    setOpenCard((prev) => ({
      ...prev,
      [cardName]: !prev[cardName],
    }));
  };

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

  async function checkGoogleCalendarStatus() {
    try {
      const response = await googleCalendarService.getStatus();

      if (response.success && response.data) {
        setCalendarConnected(response.data.connected);
      }
    } catch (err) {
      setCalendarConnected(false);
    }
  }

  async function handleSyncCalendar() {
    try {
      setSyncing(true);
      setError("");

      const response = await googleCalendarService.syncCalendar();

      if (response.success) {
        await checkGoogleCalendarStatus();
        await fetchTodaySocialBattery();
      } else {
        setError(response.message || "Gagal synchronize calendar");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Gagal synchronize calendar");
    } finally {
      setSyncing(false);
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
    checkGoogleCalendarStatus();
    fetchTodaySocialBattery();
  }, []);

if (loading) {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="rounded-2xl border border-[#B9D0EB]/50 bg-white/50 px-8 py-6 text-center shadow-sm dark:border-slate-700/50 dark:bg-white/5">
        <p className="text-slate-700 dark:text-slate-300">
          Loading social battery...
        </p>
      </div>
    </div>
  );
}

  if (calendarConnected === false) {
    return (
      <div className="flex h-full items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          <div className="rounded-2xl border border-[#B9D0EB]/60 bg-[#D7E6FF]/60 p-6 text-center shadow-sm dark:border-slate-700 dark:bg-slate-900 sm:p-8">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white sm:text-xl">
              Google Calendar Belum Terhubung
            </h2>

            <p className="mt-2 text-sm text-black dark:text-slate-300 sm:text-base">
              Anda belum menautkan Google Calendar. Silakan tautkan terlebih
              dahulu jika ingin mengakses menu Social Battery.
            </p>

            <div className="mt-4">
              <Link
                to="/user/calendar"
                className="inline-flex justify-center rounded-full bg-[#49769F] px-4 py-2 text-xs font-semibold text-white shadow-md transition hover:bg-[#3d6487]"
              >
                Hubungkan Google Calendar
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!battery && calendarConnected === true) {
    return (
      <div className="rounded-2xl border border-[#B9D0EB]/50 bg-white/50 p-6 text-center shadow-sm dark:border-slate-700/50 dark:bg-white/5 sm:p-8  mx-auto max-w-md mt-40">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white sm:text-xl">
          Belum ada data Social Battery
        </h2>

        <p className="mt-2 text-sm text-slate-700 dark:text-slate-300 sm:text-base">
          Sync Google Calendar dulu untuk menghitung social battery hari ini.
        </p>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={handleSyncCalendar}
            disabled={syncing}
            className="inline-flex w-full justify-center rounded-full bg-[#49769F] px-4 py-2 text-xs font-semibold text-white shadow-md transition hover:bg-[#3d6487] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
          >
            {syncing ? "Syncing..." : "Synchronize Calendar"}
          </button>

          <Link
            to="/user/social-battery/history"
            className="inline-flex w-full justify-center rounded-full bg-[#C7DBFF] px-4 py-2 text-xs font-semibold text-[#2D4F73] hover:bg-[#A2C5FF] dark:bg-slate-700 dark:text-slate-100 dark:hover:bg-slate-600 sm:w-auto"
          >
            View History
          </Link>
        </div>
      </div>
    );
  }
  if (!battery) {
    return (
      <div className="min-h-screen bg-[#ffffff] p-4 dark:bg-gradient-to-br dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 sm:p-6">
        <p className="text-white dark:text-slate-300">
          Checking social battery...
        </p>
      </div>
    );
  }

  const statusName = battery.batteryStatus?.name || "-";
  const statusColor = battery.batteryStatus?.color || "#6B7280";

  return (
    <div className="w-full min-w-0 space-y-6 p-4 sm:p-7">
      <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-4 overflow-x-hidden md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-xl font-bold text-white dark:text-white sm:text-2xl">
            Social Battery
          </h1>

          <p className="text-sm text-white dark:text-slate-300 sm:text-base">
            Ringkasan energi sosial kamu berdasarkan aktivitas kalender hari
            ini.
          </p>
        </div>

        <div className="hidden w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center md:flex">
          <button
            type="button"
            onClick={handleSyncCalendar}
            disabled={syncing}
            className="w-full rounded-full bg-[#D3EAFA] px-4 py-2 text-center text-xs font-semibold text-black shadow-md transition hover:bg-[#D3EAFA] sm:w-auto"
          >
            {syncing ? "Syncing..." : "Synchronize Calendar"}
          </button>

          <Link
            to="/user/social-battery/history"
            className="w-full rounded-full bg-[#73B2C7] px-4 py-2 text-center text-xs font-semibold text-white transition hover:bg-[#73B2C7] sm:w-auto"
          >
            View History
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-[1.25fr_1fr] gap-4 md:hidden">
        <div className="relative overflow-hidden rounded-[24px] border-2 border-[#0a4174] bg-gradient-to-br from-[#D9F3FF]/85 via-[#BFE8FA]/85 to-[#A9D9F2]/85 p-3 shadow-[0_10px_24px_rgba(70,130,180,0.32),0_0_0_2px_rgba(255,255,255,0.45),inset_0_2px_4px_rgba(255,255,255,0.95),inset_0_-4px_10px_rgba(70,130,180,0.18)] dark:border-white/10 dark:bg-[#2b3d59]/80 dark:bg-none dark:shadow-[0_4px_16px_rgba(0,0,0,0.12)]">
          <p className="mb-2 text-sm font-bold text-[#1F2A44] dark:text-white">
            Battery Score
          </p>

          {(() => {
            const score =
              battery.totalEvents === 0 ? 100 : battery.batteryScore || 0;

            const mobileStatusName =
              score < 50 ? "Low" : score <= 70 ? "Medium" : "High";

            const mobileStatusColor =
              score < 50 ? "#ef4444" : score <= 70 ? "#facc15" : "#22c55e";

            return (
              <div className="flex items-center justify-between gap-3 px-[-22px]">
                <div
                  className="relative flex h-[40px] w-[160px] items-center justify-center overflow-hidden rounded-[20px] bg-[#F7FCFF] shadow-[inset_0_3px_6px_rgba(58,111,153,0.20),0_4px_10px_rgba(58,111,153,0.18)]"
                  style={{
                    border: `4px solid ${mobileStatusColor}`,
                  }}
                >
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        score < 50
                          ? "repeating-linear-gradient(135deg,#fecaca 0px,#fecaca 8px,#ffffff 8px,#ffffff 16px)"
                          : score <= 70
                            ? "repeating-linear-gradient(135deg,#fde68a 0px,#fde68a 8px,#ffffff 8px,#ffffff 16px)"
                            : "repeating-linear-gradient(135deg,#bbf7d0 0px,#bbf7d0 8px,#ffffff 8px,#ffffff 16px)",
                    }}
                  />

                  <div className="relative z-8 text-[13px] font-extrabold text-[#7D9BFF] drop-shadow-sm">
                    {score.toFixed(0)}%
                  </div>
                </div>

                <div className="flex flex-col items-center justify-center">
                  <p className="text-[9px] font-bold text-[#1E3557] dark:text-slate-200">
                    {battery.batteryScore?.toFixed(2) || 0} / 100
                  </p>

                  <div
                    className="inline-block rounded-full px-4 py-[3px] text-[9px] font-semibold text-white shadow-[0_4px_8px_rgba(58,111,153,0.25),inset_0_1px_2px_rgba(255,255,255,0.35)]"
                    style={{ backgroundColor: mobileStatusColor }}
                  >
                    {mobileStatusName.toUpperCase()}
                  </div>
                </div>
              </div>
            );
          })()}
        </div>

        <div className="flex flex-col justify-center gap-3">
          <button
            type="button"
            onClick={handleSyncCalendar}
            disabled={syncing}
            className="flex items-center justify-center gap-2 rounded-xl bg-[#D3EAFA] px-3 py-3 text-center text-sm font-semibold text-black shadow-[0_4px_8px_rgba(0,0,0,0.25)] transition hover:bg-[#D3EAFA] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <FiRefreshCw
              className={syncing ? "animate-spin text-base" : "text-base"}
            />
            <span>{syncing ? "Syncing..." : "Synchronize"}</span>
          </button>

          <Link
            to="/user/calendar"
            className="flex items-center justify-center gap-2 rounded-xl bg-[#73B2C7] px-3 py-3 text-center text-sm font-semibold text-white shadow-[0_4px_8px_rgba(0,0,0,0.25)]"
          >
            <FiCalendar className="text-base" />
            <span>calendar</span>
          </Link>
        </div>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-300">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-3">
        <div className="hidden rounded-[28px] border border-white/50 bg-white/20 p-5 shadow-[0_10px_30px_rgba(50,120,180,0.25),inset_0_1px_0_rgba(255,255,255,0.75)] backdrop-blur-md dark:border-white/10 dark:bg-slate-900/55 dark:shadow-[0_10px_30px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.08)] md:block">
          <p className="text-base font-bold text-[#ffffff] dark:text-white">
            Battery Score
          </p>

          <p className="mt-1 text-sm font-semibold text-[#ffffff] dark:text-slate-300">
            {battery.batteryScore?.toFixed(2) || 0} / 100
          </p>

          {(() => {
            const score =
              battery.totalEvents === 0 ? 100 : battery.batteryScore || 0;

            const statusName =
              score < 50 ? "Low" : score <= 70 ? "Medium" : "High";

            const statusColor =
              score < 50 ? "#ef4444" : score <= 70 ? "#facc15" : "#22c55e";

            return (
              <>
                <div className="mt-4 rounded-[22px] border border-white/60 bg-white/35 p-3 shadow-[inset_0_2px_5px_rgba(255,255,255,0.7),0_8px_20px_rgba(80,140,180,0.22)] backdrop-blur-sm dark:border-white/10 dark:bg-slate-800/45 dark:shadow-[inset_0_1px_2px_rgba(255,255,255,0.08),0_8px_20px_rgba(0,0,0,0.25)]">
                  <div className="relative rounded-[16px] border-[5px] border-[#A6D4EA] bg-[#DDF5FF] p-2 shadow-inner dark:border-slate-600 dark:bg-slate-900">
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

        <div className="rounded-[28px] border border-white/55 bg-white/20 p-5 shadow-[0_10px_30px_rgba(50,120,180,0.25),inset_0_1px_0_rgba(255,255,255,0.75)] backdrop-blur-md transition dark:border-white/10 dark:bg-slate-900/55 dark:shadow-[0_10px_30px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.06)] sm:p-6 lg:col-span-2">
          <div>
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-lg font-semibold leading-tight text-white">
                Ruang Refleksi
              </h3>

              <button
                onClick={handleGenerateAiInsight}
                disabled={aiLoading}
                className="shrink-0 rounded-full border border-white/30 bg-[#E7F7FF]/90 px-2.5 py-1 text-[9px] font-semibold text-black shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_3px_8px_rgba(0,0,0,0.18)] transition hover:bg-[#CDEBFA] disabled:cursor-not-allowed disabled:opacity-60 dark:bg-blue-600 dark:text-white dark:hover:bg-blue-500"
              >
                {aiLoading ? "Generating..." : "Pesan Hari Ini"}
              </button>
            </div>

            <p className="mt-1 max-w-[260px] text-xs leading-snug text-[#E3F6FF] dark:text-slate-300 sm:max-w-none">
              Insight dan saran recovery berdasarkan social battery kamu.
            </p>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div
              onClick={(e) => {
                e.stopPropagation();
                toggleCard("insight");
              }}
              className="cursor-pointer rounded-2xl border border-white/70 bg-gradient-to-br from-[#F5FCFF]/70 via-[#E7F7FF]/70 to-[#CDEBFA]/70 p-5 shadow-[0_8px_16px_rgba(58,111,153,0.25),inset_0_2px_3px_rgba(255,255,255,0.95),inset_0_-3px_6px_rgba(104,153,190,0.18)] transition-all duration-300 dark:border-white/10 dark:bg-[#2b3d59]/70 dark:bg-none dark:shadow-[0_4px_16px_rgba(0,0,0,0.12)]"
            >
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-[#1E3557] dark:text-white">
                  Insight
                </p>

                <div className="text-[#1E3557] transition-transform duration-300 dark:text-white">
                  {openCard.insight ? (
                    <FiChevronDown className="text-base" />
                  ) : (
                    <FiChevronRight className="text-base" />
                  )}
                </div>
              </div>

              {openCard.insight && (
                <p className="mt-3 text-sm leading-relaxed text-[#41546B] dark:text-slate-300">
                  {battery.aiInsight || "-"}
                </p>
              )}
            </div>

            <div
              onClick={(e) => {
                e.stopPropagation();
                toggleCard("explanation");
              }}
              className="cursor-pointer rounded-2xl border border-white/70 bg-gradient-to-br from-[#F5FCFF]/70 via-[#E7F7FF]/70 to-[#CDEBFA]/70  p-5 shadow-[0_8px_16px_rgba(58,111,153,0.25),inset_0_2px_3px_rgba(255,255,255,0.95),inset_0_-3px_6px_rgba(104,153,190,0.18)] transition-all duration-300 dark:border-white/10 dark:bg-[#2b3d59]/70 dark:bg-none dark:shadow-[0_4px_16px_rgba(0,0,0,0.12)]"
            >
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-[#1E3557] dark:text-white">
                  Explanation
                </p>

                <div className="text-[#1E3557] transition-transform duration-300 dark:text-white">
                  {openCard.explanation ? (
                    <FiChevronDown className="text-base" />
                  ) : (
                    <FiChevronRight className="text-base" />
                  )}
                </div>
              </div>

              {openCard.explanation && (
                <p className="mt-3 text-sm leading-relaxed text-[#41546B] dark:text-slate-300">
                  {battery.aiScoreExplanation || "-"}
                </p>
              )}
            </div>

            <div
              onClick={(e) => {
                e.stopPropagation();
                toggleCard("suggestion");
              }}
              className="cursor-pointer rounded-2xl border border-white/70 bg-gradient-to-br from-[#F5FCFF]/70 via-[#E7F7FF]/70 to-[#CDEBFA]/70 p-5 shadow-[0_8px_16px_rgba(58,111,153,0.25),inset_0_2px_3px_rgba(255,255,255,0.95),inset_0_-3px_6px_rgba(104,153,190,0.18)] transition-all duration-300 dark:border-white/10 dark:bg-[#2b3d59]/70 dark:bg-none dark:shadow-[0_4px_16px_rgba(0,0,0,0.12)]"
            >
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-[#1E3557] dark:text-white">
                  Recovery Suggestion
                </p>

                <div className="text-[#1E3557] transition-transform duration-300 dark:text-white">
                  {openCard.suggestion ? (
                    <FiChevronDown className="text-base" />
                  ) : (
                    <FiChevronRight className="text-base" />
                  )}
                </div>
              </div>

              {openCard.suggestion && (
                <p className="mt-3 text-sm leading-relaxed text-[#41546B] dark:text-slate-100">
                  {battery.recoverySuggestion || "-"}
                </p>
              )}
            </div>
          </div>

          {battery.aiModelName && (
            <p className="mt-5 text-xs text-[#000508] dark:text-[#ffffff]">
              Generated by: {battery.aiModelName}
            </p>
          )}
        </div>
      </div>

      <div className="rounded-[28px] border border-[#B8D8EF] bg-gradient-to-br from-[#D9F3FF]/80 via-[#BFE8FA]/80to-[#A9D9F2]/80 p-5 shadow-[0_10px_24px_rgba(70,130,180,0.25),inset_0_1px_0_rgba(255,255,255,0.85)] dark:border-white/10 dark:bg-[#172234]/80 dark:bg-none dark:shadow-[0_8px_24px_rgba(0,0,0,0.18)] sm:p-6">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-lg font-bold text-[#1F2A44] dark:text-white">
            Ringkasan Kalkulasi
          </h3>

          <Link
            to="/user/social-battery/history"
            className="rounded-full bg-[#E7F7FF]/90 px-3 py-1 text-[9px] font-semibold text-[#1E3557] shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_3px_8px_rgba(0,0,0,0.18)] transition hover:bg-[#CDEBFA] dark:bg-blue-600 dark:text-white dark:hover:bg-blue-500 md:hidden"
          >
            History
          </Link>
        </div>

        <div className="mt-5 grid grid-cols-3 gap-3 sm:grid-cols-2 lg:grid-cols-3 lg:gap-4">
          <div className="aspect-square rounded-2xl border border-[#B9D8EB] bg-gradient-to-br from-[#F3FBFF] via-[#E2F5FF] to-[#D0ECFA] p-2 shadow-[0_6px_12px_rgba(58,111,153,0.25),inset_0_2px_3px_rgba(255,255,255,0.95),inset_0_-3px_6px_rgba(104,153,190,0.18)] dark:border-white/10 dark:bg-[#2b3d59]/70 dark:bg-none dark:shadow-[0_4px_16px_rgba(0,0,0,0.12)] sm:aspect-auto sm:flex sm:items-center sm:gap-3 sm:p-4">
            <div className="flex h-full flex-col items-center justify-center text-center sm:h-auto sm:flex-row sm:text-left">
              <FiCalendar className="mb-1 text-lg text-[#5B8CCB] drop-shadow-sm sm:mb-0 sm:text-3xl" />

              <div className="sm:ml-3">
                <p className="text-[9px] font-medium leading-tight text-[#5D6B82] dark:text-slate-300 sm:text-xs">
                  Total
                  <br className="sm:hidden" /> Acara
                </p>

                <p className="mt-1 text-base font-bold leading-none text-[#1E3557] dark:text-white sm:text-xl">
                  {battery.totalEvents}
                </p>
              </div>
            </div>
          </div>

          <div className="aspect-square rounded-2xl border border-[#B9D8EB] bg-gradient-to-br from-[#F3FBFF] via-[#E2F5FF] to-[#D0ECFA] p-2 shadow-[0_6px_12px_rgba(58,111,153,0.25),inset_0_2px_3px_rgba(255,255,255,0.95),inset_0_-3px_6px_rgba(104,153,190,0.18)] dark:border-white/10 dark:bg-[#2b3d59]/70 dark:bg-none dark:shadow-[0_4px_16px_rgba(0,0,0,0.12)] sm:aspect-auto sm:flex sm:items-center sm:gap-3 sm:p-4">
            <div className="flex h-full flex-col items-center justify-center text-center sm:h-auto sm:flex-row sm:text-left">
              <FiClock className="mb-1 text-lg text-[#5B8CCB] drop-shadow-sm sm:mb-0 sm:text-3xl" />

              <div className="sm:ml-3">
                <p className="text-[9px] font-medium leading-tight text-[#5D6B82] dark:text-slate-300 sm:text-xs">
                  Total
                  <br className="sm:hidden" /> Durasi
                </p>

                <p className="mt-1 text-base font-bold leading-none text-[#1E3557] dark:text-white sm:text-xl">
                  {battery.totalDurationMinutes}
                  <span className="ml-1 text-[9px] font-bold sm:text-xs">
                    mnt
                  </span>
                </p>
              </div>
            </div>
          </div>

          <div className="aspect-square rounded-2xl border border-[#B9D8EB] bg-gradient-to-br from-[#F3FBFF] via-[#E2F5FF] to-[#D0ECFA] p-2 shadow-[0_6px_12px_rgba(58,111,153,0.25),inset_0_2px_3px_rgba(255,255,255,0.95),inset_0_-3px_6px_rgba(104,153,190,0.18)] dark:border-white/10 dark:bg-[#2b3d59]/70 dark:bg-none dark:shadow-[0_4px_16px_rgba(0,0,0,0.12)] sm:aspect-auto sm:flex sm:items-center sm:gap-3 sm:p-4">
            <div className="flex h-full flex-col items-center justify-center text-center sm:h-auto sm:flex-row sm:text-left">
              <FiUsers className="mb-1 text-lg text-[#5B8CCB] drop-shadow-sm sm:mb-0 sm:text-3xl" />

              <div className="sm:ml-3">
                <p className="text-[9px] font-medium leading-tight text-[#5D6B82] dark:text-slate-300 sm:text-xs">
                  Intensitas
                  <br className="sm:hidden" /> Sosial
                </p>

                <p className="mt-1 text-base font-bold leading-none text-[#1E3557] dark:text-white sm:text-xl">
                  {battery.socialIntensityScore?.toFixed?.(2) ??
                    battery.socialIntensityScore}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-5 rounded-2xl border border-[#5D8FBD] bg-gradient-to-br from-[#6FA0CC] via-[#5B8FC2] to-[#4F7EAE] p-5 shadow-[0_6px_12px_rgba(58,111,153,0.25),inset_0_2px_3px_rgba(255,255,255,0.28),inset_0_-4px_8px_rgba(24,63,103,0.22)] dark:border-white/10 dark:bg-[#101827]/70 dark:bg-none dark:shadow-none">
          <p className="text-xs font-semibold tracking-wide text-[#EAF7FF] dark:text-slate-300">
            Calculation Notes
          </p>

          <p className="mt-2 text-sm leading-relaxed text-white/90 dark:text-slate-400">
            {battery.calculationNotes || "-"}
          </p>
        </div>
      </div>
    </div>
  );
}

export default SocialBatteryPage;
