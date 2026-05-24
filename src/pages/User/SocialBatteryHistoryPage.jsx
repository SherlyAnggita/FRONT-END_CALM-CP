import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiChevronDown, FiChevronRight } from "react-icons/fi";
import {
  getSocialBatteryHistory,
  getSocialBatteryByDate,
} from "../../services/User/socialBatteryService";

function SocialBatteryHistoryPage() {
  const [history, setHistory] = useState([]);
  const [historyMeta, setHistoryMeta] = useState({
    page: 1,
    limit: 7,
    total: 0,
    totalPages: 1,
  });
  const [historyLoading, setHistoryLoading] = useState(false);
  const [openHistory, setOpenHistory] = useState({});

  const toggleHistory = (id) => {
    setOpenHistory((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const [openStat, setOpenStat] = useState({});

  const toggleStat = (key) => {
    setOpenStat((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const [selectedDate, setSelectedDate] = useState("");
  const [selectedData, setSelectedData] = useState(null);
  const [dateLoading, setDateLoading] = useState(false);
  const [dateSearched, setDateSearched] = useState(false);
  const [error, setError] = useState("");

  async function fetchSocialBatteryHistory(page = 1) {
    try {
      setHistoryLoading(true);
      setError("");
      const response = await getSocialBatteryHistory(page, 7);
      setHistory(response.data?.data || []);
      setHistoryMeta(
        response.data?.meta || { page: 1, limit: 7, total: 0, totalPages: 1 },
      );
    } catch (err) {
      setError(
        err.response?.data?.message || "Gagal mengambil history social battery",
      );
    } finally {
      setHistoryLoading(false);
    }
  }

  async function handleSearchByDate() {
    if (!selectedDate) return;
    try {
      setDateLoading(true);
      setDateSearched(true);
      setError("");
      const response = await getSocialBatteryByDate(selectedDate);
      setSelectedData(response.data);
    } catch (err) {
      setSelectedData(null);
      setError(
        err.response?.data?.message ||
          "Gagal mengambil social battery berdasarkan tanggal",
      );
    } finally {
      setDateLoading(false);
    }
  }

  useEffect(() => {
    fetchSocialBatteryHistory(1);
  }, []);

  return (
    <div className="min-h-screen space-y-6 p-4 text-[#1E3557] dark:text-slate-100 md:p-6">
      {/* Header */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white dark:text-white">
            Social Battery History
          </h1>
          <p className="text-white dark:text-slate-300">
            Riwayat social battery dan pencarian data berdasarkan tanggal.
          </p>
        </div>
      </div>

      {error && (
        <div className="rounded-xl bg-red-50 p-4 text-sm text-red-600 shadow-sm dark:bg-red-900/20 dark:text-red-300">
          {error}
        </div>
      )}

      {/* Search by Date */}
      <div className="rounded-[28px] border border-[#B8D8EF]/60 bg-white/50 p-5 shadow-[0_10px_24px_rgba(70,130,180,0.15),inset_0_1px_0_rgba(255,255,255,0.85)] backdrop-blur-sm dark:border-white/10 dark:bg-white/5 sm:p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-lg font-bold text-[#1F2A44] dark:text-white">
              Search by Date
            </h3>
            <p className="text-sm text-[#5D6B82] dark:text-slate-300">
              Cari data social battery berdasarkan tanggal tertentu.
            </p>
          </div>

          <div className="flex flex-row gap-2">
            <input
              type="date"
              value={selectedDate}
              onChange={(event) => {
                setSelectedDate(event.target.value);
                if (!event.target.value) {
                  setDateSearched(false);
                  setSelectedData(null);
                }
              }}
              className="rounded-xl border border-[#B9D8EB]/70 bg-white/70 px-4 py-2 text-sm text-[#1E3557] outline-none shadow-[inset_0_1px_2px_rgba(255,255,255,0.9)] focus:border-[#4C8FEF] dark:border-white/10 dark:bg-white/10 dark:text-white"
            />
            <button
              onClick={handleSearchByDate}
              disabled={dateLoading || !selectedDate}
              className="rounded-xl bg-[#0A4774] px-4 py-2 text-sm font-semibold text-white shadow-[0_4px_10px_rgba(10,71,116,0.25)] transition hover:bg-[#0E5A92] disabled:cursor-not-allowed disabled:opacity-60 dark:bg-blue-600 dark:hover:bg-blue-500"
            >
              {dateLoading ? "Searching..." : "Search"}
            </button>
          </div>
        </div>

        {dateSearched && (
          <div className="mt-5">
            {selectedData ? (
              <div className="rounded-2xl border border-[#B9D8EB]/50 bg-white/40 p-4 shadow-sm backdrop-blur-sm dark:border-white/10 dark:bg-white/5">
                <div className="flex flex-row items-center justify-between">
                  <div>
                    <p className="text-sm text-[#5D6B82] dark:text-slate-300">
                      Data tanggal {selectedDate}
                    </p>
                    <p className="mt-1 text-2xl font-bold text-[#1E3557] dark:text-white">
                      {selectedData.batteryScore?.toFixed?.(2) ??
                        selectedData.batteryScore}
                      %
                    </p>
                  </div>
                  <div
                    className="inline-flex w-fit rounded-full px-4 py-1 text-sm font-semibold text-white shadow-md"
                    style={{
                      backgroundColor:
                        selectedData.batteryStatus?.color || "#6B7280",
                    }}
                  >
                    {(selectedData.batteryStatus?.name || "-").toUpperCase()}
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-2">
                  {[
                    {
                      icon: "📅",
                      label: "Total Events",
                      value: selectedData.totalEvents,
                    },
                    {
                      icon: "⏱️",
                      label: "Total Duration",
                      value: `${selectedData.totalDurationMinutes} min`,
                    },
                    {
                      icon: "👥",
                      label: "Social Intensity",
                      value:
                        selectedData.socialIntensityScore?.toFixed?.(2) ??
                        selectedData.socialIntensityScore,
                    },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="flex flex-col items-center justify-center gap-1 rounded-2xl border border-[#B9D8EB]/50 bg-white/40 p-3 text-center shadow-sm backdrop-blur-sm dark:border-white/10 dark:bg-white/5"
                    >
                      <span className="text-lg">{item.icon}</span>
                      <p className="text-[10px] font-semibold text-[#1E3557] dark:text-white">
                        {item.label}
                      </p>
                      <p className="text-sm font-bold text-[#1E3557] dark:text-white">
                        {item.value}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-4 rounded-2xl border border-[#5D8FBD]/50 bg-[#49769F]/60 p-4 shadow-sm backdrop-blur-sm dark:border-white/10 dark:bg-white/10">
                  <p className="text-sm font-semibold text-white dark:text-slate-200">
                    Insight
                  </p>
                  <p className="mt-2 text-sm text-white/90 dark:text-slate-300">
                    {selectedData.aiInsight || "-"}
                  </p>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-[#7DB8D9]/60 bg-white/30 p-4 text-sm text-[#5D6B82] shadow-sm backdrop-blur-sm dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
                Data social battery untuk tanggal ini tidak ditemukan.
              </div>
            )}
          </div>
        )}
      </div>

      {/* History List */}
      <div className="rounded-[28px] border border-[#B8D8EF]/60 bg-white/50 p-5 shadow-[0_10px_24px_rgba(70,130,180,0.15),inset_0_1px_0_rgba(255,255,255,0.85)] backdrop-blur-sm dark:border-white/10 dark:bg-white/5 sm:p-6">
        <div>
          <h3 className="text-lg font-bold text-[#1F2A44] dark:text-white">
            History List
          </h3>
          <p className="text-sm text-[#5D6B82] dark:text-slate-300">
            Riwayat social battery kamu berdasarkan aktivitas kalender.
          </p>
        </div>

        <div className="mt-5">
          {historyLoading ? (
            <p className="text-sm text-[#5D6B82] dark:text-slate-300">
              Loading history...
            </p>
          ) : history.length === 0 ? (
            <p className="text-sm text-[#5D6B82] dark:text-slate-300">
              Belum ada history social battery.
            </p>
          ) : (
            <div className="space-y-4">
              {history.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col rounded-2xl border border-[#B9D8EB]/50 bg-white/40 shadow-sm backdrop-blur-sm dark:border-white/10 dark:bg-white/5"
                >
                  {/* Header card - klik untuk buka tutup */}
                  <div
                    className="flex cursor-pointer items-center justify-between p-4"
                    onClick={() => toggleHistory(item.id)}
                  >
                    <div>
                      <p className="font-semibold text-[#1E3557] dark:text-white">
                        {new Date(item.date).toLocaleDateString("id-ID", {
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                      <p className="mt-1 text-sm text-[#5D6B82] dark:text-slate-300">
                        {item.totalEvents} event • {item.totalDurationMinutes}{" "}
                        min
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <p className="text-2xl font-bold text-[#1E3557] dark:text-white">
                        {item.batteryScore?.toFixed?.(2) ?? item.batteryScore}%
                      </p>
                      <span
                        className="rounded-full px-3 py-1 text-xs font-semibold text-white shadow-md"
                        style={{
                          backgroundColor:
                            item.batteryStatus?.color || "#6B7280",
                        }}
                      >
                        {(item.batteryStatus?.name || "-").toUpperCase()}
                      </span>
                      {openHistory[item.id] ? (
                        <FiChevronDown className="shrink-0 text-[#1E3557] dark:text-white" />
                      ) : (
                        <FiChevronRight className="shrink-0 text-[#1E3557] dark:text-white" />
                      )}
                    </div>
                  </div>

                  {/* Stats Grid - buka tutup */}
                  {openHistory[item.id] && (
                    <div className="grid grid-cols-3 gap-2 border-t border-[#B9D8EB]/40 p-4 dark:border-white/10">
                      {[
                        {
                          icon: "📅",
                          label: "Social Intensity",
                          value:
                            item.socialIntensityScore?.toFixed?.(2) ??
                            item.socialIntensityScore,
                        },
                        {
                          icon: "📝",
                          label: "Insight",
                          value: item.aiInsight || "-",
                        },
                        {
                          icon: "💡",
                          label: "Recovery",
                          value: item.recoverySuggestion || "-",
                        },
                      ].map((stat) => {
                        const key = `${item.date}-${stat.label}`;
                        return (
                          <div
                            key={stat.label}
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleStat(key);
                            }}
                            className="flex cursor-pointer flex-col items-center justify-center gap-1 rounded-2xl border border-[#B9D8EB]/50 bg-white/40 p-3 text-center shadow-sm backdrop-blur-sm dark:border-white/10 dark:bg-white/5"
                          >
                            <span className="text-lg">{stat.icon}</span>
                            <p className="text-[10px] font-semibold text-[#1E3557] dark:text-white">
                              {stat.label}
                            </p>
                            <p
                              className={`text-[10px] text-[#41546B] dark:text-slate-300 ${openStat[key] ? "" : "line-clamp-2"}`}
                            >
                              {stat.value}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {historyMeta.totalPages > 1 && (
          <div className="mt-5 flex items-center justify-between">
            <button
              onClick={() => fetchSocialBatteryHistory(historyMeta.page - 1)}
              disabled={historyMeta.page <= 1 || historyLoading}
              className="rounded-xl bg-[#0A4774] px-4 py-2 text-sm font-semibold text-white shadow-[0_4px_10px_rgba(10,71,116,0.25)] hover:bg-[#0E5A92] disabled:cursor-not-allowed disabled:opacity-50 dark:bg-blue-600 dark:hover:bg-blue-500"
            >
              Previous
            </button>
            <p className="text-sm text-[#5D6B82] dark:text-slate-300">
              Page {historyMeta.page} of {historyMeta.totalPages}
            </p>
            <button
              onClick={() => fetchSocialBatteryHistory(historyMeta.page + 1)}
              disabled={
                historyMeta.page >= historyMeta.totalPages || historyLoading
              }
              className="rounded-xl bg-[#0A4774] px-4 py-2 text-sm font-semibold text-white shadow-[0_4px_10px_rgba(10,71,116,0.25)] hover:bg-[#0E5A92] disabled:cursor-not-allowed disabled:opacity-50 dark:bg-blue-600 dark:hover:bg-blue-500"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default SocialBatteryHistoryPage;
