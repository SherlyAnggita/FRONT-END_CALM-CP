import { useState, useEffect, useCallback } from "react";
import { getMoodLabels } from "../../services/Admin/moodLabel";

export function useMoodLabels() {
  const [moodLabels, setMoodLabels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [pagination, setPagination] = useState({
    total: 0,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      setDebouncedSearch(searchInput.trim());
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput]);

  const fetchMoodLabels = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await getMoodLabels({
        page,
        limit,
        search: debouncedSearch,
        sortBy: "createdAt",
        sortOrder: "desc",
      });

      setMoodLabels(Array.isArray(res?.data) ? res.data : []);
      setPagination(
        res?.meta || {
          total: 0,
          totalPages: 1,
          hasNextPage: false,
          hasPrevPage: false,
        },
      );
    } catch (err) {
      setError(err?.message || "Gagal mengambil data mood label");
      setMoodLabels([]);
      setPagination({
        total: 0,
        totalPages: 1,
        hasNextPage: false,
        hasPrevPage: false,
      });
    } finally {
      setLoading(false);
    }
  }, [page, limit, debouncedSearch]);

  useEffect(() => {
    fetchMoodLabels();
  }, [fetchMoodLabels]);

  return {
    moodLabels,
    loading,
    error,
    page,
    limit,
    pagination,
    searchInput,
    setSearchInput,
    setPage,
    setLimit,
    refetch: fetchMoodLabels,
  };
}
