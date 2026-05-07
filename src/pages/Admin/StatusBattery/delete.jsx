import { useState } from "react";
import toast from "react-hot-toast";
import { deleteStatusBattery } from "../../../services/Admin/statusBattery";

export default function DeleteStatusBattery({
  isOpen,
  onClose,
  selectedStatusBattery,
  refetch,
  colors,
}) {
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleDelete = async () => {
    try {
      setLoading(true);

      await deleteStatusBattery(selectedStatusBattery.id);

      toast.success("Status battery berhasil dihapus");

      await refetch();
      onClose();
    } catch (err) {
      toast.error(err?.message || "Gagal menghapus status battery");
    } finally {
      setLoading(false);
    }
  };

  return (
  <div
        style={{
          position: "fixed",
          inset: 0,
          backgroundColor: "rgba(0,0,0,0.45)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 999,
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "420px",
            backgroundColor: colors.cardBg,
            color: colors.textPrimary,
            borderRadius: "18px",
            padding: "24px",
            border: `1px solid ${colors.border}`,
          }}
        >
          <h2
            style={{
              marginTop: 0,
              color: colors.textPrimary,
            }}
          >
            Hapus Status Battery
          </h2>

          <p
            style={{
              color: colors.textSecondary || colors.textPrimary,
            }}
          >
            Apakah kamu yakin ingin menghapus{" "}
            <b style={{ color: colors.textPrimary }}>
              {selectedStatusBattery?.name}
            </b>
            ?
          </p>

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "10px",
              marginTop: "24px",
            }}
          >
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: "10px 18px",
                borderRadius: "10px",
                border: `1px solid ${colors.border}`,
                backgroundColor: "transparent",
                color: colors.textPrimary,
                cursor: "pointer",
              }}
            >
              Batal
            </button>

            <button
              type="button"
              onClick={handleDelete}
              disabled={loading}
              style={{
                backgroundColor: loading ? "#9CA3AF" : "#ef4444",
                color: "#fff",
                border: "none",
                padding: "10px 16px",
                borderRadius: "10px",
                cursor: loading ? "not-allowed" : "pointer",
                fontWeight: 700,
              }}
            >
              {loading ? "Loading..." : "Hapus"}
            </button>
          </div>
        </div>
      </div>
    );
}