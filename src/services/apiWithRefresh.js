import { apiFetch } from "../lib/api";
import { refreshAccessToken, logoutUser } from "./authService";

export async function apiFetchWithRefresh(
  endpoint,
  options = {},
  responseType = "json",
) {
  try {
    return await apiFetch(endpoint, options, responseType);
  } catch (error) {
    if (error.status !== 401) {
      throw error;
    }

    try {
      await refreshAccessToken();
      return await apiFetch(endpoint, options, responseType);
    } catch (refreshError) {
      logoutUser();
      throw refreshError;
    }
  }
}
