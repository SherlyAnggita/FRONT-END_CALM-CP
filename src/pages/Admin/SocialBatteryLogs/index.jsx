import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  getSocialBatteryLogs,
  getSocialBatteryLogSummary,
  exportSocialBatteryLogsExcel,
} from "../../../services/Admin/socialBatteryLogsService";
import {FiEye}  from "react-icons/fi";

export default function SocialBatteryLogsPage() {
  const [logs, setLogs] = useState([]);
  const [summary, setSummary] = useState(null);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);

  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    search: "",
    userId: "",
    batteryStatusId: "",
    startDate: "",
    endDate: "",
    minBatteryScore: "",
    maxBatteryScore: "",
    minSocialIntensityScore: "",
    maxSocialIntensityScore: "",
    sort: "desc",
  });

  const fetchData = useCallback(
    async (params = filters) => {
      try {
        setLoading(true);

        const [logsRes, summaryRes] = await Promise.all([
          getSocialBatteryLogs(params),
          getSocialBatteryLogSummary(params),
        ]);

        setLogs(logsRes.data || []);
        setMeta(logsRes.meta || null);
        setSummary(summaryRes.data || null);
      } catch (error) {
        console.error("Gagal mengambil social battery logs:", error);
      } finally {
        setLoading(false);
      }
    },
    [filters],
  );

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSearch = (e) => {
    e.preventDefault();

    const newFilters = {
      ...filters,
      page: 1,
    };

    setFilters(newFilters);
    fetchData(newFilters);
  };

  const handleReset = () => {
    const resetFilters = {
      page: 1,
      limit: 10,
      search: "",
      userId: "",
      batteryStatusId: "",
      startDate: "",
      endDate: "",
      minBatteryScore: "",
      maxBatteryScore: "",
      minSocialIntensityScore: "",
      maxSocialIntensityScore: "",
      sort: "desc",
    };

    setFilters(resetFilters);
    fetchData(resetFilters);
  };

  const handleLimitChange = (e) => {
    setFilters((prev) => ({
      ...prev,
      page: 1,
      limit: Number(e.target.value),
    }));
  };

  const handleExport = async () => {
    try {
      setExporting(true);

      const blob = await exportSocialBatteryLogsExcel(filters);
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `social-battery-logs-${Date.now()}.xlsx`;

      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Gagal export social battery logs:", error);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="space-y-6 p-6 text-base-content">
      <div>
        <h1 className="text-2xl font-bold">Monitoring Social Battery Logs</h1>
        <p className="text-sm text-base-content/60">
          Pantau social battery user berdasarkan log harian.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 xl:grid-cols-6">
        <SummaryCard title="Total Logs" value={summary?.totalLogs ?? 0} />
        <SummaryCard title="Total Users" value={summary?.totalUsers ?? 0} />
        <SummaryCard
          title="Avg Battery"
          value={Number(summary?.averageBatteryScore ?? 0).toFixed(1)}
        />
        <SummaryCard
          title="Avg Intensity"
          value={Number(summary?.averageSocialIntensityScore ?? 0).toFixed(1)}
        />
        <SummaryCard title="Total Events" value={summary?.totalEvents ?? 0} />
        <SummaryCard
          title="Total Duration"
          value={`${summary?.totalDurationMinutes ?? 0} menit`}
        />
      </div>

      {summary?.batteryStatusCounts?.length > 0 && (
        <div className="card border border-base-300 bg-base-100 shadow-sm">
          <div className="card-body p-4">
            <h2 className="card-title text-base">Battery Status Summary</h2>

            <div className="flex flex-wrap gap-2">
              {summary.batteryStatusCounts.map((item) => (
                <span
                  key={item.batteryStatusId}
                  className="badge badge-outline gap-2"
                >
                  {item.name}: {item.total}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      <form
        onSubmit={handleSearch}
        className="card border border-base-300 bg-base-100 shadow-sm"
      >
        <div className="card-body grid grid-cols-1 gap-3 md:grid-cols-4">
          <input
            name="search"
            value={filters.search}
            onChange={handleChange}
            placeholder="Search user, insight, status..."
            className="input input-bordered w-full"
          />

          <input
            type="date"
            name="startDate"
            value={filters.startDate}
            onChange={handleChange}
            className="input input-bordered w-full"
          />

          <input
            type="date"
            name="endDate"
            value={filters.endDate}
            onChange={handleChange}
            className="input input-bordered w-full"
          />

          <select
            name="sort"
            value={filters.sort}
            onChange={handleChange}
            className="select select-bordered w-full"
          >
            <option value="desc">Terbaru</option>
            <option value="asc">Terlama</option>
          </select>

          <input
            name="minBatteryScore"
            value={filters.minBatteryScore}
            onChange={handleChange}
            placeholder="Min battery score"
            className="input input-bordered w-full"
          />

          <input
            name="maxBatteryScore"
            value={filters.maxBatteryScore}
            onChange={handleChange}
            placeholder="Max battery score"
            className="input input-bordered w-full"
          />

          <input
            name="minSocialIntensityScore"
            value={filters.minSocialIntensityScore}
            onChange={handleChange}
            placeholder="Min intensity"
            className="input input-bordered w-full"
          />

          <input
            name="maxSocialIntensityScore"
            value={filters.maxSocialIntensityScore}
            onChange={handleChange}
            placeholder="Max intensity"
            className="input input-bordered w-full"
          />

          <div className="flex flex-wrap gap-2 md:col-span-4">
            <button type="submit" className="btn btn-primary">
              Filter
            </button>

            <button type="button" onClick={handleReset} className="btn">
              Reset
            </button>

            <button
              type="button"
              onClick={handleExport}
              disabled={exporting}
              className="btn btn-success"
            >
              {exporting ? "Exporting..." : "Export Excel"}
            </button>
          </div>
        </div>
      </form>

      <div className="overflow-x-auto rounded-box border border-base-300 bg-base-100">
        <table className="table table-zebra">
          <thead>
            <tr>
              <th>No</th>
              <th>User</th>
              <th>Date</th>
              <th>Status</th>
              <th>Battery</th>
              <th>Intensity</th>
              <th>Events</th>
              <th>Duration</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="9" className="text-center">
                  <span className="loading loading-spinner loading-md" />
                </td>
              </tr>
            ) : logs.length === 0 ? (
              <tr>
                <td colSpan="9" className="text-center">
                  Data tidak ditemukan
                </td>
              </tr>
            ) : (
              logs.map((log) => (
                <tr key={log.id}>
                  <td>{log.no}</td>

                  <td>
                    <div className="font-medium">
                      {log.user?.fullName || log.user?.username || "-"}
                    </div>
                    <div className="text-xs text-base-content/60">
                      {log.user?.email || "-"}
                    </div>
                  </td>

                  <td>{formatDate(log.date)}</td>

                  <td>
                    <span className="badge badge-outline">
                      {log.batteryStatus?.name || "-"}
                    </span>
                  </td>

                  <td>{log.batteryScore}</td>
                  <td>{log.socialIntensityScore}</td>
                  <td>{log.totalEvents}</td>
                  <td>{log.totalDurationMinutes} menit</td>

                  <td>
                    <Link
                      to={`/admin/social-battery-logs/${log.id}`}
                      className="btn btn-primary btn-sm"
                    >
                      <FiEye size={16} />
                      Detail
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <select
          value={filters.limit}
          onChange={handleLimitChange}
          className="select select-bordered w-full md:w-40"
        >
          <option value={10}>10 / page</option>
          <option value={25}>25 / page</option>
          <option value={50}>50 / page</option>
        </select>

        <div className="join">
          <button
            disabled={!meta?.hasPrevPage}
            onClick={() =>
              setFilters((prev) => ({
                ...prev,
                page: prev.page - 1,
              }))
            }
            className="btn join-item"
          >
            Prev
          </button>

          <button className="btn join-item pointer-events-none">
            Page {meta?.page ?? 1} / {meta?.totalPages ?? 1}
          </button>

          <button
            disabled={!meta?.hasNextPage}
            onClick={() =>
              setFilters((prev) => ({
                ...prev,
                page: prev.page + 1,
              }))
            }
            className="btn join-item"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

function SummaryCard({ title, value }) {
  return (
    <div className="card border border-base-300 bg-base-100 shadow-sm">
      <div className="card-body p-4">
        <p className="text-sm text-base-content/60">{title}</p>
        <h3 className="text-xl font-bold">{value}</h3>
      </div>
    </div>
  );
}

function formatDate(date) {
  if (!date) return "-";

  return new Date(date).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}
