import { apiFetchWithRefresh } from "../apiWithRefresh";

export async function getSocialBatteryLogs({
  page = 1,
  limit = 10,
  search = "",
  userId = "",
  batteryStatusId = "",
  startDate = "",
  endDate = "",
  minBatteryScore = "",
  maxBatteryScore = "",
  minSocialIntensityScore = "",
  maxSocialIntensityScore = "",
  sort = "desc",
} = {}) {
  const queryParams = new URLSearchParams({
    page,
    limit,
    sort,
  });

  if (search) queryParams.append("search", search);
  if (userId) queryParams.append("userId", userId);
  if (batteryStatusId) queryParams.append("batteryStatusId", batteryStatusId);
  if (startDate) queryParams.append("startDate", startDate);
  if (endDate) queryParams.append("endDate", endDate);
  if (minBatteryScore) queryParams.append("minBatteryScore", minBatteryScore);
  if (maxBatteryScore) queryParams.append("maxBatteryScore", maxBatteryScore);

  if (minSocialIntensityScore) {
    queryParams.append("minSocialIntensityScore", minSocialIntensityScore);
  }

  if (maxSocialIntensityScore) {
    queryParams.append("maxSocialIntensityScore", maxSocialIntensityScore);
  }

  const response = await apiFetchWithRefresh(
    `api/admin/social-battery-logs?${queryParams.toString()}`,
    {
      method: "GET",
    },
  );

  return response;
}

export async function getSocialBatteryLogSummary({
  search = "",
  userId = "",
  batteryStatusId = "",
  startDate = "",
  endDate = "",
  minBatteryScore = "",
  maxBatteryScore = "",
  minSocialIntensityScore = "",
  maxSocialIntensityScore = "",
} = {}) {
  const queryParams = new URLSearchParams();

  if (search) queryParams.append("search", search);
  if (userId) queryParams.append("userId", userId);
  if (batteryStatusId) queryParams.append("batteryStatusId", batteryStatusId);
  if (startDate) queryParams.append("startDate", startDate);
  if (endDate) queryParams.append("endDate", endDate);
  if (minBatteryScore) queryParams.append("minBatteryScore", minBatteryScore);
  if (maxBatteryScore) queryParams.append("maxBatteryScore", maxBatteryScore);

  if (minSocialIntensityScore) {
    queryParams.append("minSocialIntensityScore", minSocialIntensityScore);
  }

  if (maxSocialIntensityScore) {
    queryParams.append("maxSocialIntensityScore", maxSocialIntensityScore);
  }

  return await apiFetchWithRefresh(
    `api/admin/social-battery-logs/summary?${queryParams.toString()}`,
    {
      method: "GET",
    },
  );
}

export async function getSocialBatteryLogDetail(id) {
  return await apiFetchWithRefresh(`api/admin/social-battery-logs/${id}`, {
    method: "GET",
  });
}

export async function exportSocialBatteryLogsExcel({
  search = "",
  userId = "",
  batteryStatusId = "",
  startDate = "",
  endDate = "",
  minBatteryScore = "",
  maxBatteryScore = "",
  minSocialIntensityScore = "",
  maxSocialIntensityScore = "",
  sort = "desc",
} = {}) {
  const queryParams = new URLSearchParams();

  if (search) queryParams.append("search", search);
  if (userId) queryParams.append("userId", userId);
  if (batteryStatusId) queryParams.append("batteryStatusId", batteryStatusId);
  if (startDate) queryParams.append("startDate", startDate);
  if (endDate) queryParams.append("endDate", endDate);
  if (minBatteryScore) queryParams.append("minBatteryScore", minBatteryScore);
  if (maxBatteryScore) queryParams.append("maxBatteryScore", maxBatteryScore);

  if (minSocialIntensityScore) {
    queryParams.append("minSocialIntensityScore", minSocialIntensityScore);
  }

  if (maxSocialIntensityScore) {
    queryParams.append("maxSocialIntensityScore", maxSocialIntensityScore);
  }

  if (sort) queryParams.append("sort", sort);

  return await apiFetchWithRefresh(
    `api/admin/social-battery-logs/export/excel?${queryParams.toString()}`,
    {
      method: "GET",
    },
    "blob",
  );
}
