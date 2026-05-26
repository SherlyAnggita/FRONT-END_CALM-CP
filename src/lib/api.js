import { tokenStorage } from "./token";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

let refreshPromise = null;
function forceLogout() {
  tokenStorage.clearTokens();
  if (window.location.pathname !== "/login") {
    window.location.replace("/login?session=expired");
  }
}

async function refreshTokenRequest() {
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    const refreshToken = tokenStorage.getRefreshToken();

    if (!refreshToken) {
      throw new Error("Refresh token tidak ditemukan");
    }

    const res = await fetch(`${BASE_URL}api/auth/refresh-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken }),
    });

    let data = {};
    try {
      data = await res.json();
    } catch (error) {
      console.warn("Gagal parse response refresh token:", error);
    }

    if (!res.ok) {
      throw new Error(data.message || "Refresh token gagal");
    }

    tokenStorage.setTokens({
      accessToken: data.accessToken,
      refreshToken: data.refreshToken || refreshToken,
    });

    return data.accessToken;
  })();

  try {
    return await refreshPromise;
  } finally {
    refreshPromise = null;
  }
}

export async function apiFetch(
  endpoint,
  options = {},
  responseType = "json",
  retry = true,
) {
  const accessToken = tokenStorage.getAccessToken();

  const headers = {
    ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    ...(options.headers || {}),
  };

  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorData = {};
    let message = "Request gagal";

    try {
      errorData = await response.json();
      message = errorData.message || message;
    } catch (error) {
      console.warn("Gagal parse response:", error);
    }

    if (
      retry &&
      response.status === 401 &&
      errorData.code === "INVALID_OR_EXPIRED_TOKEN"
    ) {
      // await refreshTokenRequest();
      // return apiFetch(endpoint, options, responseType, false);
      try {
        await refreshTokenRequest();
        return apiFetch(endpoint, options, responseType, false);
      } catch (refreshError) {
        forceLogout();
        throw refreshError;
      }
    }

    if (
      response.status === 401 &&
      (errorData.code === "INVALID_REFRESH_TOKEN" ||
        errorData.code === "REFRESH_TOKEN_EXPIRED")
    ) {
      forceLogout();
    }

    const error = new Error(message);
    error.status = response.status;
    error.data = errorData;
    throw error;
  }

  if (responseType === "blob") return await response.blob();
  if (responseType === "raw") return response;
  if (responseType === "text") return await response.text();

  return await response.json();
}
