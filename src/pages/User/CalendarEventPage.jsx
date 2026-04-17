import { useEffect, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import {
  FiCloud,
  FiInfo,
  FiLink2,
  FiCalendar,
} from "react-icons/fi";
import googleCalendarService from "../../services/User/googleCalendarService";

export default function CalendarEventPage() {
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);

  const [googleStatus, setGoogleStatus] = useState({
    connected: false,
    googleEmail: null,
    tokenExpiry: null,
    googleSub: null,
    connectedAt: null,
    updatedAt: null,
  });

  const [syncMessage, setSyncMessage] = useState("");

  const fetchGoogleStatus = async () => {
    try {
      setLoading(true);
      setSyncMessage("");

      const response = await googleCalendarService.getStatus();

      if (response.success && response.data) {
        setGoogleStatus(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch Google status:", error);
      setSyncMessage(
        error?.response?.data?.message || "Failed to get Google account status."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleConnectGoogle = async () => {
    try {
      setLoading(true);
      setSyncMessage("");

      const response = await googleCalendarService.connectGoogle();

      if (response.success && response.data) {
        window.location.href = response.data;
      }
    } catch (error) {
      console.error("Failed to connect Google account:", error);
      setSyncMessage(
        error?.response?.data?.message || "Failed to start Google connection."
      );
      setLoading(false);
    }
  };

  const handleDisconnectGoogle = async () => {
    try {
      setLoading(true);
      setSyncMessage("");

      const response = await googleCalendarService.disconnectGoogle();

      if (response.success) {
        setSyncMessage(response.message || "Google account disconnected.");
        await fetchGoogleStatus();
      }
    } catch (error) {
      console.error("Failed to disconnect Google account:", error);
      setSyncMessage(
        error?.response?.data?.message || "Failed to disconnect Google account."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSyncCalendar = async () => {
    try {
      setSyncing(true);
      setSyncMessage("");

      const response = await googleCalendarService.syncCalendar();

      if (response.success) {
        setSyncMessage(response.message || "Calendar synchronized successfully.");
      } else {
        setSyncMessage(response.message || "Failed to sync Google Calendar.");
      }
    } catch (error) {
      console.error("Failed to sync Google Calendar:", error);
      setSyncMessage(
        error?.response?.data?.message || "Failed to sync Google Calendar."
      );
    } finally {
      setSyncing(false);
    }
  };

  useEffect(() => {
    fetchGoogleStatus();
  }, []);

  return (
    <div className="w-full p-6">
      <div className="rounded-[28px] border border-sky-200 bg-sky-100/80 p-6 shadow-md transition-colors dark:border-slate-700 dark:bg-slate-800/90 dark:shadow-slate-900/30">
        <div className="mb-4 flex items-center gap-2">
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
            Google Calendar Integration
          </h1>
          <FiCloud className="text-slate-500 dark:text-slate-300" size={18} />
        </div>

        {!googleStatus.connected && (
          <div className="mb-5 rounded-2xl border border-sky-200 bg-white/70 p-4 dark:border-slate-600 dark:bg-slate-700/60">
            <div className="mb-2 flex items-start gap-3">
              <div className="mt-0.5 rounded-full bg-sky-100 p-2 text-sky-600 dark:bg-sky-900/30 dark:text-sky-300">
                <FiInfo size={18} />
              </div>

              <div>
                <p className="font-semibold text-slate-800 dark:text-slate-100">
                  Connect your Google account to use this feature
                </p>
                <p className="mt-1 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                  Untuk menggunakan fitur ini, anda perlu menghubungkan akun Google anda terlebih dahulu. 
                  Setelah terhubung, anda bisa menyinkronkan data kalender untuk memperbarui Social Battery secara otomatis berdasarkan aktivitas di kalender Google.
                </p>
              </div>
            </div>

            <div className="mt-3 grid gap-2 text-sm text-slate-700 dark:text-slate-200 sm:grid-cols-3">
              <div className="flex items-center gap-2 rounded-xl bg-sky-50 px-3 py-2 dark:bg-slate-800/70">
                <FiLink2 size={16} />
                <span>1. Connect Google account</span>
              </div>
              <div className="flex items-center gap-2 rounded-xl bg-sky-50 px-3 py-2 dark:bg-slate-800/70">
                <FiCalendar size={16} />
                <span>2. Sync your calendar</span>
              </div>
              <div className="flex items-center gap-2 rounded-xl bg-sky-50 px-3 py-2 dark:bg-slate-800/70">
                <FiCloud size={16} />
                <span>3. Update Social Battery data</span>
              </div>
            </div>
          </div>
        )}

        <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-sm dark:bg-slate-700">
              <FcGoogle size={24} />
            </div>

            <div>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Google Account:
              </p>
              <p className="font-medium text-slate-800 dark:text-slate-100">
                {googleStatus.connected
                  ? googleStatus.googleEmail || "Connected"
                  : "Not connected"}
              </p>
            </div>
          </div>

          <div
            className={`rounded-full px-4 py-2 text-sm font-medium shadow-sm ${
              googleStatus.connected
                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"
                : "bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300"
            }`}
          >
            {googleStatus.connected ? "Connected" : "Disconnected"}
          </div>
        </div>

        {!googleStatus.connected && (
          <div className="mb-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700 dark:border-amber-800/50 dark:bg-amber-900/20 dark:text-amber-300">
            Akun Google kamu belum terhubung. 
            Silakan hubungkan akun Google untuk mulai menyinkronkan data kalender dan memperbarui Social Battery kamu.
          </div>
        )}

        <div className="mb-4 flex flex-wrap gap-3">
          <button
            onClick={fetchGoogleStatus}
            disabled={loading}
            className="btn h-auto min-h-0 rounded-full border-none bg-white px-5 py-3 text-slate-700 shadow hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-slate-700 dark:text-slate-100 dark:hover:bg-slate-600"
          >
            {loading ? "Checking..." : "Check Status"}
          </button>

          {!googleStatus.connected ? (
            <button
              onClick={handleConnectGoogle}
              disabled={loading}
              className="btn h-auto min-h-0 rounded-full border-none bg-indigo-400 px-5 py-3 text-white shadow hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-indigo-500 dark:hover:bg-indigo-600"
            >
              {loading ? "Connecting..." : "Connect Google"}
            </button>
          ) : (
            <>
              <button
                onClick={handleSyncCalendar}
                disabled={syncing}
                className="btn h-auto min-h-0 rounded-full border-none bg-indigo-400 px-5 py-3 text-white shadow hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-indigo-500 dark:hover:bg-indigo-600"
              >
                {syncing ? "Synchronizing..." : "Synchronize Calendar"}
              </button>

              <button
                onClick={handleDisconnectGoogle}
                disabled={loading}
                className="btn h-auto min-h-0 rounded-full border-none bg-rose-100 px-5 py-3 text-rose-700 shadow hover:bg-rose-200 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-rose-900/30 dark:text-rose-300 dark:hover:bg-rose-900/50"
              >
                {loading ? "Disconnecting..." : "Disconnect Account"}
              </button>
            </>
          )}
        </div>

        <p className="text-sm text-slate-600 dark:text-slate-300">
          Data from your synchronized calendar will automatically update your
          Social Battery.
        </p>

        {googleStatus.connected && (
          <div className="mt-4 rounded-2xl bg-white/60 p-4 text-sm text-slate-700 dark:bg-slate-700/70 dark:text-slate-200">
            <p>
              <span className="font-semibold">Google Email:</span>{" "}
              {googleStatus.googleEmail || "-"}
            </p>
            <p>
              <span className="font-semibold">Google Sub:</span>{" "}
              {googleStatus.googleSub || "-"}
            </p>
            <p>
              <span className="font-semibold">Token Expiry:</span>{" "}
              {googleStatus.tokenExpiry || "-"}
            </p>
            <p>
              <span className="font-semibold">Connected At:</span>{" "}
              {googleStatus.connectedAt || "-"}
            </p>
            <p>
              <span className="font-semibold">Updated At:</span>{" "}
              {googleStatus.updatedAt || "-"}
            </p>
          </div>
        )}

        {syncMessage && (
          <div className="mt-4 rounded-2xl bg-white/70 px-4 py-3 text-sm text-slate-700 shadow-sm dark:bg-slate-700/80 dark:text-slate-200">
            {syncMessage}
          </div>
        )}
      </div>
    </div>
  );
}