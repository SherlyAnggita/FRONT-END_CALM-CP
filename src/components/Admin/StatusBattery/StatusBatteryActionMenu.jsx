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
  const buttonBaseStyle = {
    padding: "8px 12px",
    borderRadius: "10px",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: 700,
    textAlign: "center",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        minWidth: "140px",
        paddingTop: "6px",
        paddingBottom: "6px",
        alignItems: "center",
      }}
    >
      <button
        type="button"
        onClick={() => onToggle(row.id)}
        style={{
          ...buttonBaseStyle,
          width: "100%",
          border: `1px solid ${isDark ? "#334155" : "#d1d5db"}`,
          backgroundColor: isDark ? "#1e293b" : "#f8fafc",
          color: isDark ? "#f8fafc" : "#0f172a",
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
                ...buttonBaseStyle,
                border: "none",
                backgroundColor: "#2563eb",
                color: "#fff",
              }}
            >
              Detail
            </button>

            <button
              type="button"
              onClick={() => onEdit(row)}
              style={{
                ...buttonBaseStyle,
                border: "none",
                backgroundColor: "#2563eb",
                color: "#fff",
              }}
            >
              Edit
            </button>

            <button
              type="button"
              onClick={() => onToggleActive(row)}
              style={{
                ...buttonBaseStyle,
                border: "none",
                backgroundColor: row.isActive ? "#64748b" : "#16a34a",
                color: "#fff",
              }}
            >
              {row.isActive ? "Nonaktifkan" : "Aktifkan"}
            </button>

            <button
              type="button"
              onClick={() => onDelete(row)}
              style={{
                ...buttonBaseStyle,
                border: "none",
                backgroundColor: "#ef4444",
                color: "#fff",
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