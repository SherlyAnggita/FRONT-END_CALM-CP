import { apiFetchWithRefresh } from "../apiWithRefresh";

export async function getActivityLogs({
  page = 1,
  limit = 10,
  search = "",
  action = "",
  userId = "",
  startDate = "",
  endDate = "",
  sortBy = "createdAt",
  order = "desc",
} = {}) {
  const params = new URLSearchParams();

  params.append("page", page);
  params.append("limit", limit);

  if (search) params.append("search", search);
  if (action) params.append("action", action);
  if (userId) params.append("userId", userId);
  if (startDate) params.append("startDate", startDate);
  if (endDate) params.append("endDate", endDate);
  if (sortBy) params.append("sortBy", sortBy);
  if (order) params.append("order", order);

  return await apiFetchWithRefresh(
    `api/admin/activity/logs?${params.toString()}`,
    {
      method: "GET",
    },
    "json",
  );
}

export async function exportActivityLogsExcel({
  search = "",
  action = "",
  userId = "",
  startDate = "",
  endDate = "",
  sortBy = "createdAt",
  order = "desc",
} = {}) {
  const params = new URLSearchParams();

  if (search) params.append("search", search);
  if (action) params.append("action", action);
  if (userId) params.append("userId", userId);
  if (startDate) params.append("startDate", startDate);
  if (endDate) params.append("endDate", endDate);
  if (sortBy) params.append("sortBy", sortBy);
  if (order) params.append("order", order);

  return await apiFetchWithRefresh(
    `api/admin/activity/logs/export/excel?${params.toString()}`,
    { method: "GET" },
    "blob",
  );
}

export async function exportActivityLogsPdf(userId) {
  if (!userId) {
    throw new Error("userId wajib diisi untuk export PDF");
  }

  return await apiFetchWithRefresh(
    `api/admin/activity/logs/export/pdf?userId=${encodeURIComponent(userId)}`,
    {
      method: "GET",
    },
    "blob",
  );
}
