import { apiFetchWithRefresh } from "../apiWithRefresh";

const ADMIN_BASE_URL = "api/admin/users";

export async function getUsers({
  page = 1,
  limit = 10,
  search = "",
  userId = "",
  sortBy = "createdAt",
  order = "desc",
  role = "",
  authProvider = "",
  isActive = "",
  isEmailVerified = "",
  fromDate = "",
  toDate = "",
}) {
  const params = new URLSearchParams();

  params.append("page", page);
  params.append("limit", limit);
  params.append("sortBy", sortBy);
  params.append("order", order);

  if (search) params.append("search", search);
  if (userId) params.append("userId", userId);
  if (role) params.append("role", role);
  if (authProvider) params.append("authProvider", authProvider);
  if (isActive !== "") params.append("isActive", String(isActive));
  if (isEmailVerified !== "")
    params.append("isEmailVerified", String(isEmailVerified));
  if (fromDate) params.append("fromDate", fromDate);
  if (toDate) params.append("toDate", toDate);

  return await apiFetchWithRefresh(
    `${ADMIN_BASE_URL}?${params.toString()}`,
    {
      method: "GET",
    },
    "json",
  );
}

export async function createUser({
  email,
  password,
  fullName,
  username,
  phoneNumber,
  role = "user",
  isActive = true,
  isEmailVerified = false,
}) {
  return await apiFetchWithRefresh(
    ADMIN_BASE_URL,
    {
      method: "POST",
      body: JSON.stringify({
        email,
        password,
        fullName,
        username,
        phoneNumber,
        role,
        isActive,
        isEmailVerified,
      }),
    },
    "json",
  );
}

export async function getUserById(id) {
  if (!id) {
    throw new Error("User Id Wajib Diisi");
  }

  return await apiFetchWithRefresh(
    `${ADMIN_BASE_URL}/${id}`,
    {
      method: "GET",
    },
    "json",
  );
}

export async function toggleUserActive(id) {
  if (!id) {
    throw new Error("User Id wajib diisi");
  }

  return await apiFetchWithRefresh(
    `${ADMIN_BASE_URL}/${id}/toggle-active`,
    {
      method: "PATCH",
    },
    "json",
  );
}
