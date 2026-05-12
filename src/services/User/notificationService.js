import { apiFetchWithRefresh } from "../apiWithRefresh";

export async function getNotifications() {
  return await apiFetchWithRefresh("api/users/notifications", {
    method: "GET",
  });
}

export async function getUnreadNotificationCount() {
  return await apiFetchWithRefresh("api/users/notifications/unread-count", {
    method: "GET",
  });
}

export async function markNotificationAsRead(id) {
  return await apiFetchWithRefresh(`api/users/notifications/${id}/read`, {
    method: "PATCH",
  });
}

export async function markAllNotificationsAsRead() {
  return await apiFetchWithRefresh("api/users/notifications/read-all", {
    method: "PATCH",
  });
}
