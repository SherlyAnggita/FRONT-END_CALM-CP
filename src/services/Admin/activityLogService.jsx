import { apiFetchWithRefresh } from "../apiWithRefresh";

export async function getActivityLogs(page = 1, limit = 10) {
  return await apiFetchWithRefresh(
    `api/admin/activity/logs?page=${page}&limit=${limit}`,
    {
      method: "GET",
    },
  );
}
