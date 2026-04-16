import { useEffect, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { FiCloud } from "react-icons/fi";
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
      <div className="rounded-[28px] border border-sky-200 bg-sky-100/80 p-6 shadow-md">
        <div className="mb-4 flex items-center gap-2">
          <h1 className="text-2xl font-bold text-slate-800">
            Google Calendar Integration
          </h1>
          <FiCloud className="text-slate-500" size={18} />
        </div>

        <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-sm">
              <FcGoogle size={24} />
            </div>

            <div>
              <p className="text-sm text-slate-600">Google Account:</p>
              <p className="font-medium text-slate-800">
                {googleStatus.connected
                  ? googleStatus.googleEmail || "Connected"
                  : "Not connected"}
              </p>
            </div>
          </div>

          <div
            className={`rounded-full px-4 py-2 text-sm font-medium shadow-sm ${
              googleStatus.connected
                ? "bg-emerald-100 text-emerald-700"
                : "bg-slate-200 text-slate-600"
            }`}
          >
            {googleStatus.connected ? "Connected" : "Disconnected"}
          </div>
        </div>

        <div className="mb-4 flex flex-wrap gap-3">
          <button
            onClick={fetchGoogleStatus}
            disabled={loading}
            className="btn h-auto min-h-0 rounded-full border-none bg-white px-5 py-3 text-slate-700 shadow hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Checking..." : "Check Status"}
          </button>

          {!googleStatus.connected ? (
            <button
              onClick={handleConnectGoogle}
              disabled={loading}
              className="btn h-auto min-h-0 rounded-full border-none bg-indigo-400 px-5 py-3 text-white shadow hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Connecting..." : "Connect Google"}
            </button>
          ) : (
            <>
              <button
                onClick={handleSyncCalendar}
                disabled={syncing}
                className="btn h-auto min-h-0 rounded-full border-none bg-indigo-400 px-5 py-3 text-white shadow hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {syncing ? "Synchronizing..." : "Synchronize Calendar"}
              </button>

              <button
                onClick={handleDisconnectGoogle}
                disabled={loading}
                className="btn h-auto min-h-0 rounded-full border-none bg-rose-100 px-5 py-3 text-rose-700 shadow hover:bg-rose-200 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Disconnecting..." : "Disconnect Account"}
              </button>
            </>
          )}
        </div>

        <p className="text-sm text-slate-600">
          Data from your synchronized calendar will automatically update your
          Social Battery.
        </p>

        {googleStatus.connected && (
          <div className="mt-4 rounded-2xl bg-white/60 p-4 text-sm text-slate-700">
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
          <div className="mt-4 rounded-2xl bg-white/70 px-4 py-3 text-sm text-slate-700 shadow-sm">
            {syncMessage}
          </div>
        )}
      </div>
    </div>
  );
}