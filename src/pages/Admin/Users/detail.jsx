import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getUserById } from "../../../services/Admin/usersService";
import toast from "react-hot-toast";
import { FaArrowLeft } from "react-icons/fa";

export default function UserDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const getIsDarkMode = () =>
    window.matchMedia("(prefers-color-scheme: dark)").matches;

  const [isDark, setIsDark] = useState(getIsDarkMode());

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleThemeChange = (event) => {
      setIsDark(event.matches);
    };

    setIsDark(mediaQuery.matches);
    mediaQuery.addEventListener("change", handleThemeChange);

    return () => {
      mediaQuery.removeEventListener("change", handleThemeChange);
    };
  }, []);

  function formatDateTime(date) {
    if (!date) return "-";

    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date));
  }

  useEffect(() => {
    async function fetchUserDetail() {
      try {
        setLoading(true);

        const res = await getUserById(id);

        setUser(res?.data || res);
      } catch (error) {
        toast.error(error.message || "Gagal mengambil detail user");
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchUserDetail();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="p-6" style={{ color: isDark ? "#ffffff" : "#111827" }}>
        <p>Loading detail user...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-6" style={{ color: isDark ? "#ffffff" : "#111827" }}>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="btn btn-outline btn-sm mb-4"
        >
          <FaArrowLeft />
          Kembali
        </button>

        <p>User tidak ditemukan</p>
      </div>
    );
  }

  return (
    <div className="p-6" style={{ color: isDark ? "#ffffff" : "#111827" }}>
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="btn btn-outline btn-sm mb-4"
      >
        <FaArrowLeft />
        Kembali
      </button>

      <div
        className="rounded-xl border p-5"
        style={{
          borderColor: isDark ? "#374151" : "#d1d5db",
          backgroundColor: isDark ? "#111827" : "#ffffff",
        }}
      >
        <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold">Detail User</h1>
            <p
              className="text-sm"
              style={{ color: isDark ? "#d1d5db" : "#6b7280" }}
            >
              Informasi lengkap akun user.
            </p>
          </div>

          <span
            className={`badge ${
              user.isActive ? "badge-success" : "badge-error"
            }`}
          >
            {user.isActive ? "Aktif" : "Nonaktif"}
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <DetailItem
            label="Nama Lengkap"
            value={user.fullName}
            isDark={isDark}
          />

          <DetailItem label="Username" value={user.username} isDark={isDark} />

          <DetailItem label="Email" value={user.email} isDark={isDark} />

          <DetailItem
            label="Nomor HP"
            value={user.phoneNumber}
            isDark={isDark}
          />

          <DetailItem label="Role" value={user.role} isDark={isDark} />

          <DetailItem
            label="Auth Provider"
            value={user.authProvider}
            isDark={isDark}
          />

          <DetailItem
            label="Email Verified"
            value={user.isEmailVerified ? "Verified" : "Belum verified"}
            isDark={isDark}
          />

          <DetailItem
            label="Profile Photo URL"
            value={user.profilePhotoUrl || "-"}
            isDark={isDark}
          />

          <DetailItem
            label="Dibuat"
            value={formatDateTime(user.createdAt)}
            isDark={isDark}
          />

          <DetailItem
            label="Diupdate"
            value={formatDateTime(user.updatedAt)}
            isDark={isDark}
          />
        </div>

        {user._count && (
          <div className="mt-6">
            <h2 className="mb-3 text-lg font-bold">Statistik Data User</h2>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              <StatCard
                label="Activity Logs"
                value={user._count.activityLogs}
                isDark={isDark}
              />
              <StatCard
                label="Calendar Events"
                value={user._count.calendarEvents}
                isDark={isDark}
              />
              <StatCard
                label="Mood Entries"
                value={user._count.moodEntries}
                isDark={isDark}
              />
              <StatCard
                label="Social Battery Logs"
                value={user._count.socialBatteryLogs}
                isDark={isDark}
              />
              <StatCard
                label="Encouragements"
                value={user._count.encouragements}
                isDark={isDark}
              />
              <StatCard
                label="Refresh Tokens"
                value={user._count.refreshTokens}
                isDark={isDark}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function DetailItem({ label, value, isDark }) {
  return (
    <div
      className="rounded-lg border p-4"
      style={{
        borderColor: isDark ? "#374151" : "#e5e7eb",
        backgroundColor: isDark ? "#1f2937" : "#f9fafb",
      }}
    >
      <p
        className="mb-1 text-xs font-semibold uppercase"
        style={{ color: isDark ? "#9ca3af" : "#6b7280" }}
      >
        {label}
      </p>

      <p className="break-words text-sm font-medium">{value || "-"}</p>
    </div>
  );
}

function StatCard({ label, value, isDark }) {
  return (
    <div
      className="rounded-lg border p-4"
      style={{
        borderColor: isDark ? "#374151" : "#e5e7eb",
        backgroundColor: isDark ? "#1f2937" : "#f9fafb",
      }}
    >
      <p className="text-sm" style={{ color: isDark ? "#9ca3af" : "#6b7280" }}>
        {label}
      </p>

      <p className="mt-1 text-2xl font-bold">{value ?? 0}</p>
    </div>
  );
}
