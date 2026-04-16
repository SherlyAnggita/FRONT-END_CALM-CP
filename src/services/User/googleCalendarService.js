import axios from "axios";
import { tokenStorage } from "../../lib/token";

const BASE_URL = "https://api.calm-be.online/api/google";

const getAuthHeaders = () => {
  const token = tokenStorage.getAccessToken();

  return {
    Authorization: `Bearer ${token}`,
  };
};

const googleCalendarService = {
  async getStatus() {
    const response = await axios.get(`${BASE_URL}/status`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  },

  async connectGoogle() {
    const response = await axios.get(`${BASE_URL}/connect`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  },

  async disconnectGoogle() {
    const response = await axios.post(
      `${BASE_URL}/disconnect`,
      {},
      {
        headers: getAuthHeaders(),
      }
    );
    return response.data;
  },

  async syncCalendar() {
    const response = await axios.post(
      `${BASE_URL}/calendar/sync`,
      {},
      {
        headers: getAuthHeaders(),
      }
    );
    return response.data;
  },
};

export default googleCalendarService;