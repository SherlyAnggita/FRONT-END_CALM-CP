import { AnimatePresence, motion } from "framer-motion";
import { FaFilePdf } from "react-icons/fa";

export default function ActivityActionMenu({
  row,
  rowId,
  isOpen,
  isDark,
  pdfLoadingUserId,
  onToggle,
  onCopy,
  onExportPdf,
  onClose,
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        minWidth: "130px",
        paddingTop: "6px",
        paddingBottom: "6px",
      }}
    >
      <button
        type="button"
        onClick={() => onToggle(rowId)}
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
              onClick={() => {
                onCopy(row);
                onClose();
              }}
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
              Copy
            </button>

            <button
              type="button"
              onClick={() => {
                onExportPdf(row);
                onClose();
              }}
              disabled={pdfLoadingUserId === row.user?.id}
              style={{
                padding: "8px 12px",
                borderRadius: "10px",
                border: "none",
                cursor:
                  pdfLoadingUserId === row.user?.id
                    ? "not-allowed"
                    : "pointer",
                backgroundColor: "#ef4444",
                color: "#fff",
                fontSize: "13px",
                fontWeight: 700,
                textAlign: "left",
                opacity: pdfLoadingUserId === row.user?.id ? 0.7 : 1,
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <FaFilePdf size={13} />
              {pdfLoadingUserId === row.user?.id ? "Loading..." : "PDF"}
            </button>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}