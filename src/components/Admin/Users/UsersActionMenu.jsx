import { AnimatePresence, motion } from "framer-motion";

export default function UsersActionMenu({
  row,
  isOpen,
  isDark,
  onToggle,
  onDetail,
  onToggleActive,
  loading = false,
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        minWidth: "150px",
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
          textAlign: "center",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
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
                backgroundColor: "#2563eb",
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
              onClick={() => onToggleActive(row)}
              disabled={loading}
              style={{
                padding: "8px 12px",
                borderRadius: "10px",
                border: "none",
                cursor: loading ? "not-allowed" : "pointer",
                backgroundColor: row.isActive ? "#64748b" : "#16a34a",
                color: "#fff",
                fontSize: "13px",
                fontWeight: 700,
                textAlign: "left",
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading
                ? "Memproses..."
                : row.isActive
                  ? "Nonaktifkan"
                  : "Aktifkan"}
            </button>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
