import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  FiArrowLeft,
  FiUser,
  FiMail,
  FiAtSign,
  FiHeart,
  FiActivity,
  FiAlertCircle,
  FiCalendar,
  FiClock,
  FiCpu,
  FiMessageCircle,
  FiCheckCircle,
} from "react-icons/fi";
import { getMoodEntryDetail } from "../../../services/Admin/moodEntryService";

export default function MoodEntryDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [moodEntry, setMoodEntry] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchDetail = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getMoodEntryDetail(id);
      setMoodEntry(response.data);
    } catch (error) {
      console.error("Gagal mengambil detail mood entry:", error);
      alert("Gagal mengambil detail mood entry");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleString("id-ID", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  const getStatusBadge = (status) => {
    if (status === "success") return "badge-success";
    if (status === "failed") return "badge-error";
    return "badge-warning";
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center p-6">
        <div className="flex flex-col items-center gap-3">
          <span className="loading loading-spinner loading-lg text-primary" />
          <p className="text-sm opacity-70">Memuat detail mood entry...</p>
        </div>
      </div>
    );
  }

  if (!moodEntry) {
    return (
      <div className="p-6">
        <div className="alert alert-warning">
          <FiAlertCircle />
          <span>Data mood entry tidak ditemukan.</span>
        </div>

        <button onClick={() => navigate(-1)} className="btn btn-primary mt-4">
          <FiArrowLeft />
          Kembali
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 text-base-content">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <button onClick={() => navigate(-1)} className="btn btn-ghost mb-3">
            <FiArrowLeft />
            Kembali
          </button>

          <h1 className="text-2xl font-bold">Detail Mood Entry</h1>
          <p className="text-sm opacity-70">
            Informasi lengkap mood entry user beserta hasil encouragement AI.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <span
            className={`badge badge-lg ${getStatusBadge(moodEntry.analysisStatus)}`}
          >
            {moodEntry.analysisStatus}
          </span>

          <span className="badge badge-outline badge-lg">
            {moodEntry.moodLabel?.emoji} {moodEntry.moodLabel?.name || "-"}
          </span>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <div className="card bg-base-100 shadow">
          <div className="card-body">
            <div className="mb-2 flex items-center gap-2">
              <div className="rounded-box bg-primary/10 p-2 text-primary">
                <FiUser size={20} />
              </div>
              <h2 className="card-title text-lg">User</h2>
            </div>

            <div className="space-y-3 text-sm">
              <InfoRow
                icon={<FiUser />}
                label="Nama"
                value={moodEntry.user?.fullName || "-"}
              />
              <InfoRow
                icon={<FiAtSign />}
                label="Username"
                value={
                  moodEntry.user?.username ? `@${moodEntry.user.username}` : "-"
                }
              />
              <InfoRow
                icon={<FiMail />}
                label="Email"
                value={moodEntry.user?.email || "-"}
              />
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow">
          <div className="card-body">
            <div className="mb-2 flex items-center gap-2">
              <div className="rounded-box bg-secondary/10 p-2 text-secondary">
                <FiHeart size={20} />
              </div>
              <h2 className="card-title text-lg">Mood</h2>
            </div>

            <div className="space-y-3 text-sm">
              <InfoRow
                icon={<FiHeart />}
                label="Label"
                value={`${moodEntry.moodLabel?.emoji || ""} ${
                  moodEntry.moodLabel?.name || "-"
                }`}
              />
              <InfoRow
                icon={<FiActivity />}
                label="Mood Score"
                value={moodEntry.moodScore ?? "-"}
              />
              <InfoRow
                icon={<FiCheckCircle />}
                label="Analysis Status"
                value={
                  <span
                    className={`badge ${getStatusBadge(moodEntry.analysisStatus)}`}
                  >
                    {moodEntry.analysisStatus}
                  </span>
                }
              />
              <InfoRow
                icon={<FiAlertCircle />}
                label="Analysis Error"
                value={moodEntry.analysisError || "-"}
              />
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow">
          <div className="card-body">
            <div className="mb-2 flex items-center gap-2">
              <div className="rounded-box bg-accent/10 p-2 text-accent">
                <FiCalendar size={20} />
              </div>
              <h2 className="card-title text-lg">Tanggal</h2>
            </div>

            <div className="space-y-3 text-sm">
              <InfoRow
                icon={<FiCalendar />}
                label="Entry Date"
                value={formatDate(moodEntry.entryDate)}
              />
              <InfoRow
                icon={<FiClock />}
                label="Created At"
                value={formatDate(moodEntry.createdAt)}
              />
              <InfoRow
                icon={<FiClock />}
                label="Updated At"
                value={formatDate(moodEntry.updatedAt)}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="card bg-base-100 shadow">
        <div className="card-body">
          <div className="mb-2 flex items-center gap-2">
            <div className="rounded-box bg-info/10 p-2 text-info">
              <FiMessageCircle size={20} />
            </div>
            <h2 className="card-title text-lg">Feeling Text</h2>
          </div>

          <div className="rounded-box bg-base-200 p-4 leading-relaxed">
            {moodEntry.feelingText || "-"}
          </div>
        </div>
      </div>

      <div className="card bg-base-100 shadow">
        <div className="card-body">
          <div className="mb-2 flex items-center gap-2">
            <div className="rounded-box bg-success/10 p-2 text-success">
              <FiCpu size={20} />
            </div>
            <h2 className="card-title text-lg">Encouragement AI</h2>
          </div>

          {moodEntry.encouragementResult ? (
            <div className="space-y-4">
              <div className="stats stats-vertical bg-base-200 shadow-sm lg:stats-horizontal">
                <div className="stat">
                  <div className="stat-title">Predicted Label</div>
                  <div className="stat-value text-lg">
                    {moodEntry.encouragementResult.predictedLabel || "-"}
                  </div>
                </div>

                <div className="stat">
                  <div className="stat-title">Confidence</div>
                  <div className="stat-value text-lg">
                    {moodEntry.encouragementResult.confidenceScore ?? "-"}
                  </div>
                </div>

                <div className="stat">
                  <div className="stat-title">Model</div>
                  <div className="stat-value text-lg">
                    {moodEntry.encouragementResult.modelName || "-"}
                  </div>
                </div>
              </div>

              <div>
                <p className="mb-2 text-sm font-semibold opacity-70">
                  Support Message
                </p>
                <div className="rounded-box bg-base-200 p-4 leading-relaxed">
                  {moodEntry.encouragementResult.supportMessage || "-"}
                </div>
              </div>
            </div>
          ) : (
            <div className="alert alert-info">
              <FiCpu />
              <span>Belum ada hasil AI untuk mood entry ini.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function InfoRow({ icon, label, value }) {
  return (
    <div className="flex items-start gap-3 rounded-box bg-base-200 p-3">
      <span className="mt-0.5 opacity-70">{icon}</span>
      <div>
        <p className="text-xs font-medium uppercase tracking-wide opacity-60">
          {label}
        </p>
        <div className="mt-1 break-words">{value}</div>
      </div>
    </div>
  );
}
