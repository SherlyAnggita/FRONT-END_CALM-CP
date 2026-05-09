import { apiFetchWithRefresh } from "../apiWithRefresh";

export async function getEncouragementResults({
  page = 1,
  limit = 10,
  search = "",
  userId = "",
  predictedLabel = "",
  modelName = "",
  minConfidenceScore = "",
  maxConfidenceScore = "",
  startDate = "",
  endDate = "",
  sort = "desc",
} = {}) {
  const queryParams = new URLSearchParams({
    page,
    limit,
    sort,
  });

  if (search) queryParams.append("search", search);
  if (userId) queryParams.append("userId", userId);
  if (predictedLabel) queryParams.append("predictedLabel", predictedLabel);
  if (modelName) queryParams.append("modelName", modelName);
  if (minConfidenceScore)
    queryParams.append("minConfidenceScore", minConfidenceScore);
  if (maxConfidenceScore)
    queryParams.append("maxConfidenceScore", maxConfidenceScore);
  if (startDate) queryParams.append("startDate", startDate);
  if (endDate) queryParams.append("endDate", endDate);

  return await apiFetchWithRefresh(
    `api/admin/encouragement-results?${queryParams.toString()}`,
    {
      method: "GET",
    },
  );
}

export async function getEncouragementResultDetail(id) {
  return await apiFetchWithRefresh(`api/admin/encouragement-results/${id}`, {
    method: "GET",
  });
}

export async function exportEncouragementResultsExcel({
  search = "",
  userId = "",
  predictedLabel = "",
  modelName = "",
  minConfidenceScore = "",
  maxConfidenceScore = "",
  startDate = "",
  endDate = "",
  sort = "desc",
} = {}) {
  const queryParams = new URLSearchParams();

  if (search) queryParams.append("search", search);
  if (userId) queryParams.append("userId", userId);
  if (predictedLabel) queryParams.append("predictedLabel", predictedLabel);
  if (modelName) queryParams.append("modelName", modelName);
  if (minConfidenceScore)
    queryParams.append("minConfidenceScore", minConfidenceScore);
  if (maxConfidenceScore)
    queryParams.append("maxConfidenceScore", maxConfidenceScore);
  if (startDate) queryParams.append("startDate", startDate);
  if (endDate) queryParams.append("endDate", endDate);
  if (sort) queryParams.append("sort", sort);

  return await apiFetchWithRefresh(
    `api/admin/encouragement-results/export/excel?${queryParams.toString()}`,
    {
      method: "GET",
    },
    "blob",
  );
}
