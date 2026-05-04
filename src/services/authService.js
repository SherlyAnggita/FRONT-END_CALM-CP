import { apiFetch } from "../lib/api";
import { tokenStorage } from "../lib/token";

export async function loginUser(payload) {
  const data = await apiFetch("api/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  tokenStorage.setTokens({
    accessToken: data.accessToken,
    refreshToken: data.refreshToken,
  });

  if (data.data) {
    tokenStorage.setUser(data.data);
  }

  return data;
}

export async function registerUser(payload) {
  return apiFetch("api/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

const API_URL = import.meta.env.VITE_API_URL;

export async function getGoogleAccessToken() {
  const response = await fetch(`${API_URL}/api/auth/google/access-token`, {
    method: "GET",
    credentials: "include",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Gagal login dengan Google");
  }

  return data;
}

export async function getUserProfile() {
  const data = await apiFetch("api/users/profile", {
    method: "GET",
  });

  if (data.data) {
    // tokenStorage.setUser(data.data);
    const currentUser = tokenStorage.getUser();

    tokenStorage.setUser({
      ...currentUser,
      ...data.data,
    });
  }

  return data;
}

export async function updateUserProfile(payload) {
  const data = await apiFetch("api/users/profile", {
    method: "PATCH",
    body: JSON.stringify(payload),
  });

  if (data.data) {
    // tokenStorage.setUser(data.data);
    const currentUser = tokenStorage.getUser();

    tokenStorage.setUser({
      ...currentUser,
      ...data.data,
    });
  }

  return data;
}

export async function refreshAccessToken() {
  const refreshToken = tokenStorage.getRefreshToken();

  if (!refreshToken) {
    throw new Error("Refresh token tidak ditemukan");
  }

  const data = await apiFetch("api/auth/refresh-token", {
    method: "POST",
    body: JSON.stringify({ refreshToken }),
  });

  tokenStorage.setTokens({
    accessToken: data.accessToken,
    refreshToken,
  });

  return data;
}

export async function logoutUser() {
  const refreshToken = tokenStorage.getRefreshToken();

  tokenStorage.clearTokens();
  try {
    if (refreshToken) {
      await apiFetch("api/auth/logout", {
        method: "POST",
        body: JSON.stringify({ refreshToken }),
      });
    }
  } catch (error) {
    // console.error("Logout API error:", error);
    console.warn("Logout API gagal, tapi tetap clear token");
    // tetap lanjut hapus token walaupun gagal
  } finally {
    window.location.href = "/login";
  }
}

export function getAccessToken() {
  return tokenStorage.getAccessToken();
}

export function getRefreshToken() {
  return tokenStorage.getRefreshToken();
}

export function getCurrentUser() {
  return tokenStorage.getUser();
}
export function isAuthenticated() {
  return !!tokenStorage.getAccessToken();
}

export function isAdmin() {
  const user = tokenStorage.getUser();
  return user?.role === "admin";
}
