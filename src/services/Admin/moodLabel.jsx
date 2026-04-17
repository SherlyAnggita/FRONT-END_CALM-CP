import { apiFetchWithRefresh } from "../apiWithRefresh";

export async function getMoodLabels({
  page = 1,
  limit = 10,
  search = "",
  isActive = "",
  score = "",
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
  if (score !== "") params.append("score", String(score));
  if (fromDate) params.append("fromDate", fromDate);
  if (toDate) params.append("toDate", toDate);
  if (sortBy) params.append("sortBy", sortBy);
  if (sortOrder) params.append("sortOrder", sortOrder);

  return await apiFetchWithRefresh(
    `api/admin/mood-labels?${params.toString()}`,
    {
      method: "GET",
    },
    "json",
  );
}

export async function createMoodLabel(data) {
  return await apiFetchWithRefresh(
    `api/admin/mood-labels`,
    {
      method: "POST",
      body: JSON.stringify(data),
    },
    "json",
  );
}

export async function updateMoodLabel(id, data) {
  return await apiFetchWithRefresh(
    `api/admin/mood-labels/${id}`,
    {
      method: "PUT",
      body: JSON.stringify(data),
    },
    "json",
  );
}

export async function deleteMoodLabel(id) {
  return await apiFetchWithRefresh(
    `api/admin/mood-labels/${id}`,
    {
      method: "DELETE",
    },
    "json",
  );
}

export async function toggleMoodLabelActive(id) {
  return await apiFetchWithRefresh(
    `api/admin/mood-labels/${id}/toggle-active`,
    {
      method: "PATCH",
    },
    "json",
  );
}
