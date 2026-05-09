import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getSocialBatteryLogDetail } from "../../../services/admin/socialBatteryLogsService";

export default function SocialBatteryLogDetailPage() {
  const { id } = useParams();

  const [log, setLog] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchDetail = useCallback(async () => {
    try {
      setLoading(true);

      const response = await getSocialBatteryLogDetail(id);
      setLog(response.data);
    } catch (error) {
      console.error("Gagal mengambil detail social battery log:", error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  if (loading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center p-6">
        <span className="loading loading-spinner loading-lg" />
      </div>
    );
  }

  if (!log) {
    return (
      <div className="p-6">
        <div className="alert alert-warning">
          <span>Data social battery log tidak ditemukan.</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 text-base-content">
      <div>
        <Link
          to="/admin/social-battery-logs"
          className="btn btn-ghost btn-sm px-0 text-primary"
        >
          ← Kembali
        </Link>

        <h1 className="mt-2 text-2xl font-bold">Detail Social Battery Log</h1>
        <p className="text-sm text-base-content/60">
          Detail monitoring social battery user.
        </p>
      </div>

      <section className="card border border-base-300 bg-base-100 shadow-sm">
        <div className="card-body">
          <h2 className="card-title">Informasi User</h2>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <DetailItem label="Nama" value={log.user?.fullName || "-"} />
            <DetailItem label="Username" value={log.user?.username || "-"} />
            <DetailItem label="Email" value={log.user?.email || "-"} />
            <DetailItem label="User ID" value={log.user?.id || "-"} />
          </div>
        </div>
      </section>

      <section className="card border border-base-300 bg-base-100 shadow-sm">
        <div className="card-body">
          <h2 className="card-title">Data Social Battery</h2>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <DetailItem label="Tanggal" value={formatDateTime(log.date)} />
            <DetailItem
              label="Battery Status"
              value={log.batteryStatus?.name || "-"}
            />
            <DetailItem
              label="Status Description"
              value={log.batteryStatus?.description || "-"}
            />
            <DetailItem label="Battery Score" value={log.batteryScore} />
            <DetailItem
              label="Social Intensity Score"
              value={log.socialIntensityScore}
            />
            <DetailItem label="Total Events" value={log.totalEvents} />
            <DetailItem
              label="Total Duration"
              value={`${log.totalDurationMinutes ?? 0} menit`}
            />
            <DetailItem
              label="Created At"
              value={formatDateTime(log.createdAt)}
            />
            <DetailItem
              label="Updated At"
              value={formatDateTime(log.updatedAt)}
            />
          </div>
        </div>
      </section>

      <section className="card border border-base-300 bg-base-100 shadow-sm">
        <div className="card-body">
          <h2 className="card-title">AI & Calculation Detail</h2>

          <div className="space-y-4">
            <LongDetailItem
              label="Calculation Notes"
              value={log.calculationNotes}
            />
            <LongDetailItem label="AI Insight" value={log.aiInsight} />
            <LongDetailItem
              label="AI Score Explanation"
              value={log.aiScoreExplanation}
            />
            <LongDetailItem
              label="Recovery Suggestion"
              value={log.recoverySuggestion}
            />
            <DetailItem label="AI Model Name" value={log.aiModelName || "-"} />
          </div>
        </div>
      </section>
    </div>
  );
}

function DetailItem({ label, value }) {
  return (
    <div>
      <p className="text-sm text-base-content/60">{label}</p>
      <p className="font-medium break-words">{value ?? "-"}</p>
    </div>
  );
}

function LongDetailItem({ label, value }) {
  return (
    <div>
      <p className="text-sm text-base-content/60">{label}</p>
      <div className="mt-1 rounded-box bg-base-200 p-3 text-sm leading-relaxed">
        {value || "-"}
      </div>
    </div>
  );
}

function formatDateTime(date) {
  if (!date) return "-";

  return new Date(date).toLocaleString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
