import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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
        response.data?.meta || {
          page: 1,
          limit: 7,
          total: 0,
          totalPages: 1,
        },
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Gagal mengambil history social battery",
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
    <div className="min-h-screen space-y-6  p-4 text-[#1E3557] dark:bg-slate-950 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900 dark:text-slate-100 md:p-6">
      {/* Header */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#ffffff] dark:text-white">
            Social Battery History
          </h1>

          <p className="text-[#ffffff] dark:text-slate-300">
            Riwayat social battery dan pencarian data berdasarkan tanggal.
          </p>
        </div>

        <Link
          to="/user/social-battery"
          className="w-fit rounded-full bg-[#CAE4F4] px-4 py-2 text-sm font-semibold text-black shadow-[0_4px_10px_rgba(10,71,116,0.25)] hover:bg-[#0E5A92] dark:bg-blue-600 dark:hover:bg-blue-500"
        >
          Back to Social Battery
        </Link>
      </div>

      {error && (
        <div className="rounded-xl bg-red-50 p-4 text-sm text-red-600 shadow-sm dark:bg-red-900/20 dark:text-red-300">
          {error}
        </div>
      )}

      {/* Search by Date */}
      <div className="rounded-[28px] border border-[#B8D8EF] bg-gradient-to-br from-[#D9F3FF] via-[#BFE8FA] to-[#A9D9F2] p-5 shadow-[0_10px_24px_rgba(70,130,180,0.25),inset_0_1px_0_rgba(255,255,255,0.85)] dark:border-slate-700 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 sm:p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-lg font-bold text-[#1F2A44] dark:text-white">
              Search by Date
            </h3>

            <p className="text-sm text-[#5D6B82] dark:text-slate-300">
              Cari data social battery berdasarkan tanggal tertentu.
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              type="date"
              value={selectedDate}
              onChange={(event) => setSelectedDate(event.target.value)}
              className="rounded-xl border border-[#B9D8EB] bg-[#F5FCFF] px-4 py-2 text-sm text-[#1E3557] outline-none shadow-[inset_0_1px_2px_rgba(255,255,255,0.9)] focus:border-[#4C8FEF] dark:border-slate-600 dark:bg-slate-800 dark:text-white"
            />

            <button
              onClick={handleSearchByDate}
              disabled={dateLoading || !selectedDate}
              className="rounded-xl bg-[#0A4774] px-4 py-2 text-sm font-semibold text-white shadow-[0_4px_10px_rgba(10,71,116,0.25)] hover:bg-[#0E5A92] disabled:cursor-not-allowed disabled:opacity-60 dark:bg-blue-600 dark:hover:bg-blue-500"
            >
              {dateLoading ? "Searching..." : "Search"}
            </button>
          </div>
        </div>

        {dateSearched && (
          <div className="mt-5">
            {selectedData ? (
              <div className="rounded-2xl border border-[#B9D8EB] bg-gradient-to-br from-[#F3FBFF] via-[#E2F5FF] to-[#D0ECFA] p-4 shadow-[0_6px_12px_rgba(58,111,153,0.25),inset_0_2px_3px_rgba(255,255,255,0.95),inset_0_-3px_6px_rgba(104,153,190,0.18)] dark:border-slate-700 dark:from-slate-800 dark:via-slate-800 dark:to-slate-900">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-sm text-[#5D6B82] dark:text-slate-300">
                      Data tanggal {selectedDate}
                    </p>

                    <p className="mt-1 text-2xl font-bold text-[#1E3557] dark:text-white">
                      {selectedData.batteryScore?.toFixed?.(2) ??
                        selectedData.batteryScore}{" "}
                      / 100
                    </p>
                  </div>

                  <div
                    className="inline-flex w-fit rounded-full px-4 py-1 text-sm font-semibold text-white shadow-[0_4px_8px_rgba(58,111,153,0.25),inset_0_1px_2px_rgba(255,255,255,0.35)]"
                    style={{
                      backgroundColor:
                        selectedData.batteryStatus?.color || "#6B7280",
                    }}
                  >
                    {(selectedData.batteryStatus?.name || "-").toUpperCase()}
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
                  <div className="flex items-center gap-2 rounded-2xl border border-[#B9D8EB] bg-gradient-to-br from-[#F5FCFF] via-[#E7F7FF] to-[#CDEBFA] p-4 shadow-[0_6px_12px_rgba(58,111,153,0.2),inset_0_2px_3px_rgba(255,255,255,0.95)] dark:border-slate-700 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800">
                    <span className="text-xl text-[#4C8FEF]">📅</span>
                    <div>
                      <p className="text-sm font-semibold text-[#1E3557] dark:text-white">
                        Total Events
                      </p>
                      <p className="mt-1 text-xl font-bold text-[#1E3557] dark:text-white">
                        {selectedData.totalEvents}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 rounded-2xl border border-[#B9D8EB] bg-gradient-to-br from-[#F5FCFF] via-[#E7F7FF] to-[#CDEBFA] p-4 shadow-[0_6px_12px_rgba(58,111,153,0.2),inset_0_2px_3px_rgba(255,255,255,0.95)] dark:border-slate-700 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800">
                    <span className="text-xl text-[#4C8FEF]">⏱️</span>
                    <div>
                      <p className="text-sm font-semibold text-[#1E3557] dark:text-white">
                        Total Duration
                      </p>
                      <p className="mt-1 text-xl font-bold text-[#1E3557] dark:text-white">
                        {selectedData.totalDurationMinutes} min
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 rounded-2xl border border-[#B9D8EB] bg-gradient-to-br from-[#F5FCFF] via-[#E7F7FF] to-[#CDEBFA] p-4 shadow-[0_6px_12px_rgba(58,111,153,0.2),inset_0_2px_3px_rgba(255,255,255,0.95)] dark:border-slate-700 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800">
                    <span className="text-xl text-[#4C8FEF]">👥</span>
                    <div>
                      <p className="text-sm font-semibold text-[#1E3557] dark:text-white">
                        Social Intensity
                      </p>
                      <p className="mt-1 text-xl font-bold text-[#1E3557] dark:text-white">
                        {selectedData.socialIntensityScore?.toFixed?.(2) ??
                          selectedData.socialIntensityScore}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 rounded-2xl border border-[#5D8FBD] bg-gradient-to-br from-[#6FA0CC] via-[#5B8FC2] to-[#4F7EAE] p-4 shadow-[0_6px_12px_rgba(58,111,153,0.25),inset_0_2px_3px_rgba(255,255,255,0.28)] dark:border-slate-700 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
                  <p className="text-sm font-semibold text-white">Insight</p>

                  <p className="mt-2 text-sm text-white/90 dark:text-slate-300">
                    {selectedData.aiInsight || "-"}
                  </p>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-[#7DB8D9] bg-[#D8F3FF] p-4 text-sm text-[#5D6B82] shadow-sm dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300">
                Data social battery untuk tanggal ini tidak ditemukan.
              </div>
            )}
          </div>
        )}
      </div>

      {/* History List */}
      <div className="rounded-[28px] border border-[#B8D8EF] bg-gradient-to-br from-[#D9F3FF] via-[#BFE8FA] to-[#A9D9F2] p-5 shadow-[0_10px_24px_rgba(70,130,180,0.25),inset_0_1px_0_rgba(255,255,255,0.85)] dark:border-slate-700 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 sm:p-6">
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
                  className="flex flex-col gap-4 rounded-2xl border border-[#B9D8EB] bg-gradient-to-br from-[#F3FBFF] via-[#E2F5FF] to-[#D0ECFA] p-4 shadow-[0_6px_12px_rgba(58,111,153,0.25),inset_0_2px_3px_rgba(255,255,255,0.95),inset_0_-3px_6px_rgba(104,153,190,0.18)] dark:border-slate-700 dark:from-slate-800 dark:via-slate-800 dark:to-slate-900"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="font-semibold text-[#1E3557] dark:text-white">
                        {new Date(item.date).toLocaleDateString("id-ID", {
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                        })}
                      </p>

                      <p className="mt-1 text-sm text-[#5D6B82] dark:text-slate-300">
                        {item.totalEvents} event •{" "}
                        {item.totalDurationMinutes} min
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <p className="text-2xl font-bold text-[#1E3557] dark:text-white">
                        {item.batteryScore?.toFixed?.(2) ?? item.batteryScore}
                      </p>

                      <span
                        className="rounded-full px-4 py-1 text-sm font-semibold text-white shadow-[0_4px_8px_rgba(58,111,153,0.25),inset_0_1px_2px_rgba(255,255,255,0.35)]"
                        style={{
                          backgroundColor:
                            item.batteryStatus?.color || "#6B7280",
                        }}
                      >
                        {(item.batteryStatus?.name || "-").toUpperCase()}
                      </span>
                    </div>
                  </div>

                  <div className="mt-2 grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div className="flex items-center gap-2 rounded-2xl border border-[#B9D8EB] bg-gradient-to-br from-[#F5FCFF] via-[#E7F7FF] to-[#CDEBFA] p-4 shadow-[0_6px_12px_rgba(58,111,153,0.2),inset_0_2px_3px_rgba(255,255,255,0.95)] dark:border-slate-700 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800">
                      <span className="text-xl text-[#4C8FEF]">📅</span>
                      <div>
                        <p className="text-sm font-semibold text-[#1E3557] dark:text-white">
                          Social Intensity
                        </p>
                        <p className="mt-1 text-sm text-[#41546B] dark:text-slate-300">
                          {item.socialIntensityScore?.toFixed?.(2) ??
                            item.socialIntensityScore}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 rounded-2xl border border-[#B9D8EB] bg-gradient-to-br from-[#F5FCFF] via-[#E7F7FF] to-[#CDEBFA] p-4 shadow-[0_6px_12px_rgba(58,111,153,0.2),inset_0_2px_3px_rgba(255,255,255,0.95)] dark:border-slate-700 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800">
                      <span className="text-xl text-[#4C8FEF]">📝</span>
                      <div>
                        <p className="text-sm font-semibold text-[#1E3557] dark:text-white">
                          Insight
                        </p>
                        <p className="mt-1 text-sm text-[#41546B] dark:text-slate-300">
                          {item.aiInsight || "-"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 rounded-2xl border border-[#B9D8EB] bg-gradient-to-br from-[#F5FCFF] via-[#E7F7FF] to-[#CDEBFA] p-4 shadow-[0_6px_12px_rgba(58,111,153,0.2),inset_0_2px_3px_rgba(255,255,255,0.95)] dark:border-slate-700 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800">
                      <span className="text-xl text-[#4C8FEF]">💡</span>
                      <div>
                        <p className="text-sm font-semibold text-[#1E3557] dark:text-white">
                          Recovery Suggestion
                        </p>
                        <p className="mt-1 text-sm text-[#41546B] dark:text-slate-300">
                          {item.recoverySuggestion || "-"}
                        </p>
                      </div>
                    </div>
                  </div>
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
              className="rounded-xl bg-[#0A4774] px-4 py-2 text-sm font-semibold text-white shadow-[0_4px_10px_rgba(10,71,116,0.25)] hover:bg-[#0E5A92] disabled:cursor-not-allowed disabled:opacity-50 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
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
              className="rounded-xl bg-[#0A4774] px-4 py-2 text-sm font-semibold text-white shadow-[0_4px_10px_rgba(10,71,116,0.25)] hover:bg-[#0E5A92] disabled:cursor-not-allowed disabled:opacity-50 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
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