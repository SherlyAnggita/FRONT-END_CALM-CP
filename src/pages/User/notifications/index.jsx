import { useEffect, useState, useCallback, useRef } from "react";
import { FiBell, FiCheck, FiCheckCircle, FiInbox } from "react-icons/fi";
import {
  getNotifications,
  getUnreadNotificationCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "../../../services/User/notificationService";
import { useNavigate } from "react-router-dom";

const FILTERS = [
  { label: "Semua", value: "all" },
  { label: "Belum Dibaca", value: "unread" },
  { label: "Sudah Dibaca", value: "read" },
];

const PAGE_SIZE = 12;

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

// ─── Skeleton ────────────────────────────────────────────────────────────────
function NotifSkeleton() {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-4 dark:border-white/[0.07] dark:bg-white/[0.04]">
      <div className="flex items-center justify-between">
        <div className="skeleton h-2 w-2 rounded-full" />
        <div className="skeleton h-3 w-16 rounded-md" />
      </div>
      <div className="skeleton h-4 w-3/5 rounded-md" />
      <div className="space-y-1.5">
        <div className="skeleton h-3 w-full rounded-md" />
        <div className="skeleton h-3 w-4/5 rounded-md" />
      </div>
    </div>
  );
}

// ─── Notification Card ────────────────────────────────────────────────────────
function NotifCard({ notif, onRead, style }) {
  const isUnread = !notif.readAt;

  return (
    <div
      onClick={() => onRead(notif.id)}
      style={style}
      className={`group relative flex cursor-pointer flex-col gap-2.5 rounded-2xl border p-4 transition-all duration-200
        hover:-translate-y-[2px] hover:shadow-lg active:scale-[0.985] backdrop-blur-sm
        ${
          isUnread
            ? "border-primary/30 bg-primary/10 dark:border-primary/25 dark:bg-primary/[0.12]"
            : "border-white/10 bg-white/5 hover:bg-white/10 dark:border-white/[0.07] dark:bg-white/[0.04] dark:hover:bg-white/[0.07]"
        }`}
    >
      {/* Top row */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {isUnread ? (
            <span className="h-2 w-2 flex-shrink-0 rounded-full bg-primary shadow-[0_0_6px_rgba(var(--p),0.6)]" />
          ) : (
            <span className="h-2 w-2 flex-shrink-0 rounded-full bg-base-content/20" />
          )}
          <span
            className={`text-[11px] font-medium uppercase tracking-wide ${
              isUnread ? "text-primary/70" : "text-black dark:text-white/40"
            }`}
          >
            {notif.type?.replace(/_/g, " ") || "Notifikasi"}
          </span>
        </div>
        <span className="text-[11px] tabular-nums text-[#111]/40 dark:text-white/40">
          {timeAgo(notif.createdAt)}
        </span>
      </div>

      {/* Title */}
      <p
        className={`line-clamp-2 text-[13px] font-semibold leading-snug ${
          isUnread
            ? "text-[#111] dark:text-white"
            : "text-[#111]/60 dark:text-white/55"
        }`}
      >
        {notif.title}
      </p>

      {/* Message */}
      <p className="line-clamp-3 flex-1 text-xs leading-relaxed text-[#111]/60 dark:text-white/50">
        {notif.message}
      </p>

      {/* Hover CTA — only for unread */}
      {isUnread && (
        <div className="flex items-center gap-1.5 pt-0.5 opacity-0 transition-opacity duration-150 group-hover:opacity-100">
          <FiCheck size={11} className="text-primary" />
          <span className="text-[11px] font-medium text-primary">
            Tandai dibaca
          </span>
        </div>
      )}
    </div>
  );
}

// ─── Lazy reveal wrapper ──────────────────────────────────────────────────────
function LazyNotifCard({ notif, onRead, index }) {
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
    <div ref={ref}>
      <NotifCard
        notif={notif}
        onRead={onRead}
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(12px)",
          transition: `opacity 0.3s ease ${(index % PAGE_SIZE) * 30}ms, transform 0.3s ease ${(index % PAGE_SIZE) * 30}ms`,
        }}
      />
    </div>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────
function EmptyState({ filter }) {
  const messages = {
    unread: {
      title: "Semua sudah dibaca",
      sub: "Tidak ada notifikasi baru saat ini.",
    },
    read: {
      title: "Belum ada riwayat",
      sub: "Notifikasi yang sudah dibaca akan muncul di sini.",
    },
    all: { title: "Kotak masuk kosong", sub: "Belum ada notifikasi untukmu." },
  };
  const { title, sub } = messages[filter] || messages.all;

  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm py-16 sm:py-20 dark:border-white/[0.07] dark:bg-white/[0.04]">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-[#111]/40 dark:text-white/30 dark:bg-white/[0.06]">
        <FiInbox size={24} strokeWidth={1.5} />
      </div>
      <div className="text-center px-4">
        <p className="text-sm font-semibold text-[#111]/60 dark:text-white/50">
          {title}
        </p>
        <p className="mt-1 text-xs text-[#111]/40 dark:text-white/40">{sub}</p>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function NotificationsPage() {
  const navigate = useNavigate();
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
      const [notifRes, countRes] = await Promise.all([
        getNotifications(),
        getUnreadNotificationCount(),
      ]);
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

    if (!notif?.readAt) {
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
    }

    navigate(`/user/notifications/${id}`);
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

  // Infinite scroll
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
          }, 350);
        }
      },
      { threshold: 0.1 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasMore, loadingMore]);

  return (
    // ✅ Tidak ada bg apapun — 100% transparan, ikut background parent
    <div className="min-h-screen">
      {/* ── Sticky Header ── */}
      {/* ✅ bg-transparent + backdrop-blur supaya blur tapi tidak nambah warna gelap */}
      <div className="sticky top-0 z-20 border-b border-white/10 bg-transparent backdrop-blur-xl dark:border-white/[0.06]">
        <div className="mx-auto max-w-5xl px-4 pb-3 pt-4 sm:px-6 md:px-8">
          {/* Title row */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 sm:gap-3">
              <div className="relative flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary dark:bg-primary/15 sm:h-9 sm:w-9">
                <FiBell size={15} className="sm:hidden" />
                <FiBell size={17} className="hidden sm:block" />
                {unreadCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-[17px] w-[17px] items-center justify-center rounded-full bg-primary text-[9px] font-bold text-primary-content shadow sm:h-[18px] sm:w-[18px] sm:text-[10px]">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </div>
              <div>
                <h1 className="text-sm font-bold leading-tight text-[#111] dark:text-white sm:text-base">
                  Notifikasi
                </h1>
                <p className="text-[10px] text-[#111] dark:text-white/60 sm:text-[11px]">
                  {unreadCount > 0
                    ? `${unreadCount} belum dibaca`
                    : "Semua sudah dibaca"}
                </p>
              </div>
            </div>

            {unreadCount > 0 && (
              <button
                onClick={handleReadAll}
                disabled={loadingReadAll}
                className="flex items-center gap-1.5 rounded-xl border border-primary/20 bg-primary/10 px-2.5 py-1.5 text-xs font-semibold text-primary transition-all duration-150 hover:bg-primary/20 active:scale-95 disabled:opacity-60 dark:border-primary/25 dark:bg-primary/10 sm:px-3"
              >
                {loadingReadAll ? (
                  <span className="loading loading-spinner loading-xs" />
                ) : (
                  <FiCheckCircle size={13} />
                )}
                <span className="hidden sm:inline">Tandai semua dibaca</span>
                <span className="sm:hidden">Semua dibaca</span>
              </button>
            )}
          </div>

          {/* Filter tabs */}
          {/* ✅ bg-white/10 bukan bg-base-100 — netral di light & dark */}
          <div className="mt-3 flex gap-1 rounded-xl bg-white/10 p-1 backdrop-blur-sm dark:bg-white/[0.06]">
            {FILTERS.map((f) => (
              <button
                key={f.value}
                onClick={() => setFilter(f.value)}
                className={`relative flex flex-1 items-center justify-center gap-1.5 rounded-lg py-1.5 text-[11px] font-semibold transition-all duration-200 sm:py-2 sm:text-xs ${
                  filter === f.value
                    ? "bg-primary text-primary-content shadow-sm"
                    : "text-[#111]/60 dark:text-white/50 hover:text-[#111] dark:hover:text-white"
                }`}
              >
                {f.label}
                {f.value === "unread" && unreadCount > 0 && (
                  <span
                    className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold leading-none ${
                      filter === "unread"
                        ? "bg-primary-content/20 text-primary-content"
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

      {/* ── Content ── */}
      <div className="mx-auto max-w-5xl px-4 py-4 pb-20 sm:px-6 sm:py-5 md:px-8 md:py-6">
        {loading ? (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <NotifSkeleton key={i} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState filter={filter} />
        ) : (
          <>
            {/* Stats bar */}
            <div className="mb-3 flex items-center justify-between sm:mb-4">
              <p className="text-[11px] text-[#111] dark:text-white/40 sm:text-xs">
                {filtered.length} notifikasi
                {filter !== "all" && (
                  <span className="ml-1">
                    · {filter === "unread" ? "belum dibaca" : "sudah dibaca"}
                  </span>
                )}
              </p>
              {filtered.length > PAGE_SIZE && (
                <p className="text-[11px] text-[#111]/40 dark:text-white/30 sm:text-xs">
                  {Math.min(visibleItems.length, filtered.length)} /{" "}
                  {filtered.length}
                </p>
              )}
            </div>

            {/* Grid — 1 col HP, 2 col tablet, 3 col desktop */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {visibleItems.map((notif, i) => (
                <LazyNotifCard
                  key={notif.id}
                  notif={notif}
                  onRead={handleRead}
                  index={i}
                />
              ))}

              {loadingMore &&
                Array.from({ length: 3 }).map((_, i) => (
                  <NotifSkeleton key={`skel-${i}`} />
                ))}
            </div>

            {/* Infinite scroll sentinel */}
            {hasMore && <div ref={loadMoreRef} className="h-6" />}

            {/* End of list */}
            {!hasMore && filtered.length > PAGE_SIZE && (
              <div className="mt-6 flex items-center gap-3 sm:mt-8">
                <div className="h-px flex-1 bg-white/10 dark:bg-white/[0.06]" />
                <p className="text-[11px] text-[#111]/40 dark:text-white/30">
                  Semua {filtered.length} notifikasi ditampilkan
                </p>
                <div className="h-px flex-1 bg-white/10 dark:bg-white/[0.06]" />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
