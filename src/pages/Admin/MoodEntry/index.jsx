import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiSearch,
  FiDownload,
  FiEye,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import {
  getMoodEntries,
  exportMoodEntriesExcel,
} from "../../../services/Admin/moodEntryService";

export default function MoodEntriesPage() {
  const navigate = useNavigate();

  const [moodEntries, setMoodEntries] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);

  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    search: "",
    moodLabelId: "",
    analysisStatus: "",
    startDate: "",
    endDate: "",
    sort: "desc",
  });

  const fetchMoodEntries = useCallback(async () => {
    try {
      setLoading(true);

      const response = await getMoodEntries(filters);

      setMoodEntries(response.data || []);
      setMeta(response.meta || null);
    } catch (error) {
      console.error("Gagal mengambil mood entries:", error);
      alert("Gagal mengambil data mood entries");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchMoodEntries();
  }, [fetchMoodEntries]);

  const handleChangeFilter = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: 1,
    }));
  };

  const handleExportExcel = async () => {
    try {
      setExportLoading(true);

      const blob = await exportMoodEntriesExcel(filters);
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `mood-entries-${Date.now()}.xlsx`;
      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Gagal export mood entries:", error);
      alert("Gagal export Excel");
    } finally {
      setExportLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    if (status === "success") return "badge-success";
    if (status === "failed") return "badge-error";
    return "badge-warning";
  };

  return (
    <div className="space-y-6 p-6 text-base-content">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Mood Entries Monitoring</h1>
          <p className="text-sm opacity-70">
            Monitoring daftar mood entry yang masuk ke database.
          </p>
        </div>

        <button
          onClick={handleExportExcel}
          disabled={exportLoading}
          className="btn btn-success"
        >
          {exportLoading ? (
            <>
              <span className="loading loading-spinner loading-sm" />
              Exporting...
            </>
          ) : (
            <>
              <FiDownload size={16} />
              Export Excel
            </>
          )}
        </button>
      </div>

      <div className="card bg-base-100 shadow">
        <div className="card-body">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            <label className="input input-bordered flex items-center gap-2 md:col-span-2">
              <FiSearch className="text-base-content/60" />
              <input
                type="text"
                placeholder="Search user / email / feeling..."
                value={filters.search}
                onChange={(e) => handleChangeFilter("search", e.target.value)}
                className="grow"
              />
            </label>

            <select
              value={filters.analysisStatus}
              onChange={(e) =>
                handleChangeFilter("analysisStatus", e.target.value)
              }
              className="select select-bordered"
            >
              <option value="">Semua Status</option>
              <option value="pending">Pending</option>
              <option value="success">Success</option>
              <option value="failed">Failed</option>
            </select>

            <input
              type="date"
              value={filters.startDate}
              onChange={(e) => handleChangeFilter("startDate", e.target.value)}
              className="input input-bordered"
            />

            <input
              type="date"
              value={filters.endDate}
              onChange={(e) => handleChangeFilter("endDate", e.target.value)}
              className="input input-bordered"
            />

            <select
              value={filters.sort}
              onChange={(e) => handleChangeFilter("sort", e.target.value)}
              className="select select-bordered"
            >
              <option value="desc">Terbaru</option>
              <option value="asc">Terlama</option>
            </select>

            <select
              value={filters.limit}
              onChange={(e) =>
                handleChangeFilter("limit", Number(e.target.value))
              }
              className="select select-bordered"
            >
              <option value={10}>10 / halaman</option>
              <option value={20}>20 / halaman</option>
              <option value={30}>30 / halaman</option>
              <option value={40}>40 / halaman</option>
              <option value={50}>50 / halaman</option>
            </select>
          </div>
        </div>
      </div>

      <div className="card bg-base-100 shadow">
        <div className="card-body p-0">
          <div className="overflow-x-auto">
            <table className="table table-zebra">
              <thead>
                <tr>
                  <th>No</th>
                  <th>User</th>
                  <th>Email</th>
                  <th>Mood</th>
                  <th>Score</th>
                  <th>Feeling</th>
                  <th>Status</th>
                  <th>Entry Date</th>
                  <th>AI Label</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="10" className="py-8 text-center">
                      <span className="loading loading-spinner loading-md" />
                    </td>
                  </tr>
                ) : moodEntries.length === 0 ? (
                  <tr>
                    <td colSpan="10" className="py-8 text-center opacity-70">
                      Data tidak ditemukan
                    </td>
                  </tr>
                ) : (
                  moodEntries.map((entry) => (
                    <tr key={entry.id}>
                      <td>{entry.no}</td>

                      <td>
                        <div className="font-medium">
                          {entry.user?.fullName || entry.user?.username || "-"}
                        </div>
                        <div className="text-xs opacity-60">
                          @{entry.user?.username || "-"}
                        </div>
                      </td>

                      <td>{entry.user?.email || "-"}</td>

                      <td className="text-center">
                        {entry.mood?.emoji} {entry.mood?.name}
                      </td>

                      <td className="text-center">
                        {entry.moodScore ?? "-"}
                      </td>

                      <td className="max-w-[260px] truncate">
                        {entry.feelingText}
                      </td>

                      <td>
                        <span
                          className={`badge ${getStatusBadge(
                            entry.analysisStatus,
                          )}`}
                        >
                          {entry.analysisStatus}
                        </span>
                      </td>

                      <td>
                        {new Date(entry.entryDate).toLocaleString("id-ID")}
                      </td>

                      <td>{entry.aiResult?.predictedLabel || "-"}</td>

                      <td>
                        <button
                          onClick={() =>
                            navigate(`/admin/mood-entries/${entry.id}`)
                          }
                          className="btn btn-primary btn-sm"
                        >
                          <FiEye size={16} />
                          Detail
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {meta && (
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <p className="text-sm opacity-70">
            Page {meta.page} of {meta.totalPages} | Total {meta.total} data
          </p>

          <div className="join">
            <button
              disabled={!meta.hasPrevPage}
              onClick={() =>
                setFilters((prev) => ({
                  ...prev,
                  page: prev.page - 1,
                }))
              }
              className="btn join-item"
            >
              <FiChevronLeft />
              Prev
            </button>

            <button className="btn join-item btn-disabled">{meta.page}</button>

            <button
              disabled={!meta.hasNextPage}
              onClick={() =>
                setFilters((prev) => ({
                  ...prev,
                  page: prev.page + 1,
                }))
              }
              className="btn join-item"
            >
              Next
              <FiChevronRight />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
