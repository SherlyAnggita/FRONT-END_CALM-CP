import { apiFetchWithRefresh } from "../apiWithRefresh";

export async function getDashboard() {
  return await apiFetchWithRefresh(
    "api/admin/",
    {
      method: "GET",
    },
    "json",
  );
}
