import { apiFetch } from "../lib/api";
import { refreshAccessToken, logoutUser } from "./authService";

let isRedirectingToLogin = false;

export async function apiFetchWithRefresh(
  endpoint,
  options = {},
  responseType = "json",
) {
  try {
    return await apiFetch(endpoint, options, responseType);
  } catch (error) {
    if (error.status === 403 && error.code === "ACCOUNT_DISABLED") {
      if (!isRedirectingToLogin) {
        isRedirectingToLogin = true;
        logoutUser();
      }
      return;
    }
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
