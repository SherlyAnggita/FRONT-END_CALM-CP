import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  FiArrowLeft,
  FiUser,
  FiCalendar,
  FiCpu,
  FiMessageCircle,
} from "react-icons/fi";
import { getEncouragementResultDetail } from "../../../services/Admin/encouragementService";

export default function EncouragementResultDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchDetail = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getEncouragementResultDetail(id);
      setData(response.data);
    } catch (error) {
      console.error("Gagal mengambil detail encouragement result:", error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  const formatDate = (value) =>
    value ? new Date(value).toLocaleString("id-ID") : "-";

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="card bg-base-100 shadow">
        <div className="card-body items-center text-center">
          <h2 className="card-title">Data tidak ditemukan</h2>
          <button
            onClick={() => navigate("/admin/encouragement-results")}
            className="btn btn-primary"
          >
            Kembali
          </button>
        </div>
      </div>
    );
  }

  const mood = data.moodEntry?.moodLabel;

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-gradient-to-r from-primary/15 via-secondary/10 to-accent/15 p-5 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <span className="badge badge-primary badge-outline">
                Encouragement Detail
              </span>
              <span className="badge badge-ghost">
                {data.modelName || "Unknown Model"}
              </span>
            </div>

            <h1 className="text-2xl font-bold md:text-3xl">
              Detail Encouragement Result
            </h1>
            <p className="mt-1 text-sm text-base-content/70">
              Detail hasil AI encouragement dari mood entry user.
            </p>
          </div>

          <button
            onClick={() => navigate("/admin/encouragement-results")}
            className="btn btn-outline"
          >
            <FiArrowLeft size={16} />
            Kembali
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="stats bg-base-100 shadow">
          <div className="stat">
            <div className="stat-title">Predicted Label</div>
            <div className="stat-value text-xl">
              {data.predictedLabel || "-"}
            </div>
            <div className="stat-desc">Hasil klasifikasi AI</div>
          </div>
        </div>

        <div className="stats bg-base-100 shadow">
          <div className="stat">
            <div className="stat-title">Confidence Score</div>
            <div className="stat-value text-xl">
              {data.confidenceScore ?? "-"}
            </div>
            <div className="stat-desc">Tingkat keyakinan model</div>
          </div>
        </div>

        <div className="stats bg-base-100 shadow">
          <div className="stat">
            <div className="stat-title">Created At</div>
            <div className="stat-value text-sm">
              {formatDate(data.createdAt)}
            </div>
            <div className="stat-desc">Waktu hasil dibuat</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="card border border-base-300 bg-base-100 shadow-sm">
          <div className="card-body">
            <div className="mb-3 flex items-center gap-3">
              <div className="rounded-xl bg-primary/10 p-3 text-primary">
                <FiUser size={22} />
              </div>
              <div>
                <h2 className="card-title">User Information</h2>
                <p className="text-sm text-base-content/60">
                  Pemilik mood entry
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <InfoRow label="Nama" value={data.user?.fullName || "-"} />
              <InfoRow label="Username" value={data.user?.username || "-"} />
              <InfoRow label="Email" value={data.user?.email || "-"} />
            </div>
          </div>
        </div>

        <div className="card border border-base-300 bg-base-100 shadow-sm">
          <div className="card-body">
            <div className="mb-3 flex items-center gap-3">
              <div className="rounded-xl bg-secondary/10 p-3 text-secondary">
                <FiCalendar size={22} />
              </div>
              <div>
                <h2 className="card-title">Mood Entry</h2>
                <p className="text-sm text-base-content/60">
                  Data mood yang dianalisis
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <InfoRow
                label="Mood"
                value={`${mood?.emoji || ""} ${mood?.name || "-"}`}
              />
              <InfoRow
                label="Mood Score"
                value={data.moodEntry?.moodScore ?? "-"}
              />
              <InfoRow
                label="Analysis Status"
                value={
                  <span className="badge badge-success badge-outline">
                    {data.moodEntry?.analysisStatus || "-"}
                  </span>
                }
              />
              <InfoRow
                label="Entry Date"
                value={formatDate(data.moodEntry?.entryDate)}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="card border border-base-300 bg-base-100 shadow-sm">
        <div className="card-body">
          <div className="mb-3 flex items-center gap-3">
            <div className="rounded-xl bg-accent/10 p-3 text-accent">
              <FiMessageCircle size={22} />
            </div>
            <div>
              <h2 className="card-title">Feeling Text</h2>
              <p className="text-sm text-base-content/60">
                Isi curhatan atau mood entry user
              </p>
            </div>
          </div>

          <div className="rounded-2xl bg-base-200/70 p-4 leading-relaxed">
            <p className="whitespace-pre-line">
              {data.moodEntry?.feelingText || "-"}
            </p>
          </div>
        </div>
      </div>

      <div className="card border border-base-300 bg-base-100 shadow-sm">
        <div className="card-body">
          <div className="mb-3 flex items-center gap-3">
            <div className="rounded-xl bg-info/10 p-3 text-info">
              <FiCpu size={22} />
            </div>
            <div>
              <h2 className="card-title">AI Encouragement Result</h2>
              <p className="text-sm text-base-content/60">
                Hasil respons encouragement dari model AI
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <InfoBox
              label="Predicted Label"
              value={data.predictedLabel || "-"}
            />
            <InfoBox
              label="Confidence Score"
              value={data.confidenceScore ?? "-"}
            />
            <InfoBox label="Model Name" value={data.modelName || "-"} />
          </div>

          <div className="mt-5">
            <p className="mb-2 font-semibold">Support Message</p>
            <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5">
              <p className="whitespace-pre-line leading-relaxed">
                {data.supportMessage || "-"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="flex flex-col gap-1 rounded-xl bg-base-200/60 p-3 sm:flex-row sm:items-center sm:justify-between">
      <span className="text-sm text-base-content/60">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

function InfoBox({ label, value }) {
  return (
    <div className="rounded-xl bg-base-200/60 p-4">
      <p className="text-xs uppercase tracking-wide text-base-content/50">
        {label}
      </p>
      <p className="mt-1 font-semibold">{value}</p>
    </div>
  );
}
