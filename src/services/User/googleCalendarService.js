// import axios from "axios";
// import { tokenStorage } from "../../lib/token";
// import { logoutUser } from "../authService";

// const BASE_URL = import.meta.env.VITE_API_BASE_URL + "api/google";

// let isRedirectingToLogin = false;

// const handleGoogleTokenExpired = (error) => {
//   if (
//     error.response?.status === 409 &&
//     error.response?.data?.code === "GOOGLE_TOKEN_EXPIRED"
//   ) {
//     return true;
//   }

//   return false;
// };

// const getAuthHeaders = () => {
//   const token = tokenStorage.getAccessToken();

//   return {
//     Authorization: `Bearer ${token}`,
//   };
// };

// const handleAccountDisabled = (error) => {
//   if (
//     error.response?.status === 403 &&
//     error.response?.data?.code === "ACCOUNT_DISABLED"
//   ) {
//     if (!isRedirectingToLogin) {
//       isRedirectingToLogin = true;
//       logoutUser();
//     }

//     return true;
//   }

//   return false;
// };

// const safeRequest = async (requestFn) => {
//   try {
//     const response = await requestFn();
//     return response.data;
//   } catch (error) {
//     // if (handleAccountDisabled(error)) return;
//     if (handleAccountDisabled(error)) return;

//     if (handleGoogleTokenExpired(error)) {
//       throw error; // jangan logout, biar component yang handle reconnect
//     }
//     throw error;
//   }
// };

// const googleCalendarService = {
//   async getStatus() {
//     return safeRequest(() =>
//       axios.get(`${BASE_URL}/status`, {
//         headers: getAuthHeaders(),
//       }),
//     );
//   },

//   async connectGoogle() {
//     return safeRequest(() =>
//       axios.get(`${BASE_URL}/connect`, {
//         headers: getAuthHeaders(),
//       }),
//     );
//   },

//   async disconnectGoogle() {
//     return safeRequest(() =>
//       axios.delete(`${BASE_URL}/disconnect`, {
//         headers: getAuthHeaders(),
//       }),
//     );
//   },

//   async syncCalendar() {
//     return safeRequest(() =>
//       axios.post(
//         `${BASE_URL}/calendar/sync`,
//         {},
//         {
//           headers: getAuthHeaders(),
//         },
//       ),
//     );
//   },

//   async getCalendarEvents() {
//     return safeRequest(() =>
//       axios.get(`${BASE_URL}/calendar/events`, {
//         headers: getAuthHeaders(),
//       }),
//     );
//   },
// };

// export default googleCalendarService;

import { apiFetch } from "../../lib/api";
import { logoutUser } from "../authService";

const handleGoogleTokenExpired = (error) => {
  return error.status === 409 && error.data?.code === "GOOGLE_TOKEN_EXPIRED";
};

const handleAccountDisabled = async (error) => {
  if (error.status === 403 && error.data?.code === "ACCOUNT_DISABLED") {
    await logoutUser();
    return true;
  }

  return false;
};

const safeRequest = async (requestFn) => {
  try {
    return await requestFn();
  } catch (error) {
    if (await handleAccountDisabled(error)) return;

    if (handleGoogleTokenExpired(error)) {
      throw error;
    }

    throw error;
  }
};

const googleCalendarService = {
  async getStatus() {
    return safeRequest(() => apiFetch("api/google/status"));
  },

  async connectGoogle() {
    return safeRequest(() => apiFetch("api/google/connect"));
  },

  async disconnectGoogle() {
    return safeRequest(() =>
      apiFetch("api/google/disconnect", {
        method: "DELETE",
      }),
    );
  },

  async syncCalendar() {
    return safeRequest(() =>
      apiFetch("api/google/calendar/sync", {
        method: "POST",
        body: JSON.stringify({}),
      }),
    );
  },

  async getCalendarEvents() {
    return safeRequest(() => apiFetch("api/google/calendar/events"));
  },
};

export default googleCalendarService;
