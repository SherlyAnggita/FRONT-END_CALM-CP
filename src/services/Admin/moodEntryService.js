import { apiFetchWithRefresh } from "../apiWithRefresh";

export async function getMoodEntries({
  page = 1,
  limit = 10,
  search = "",
  moodLabelId = "",
  analysisStatus = "",
  startDate = "",
  endDate = "",
  sort = "desc",
} = {}) {
  const queryParams = new URLSearchParams({
    page,
    limit,
    sort,
  });

  if (search) {
    queryParams.append("search", search);
  }

  if (moodLabelId) {
    queryParams.append("moodLabelId", moodLabelId);
  }

  if (analysisStatus) {
    queryParams.append("analysisStatus", analysisStatus);
  }

  if (startDate) {
    queryParams.append("startDate", startDate);
  }

  if (endDate) {
    queryParams.append("endDate", endDate);
  }

  const response = await apiFetchWithRefresh(
    `api/admin/mood-entries?${queryParams.toString()}`,
    {
      method: "GET",
    },
  );

  return response;
}
export async function getMoodEntryDetail(id) {
  return await apiFetchWithRefresh(`api/admin/mood-entries/${id}`, {
    method: "GET",
  });
}

export async function exportMoodEntriesExcel({
  search = "",
  moodLabelId = "",
  analysisStatus = "",
  startDate = "",
  endDate = "",
  userId = "",
  sort = "desc",
} = {}) {
  const queryParams = new URLSearchParams();

  if (search) queryParams.append("search", search);
  if (moodLabelId) queryParams.append("moodLabelId", moodLabelId);
  if (analysisStatus) queryParams.append("analysisStatus", analysisStatus);
  if (startDate) queryParams.append("startDate", startDate);
  if (endDate) queryParams.append("endDate", endDate);
  if (userId) queryParams.append("userId", userId);
  if (sort) queryParams.append("sort", sort);

  return await apiFetchWithRefresh(
    `api/admin/mood-entries/export/excel?${queryParams.toString()}`,
    {
      method: "GET",
    },
    "blob",
  );
}
