import { apiFetchWithRefresh } from "../apiWithRefresh";

export async function getDashboardData() {
  try {
    const response = await apiFetchWithRefresh("api/users/", {
      method: "GET",
    });
    return response;
  } catch (error) {
    console.error("Failed to fetch dashboard:", error);
    throw error;
  }
}
