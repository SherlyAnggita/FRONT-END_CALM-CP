import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { createMoodLabel } from "../../../services/Admin/moodLabel";
import EmojiPicker from "emoji-picker-react";
import toast from "react-hot-toast";

export default function TambahMoodLabel({
  isOpen,
  onClose,
  isDark,
  colors,
  refetch,
}) {
  const [submitLoading, setSubmitLoading] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const [form, setForm] = useState({
    name: "",
    description: "",
    score: "",
    emoji: "",
    paperColor: "#FDE68A",
  });

  useEffect(() => {
    if (!isOpen) {
      setForm({
        name: "",
        description: "",
        score: "",
        emoji: "",
        paperColor: "#FDE68A",
      });
      setSubmitLoading(false);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = () => setShowEmojiPicker(false);
    if (showEmojiPicker) {
      window.addEventListener("click", handleClickOutside);
    }
    return () => window.removeEventListener("click", handleClickOutside);
  }, [showEmojiPicker]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSubmitLoading(true);

      const payload = {
        name: form.name.trim(),
        description: form.description.trim() || null,
        score: form.score === "" ? null : Number(form.score),
        emoji: form.emoji.trim() || null,
        paperColor: form.paperColor.trim() || null,
      };

      const res = await createMoodLabel(payload);

      toast.success(res?.message || "Mood label berhasil dibuat");
      onClose();
      await refetch();
    } catch (err) {
      toast.error(err?.message || "Gagal menambah mood label");
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 999,
            padding: "16px",
          }}
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "100%",
              maxWidth: "560px",
              backgroundColor: isDark ? "#0f172a" : "#ffffff",
              borderRadius: "16px",
              border: `1px solid ${colors.border}`,
              padding: "20px",
              boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
            }}
          >
            <h3
              style={{
                margin: 0,
                marginBottom: "16px",
                color: colors.textPrimary,
                fontSize: "20px",
                fontWeight: 700,
              }}
            >
              Tambah Mood Label
            </h3>

            <form
              onSubmit={handleSubmit}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "12px",
              }}
            >
              <input
                type="text"
                placeholder="Nama mood label"
                value={form.name}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, name: e.target.value }))
                }
                required
                style={{
                  padding: "12px 14px",
                  borderRadius: "12px",
                  border: `1px solid ${colors.border}`,
                  backgroundColor: colors.inputBg,
                  color: colors.textPrimary,
                  outline: "none",
                }}
              />

              <textarea
                placeholder="Deskripsi"
                value={form.description}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                rows={3}
                style={{
                  padding: "12px 14px",
                  borderRadius: "12px",
                  border: `1px solid ${colors.border}`,
                  backgroundColor: colors.inputBg,
                  color: colors.textPrimary,
                  outline: "none",
                  resize: "vertical",
                }}
              />

              <input
                type="number"
                placeholder="Score"
                value={form.score}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, score: e.target.value }))
                }
                style={{
                  padding: "12px 14px",
                  borderRadius: "12px",
                  border: `1px solid ${colors.border}`,
                  backgroundColor: colors.inputBg,
                  color: colors.textPrimary,
                  outline: "none",
                }}
              />

              <div
                style={{ position: "relative" }}
                onClick={(e) => e.stopPropagation()}
              >
                <input
                  type="text"
                  placeholder="Emoji"
                  value={form.emoji}
                  readOnly
                  onClick={() => setShowEmojiPicker((prev) => !prev)}
                  style={{
                    padding: "12px 14px",
                    borderRadius: "12px",
                    border: `1px solid ${colors.border}`,
                    backgroundColor: colors.inputBg,
                    color: colors.textPrimary,
                    outline: "none",
                    cursor: "pointer",
                  }}
                />
                {showEmojiPicker && (
                  <div
                    style={{
                      position: "absolute",
                      top: "110%",
                      zIndex: 10,
                    }}
                  >
                    <EmojiPicker
                      onEmojiClick={(emojiData) => {
                        setForm((prev) => ({
                          ...prev,
                          emoji: emojiData.emoji,
                        }));
                        setShowEmojiPicker(false);
                      }}
                    />
                  </div>
                )}
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  flexWrap: "wrap",
                }}
              >
                <label
                  style={{
                    color: colors.textPrimary,
                    fontSize: "14px",
                    fontWeight: 600,
                    minWidth: "90px",
                  }}
                >
                  Paper Color
                </label>

                <input
                  type="color"
                  value={form.paperColor || "#FDE68A"}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      paperColor: e.target.value,
                    }))
                  }
                  style={{
                    width: "52px",
                    height: "42px",
                    border: `1px solid ${colors.border}`,
                    borderRadius: "10px",
                    backgroundColor: "transparent",
                    cursor: "pointer",
                    padding: "4px",
                  }}
                />

                <input
                  type="text"
                  value={form.paperColor}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      paperColor: e.target.value,
                    }))
                  }
                  placeholder="#FDE68A"
                  style={{
                    flex: "1 1 160px",
                    padding: "12px 14px",
                    borderRadius: "12px",
                    border: `1px solid ${colors.border}`,
                    backgroundColor: colors.inputBg,
                    color: colors.textPrimary,
                    outline: "none",
                  }}
                />

                <div
                  style={{
                    width: "24px",
                    height: "24px",
                    borderRadius: "999px",
                    backgroundColor: form.paperColor || "#FDE68A",
                    border: `1px solid ${colors.border}`,
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
                    fontWeight: 600,
                  }}
                >
                  Batal
                </button>

                <button
                  type="submit"
                  disabled={submitLoading}
                  style={{
                    padding: "10px 16px",
                    borderRadius: "10px",
                    border: "none",
                    backgroundColor: "#2563eb",
                    color: "#fff",
                    cursor: "pointer",
                    fontWeight: 700,
                    opacity: submitLoading ? 0.7 : 1,
                  }}
                >
                  {submitLoading ? "Menyimpan..." : "Simpan"}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
