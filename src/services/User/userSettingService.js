import { tokenStorage } from "../../lib/token";

const API_BASE_URL = "https://api.calm-be.online/api";

export async function updatePassword(payload) {
  const token = tokenStorage.getAccessToken();

  const res = await fetch(`${API_BASE_URL}/users/profile/password`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Gagal mengubah password");
  }

  return data;
}