import { apiFetch } from "../lib/api";
import { tokenStorage } from "../lib/token";

export async function loginUser(payload) {
  const data = await apiFetch("/api/auth/login", {
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
  return apiFetch("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function getUserProfile() {
  const data = await apiFetch("/api/users/profile", {
    method: "GET",
  });

  if (data.data) {
    tokenStorage.setUser(data.data);
  }

  return data;
}

export async function updateUserProfile(payload) {
  const data = await apiFetch("/api/users/profile", {
    method: "PATCH",
    body: JSON.stringify(payload),
  });

  if (data.data) {
    tokenStorage.setUser(data.data);
  }

  return data;
}

export async function refreshAccessToken() {
  const refreshToken = tokenStorage.getRefreshToken();

  if (!refreshToken) {
    throw new Error("Refresh token tidak ditemukan");
  }

  const data = await apiFetch("/api/auth/refresh-token", {
    method: "POST",
    body: JSON.stringify({ refreshToken }),
  });

  tokenStorage.setTokens({
    accessToken: data.accessToken,
  });

  return data;
}

export function logoutUser() {
  tokenStorage.clearTokens();
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