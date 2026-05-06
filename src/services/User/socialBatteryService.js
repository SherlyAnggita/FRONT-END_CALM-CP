import axios from "axios";
import { tokenStorage } from "../../lib/token";
import { logoutUser } from "../authService";

const BASE_URL = import.meta.env.VITE_API_BASE_URL + "api/users/social-battery";

const socialBatteryApi = axios.create({
  baseURL: BASE_URL,
});

socialBatteryApi.interceptors.request.use((config) => {
  const token = tokenStorage.getAccessToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

socialBatteryApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await logoutUser();
    }

    return Promise.reject(error);
  },
);

export async function getTodaySocialBattery() {
  const response = await socialBatteryApi.get("/today");
  return response.data;
}

export async function getSocialBatteryHistory(page = 1, limit = 7) {
  const response = await socialBatteryApi.get(
    `/history?page=${page}&limit=${limit}`,
  );

  return response.data;
}

export async function getSocialBatteryByDate(date) {
  const response = await socialBatteryApi.get(`/${date}`);
  return response.data;
}

export async function calculateSocialBattery(date = null) {
  const response = await socialBatteryApi.post("/calculate", {
    date,
  });

  return response.data;
}

export async function generateAiInsight(date = null) {
  const response = await socialBatteryApi.post("/generate-ai-insight", {
    date,
  });

  return response.data;
}
