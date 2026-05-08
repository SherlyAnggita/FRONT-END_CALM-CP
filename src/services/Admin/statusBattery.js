import { apiFetchWithRefresh } from "../apiWithRefresh";

export async function getStatusBatteries({
  page = 1,
  limit = 10,
  search = "",
  isActive = "",
  minScore = "",
  maxScore = "",
  fromDate = "",
  toDate = "",
  sortBy = "createdAt",
  sortOrder = "desc",
} = {}) {
  const params = new URLSearchParams();

  params.append("page", String(page));
  params.append("limit", String(limit));

  if (search) params.append("search", search);
  if (isActive !== "") params.append("isActive", String(isActive));
  if (minScore !== "") params.append("minScore", String(minScore));
  if (maxScore !== "") params.append("maxScore", String(maxScore));
  if (fromDate) params.append("fromDate", fromDate);
  if (toDate) params.append("toDate", toDate);
  if (sortBy) params.append("sortBy", sortBy);
  if (sortOrder) params.append("sortOrder", sortOrder);

  return await apiFetchWithRefresh(
    `api/admin/status-batteries?${params.toString()}`,
    {
      method: "GET",
    },
    "json",
  );
}

export async function createStatusBattery(data) {
  return await apiFetchWithRefresh(
    `api/admin/status-batteries`,
    {
      method: "POST",
      body: JSON.stringify(data),
    },
    "json",
  );
}

export async function updateStatusBattery(id, data) {
  return await apiFetchWithRefresh(
    `api/admin/status-batteries/${id}`,
    {
      method: "PUT",
      body: JSON.stringify(data),
    },
    "json",
  );
}

export async function deleteStatusBattery(id) {
  return await apiFetchWithRefresh(
    `api/admin/status-batteries/${id}`,
    {
      method: "DELETE",
    },
    "json",
  );
}

export async function getDetailStatusBattery(id) {
  return await apiFetchWithRefresh(
    `api/admin/status-batteries/${id}`,
    {
      method: "GET",
    },
    "json",
  );
}

export async function toggleStatusBatteryActive(id) {
  return await apiFetchWithRefresh(
    `api/admin/status-batteries/${id}/toggle-active`,
    {
      method: "PATCH",
    },
    "json",
  );
}