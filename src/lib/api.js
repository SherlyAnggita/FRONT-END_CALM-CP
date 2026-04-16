import { tokenStorage } from "./token";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function apiFetch(endpoint, options = {}, responseType = "json") {
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
    } catch {
      // abaikan kalau response error bukan json
    }

    const error = new Error(message);
    error.status = response.status;
    error.data = errorData;
    throw error;
  }

  if (responseType === "blob") {
    return await response.blob();
  }

  if (responseType === "raw") {
    return response;
  }

  if (responseType === "text") {
    return await response.text();
  }

  return await response.json();
}
