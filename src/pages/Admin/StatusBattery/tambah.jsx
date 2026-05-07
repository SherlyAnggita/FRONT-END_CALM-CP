import { useState } from "react";
import toast from "react-hot-toast";
import { createStatusBattery } from "../../../services/Admin/statusBattery";

export default function TambahStatusBattery({
  isOpen,
  onClose,
  isDark,
  colors,
  refetch,
}) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    minScore: "",
    maxScore: "",
    color: "#2563eb",
  });

  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const minScore = parseFloat(formData.minScore);
    const maxScore = parseFloat(formData.maxScore);

    if (minScore < 0 || minScore > 100) {
      toast.error("Min Score harus di antara 0 sampai 100");
      return;
    }

    if (maxScore < 0 || maxScore > 100) {
      toast.error("Max Score harus di antara 0 sampai 100");
      return;
    }

    if (minScore > maxScore) {
      toast.error("Min Score tidak boleh lebih besar dari Max Score");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        ...formData,
        minScore,
        maxScore,
      };

      await createStatusBattery(payload);

      toast.success("Status battery berhasil ditambahkan");

      await refetch();
      onClose();

      setFormData({
        name: "",
        description: "",
        minScore: "",
        maxScore: "",
        color: "#2563eb",
      });
    } catch (err) {
      toast.error(err?.message || "Gagal menambahkan status battery");
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
          maxWidth: "520px",
          backgroundColor: colors.cardBg,
          borderRadius: "18px",
          padding: "24px",
          border: `1px solid ${colors.border}`,
        }}
      >
        <h2
          style={{
            marginTop: 0,
            marginBottom: "20px",
            color: colors.textPrimary,
          }}
        >
          Tambah Status Battery
        </h2>

        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          <div>
            <label style={labelStyle(colors)}>Name</label>
            <input
              type="text"
              name="name"
              placeholder="Masukkan name"
              value={formData.name}
              onChange={handleChange}
              required
              style={inputStyle(colors)}
            />
          </div>

          <div>
            <label style={labelStyle(colors)}>Description</label>
            <textarea
              name="description"
              placeholder="Masukkan description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={4}
              style={{
                ...inputStyle(colors),
                resize: "none",
              }}
            />
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "12px",
            }}
          >
            <div>
              <label style={labelStyle(colors)}>Min Score</label>
              <input
                type="number"
                step="0.01"
                name="minScore"
                min="0"
                max="100"
                placeholder="0"
                value={formData.minScore}
                onChange={handleChange}
                required
                style={inputStyle(colors)}
              />
            </div>

            <div>
              <label style={labelStyle(colors)}>Max Score</label>
              <input
                type="number"
                step="0.01"
                name="maxScore"
                min="0"
                max="100"
                placeholder="100"
                value={formData.maxScore}
                onChange={handleChange}
                required
                style={inputStyle(colors)}
              />
            </div>
          </div>

          <div>
            <label style={labelStyle(colors)}>Color</label>
            <input
              type="color"
              name="color"
              value={formData.color}
              onChange={handleChange}
              style={{
                width: "80px",
                height: "44px",
                border: "none",
                background: "transparent",
                cursor: "pointer",
              }}
            />
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "10px",
              marginTop: "8px",
            }}
          >
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: "10px 16px",
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
              type="submit"
              disabled={loading}
              style={{
                padding: "10px 16px",
                borderRadius: "10px",
                border: "none",
                backgroundColor: loading ? "#9CA3AF" : "#2563eb",
                color: "#fff",
                cursor: loading ? "not-allowed" : "pointer",
                fontWeight: 700,
              }}
            >
              {loading ? "Loading..." : "Simpan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function inputStyle(colors) {
  return {
    width: "100%",
    padding: "12px 14px",
    borderRadius: "10px",
    border: `1px solid ${colors.border}`,
    backgroundColor: colors.inputBg,
    color: colors.textPrimary,
    fontSize: "14px",
    outline: "none",
    boxSizing: "border-box",
  };
}

function labelStyle(colors) {
  return {
    display: "block",
    marginBottom: "8px",
    color: colors.textPrimary,
    fontSize: "14px",
    fontWeight: 600,
  };
}