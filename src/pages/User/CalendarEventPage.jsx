import { useEffect, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { FiCloud, FiCalendar } from "react-icons/fi";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import googleCalendarService from "../../services/User/googleCalendarService";

export default function CalendarEventPage() {
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [eventsLoading, setEventsLoading] = useState(false);
  const [calendarEvents, setCalendarEvents] = useState([]);

  const [googleStatus, setGoogleStatus] = useState({
    connected: false,
    googleEmail: null,
    tokenExpiry: null,
    googleSub: null,
    connectedAt: null,
    updatedAt: null,
  });

  const [syncMessage, setSyncMessage] = useState("");

  const fetchCalendarEvents = async () => {
    try {
      setEventsLoading(true);

      const response = await googleCalendarService.getCalendarEvents();
      console.log("Calendar events:", response);

      if (response.success && response.data) {
        const events = Array.isArray(response.data)
          ? response.data
          : response.data.events ||
            response.data.calendarEvents ||
            response.data.items ||
            [];

        const sortedEvents = events.sort(
          (a, b) =>
            new Date(a.startTime || a.start?.dateTime || a.start?.date) -
            new Date(b.startTime || b.start?.dateTime || b.start?.date)
        );

        setCalendarEvents(sortedEvents);
      }
    } catch (error) {
      console.error("Failed to fetch calendar events:", error);
      setSyncMessage(
        error?.response?.data?.message || "Failed to get calendar events."
      );
    } finally {
      setEventsLoading(false);
    }
  };

  const fetchGoogleStatus = async () => {
    try {
      setLoading(true);
      setSyncMessage("");

      const response = await googleCalendarService.getStatus();

      if (response.success && response.data) {
        setGoogleStatus(response.data);

        if (response.data.connected) {
          await fetchCalendarEvents();
        }
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
        setCalendarEvents([]);
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
        await fetchCalendarEvents();
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

  const fullCalendarEvents = calendarEvents.map((event) => ({
    id: event.id,
    title: event.summary || event.title || "Untitled Event",
    start: event.startTime || event.start?.dateTime || event.start?.date,
    end: event.endTime || event.end?.dateTime || event.end?.date,
  }));

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
            Akun Google kamu belum terhubung. Silakan hubungkan akun Google
            untuk mulai menyinkronkan data kalender dan memperbarui Social
            Battery kamu.
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
          <div className="mt-4 rounded-2xl bg-white/60 px-4 py-3 text-sm text-slate-700 dark:bg-slate-700/70 dark:text-slate-200">
            Connected at{" "}
            <span className="font-semibold">
              {googleStatus.connectedAt
                ? new Date(googleStatus.connectedAt).toLocaleString("id-ID", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })
                : "-"}
            </span>
          </div>
        )}

        {syncMessage && (
          <div className="mt-4 rounded-2xl bg-white/70 px-4 py-3 text-sm text-slate-700 shadow-sm dark:bg-slate-700/80 dark:text-slate-200">
            {syncMessage}
          </div>
        )}
      </div>

      {googleStatus.connected && (
        <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_260px]">
          <div className="rounded-2xl bg-white p-4 shadow-md dark:bg-slate-800">
            <div className="mb-4 flex items-center gap-2">
              <FiCalendar className="text-slate-500 dark:text-slate-300" />
              <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                Calendar Events
              </h2>
            </div>

            {eventsLoading ? (
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Loading calendar events...
              </p>
            ) : (
              <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView="timeGridWeek"
                events={fullCalendarEvents}
                height="650px"
                nowIndicator={true}
                allDaySlot={true}
                slotMinTime="06:00:00"
                slotMaxTime="24:00:00"
                headerToolbar={{
                  left: "prev,next today",
                  center: "title",
                  right: "dayGridMonth,timeGridWeek,timeGridDay",
                }}
              />
            )}
          </div>

          <div className="rounded-2xl bg-sky-700/70 p-4 text-white shadow-md">
            <h3 className="mb-3 text-lg font-semibold">May 2026</h3>

            <p className="text-sm">Total Events: {calendarEvents.length}</p>

            <div className="mt-4 space-y-2">
              {calendarEvents.length === 0 ? (
                <p className="text-sm text-white/80">
                  Belum ada event calendar yang ditemukan.
                </p>
              ) : (
                calendarEvents.slice(0, 5).map((event) => (
                  <div
                    key={event.id}
                    className="rounded-xl bg-white/90 p-3 text-sm text-slate-700"
                  >
                    <p className="font-semibold">
                      {event.summary || event.title || "Untitled Event"}
                    </p>
                    <p className="text-xs">
                      {event.startTime ||
                        event.start?.dateTime ||
                        event.start?.date ||
                        "-"}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}