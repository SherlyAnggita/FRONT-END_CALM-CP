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
        }
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Gagal mengambil history social battery"
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
          "Gagal mengambil social battery berdasarkan tanggal"
      );
    } finally {
      setDateLoading(false);
    }
  }

  useEffect(() => {
    fetchSocialBatteryHistory(1);
  }, []);

  return (
    <div className="space-y-6 p-6 bg-[#E6F0FA] min-h-screen">
      {/* Header */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Social Battery History
          </h1>
          <p className="text-gray-500">
            Riwayat social battery dan pencarian data berdasarkan tanggal.
          </p>
        </div>

        <Link
          to="/user/social-battery"
          className="w-fit rounded-xl bg-[#C7DBFF] px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-[#A2C5FF]"
        >
          Back to Social Battery
        </Link>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Search by Date */}
      <div className="rounded-2xl bg-white p-6 shadow-sm border border-[#B9D0EB]">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Search by Date
            </h3>
            <p className="text-sm text-gray-500">
              Cari data social battery berdasarkan tanggal tertentu.
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              type="date"
              value={selectedDate}
              onChange={(event) => setSelectedDate(event.target.value)}
              className="rounded-xl border border-gray-300 px-4 py-2 text-sm outline-none focus:border-[#4C8FEF]"
            />

            <button
              onClick={handleSearchByDate}
              disabled={dateLoading || !selectedDate}
              className="rounded-xl bg-[#4C8FEF] px-4 py-2 text-sm font-semibold text-white hover:bg-[#3A73D4] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {dateLoading ? "Searching..." : "Search"}
            </button>
          </div>
        </div>

        {dateSearched && (
          <div className="mt-5">
            {selectedData ? (
              <div className="rounded-xl bg-[#D7E6FF] p-4">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-sm text-gray-500">
                      Data tanggal {selectedDate}
                    </p>
                    <p className="mt-1 text-2xl font-bold text-gray-900">
                      {selectedData.batteryScore?.toFixed?.(2) ??
                        selectedData.batteryScore}{" "}
                      / 100
                    </p>
                  </div>

                  <div
                    className="inline-flex w-fit rounded-full px-4 py-1 text-sm font-semibold text-white"
                    style={{
                      backgroundColor:
                        selectedData.batteryStatus?.color || "#6B7280",
                    }}
                  >
                    {(selectedData.batteryStatus?.name || "-").toUpperCase()}
                  </div>
                </div>

                {/* Cards */}
                <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
                  <div className="rounded-xl bg-white p-4 flex items-center gap-2 shadow-sm">
                    <span className="text-xl text-[#4C8FEF]">📅</span>
                    <div>
                      <p className="text-sm font-semibold text-gray-800">
                        Total Events
                      </p>
                      <p className="mt-1 text-xl font-bold text-gray-900">
                        {selectedData.totalEvents}
                      </p>
                    </div>
                  </div>

                  <div className="rounded-xl bg-white p-4 flex items-center gap-2 shadow-sm">
                    <span className="text-xl text-[#4C8FEF]">⏱️</span>
                    <div>
                      <p className="text-sm font-semibold text-gray-800">
                        Total Duration
                      </p>
                      <p className="mt-1 text-xl font-bold text-gray-900">
                        {selectedData.totalDurationMinutes} min
                      </p>
                    </div>
                  </div>

                  <div className="rounded-xl bg-white p-4 flex items-center gap-2 shadow-sm">
                    <span className="text-xl text-[#4C8FEF]">👥</span>
                    <div>
                      <p className="text-sm font-semibold text-gray-800">
                        Social Intensity
                      </p>
                      <p className="mt-1 text-xl font-bold text-gray-900">
                        {selectedData.socialIntensityScore?.toFixed?.(2) ??
                          selectedData.socialIntensityScore}
                      </p>
                    </div>
                  </div>
                </div>

                {/* AI Insight */}
                <div className="mt-4 rounded-xl bg-white p-4">
                  <p className="text-sm font-semibold text-gray-800">Insight</p>
                  <p className="mt-2 text-sm text-gray-600">
                    {selectedData.aiInsight || "-"}
                  </p>
                </div>
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-gray-300 bg-[#D7E6FF] p-4 text-sm text-gray-500">
                Data social battery untuk tanggal ini tidak ditemukan.
              </div>
            )}
          </div>
        )}
      </div>

      {/* History List */}
      <div className="rounded-2xl bg-white p-6 shadow-sm border border-[#B9D0EB]">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">History List</h3>
          <p className="text-sm text-gray-500">
            Riwayat social battery kamu berdasarkan aktivitas kalender.
          </p>
        </div>

        <div className="mt-5">
          {historyLoading ? (
            <p className="text-sm text-gray-500">Loading history...</p>
          ) : history.length === 0 ? (
            <p className="text-sm text-gray-500">
              Belum ada history social battery.
            </p>
          ) : (
            <div className="space-y-4">
              {history.map((item) => (
                <div
                  key={item.id}
                  className="rounded-xl bg-[#D7E6FF] p-4 shadow-sm flex flex-col gap-4"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="font-semibold text-gray-900">
                        {new Date(item.date).toLocaleDateString("id-ID", {
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                      <p className="mt-1 text-sm text-gray-500">
                        {item.totalEvents} event • {item.totalDurationMinutes} min
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <p className="text-2xl font-bold text-gray-900">
                        {item.batteryScore?.toFixed?.(2) ?? item.batteryScore}
                      </p>

                      <span
                        className="rounded-full px-4 py-1 text-sm font-semibold text-white"
                        style={{
                          backgroundColor:
                            item.batteryStatus?.color || "#6B7280",
                        }}
                      >
                        {(item.batteryStatus?.name || "-").toUpperCase()}
                      </span>
                    </div>
                  </div>

                  {/* Cards */}
                  <div className="mt-2 grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div className="rounded-xl bg-white p-4 flex items-center gap-2 shadow-sm">
                      <span className="text-xl text-[#4C8FEF]">📅</span>
                      <div>
                        <p className="text-sm font-semibold text-gray-800">
                          Social Intensity
                        </p>
                        <p className="mt-1 text-sm text-gray-600">
                          {item.socialIntensityScore?.toFixed?.(2) ??
                            item.socialIntensityScore}
                        </p>
                      </div>
                    </div>

                    <div className="rounded-xl bg-white p-4 flex items-center gap-2 shadow-sm">
                      <span className="text-xl text-[#4C8FEF]">📝</span>
                      <div>
                        <p className="text-sm font-semibold text-gray-800">Insight</p>
                        <p className="mt-1 text-sm text-gray-600">{item.aiInsight || "-"}</p>
                      </div>
                    </div>

                    <div className="rounded-xl bg-white p-4 flex items-center gap-2 shadow-sm">
                      <span className="text-xl text-[#4C8FEF]">💡</span>
                      <div>
                        <p className="text-sm font-semibold text-gray-800">
                          Recovery Suggestion
                        </p>
                        <p className="mt-1 text-sm text-gray-600">
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

        {/* Pagination */}
        {historyMeta.totalPages > 1 && (
          <div className="mt-5 flex items-center justify-between">
            <button
              onClick={() => fetchSocialBatteryHistory(historyMeta.page - 1)}
              disabled={historyMeta.page <= 1 || historyLoading}
              className="rounded-xl bg-[#C7DBFF] px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-[#A2C5FF] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Previous
            </button>

            <p className="text-sm text-gray-500">
              Page {historyMeta.page} of {historyMeta.totalPages}
            </p>

            <button
              onClick={() => fetchSocialBatteryHistory(historyMeta.page + 1)}
              disabled={
                historyMeta.page >= historyMeta.totalPages || historyLoading
              }
              className="rounded-xl bg-[#C7DBFF] px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-[#A2C5FF] disabled:cursor-not-allowed disabled:opacity-50"
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