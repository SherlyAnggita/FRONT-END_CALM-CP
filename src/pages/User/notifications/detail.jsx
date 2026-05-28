import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  FiAlertCircle,
  FiArrowLeft,
  FiBattery,
  FiCheckCircle,
  FiClock,
  FiHash,
  FiRefreshCw,
  FiSend,
  FiUser,
  FiZap,
} from "react-icons/fi";
import {
  getNotificationById,
  markNotificationAsRead,
} from "../../../services/User/notificationService";

function formatDate(value) {
  if (!value) return null;

  return new Date(value).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function timeAgo(value) {
  if (!value) return "";

  const diff = Math.floor((Date.now() - new Date(value).getTime()) / 1000);

  if (diff < 60) return "Baru saja";
  if (diff < 3600) return `${Math.floor(diff / 60)} menit lalu`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} jam lalu`;
  if (diff < 604800) return `${Math.floor(diff / 86400)} hari lalu`;

  return formatDate(value);
}

const STATUS_CONFIG = {
  pending: {
    label: "Menunggu",
    icon: FiClock,
    className:
      "border-amber-400/20 bg-amber-400/10 text-amber-700 dark:text-amber-300",
  },
  sent: {
    label: "Terkirim",
    icon: FiSend,
    className:
      "border-emerald-400/20 bg-emerald-400/10 text-emerald-700 dark:text-emerald-300",
  },
  failed: {
    label: "Gagal",
    icon: FiAlertCircle,
    className:
      "border-rose-400/20 bg-rose-400/10 text-rose-700 dark:text-rose-300",
  },
  read: {
    label: "Dibaca",
    icon: FiCheckCircle,
    className: "border-sky-400/20 bg-sky-400/10 text-sky-700 dark:text-sky-300",
  },
};

function StatusBadge({ status, readAt }) {
  const key = readAt ? "read" : status || "pending";
  const config = STATUS_CONFIG[key] || STATUS_CONFIG.pending;
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-bold ${config.className}`}
    >
      <Icon className="h-3 w-3" />
      {config.label}
    </span>
  );
}

function GlassCard({ children, className = "" }) {
  return (
    <section
      className={`rounded-[1.4rem] border border-base-content/10 bg-base-100/35 shadow-sm shadow-black/5 backdrop-blur-xl dark:bg-base-100/5 ${className}`}
    >
      {children}
    </section>
  );
}

function InfoItem({ icon: Icon, label, value, mono = false, accent = "" }) {
  return (
    <div className="rounded-xl border border-base-content/10 bg-base-100/25 p-2 backdrop-blur-md dark:bg-white/[0.03] sm:rounded-2xl sm:p-3.5">
      <div className="mb-1 flex items-center gap-1 text-[8px] font-bold uppercase tracking-[0.12em] text-base-content/45 sm:text-[10px]">
        <Icon className="h-3.5 w-3.5 text-primary" />
        {label}
      </div>
     <p
        className={`truncate text-[9px] font-semibold text-base-content/80 sm:text-sm ${mono ? "font-mono text-xs" : ""} ${accent}`}
        title={value || "—"}
      >
        {value || "—"}
      </p>
    </div>
  );
}

function SectionTitle({ children }) {
  return (
    <p className="mb-3 text-[11px] font-black uppercase tracking-[0.22em] text-base-content/45">
      {children}
    </p>
  );
}

function SkeletonView() {
  return (
    <div className="mx-auto w-full max-w-6xl animate-pulse px-4 py-4 sm:px-6 lg:px-8">
      <div className="mb-4 flex items-center gap-3">
        <div className="skeleton h-11 w-11 rounded-2xl" />
        <div className="min-w-0 flex-1 space-y-2">
          <div className="skeleton h-4 w-48 rounded-full" />
          <div className="skeleton h-3 w-28 rounded-full" />
        </div>
      </div>
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.65fr)]">
        <div className="skeleton min-h-[360px] rounded-[1.4rem]" />
        <div className="space-y-4">
          <div className="skeleton h-44 rounded-[1.4rem]" />
          <div className="skeleton h-36 rounded-[1.4rem]" />
          <div className="skeleton h-36 rounded-[1.4rem]" />
        </div>
      </div>
    </div>
  );
}

function EmptyState({ onBack }) {
  return (
    <div className="flex min-h-[calc(100dvh-76px)] items-center justify-center px-4 py-10">
      <GlassCard className="w-full max-w-md p-7 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl border border-rose-400/20 bg-rose-400/10 text-rose-500">
          <FiAlertCircle className="h-8 w-8" />
        </div>
        <h2 className="text-lg font-black text-base-content">
          Notifikasi tidak ditemukan
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-base-content/55">
          Mungkin notifikasi sudah dihapus atau ID yang dibuka tidak valid.
        </p>
        <button
          onClick={onBack}
          className="btn btn-primary btn-sm mt-6 rounded-full px-6"
        >
          Kembali
        </button>
      </GlassCard>
    </div>
  );
}

export default function NotificationDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [notif, setNotif] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function loadNotification() {
      try {
        setLoading(true);
        setError(false);

        const response = await getNotificationById(id);
        const data = response?.data;

        if (!mounted) return;
        setNotif(data);

        if (data && !data.readAt) {
          try {
            await markNotificationAsRead(id);
            if (mounted) {
              setNotif((current) => ({
                ...current,
                readAt: new Date().toISOString(),
              }));
            }
          } catch {
            // Tidak perlu mengganggu user kalau update read status gagal.
          }
        }
      } catch {
        if (mounted) setError(true);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadNotification();

    return () => {
      mounted = false;
    };
  }, [id]);

  const typeLabel = useMemo(() => {
    return notif?.type?.replace(/_/g, " ") || "Notifikasi";
  }, [notif?.type]);

  return (
    <main className="h-[calc(100dvh-80px)] overflow-hidden bg-transparent text-base-content">
      <header className="shrink-0 border-b border-base-content/10 bg-base-100/10 backdrop-blur-xl dark:bg-black/5">
        <div className="mx-auto flex max-w-5xl items-center gap-3 px-4 py-3 sm:px-6">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="btn btn-ghost btn-square btn-sm rounded-2xl border border-base-content/10 bg-base-100/25 backdrop-blur-md"
            aria-label="Kembali"
          >
            <FiArrowLeft className="h-4 w-4" />
          </button>

          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-base-content/40">
              Detail Notifikasi
            </p>
            {/* <h1 className="truncate text-sm font-black sm:text-base">
              {loading
                ? "Memuat notifikasi..."
                : error
                  ? "Tidak ditemukan"
                  : notif?.title}
            </h1> */}
          </div>

          {notif && <StatusBadge status={notif.status} readAt={notif.readAt} />}
        </div>
      </header>

      {loading && <SkeletonView />}

      {!loading && error && <EmptyState onBack={() => navigate(-1)} />}

      {!loading && !error && notif && (
        <div className="mx-auto box-border w-full max-w-5xl overflow-hidden px-4 py-4 sm:px-6 sm:py-5">
          <GlassCard className="h-full overflow-hidden border-0 bg-transparent p-0 shadow-none lg:border lg:bg-base-100/35 lg:p-5 lg:shadow-sm">
            <div className="grid h-full gap-4 lg:grid-cols-[minmax(0,1fr)_300px]">
              <section className="min-w-0 overflow-hidden rounded-[1.25rem] border border-base-content/10 bg-base-100/25 p-4 backdrop-blur-md dark:bg-white/[0.03]">
                <div className="mb-4 flex flex-wrap items-center gap-2">
                  <span className="badge badge-primary badge-outline border-primary/30 bg-primary/10 px-3 py-3 text-[10px] font-black uppercase tracking-wide">
                    {typeLabel}
                  </span>
                  {notif.channel && (
                    <span className="badge border-base-content/10 bg-base-100/30 px-3 py-3 text-[10px] font-bold text-base-content/55 dark:bg-white/[0.04]">
                      {notif.channel}
                    </span>
                  )}
                </div>

                <h2 className="text-[15px] font-black leading-tight tracking-tight text-base-content sm:text-3xl">
                  {notif.title}
                </h2>

                <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px] font-medium text-base-content/50">
                  <FiClock className="h-3.5 w-3.5" />
                  <span>{timeAgo(notif.createdAt)}</span>
                  <span className="text-base-content/25">•</span>
                  <span>{formatDate(notif.createdAt)}</span>
                </div>

                <div className="divider my-1 before:bg-base-content/10 after:bg-base-content/10" />

                <SectionTitle>Pesan</SectionTitle>
                <div className="max-h-[130px] overflow-y-auto rounded-2xl border border-base-content/10 bg-base-100/35 p-3 backdrop-blur-md dark:bg-white/[0.04] sm:max-h-[190px] sm:rounded-3xl sm:p-5">
                  <p className="whitespace-pre-wrap text-[10px] leading-5 text-base-content/75 sm:text-base">
                    {notif.message || "Tidak ada pesan."}
                  </p>
                </div>

                <div className="mt-4 lg:hidden">
                  <SectionTitle>Status</SectionTitle>

                  <div className="grid grid-cols-2 gap-2">
                    <InfoItem icon={FiSend} label="Dikirim" value={formatDate(notif.sentAt)} />

                    <InfoItem
                      icon={FiCheckCircle}
                      label="Dibaca"
                      value={notif.readAt ? formatDate(notif.readAt) : "Belum dibaca"}
                      accent={!notif.readAt ? "text-amber-600 dark:text-amber-300" : ""}
                    />

                    <InfoItem icon={FiClock} label="Dibuat" value={formatDate(notif.createdAt)} />

                    <InfoItem icon={FiRefreshCw} label="Diperbarui" value={formatDate(notif.updatedAt)} />
                  </div>
                </div>

                {notif.error && (
                  <div className="mt-4 rounded-3xl border border-rose-400/15 bg-rose-400/10 p-4 text-rose-600 dark:text-rose-300">
                    <p className="mb-2 text-[10px] font-black uppercase tracking-[0.22em] opacity-70">
                      Log Error
                    </p>
                    <p className="break-words font-mono text-xs leading-6">
                      {notif.error}
                    </p>
                  </div>
                )}
              </section>

              <aside className="hidden rounded-[1.25rem] border border-base-content/10 bg-base-100/25 p-4 backdrop-blur-md dark:bg-white/[0.03] lg:block">
                <SectionTitle>Status</SectionTitle>
                <div className="grid grid-cols-2 gap-3 lg:grid-cols-1">
                  <InfoItem
                    icon={FiSend}
                    label="Dikirim"
                    value={formatDate(notif.sentAt)}
                  />
                  <InfoItem
                    icon={FiCheckCircle}
                    label="Dibaca"
                    value={
                      notif.readAt ? formatDate(notif.readAt) : "Belum dibaca"
                    }
                    accent={
                      !notif.readAt ? "text-amber-600 dark:text-amber-300" : ""
                    }
                  />
                  <InfoItem
                    icon={FiClock}
                    label="Dibuat"
                    value={formatDate(notif.createdAt)}
                  />
                  <InfoItem
                    icon={FiRefreshCw}
                    label="Diperbarui"
                    value={formatDate(notif.updatedAt)}
                  />
                </div>
              </aside>
            </div>
          </GlassCard>
        </div>
      )}
    </main>
  );
}