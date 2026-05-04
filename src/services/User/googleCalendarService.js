import axios from "axios";
import { tokenStorage } from "../../lib/token";
import { logoutUser } from "../authService";

const BASE_URL = "https://api.calm-be.online/api/google";

let isRedirectingToLogin = false;

const getAuthHeaders = () => {
  const token = tokenStorage.getAccessToken();

  return {
    Authorization: `Bearer ${token}`,
  };
};

const handleAccountDisabled = (error) => {
  if (
    error.response?.status === 403 &&
    error.response?.data?.code === "ACCOUNT_DISABLED"
  ) {
    if (!isRedirectingToLogin) {
      isRedirectingToLogin = true;
      logoutUser();
    }

    return true;
  }

  return false;
};

const safeRequest = async (requestFn) => {
  try {
    const response = await requestFn();
    return response.data;
  } catch (error) {
    if (handleAccountDisabled(error)) return;
    throw error;
  }
};

const googleCalendarService = {
  async getStatus() {
    return safeRequest(() =>
      axios.get(`${BASE_URL}/status`, {
        headers: getAuthHeaders(),
      }),
    );
  },

  async connectGoogle() {
    return safeRequest(() =>
      axios.get(`${BASE_URL}/connect`, {
        headers: getAuthHeaders(),
      }),
    );
  },

  async disconnectGoogle() {
    return safeRequest(() =>
      axios.delete(`${BASE_URL}/disconnect`, {
        headers: getAuthHeaders(),
      }),
    );
  },

  async syncCalendar() {
    return safeRequest(() =>
      axios.post(
        `${BASE_URL}/calendar/sync`,
        {},
        {
          headers: getAuthHeaders(),
        },
      ),
    );
  },

  async getCalendarEvents() {
    return safeRequest(() =>
      axios.get(`${BASE_URL}/calendar/events`, {
        headers: getAuthHeaders(),
      }),
    );
  },
};

export default googleCalendarService;
