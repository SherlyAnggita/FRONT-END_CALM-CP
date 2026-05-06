import { AnimatePresence, motion } from "framer-motion";

export default function StatusBatteryActionMenu({
  row,
  isOpen,
  isDark,
  onToggle,
  onDetail,
  onEdit,
  onDelete,
  onToggleActive,
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        minWidth: "140px",
        paddingTop: "6px",
        paddingBottom: "6px",
      }}
    >
      <button
        type="button"
        onClick={() => onToggle(row.id)}
        style={{
          padding: "8px 12px",
          borderRadius: "10px",
          border: `1px solid ${isDark ? "#334155" : "#d1d5db"}`,
          cursor: "pointer",
          backgroundColor: isDark ? "#1e293b" : "#f8fafc",
          color: isDark ? "#f8fafc" : "#0f172a",
          fontSize: "13px",
          fontWeight: 700,
          textAlign: "left",
        }}
      >
        {isOpen ? "Tutup Aksi" : "Aksi"}
      </button>

      <AnimatePresence initial={false}>
        {isOpen ? (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -6 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: -6 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              width: "100%",
              overflow: "hidden",
            }}
          >
            <button
              type="button"
              onClick={() => onDetail(row)}
              style={{
                padding: "8px 12px",
                borderRadius: "10px",
                border: "none",
                cursor: "pointer",
                backgroundColor: "#7c3aed",
                color: "#fff",
                fontSize: "13px",
                fontWeight: 700,
                textAlign: "left",
              }}
            >
              Detail
            </button>

            <button
              type="button"
              onClick={() => onEdit(row)}
              style={{
                padding: "8px 12px",
                borderRadius: "10px",
                border: "none",
                cursor: "pointer",
                backgroundColor: "#2563eb",
                color: "#fff",
                fontSize: "13px",
                fontWeight: 700,
                textAlign: "left",
              }}
            >
              Edit
            </button>

            <button
              type="button"
              onClick={() => onToggleActive(row)}
              style={{
                padding: "8px 12px",
                borderRadius: "10px",
                border: "none",
                cursor: "pointer",
                backgroundColor: row.isActive ? "#64748b" : "#16a34a",
                color: "#fff",
                fontSize: "13px",
                fontWeight: 700,
                textAlign: "left",
              }}
            >
              {row.isActive ? "Nonaktifkan" : "Aktifkan"}
            </button>

            <button
              type="button"
              onClick={() => onDelete(row)}
              style={{
                padding: "8px 12px",
                borderRadius: "10px",
                border: "none",
                cursor: "pointer",
                backgroundColor: "#ef4444",
                color: "#fff",
                fontSize: "13px",
                fontWeight: 700,
                textAlign: "left",
              }}
            >
              Hapus
            </button>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
