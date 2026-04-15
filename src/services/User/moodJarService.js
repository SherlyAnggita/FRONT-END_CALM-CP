import { apiFetchWithRefresh } from "../apiWithRefresh";

export async function getActiveMoodLabels() {
  return await apiFetchWithRefresh("api/users/mood-labels/active", {
    method: "GET",
  });
}

export async function getMoodEntries(page = 1, limit = 5) {
  return await apiFetchWithRefresh(
    `api/users/mood-entries?page=${page}&limit=${limit}`,
    {
      method: "GET",
    },
  );
}

export async function getMoodEntryDetail(id) {
  return await apiFetchWithRefresh(`api/users/mood-entries/${id}`, {
    method: "GET",
  });
}

export async function createMoodEntry(payload) {
  return await apiFetchWithRefresh("api/users/mood-entries", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
