import { useCallback, useEffect, useState } from "react";
import { getStatusBatteries } from "../../services/Admin/statusBattery";

export function useStatusBattery() {
  const [statusBatteries, setStatusBatteries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  });

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput]);

  const fetchStatusBatteries = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getStatusBatteries({
        page,
        limit,
        search,
      });

      const data =
        response?.data?.statusBatteries ||
        response?.data?.statusBattery ||
        response?.data?.data ||
        response?.data ||
        [];

      const paginationData =
        response?.data?.pagination ||
        response?.pagination ||
        {};

      setStatusBatteries(Array.isArray(data) ? data : []);

      setPagination({
        total: paginationData?.total || data?.length || 0,
        page: paginationData?.page || page,
        limit: paginationData?.limit || limit,
        totalPages: paginationData?.totalPages || 1,
      });
    } catch (err) {
      setError(err?.message || "Gagal mengambil data status battery");
      setStatusBatteries([]);
    } finally {
      setLoading(false);
    }
  }, [page, limit, search]);

  useEffect(() => {
    fetchStatusBatteries();
  }, [fetchStatusBatteries]);

  return {
    statusBatteries,
    loading,
    error,
    page,
    limit,
    pagination,
    searchInput,
    setSearchInput,
    setPage,
    setLimit,
    refetch: fetchStatusBatteries,
  };
}