import { apiFetch } from "../lib/api";
import { refreshAccessToken, logoutUser } from "./authService";

export async function apiFetchWithRefresh(endpoint, options = {}) {
  try {
    return await apiFetch(endpoint, options);
  } catch (error) {
    if (error.status !== 401) {
      throw error;
    }

    try {
      await refreshAccessToken();
      return await apiFetch(endpoint, options);
    } catch (refreshError) {
      logoutUser();
      throw refreshError;
    }
  }
}