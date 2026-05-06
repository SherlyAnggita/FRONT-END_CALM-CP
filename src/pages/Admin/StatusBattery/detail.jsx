import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { getDetailStatusBattery } from "../../../services/Admin/statusBattery";

export default function DetailStatusBatteryPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [statusBattery, setStatusBattery] = useState(null);
  const [loading, setLoading] = useState(false);

  const getIsDarkMode = () =>
    window.matchMedia("(prefers-color-scheme: dark)").matches;

  const [isDark, setIsDark] = useState(getIsDarkMode());

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e) => setIsDark(e.matches);

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const colors = useMemo(
    () => ({
      pageBg: isDark ? "#111827" : "#f8fafc",
      cardBg: isDark ? "#0f172a" : "#ffffff",
      softBg: isDark ? "#111827" : "#f9fafb",
      yellowSoft: isDark ? "#422006" : "#fef9c3",
      textPrimary: isDark ? "#f8fafc" : "#111827",
      textSecondary: isDark ? "#94a3b8" : "#64748b",
      border: isDark ? "#334155" : "#e2e8f0",
      shadow: isDark
        ? "0 18px 40px rgba(0,0,0,0.35)"
        : "0 18px 40px rgba(15,23,42,0.12)",
    }),
    [isDark],
  );

  useEffect(() => {
    async function fetchDetail() {
      try {
        setLoading(true);
        const response = await getDetailStatusBattery(id);
        setStatusBattery(response?.data || null);
      } catch (err) {
        toast.error(err?.message || "Gagal mengambil detail status battery");
      } finally {
        setLoading(false);
      }
    }

    if (id) fetchDetail();
  }, [id]);

  if (loading) {
    return (
      <div style={pageStyle(colors)}>
        <p style={{ color: colors.textSecondary }}>Loading detail...</p>
      </div>
    );
  }

  return (
    <div style={pageStyle(colors)}>
      <button
        type="button"
        onClick={() => navigate("/admin/status-battery")}
        style={{
          padding: "10px 16px",
          borderRadius: "12px",
          border: `1px solid ${colors.border}`,
          backgroundColor: colors.cardBg,
          color: colors.textPrimary,
          cursor: "pointer",
          fontWeight: 700,
          marginBottom: "18px",
        }}
      >
        ← Kembali
      </button>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: "16px",
          marginBottom: "22px",
        }}
      >
        <div>
          <h1
            style={{
              margin: 0,
              color: colors.textPrimary,
              fontSize: "34px",
              fontWeight: 900,
              letterSpacing: "-0.03em",
            }}
          >
            Detail Status Battery
          </h1>

          <p
            style={{
              margin: "8px 0 0",
              color: colors.textSecondary,
              fontSize: "15px",
            }}
          >
            Informasi lengkap rentang skor status battery pengguna.
          </p>
        </div>

        {statusBattery ? (
          <span
            style={{
              padding: "8px 14px",
              borderRadius: "999px",
              backgroundColor: statusBattery.isActive ? "#dcfce7" : "#fee2e2",
              color: statusBattery.isActive ? "#166534" : "#991b1b",
              fontWeight: 800,
              fontSize: "13px",
            }}
          >
            {statusBattery.isActive ? "Active" : "Inactive"}
          </span>
        ) : null}
      </div>

      {!statusBattery ? (
        <div style={cardStyle(colors)}>
          <p style={{ margin: 0, color: colors.textSecondary }}>
            Detail status battery tidak ditemukan.
          </p>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "280px 1fr",
            gap: "22px",
            alignItems: "start",
          }}
        >
          <div style={cardStyle(colors)}>
            <div
              style={{
                width: "72px",
                height: "72px",
                borderRadius: "18px",
                backgroundColor: normalizeColor(statusBattery.color),
                border: `6px solid ${isDark ? "#1e293b" : "#fef3c7"}`,
                boxShadow: "0 8px 18px rgba(234,179,8,0.25)",
                marginBottom: "18px",
              }}
            />

            <h2
              style={{
                margin: 0,
                color: colors.textPrimary,
                fontSize: "28px",
                fontWeight: 900,
                letterSpacing: "-0.03em",
              }}
            >
              {statusBattery.name || "-"}
            </h2>

            <p
              style={{
                margin: "6px 0 20px",
                color: colors.textSecondary,
                fontSize: "15px",
              }}
            >
              {statusBattery.description || "-"}
            </p>

            <div
              style={{
                padding: "18px",
                borderRadius: "16px",
                backgroundColor: colors.yellowSoft,
              }}
            >
              <p
                style={{
                  margin: "0 0 8px",
                  color: isDark ? "#fde68a" : "#713f12",
                  fontSize: "12px",
                  fontWeight: 900,
                  textTransform: "uppercase",
                }}
              >
                Score Range
              </p>

              <p
                style={{
                  margin: 0,
                  color: colors.textPrimary,
                  fontSize: "28px",
                  fontWeight: 900,
                }}
              >
                {statusBattery.minScore}% - {statusBattery.maxScore}%
              </p>
            </div>
          </div>

          <div style={cardStyle(colors)}>
            <h2
              style={{
                margin: 0,
                color: colors.textPrimary,
                fontSize: "22px",
                fontWeight: 900,
              }}
            >
              Informasi Detail
            </h2>

            <p
              style={{
                margin: "6px 0 18px",
                color: colors.textSecondary,
                fontSize: "14px",
              }}
            >
              Informasi lengkap rentang skor status battery pengguna.
            </p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                gap: "14px",
              }}
            >
              <InfoBox label="ID" value={statusBattery.id} colors={colors} />
              <InfoBox
                label="Name"
                value={statusBattery.name}
                colors={colors}
              />
              <InfoBox
                label="Min Score"
                value={`${statusBattery.minScore}%`}
                colors={colors}
              />
              <InfoBox
                label="Max Score"
                value={`${statusBattery.maxScore}%`}
                colors={colors}
              />
              <InfoBox
                label="Color"
                value={statusBattery.color}
                colors={colors}
                color={statusBattery.color}
              />
              <InfoBox
                label="Status"
                value={statusBattery.isActive ? "Active" : "Inactive"}
                colors={colors}
                badge={statusBattery.isActive}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function InfoBox({ label, value, colors, color, badge }) {
  return (
    <div
      style={{
        padding: "14px",
        borderRadius: "14px",
        border: `1px solid ${colors.border}`,
        backgroundColor: colors.softBg,
        minHeight: "72px",
      }}
    >
      <p
        style={{
          margin: "0 0 8px",
          color: colors.textSecondary,
          fontSize: "12px",
          fontWeight: 900,
          textTransform: "uppercase",
        }}
      >
        {label}
      </p>

      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <p
          style={{
            margin: 0,
            color: colors.textPrimary,
            fontSize: "15px",
            fontWeight: 800,
            wordBreak: "break-word",
          }}
        >
          {value || "-"}
        </p>

        {color ? (
          <span
            style={{
              width: "20px",
              height: "20px",
              borderRadius: "6px",
              backgroundColor: normalizeColor(color),
              display: "inline-block",
              border: `1px solid ${colors.border}`,
            }}
          />
        ) : null}

        {badge !== undefined ? (
          <span
            style={{
              padding: "4px 10px",
              borderRadius: "999px",
              backgroundColor: badge ? "#dcfce7" : "#fee2e2",
              color: badge ? "#166534" : "#991b1b",
              fontSize: "12px",
              fontWeight: 800,
            }}
          >
            {badge ? "Active" : "Inactive"}
          </span>
        ) : null}
      </div>
    </div>
  );
}

function normalizeColor(color) {
  if (!color) return "#000000";

  const colorMap = {
    yellow: "#facc15",
    red: "#ef4444",
    green: "#22c55e",
    blue: "#3b82f6",
    orange: "#f97316",
    purple: "#8b5cf6",
    pink: "#ec4899",
    gray: "#64748b",
  };

  return colorMap[color?.toLowerCase()] || color;
}

function pageStyle(colors) {
  return {
    padding: "28px",
    minHeight: "100vh",
    backgroundColor: colors.pageBg,
  };
}

function cardStyle(colors) {
  return {
    backgroundColor: colors.cardBg,
    border: `1px solid ${colors.border}`,
    borderRadius: "22px",
    padding: "24px",
    boxShadow: colors.shadow,
  };
}