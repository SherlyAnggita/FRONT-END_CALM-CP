import { useEffect, useState, useCallback, useRef } from "react";
import {
  FiBell,
  FiCheck,
  FiCheckCircle,
  FiInbox,
  FiFilter,
} from "react-icons/fi";
import {
  getNotifications,
  getUnreadNotificationCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "../../../services/User/notificationService";

const FILTERS = [
  { label: "Semua", value: "all" },
  { label: "Belum Dibaca", value: "unread" },
  { label: "Sudah Dibaca", value: "read" },
];

const PAGE_SIZE = 12; // 12 = 4 rows × 3 cols on desktop

function timeAgo(dateString) {
  if (!dateString) return "";
  const now = new Date();
  const date = new Date(dateString);
  const diff = Math.floor((now - date) / 1000);

  if (diff < 60) return "Baru saja";
  if (diff < 3600) return `${Math.floor(diff / 60)} mnt lalu`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} jam lalu`;
  if (diff < 604800) return `${Math.floor(diff / 86400)} hari lalu`;
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

// ─── Skeleton Card ────────────────────────────────────────────────────────────
function NotifSkeleton() {
  return (
    <div className="flex h-full flex-col gap-3 rounded-2xl bg-base-100 p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="skeleton h-2.5 w-2.5 rounded-full" />
        <div className="skeleton h-3 w-14 rounded-lg" />
      </div>
      <div className="skeleton h-4 w-3/5 rounded-lg" />
      <div className="flex-1 space-y-1.5">
        <div className="skeleton h-3 w-full rounded-lg" />
        <div className="skeleton h-3 w-4/5 rounded-lg" />
      </div>
    </div>
  );
}

// ─── Single Notification Card ─────────────────────────────────────────────────
function NotifCard({ notif, onRead, visible }) {
  return (
    <div
      onClick={() => onRead(notif.id)}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(10px)",
        transition: "opacity 0.3s ease, transform 0.3s ease",
      }}
      className={`group relative flex h-full cursor-pointer flex-col rounded-2xl p-4 shadow-sm transition-shadow duration-200 hover:shadow-md active:scale-[0.99] ${
        !notif.readAt
          ? "bg-primary/5 ring-1 ring-primary/20 hover:bg-primary/10"
          : "bg-base-100 hover:bg-base-200"
      }`}
    >
      {/* Top row: dot + time */}
      <div className="mb-2 flex items-center justify-between gap-2">
        <span
          className={`h-2 w-2 flex-shrink-0 rounded-full transition-colors ${
            !notif.readAt ? "bg-primary" : "bg-base-300"
          }`}
        />
        <span className="text-[11px] text-base-content/40">
          {timeAgo(notif.createdAt)}
        </span>
      </div>

      {/* Title */}
      <p
        className={`mb-1.5 line-clamp-2 text-sm font-semibold leading-snug ${
          !notif.readAt ? "text-base-content" : "text-base-content/60"
        }`}
      >
        {notif.title}
      </p>

      {/* Message */}
      <p className="line-clamp-3 flex-1 text-xs leading-relaxed text-base-content/55">
        {notif.message}
      </p>

      {/* Hover: mark read hint */}
      {!notif.readAt && (
        <div className="mt-3 flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          <FiCheck size={12} className="text-primary" />
          <span className="text-[11px] text-primary">Tandai dibaca</span>
        </div>
      )}
    </div>
  );
}

// ─── Lazy-reveal wrapper ──────────────────────────────────────────────────────
function LazyNotifCard({ notif, onRead }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.05 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="h-full">
      <NotifCard notif={notif} onRead={onRead} visible={visible} />
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [loadingReadAll, setLoadingReadAll] = useState(false);
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const loadMoreRef = useRef(null);

  const loadNotifications = useCallback(async () => {
    try {
      const notifRes = await getNotifications();
      const countRes = await getUnreadNotificationCount();
      setNotifications(notifRes.data || []);
      setUnreadCount(countRes.data?.count || 0);
    } catch (error) {
      console.error("Gagal mengambil notifikasi:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  useEffect(() => {
    setPage(1);
  }, [filter]);

  const handleRead = async (id) => {
    const notif = notifications.find((n) => n.id === id);
    if (notif?.readAt) return;
    setNotifications((prev) =>
      prev.map((n) =>
        n.id === id ? { ...n, readAt: new Date().toISOString() } : n,
      ),
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
    try {
      await markNotificationAsRead(id);
    } catch {
      await loadNotifications();
    }
  };

  const handleReadAll = async () => {
    setLoadingReadAll(true);
    setNotifications((prev) =>
      prev.map((n) => ({ ...n, readAt: n.readAt || new Date().toISOString() })),
    );
    setUnreadCount(0);
    try {
      await markAllNotificationsAsRead();
    } catch {
      await loadNotifications();
    } finally {
      setLoadingReadAll(false);
    }
  };

  const filtered = notifications.filter((n) => {
    if (filter === "unread") return !n.readAt;
    if (filter === "read") return !!n.readAt;
    return true;
  });

  const visibleItems = filtered.slice(0, page * PAGE_SIZE);
  const hasMore = visibleItems.length < filtered.length;

  // Infinite scroll sentinel
  useEffect(() => {
    const el = loadMoreRef.current;
    if (!el || !hasMore) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !loadingMore) {
          setLoadingMore(true);
          setTimeout(() => {
            setPage((p) => p + 1);
            setLoadingMore(false);
          }, 400);
        }
      },
      { threshold: 0.1 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasMore, loadingMore]);

  return (
    <div className="min-h-screen bg-base-200">
      {/* ── Sticky Header ── */}
      <div className="sticky top-0 z-10 border-b border-base-300/50 bg-base-200/80 backdrop-blur-md">
        <div className="mx-auto max-w-6xl px-4 py-4 md:px-8">
          <div className="flex items-center justify-between">
            {/* Title */}
            <div className="flex items-center gap-3">
              <div className="relative flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <FiBell size={18} />
                {unreadCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-content">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </div>
              <div>
                <h1 className="text-lg font-bold leading-tight">Notifikasi</h1>
                <p className="text-xs text-base-content/45">
                  {unreadCount > 0
                    ? `${unreadCount} belum dibaca`
                    : "Semua sudah dibaca"}
                </p>
              </div>
            </div>

            {/* Mark all */}
            {unreadCount > 0 && (
              <button
                onClick={handleReadAll}
                disabled={loadingReadAll}
                className="btn btn-ghost btn-sm gap-1.5 text-primary"
              >
                {loadingReadAll ? (
                  <span className="loading loading-spinner loading-xs" />
                ) : (
                  <FiCheckCircle size={15} />
                )}
                <span className="hidden sm:inline">Tandai semua dibaca</span>
                <span className="sm:hidden">Tandai semua</span>
              </button>
            )}
          </div>

          {/* Filter Tabs */}
          <div className="mt-3 flex items-center gap-1 rounded-xl bg-base-100 p-1 shadow-sm">
            <FiFilter
              size={13}
              className="ml-1.5 flex-shrink-0 text-base-content/35"
            />
            {FILTERS.map((f) => (
              <button
                key={f.value}
                onClick={() => setFilter(f.value)}
                className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-1.5 text-sm font-medium transition-all duration-200 ${
                  filter === f.value
                    ? "bg-primary text-primary-content shadow"
                    : "text-base-content/55 hover:text-base-content"
                }`}
              >
                {f.label}
                {f.value === "unread" && unreadCount > 0 && (
                  <span
                    className={`rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${
                      filter === "unread"
                        ? "bg-primary-content/25 text-primary-content"
                        : "bg-primary/15 text-primary"
                    }`}
                  >
                    {unreadCount}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Grid Content ── */}
      <div className="mx-auto max-w-6xl px-4 py-5 pb-16 md:px-8 md:py-6">
        {loading ? (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <NotifSkeleton key={i} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 rounded-2xl bg-base-100 py-24 text-base-content/35 shadow-sm">
            <FiInbox size={36} strokeWidth={1.5} />
            <p className="text-sm font-medium">
              {filter === "unread"
                ? "Tidak ada notifikasi yang belum dibaca"
                : filter === "read"
                  ? "Belum ada notifikasi yang sudah dibaca"
                  : "Tidak ada notifikasi"}
            </p>
          </div>
        ) : (
          <>
            {/* 1 col on mobile → 2 col on tablet → 3 col on desktop */}
            <div className="grid auto-rows-fr grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {visibleItems.map((notif) => (
                <LazyNotifCard
                  key={notif.id}
                  notif={notif}
                  onRead={handleRead}
                />
              ))}

              {/* Skeleton placeholders while loading more — fill to full row */}
              {loadingMore &&
                Array.from({ length: 3 }).map((_, i) => (
                  <NotifSkeleton key={`skel-more-${i}`} />
                ))}
            </div>

            {/* Infinite scroll sentinel */}
            {hasMore && <div ref={loadMoreRef} className="h-4" />}

            {/* Footer count */}
            {!hasMore && (
              <p className="mt-6 text-center text-xs text-base-content/30">
                Menampilkan semua {filtered.length} notifikasi
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
