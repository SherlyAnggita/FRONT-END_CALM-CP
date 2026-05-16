import { tokenStorage } from "../../lib/token";
import { apiFetchWithRefresh } from "../apiWithRefresh";

export async function updatePassword(payload) {
  return await apiFetchWithRefresh(
    "api/users/profile/password",
    {
      method: "PATCH",
      body: JSON.stringify(payload),
    }
  );
}