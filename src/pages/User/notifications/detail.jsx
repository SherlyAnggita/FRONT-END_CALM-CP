import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FiArrowLeft,
  FiBell,
  FiClock,
  FiTag,
  FiCheckCircle,
} from "react-icons/fi";
import {
  getNotificationById,
  markNotificationAsRead,
} from "../../../services/User/notificationService";

function formatFullDate(dateString) {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ─── Skeleton ────────────────────────────────────────────────────────────────
function DetailSkeleton() {
  return (
    <div className="mx-auto max-w-2xl">
      <div className="rounded-2xl border border-base-200 bg-base-100 p-6 dark:border-white/[0.06]">
        <div className="mb-6 flex items-center gap-3">
          <div className="skeleton h-10 w-10 rounded-xl" />
          <div className="flex-1 space-y-2">
            <div className="skeleton h-4 w-2/3 rounded-md" />
            <div className="skeleton h-3 w-1/3 rounded-md" />
          </div>
        </div>
        <div className="space-y-3">
          <div className="skeleton h-3 w-full rounded-md" />
          <div className="skeleton h-3 w-full rounded-md" />
          <div className="skeleton h-3 w-4/5 rounded-md" />
          <div className="skeleton h-3 w-3/5 rounded-md" />
        </div>
      </div>
    </div>
  );
}

export default function NotificationDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [notif, setNotif] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    async function fetchDetail() {
      try {
        setLoading(true);
        // Ambil notifikasi berdasarkan ID
        const res = await getNotificationById(id);
        const found = res.data;

        if (!found) {
          setNotFound(true);
          return;
        }

        setNotif(found);

        // Auto mark as read kalau belum dibaca
        if (!found.readAt) {
          await markNotificationAsRead(id);
          setNotif((prev) => ({ ...prev, readAt: new Date().toISOString() }));
        }
      } catch (error) {
        console.error("Gagal mengambil detail notifikasi:", error);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    }

    fetchDetail();
  }, [id]);

  return (
    <div className="min-h-screen bg-base-200 dark:bg-[#0f172a]">
      {/* ── Header ── */}
      <div className="sticky top-0 z-20 border-b border-base-300/60 bg-base-200/90 backdrop-blur-lg dark:border-white/[0.06] dark:bg-[#0f172a]/90">
        <div className="mx-auto max-w-2xl px-4 py-3 md:px-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl border border-base-300 bg-base-100 text-base-content/60 transition-all duration-150 hover:border-base-400 hover:text-base-content active:scale-95 dark:border-white/[0.08] dark:bg-base-content/5 dark:hover:border-white/20"
            >
              <FiArrowLeft size={16} />
            </button>
            <div>
              <h1 className="text-sm font-bold leading-tight text-base-content">
                Detail Notifikasi
              </h1>
              <p className="text-[11px] text-base-content/40">
                Kembali ke daftar notifikasi
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="mx-auto max-w-2xl px-4 py-6 pb-20 md:px-8">
        {loading ? (
          <DetailSkeleton />
        ) : notFound ? (
          /* ── Not Found ── */
          <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-base-200 bg-base-100 py-24 dark:border-white/[0.06]">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-base-200 text-base-content/30 dark:bg-base-content/5">
              <FiBell size={24} strokeWidth={1.5} />
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-base-content/50">
                Notifikasi tidak ditemukan
              </p>
              <p className="mt-1 text-xs text-base-content/35">
                Notifikasi ini mungkin sudah dihapus atau tidak tersedia.
              </p>
            </div>
            <button
              onClick={() => navigate("/user/notifications")}
              className="mt-2 rounded-xl bg-primary px-5 py-2 text-xs font-semibold text-primary-content transition-all hover:opacity-90 active:scale-95"
            >
              Kembali ke Notifikasi
            </button>
          </div>
        ) : (
          /* ── Detail Card ── */
          <div
            style={{
              animation: "fadeUp 0.25s ease-out both",
            }}
            className="rounded-2xl border border-base-200 bg-base-100 shadow-sm dark:border-white/[0.06] dark:bg-[#1e293b]"
          >
            {/* Card header */}
            <div className="flex items-start gap-4 border-b border-base-200 p-5 dark:border-white/[0.06]">
              <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary dark:bg-primary/15">
                <FiBell size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <h2 className="text-sm font-bold leading-snug text-base-content">
                    {notif.title}
                  </h2>
                  {notif.readAt && (
                    <span className="flex flex-shrink-0 items-center gap-1 rounded-full bg-base-200 px-2 py-0.5 text-[10px] font-semibold text-base-content/40 dark:bg-base-content/10">
                      <FiCheckCircle size={10} />
                      Dibaca
                    </span>
                  )}
                </div>
                <p className="mt-0.5 text-[11px] font-medium uppercase tracking-wide text-primary/60">
                  {notif.type?.replace(/_/g, " ") || "Notifikasi"}
                </p>
              </div>
            </div>

            {/* Message body */}
            <div className="p-5">
              <p className="text-sm leading-relaxed text-base-content/75 whitespace-pre-line">
                {notif.message}
              </p>
            </div>

            {/* Metadata footer */}
            <div className="space-y-2.5 border-t border-base-200 px-5 py-4 dark:border-white/[0.06]">
              <MetaRow
                icon={<FiClock size={13} />}
                label="Dikirim"
                value={formatFullDate(notif.createdAt)}
              />
              {notif.readAt && (
                <MetaRow
                  icon={<FiCheckCircle size={13} />}
                  label="Dibaca"
                  value={formatFullDate(notif.readAt)}
                />
              )}
              <MetaRow
                icon={<FiTag size={13} />}
                label="Tipe"
                value={notif.type?.replace(/_/g, " ") || "-"}
              />
              <MetaRow
                icon={<FiBell size={13} />}
                label="Channel"
                value={notif.channel || "in_app"}
              />
            </div>

            {/* Action */}
            <div className="px-5 pb-5">
              <button
                onClick={() => navigate("/user/notifications")}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-base-300 bg-base-200 py-2.5 text-xs font-semibold text-base-content/60 transition-all duration-150 hover:bg-base-300 hover:text-base-content active:scale-[0.98] dark:border-white/[0.08] dark:bg-base-content/5 dark:hover:bg-base-content/10"
              >
                <FiArrowLeft size={13} />
                Kembali ke Notifikasi
              </button>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

// ─── Meta row helper ──────────────────────────────────────────────────────────
function MetaRow({ icon, label, value }) {
  return (
    <div className="flex items-start gap-2.5">
      <span className="mt-0.5 flex-shrink-0 text-base-content/30">{icon}</span>
      <span className="w-16 flex-shrink-0 text-[11px] font-semibold text-base-content/35">
        {label}
      </span>
      <span className="text-[11px] text-base-content/60 leading-relaxed">
        {value}
      </span>
    </div>
  );
}
