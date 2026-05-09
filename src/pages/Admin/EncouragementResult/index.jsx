import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  getEncouragementResults,
  exportEncouragementResultsExcel,
} from "../../../services/admin/encouragementService";

export default function EncouragementResultsPage() {
  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(false);

  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    search: "",
    predictedLabel: "",
    modelName: "",
    startDate: "",
    endDate: "",
    sort: "desc",
  });

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);

      const response = await getEncouragementResults(filters);

      setItems(response.data || []);
      setMeta(response.meta || null);
    } catch (error) {
      console.error("Gagal mengambil encouragement results:", error);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  function handleChange(e) {
    const { name, value } = e.target;

    setFilters((prev) => ({
      ...prev,
      [name]: value,
      page: name === "search" ? prev.page : 1,
    }));
  }

  async function handleExport() {
    try {
      const blob = await exportEncouragementResultsExcel(filters);
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `encouragement-results-${Date.now()}.xlsx`;
      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Gagal export encouragement results:", error);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Encouragement Results</h1>
          <p className="text-sm opacity-70">
            Monitoring hasil AI encouragement dari mood entry user.
          </p>
        </div>

        <button onClick={handleExport} className="btn btn-primary">
          Export Excel
        </button>
      </div>

      <div className="card bg-base-100 shadow">
        <div className="card-body space-y-4">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
            <input
              type="text"
              name="search"
              value={filters.search}
              onChange={handleChange}
              placeholder="Search user, label, message..."
              className="input input-bordered w-full"
            />

            <input
              type="text"
              name="predictedLabel"
              value={filters.predictedLabel}
              onChange={handleChange}
              placeholder="Predicted label"
              className="input input-bordered w-full"
            />

            <input
              type="text"
              name="modelName"
              value={filters.modelName}
              onChange={handleChange}
              placeholder="Model name"
              className="input input-bordered w-full"
            />

            <select
              name="sort"
              value={filters.sort}
              onChange={handleChange}
              className="select select-bordered w-full"
            >
              <option value="desc">Newest</option>
              <option value="asc">Oldest</option>
            </select>

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
              name="limit"
              value={filters.limit}
              onChange={handleChange}
              className="select select-bordered w-full"
            >
              <option value="10">10 rows</option>
              <option value="25">25 rows</option>
              <option value="50">50 rows</option>
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>No</th>
                  <th>User</th>
                  <th>Mood</th>
                  <th>Predicted</th>
                  <th>Support Message</th>
                  <th>Confidence</th>
                  <th>Model</th>
                  <th>Created At</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="9" className="text-center">
                      Loading...
                    </td>
                  </tr>
                ) : items.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="text-center">
                      Data tidak ditemukan
                    </td>
                  </tr>
                ) : (
                  items.map((item) => (
                    <tr key={item.id}>
                      <td>{item.no}</td>
                      <td>
                        <div className="font-semibold">
                          {item.user?.fullName || item.user?.username || "-"}
                        </div>
                        <div className="text-xs opacity-70">
                          {item.user?.email || "-"}
                        </div>
                      </td>
                      <td>
                        {item.moodEntry?.moodLabel?.emoji}{" "}
                        {item.moodEntry?.moodLabel?.name || "-"}
                      </td>
                      <td>{item.predictedLabel || "-"}</td>
                      <td className="max-w-xs truncate">
                        {item.supportMessage || "-"}
                      </td>
                      <td>{item.confidenceScore ?? "-"}</td>
                      <td>{item.modelName || "-"}</td>
                      <td>
                        {item.createdAt
                          ? new Date(item.createdAt).toLocaleString("id-ID")
                          : "-"}
                      </td>
                      <td>
                        <button
                          className="btn btn-sm btn-outline"
                          onClick={() =>
                            navigate(`/admin/encouragement-results/${item.id}`)
                          }
                        >
                          Detail
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <p className="text-sm opacity-70">
              Total: {meta?.total || 0} data | Page {meta?.page || 1} of{" "}
              {meta?.totalPages || 1}
            </p>

            <div className="join">
              <button
                className="btn join-item"
                disabled={!meta?.hasPrevPage}
                onClick={() =>
                  setFilters((prev) => ({
                    ...prev,
                    page: prev.page - 1,
                  }))
                }
              >
                Prev
              </button>

              <button className="btn join-item btn-disabled">
                {filters.page}
              </button>

              <button
                className="btn join-item"
                disabled={!meta?.hasNextPage}
                onClick={() =>
                  setFilters((prev) => ({
                    ...prev,
                    page: prev.page + 1,
                  }))
                }
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
