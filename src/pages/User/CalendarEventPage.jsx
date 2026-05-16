import { useEffect, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { FiCloud, FiCalendar, FiArrowLeft } from "react-icons/fi";
import googleCalendarService from "../../services/User/googleCalendarService";
import CalendarEventVisual from "../../components/User/Calendar/CalendarEventVisual";
import UpcomingEventsCard from "../../components/User/Calendar/UpcomingEventsCard";

export default function CalendarEventPage() {
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [eventsLoading, setEventsLoading] = useState(false);
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [showGoogleInfo, setShowGoogleInfo] = useState(false);

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [googleModal, setGoogleModal] = useState({
    open: false,
    title: "",
    message: "",
    type: "info",
  });

  const closeGoogleModal = () => {
    setGoogleModal((prev) => ({ ...prev, open: false }));
    navigate("/user/calendar", { replace: true });
  };

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
            new Date(b.startTime || b.start?.dateTime || b.start?.date),
        );

        setCalendarEvents(sortedEvents);
      }
    } catch (error) {
      console.error("Failed to fetch calendar events:", error);
      setSyncMessage(
        error?.response?.data?.message || "Failed to get calendar events.",
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
        setShowGoogleInfo(true);

        setTimeout(() => {
          setShowGoogleInfo(false);
        }, 10000);

        if (response.data.connected) {
          await fetchCalendarEvents();
        }
      }
    } catch (error) {
      console.error("Failed to fetch Google status:", error);
      setSyncMessage(
        error?.response?.data?.message ||
          "Failed to get Google account status.",
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
        error?.response?.data?.message || "Failed to start Google connection.",
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
        error?.response?.data?.message ||
          "Failed to disconnect Google account.",
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
        setSyncMessage(
          response.message || "Calendar synchronized successfully.",
        );
        await fetchCalendarEvents();
      } else {
        setSyncMessage(response.message || "Failed to sync Google Calendar.");
      }
    } catch (error) {
      console.error("Failed to sync Google Calendar:", error);
      setSyncMessage(
        error?.response?.data?.message || "Failed to sync Google Calendar.",
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
    const connected = searchParams.get("connected");
    const reason = searchParams.get("reason");

    if (connected === "false" && reason === "google_already_connected") {
      setGoogleModal({
        open: true,
        type: "warning",
        title: "Google Calendar sudah tertaut",
        message:
          "Akun Google Calendar ini sudah terhubung dengan akun CALM lain. Silakan disconnect terlebih dahulu dari akun sebelumnya, atau gunakan akun Google Calendar lain.",
      });
    } else if (connected === "false") {
      setGoogleModal({
        open: true,
        type: "error",
        title: "Gagal menghubungkan Google Calendar",
        message:
          "Terjadi kesalahan saat menghubungkan Google Calendar. Silakan coba lagi beberapa saat lagi.",
      });
    } else if (connected === "true") {
      setGoogleModal({
        open: true,
        type: "success",
        title: "Google Calendar berhasil terhubung",
        message: "Akun Google Calendar kamu berhasil terhubung ke CALM.",
      });
    }
  }, [searchParams]);

  useEffect(() => {
    fetchGoogleStatus();
  }, []);

  return (
 <div className="relative min-h-screen w-full max-w-full overflow-x-hidden bg-gradient-to-br from-[#4d739a] via-[#7fb0da] to-[#f8e8d2] px-1 py-2 dark:from-[#0f172a] dark:via-[#111827] dark:to-[#1e293b] sm:p-5">
    {/* decorative clouds/blobs */}
    <div className="pointer-events-none absolute -left-8 top-8 h-28 w-28 rounded-full bg-orange-100/70 blur-sm" />
    <div className="pointer-events-none absolute right-16 top-6 h-16 w-32 rounded-full bg-indigo-300/40 blur-sm" />
    <div className="pointer-events-none absolute -right-10 top-28 h-24 w-40 rounded-full bg-white/50 blur-sm" />
    <div className="pointer-events-none absolute bottom-8 left-10 h-24 w-40 rounded-full bg-white/40 blur-sm" />

   <div className="relative mx-auto w-full max-w-6xl overflow-x-hidden">
      <div className="mb-4 md:hidden">
        <Link
          to="/user/social-battery"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-slate-900"
        >
          <FiArrowLeft size={16} />
          <span>Kembali</span>
        </Link>
      </div>

      {/* Main glass panel */}
   <div className=" w-full min-w-0 rounded-[28px] border border-white/60 bg-white/35 p-2 shadow-xl backdrop-blur-md dark:border-white/10 dark:bg-white/10 dark:shadow-black/30 sm:rounded-[36px]sm:p-7">
        {/* Google Integration Card */}
       <div className="rounded-[28px] border border-white/60 bg-[#d9efff]/70 p-5 shadow-lg backdrop-blur-md dark:border-white/10 dark:bg-[#1e293b]/80">
          <div className="mb-4 flex items-center gap-2">
            <h1 className="text-xl font-bold text-[#7a5f4b] dark:text-slate-100 sm:text-2xl">
              Google Calendar Integration
            </h1>
            <FiCloud className="text-[#7f96c9]" size={18} />
          </div>

          <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-sm">
                <FcGoogle size={24} />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <p className="text-sm text-[#7a6f68] dark:text-slate-300">Google Account:</p>

                  <span
                    className={`text-sm font-semibold ${
                      googleStatus.connected
                        ? "text-emerald-600"
                        : "text-slate-500"
                    }`}
                  >
                    {googleStatus.connected ? "Connected" : "Disconnected"}
                  </span>
                </div>

                <p className="font-medium text-[#6b5547] dark:text-slate-100">
                  {googleStatus.connected
                    ? googleStatus.googleEmail || "Connected"
                    : "Not connected"}
                </p>
              </div>
            </div>
          </div>

          {!googleStatus.connected && (
            <div className="mb-4 rounded-2xl border border-amber-200 bg-amber-50/80 px-4 py-3 text-sm text-amber-700">
              Akun Google kamu belum terhubung. Silakan hubungkan akun Google
              untuk mulai menyinkronkan data kalender dan memperbarui Social
              Battery kamu.
            </div>
          )}

          <div className="mb-4 grid grid-cols-3 gap-2 sm:flex sm:flex-wrap sm:gap-3">
            <button
              onClick={fetchGoogleStatus}
              disabled={loading}
              className="btn h-auto min-h-0 rounded-full border-none bg-[#c58f65] px-2 py-2 text-[11px] text-white shadow transition hover:bg-[#b77d54] disabled:cursor-not-allowed disabled:opacity-60 sm:px-5 sm:py-3 sm:text-sm"
            >
              {loading ? "Checking..." : "Check Status"}
            </button>

            {!googleStatus.connected ? (
              <button
                onClick={handleConnectGoogle}
                disabled={loading}
                className="btn h-auto min-h-0 rounded-full border-none bg-[#9aa6d9] px-2 py-2 text-[11px] text-white shadow transition hover:bg-[#8996cf] disabled:cursor-not-allowed disabled:opacity-60 sm:px-5 sm:py-3 sm:text-sm"
              >
                {loading ? "Connecting..." : "Connect Google"}
              </button>
            ) : (
              <>
                <button
                  onClick={handleSyncCalendar}
                  disabled={syncing}
                  className="btn h-auto min-h-0 rounded-full border-none bg-[#49769F] px-2 py-2 text-[11px] text-white shadow-md transition hover:bg-[#6EA1B2] disabled:cursor-not-allowed disabled:opacity-60 sm:px-5 sm:py-3 sm:text-sm"
                >
                  {syncing ? "Syncing..." : "Synchronize"}
                </button>

                <button
                  onClick={handleDisconnectGoogle}
                  disabled={loading}
                  className="btn h-auto min-h-0 rounded-full border-none bg-[#E98989] px-2 py-2 text-[11px] text-white shadow transition hover:bg-[#DDA4A4] disabled:cursor-not-allowed disabled:opacity-60 sm:px-5 sm:py-3 sm:text-sm"
                >
                  {loading ? "Disconnecting..." : "Disconnect"}
                </button>
              </>
            )}
          </div>

         <p className="text-sm text-[#6f777f] dark:text-slate-300">
            Data from your synchronized calendar will automatically update your
            Social Battery.
          </p>

          {googleStatus.connected && showGoogleInfo && (
            <div className="mt-4 rounded-2xl bg-white/70 p-4 text-sm text-slate-700 shadow-sm">
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <p className="text-xs text-slate-500">Google Email</p>
                  <p className="font-semibold">
                    {googleStatus.googleEmail || "-"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-500">Connected At</p>
                  <p className="font-semibold">
                    {googleStatus.connectedAt
                      ? new Date(googleStatus.connectedAt).toLocaleString(
                          "id-ID",
                          {
                            dateStyle: "medium",
                            timeStyle: "short",
                          },
                        )
                      : "-"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-500">Last Updated</p>
                  <p className="font-semibold">
                    {googleStatus.updatedAt
                      ? new Date(googleStatus.updatedAt).toLocaleString(
                          "id-ID",
                          {
                            dateStyle: "medium",
                            timeStyle: "short",
                          },
                        )
                      : "-"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-500">Token Expiry</p>
                  <p className="font-semibold">
                    {googleStatus.tokenExpiry
                      ? new Date(googleStatus.tokenExpiry).toLocaleString(
                          "id-ID",
                          {
                            dateStyle: "medium",
                            timeStyle: "short",
                          },
                        )
                      : "-"}
                  </p>
                </div>
              </div>
            </div>
          )}

          {syncMessage && (
            <div className="mt-4 rounded-2xl bg-white/70 px-4 py-3 text-sm text-slate-700 shadow-sm">
              {syncMessage}
            </div>
          )}
        </div>

        {/* Calendar + Upcoming */}
        {googleStatus.connected && (
        <div className="mt-6 grid w-full min-w-0 gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="w-full min-w-0 rounded-[24px] border border-white/70 bg-[#ffe7cf]/75 p-1 shadow-lg backdrop-blur-md dark:border-white/10 dark:bg-[#111827]/80 sm:p-3">
              <CalendarEventVisual
                fullCalendarEvents={fullCalendarEvents}
                eventsLoading={eventsLoading}
              />
            </div>

            <div className="min-w-0 rounded-[28px] border border-white/70 bg-white/45 p-4 shadow-lg backdrop-blur-md dark:bg-[#111827]/80">
              <UpcomingEventsCard calendarEvents={calendarEvents} />
            </div>
          </div>
        )}
      </div>
    </div>

    {googleModal.open && (
      <dialog open className="modal modal-open">
        <div className="modal-box bg-white text-slate-800">
          <div
            className={`mb-4 rounded-2xl px-4 py-3 text-sm font-semibold ${
              googleModal.type === "success"
                ? "bg-emerald-100 text-emerald-700"
                : googleModal.type === "warning"
                  ? "bg-amber-100 text-amber-700"
                  : "bg-rose-100 text-rose-700"
            }`}
          >
            {googleModal.title}
          </div>

          <p className="text-sm leading-relaxed text-slate-600">
            {googleModal.message}
          </p>

          <div className="modal-action">
            <button
              type="button"
              onClick={closeGoogleModal}
              className="btn rounded-full border-none bg-[#49769F] px-6 text-white hover:bg-[#3d6487]"
            >
              Mengerti
            </button>
          </div>
        </div>

        <form method="dialog" className="modal-backdrop">
          <button type="button" onClick={closeGoogleModal}>
            close
          </button>
        </form>
      </dialog>
    )}
  </div>
);
}
