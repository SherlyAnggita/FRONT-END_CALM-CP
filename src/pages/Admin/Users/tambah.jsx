import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { createUser } from "../../../services/Admin/usersService";
import toast from "react-hot-toast";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const initialForm = {
  email: "",
  password: "",
  fullName: "",
  username: "",
  phoneNumber: "",
  role: "user",
  isActive: true,
  isEmailVerified: false,
};

export default function TambahUser({
  isOpen,
  onClose,
  isDark,
  colors,
  refetch,
}) {
  const [submitLoading, setSubmitLoading] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setForm(initialForm);
    }
  }, [isOpen]);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function validateForm() {
    if (!form.fullName.trim()) return "Nama lengkap wajib diisi";
    if (!form.username.trim()) return "Username wajib diisi";
    if (!form.email.trim()) return "Email wajib diisi";
    if (!form.password.trim()) return "Password wajib diisi";
    if (form.password.length < 8) return "Password minimal 8 karakter";
    if (!form.phoneNumber.trim()) return "Nomor HP wajib diisi";

    return "";
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const errorMessage = validateForm();

    if (errorMessage) {
      toast.error(errorMessage);
      return;
    }

    try {
      setSubmitLoading(true);

      await createUser({
        email: form.email.trim(),
        password: form.password,
        fullName: form.fullName.trim(),
        username: form.username.trim(),
        phoneNumber: form.phoneNumber.trim(),
        role: form.role,
        isActive: form.isActive,
        isEmailVerified: form.isEmailVerified,
      });

      toast.success("User berhasil ditambahkan");

      if (refetch) {
        await refetch();
      }

      onClose();
    } catch (error) {
      toast.error(error.message || "Gagal menambahkan user");
      console.error(error);
    } finally {
      setSubmitLoading(false);
    }
  }

  if (!colors) {
    colors = {
      border: isDark ? "#374151" : "#d1d5db",
      background: isDark ? "#111827" : "#ffffff",
      surface: isDark ? "#1f2937" : "#ffffff",
      text: isDark ? "#ffffff" : "#111827",
      muted: isDark ? "#d1d5db" : "#6b7280",
      input: isDark ? "#111827" : "#ffffff",
    };
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center px-4"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.55)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={onClose}
        >
          <motion.div
            className="w-full max-w-2xl rounded-2xl border shadow-xl"
            style={{
              backgroundColor: colors.background,
              borderColor: colors.border,
              color: colors.text,
            }}
            initial={{ scale: 0.96, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.96, opacity: 0, y: 10 }}
            transition={{ duration: 0.18 }}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div
              className="flex items-center justify-between border-b px-5 py-4"
              style={{ borderColor: colors.border }}
            >
              <div>
                <h2 className="text-lg font-bold">Tambah User</h2>
                <p className="text-sm" style={{ color: colors.muted }}>
                  Buat akun user secara manual dari admin panel.
                </p>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="rounded-lg px-3 py-1 text-xl leading-none hover:opacity-75"
                disabled={submitLoading}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 p-5">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium">
                    Nama Lengkap
                  </label>
                  <input
                    name="fullName"
                    value={form.fullName}
                    onChange={handleChange}
                    className="w-full rounded-lg px-3 py-2 text-sm outline-none"
                    style={{
                      border: `1px solid ${colors.border}`,
                      backgroundColor: colors.input,
                      color: colors.text,
                    }}
                    placeholder="Masukkan nama lengkap"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium">
                    Username
                  </label>
                  <input
                    name="username"
                    value={form.username}
                    onChange={handleChange}
                    className="w-full rounded-lg px-3 py-2 text-sm outline-none"
                    style={{
                      border: `1px solid ${colors.border}`,
                      backgroundColor: colors.input,
                      color: colors.text,
                    }}
                    placeholder="Masukkan username"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full rounded-lg px-3 py-2 text-sm outline-none"
                    style={{
                      border: `1px solid ${colors.border}`,
                      backgroundColor: colors.input,
                      color: colors.text,
                    }}
                    placeholder="user@mail.com"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium">
                    Password
                  </label>

                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      className="w-full rounded-lg px-3 py-2 pr-11 text-sm outline-none"
                      style={{
                        border: `1px solid ${colors.border}`,
                        backgroundColor: colors.input,
                        color: colors.text,
                      }}
                      placeholder="Minimal 8 karakter"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                      style={{
                        color: colors.muted,
                      }}
                      tabIndex={-1}
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium">
                    Nomor HP
                  </label>
                  <input
                    name="phoneNumber"
                    value={form.phoneNumber}
                    onChange={handleChange}
                    className="w-full rounded-lg px-3 py-2 text-sm outline-none"
                    style={{
                      border: `1px solid ${colors.border}`,
                      backgroundColor: colors.input,
                      color: colors.text,
                    }}
                    placeholder="08123456789"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium">Role</label>
                  <select
                    name="role"
                    value={form.role}
                    onChange={handleChange}
                    className="w-full rounded-lg px-3 py-2 text-sm outline-none"
                    style={{
                      border: `1px solid ${colors.border}`,
                      backgroundColor: colors.input,
                      color: colors.text,
                    }}
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>

              <div
                className="grid grid-cols-1 gap-3 rounded-xl border p-4 md:grid-cols-2"
                style={{ borderColor: colors.border }}
              >
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={form.isActive}
                    onChange={handleChange}
                  />
                  User aktif
                </label>

                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    name="isEmailVerified"
                    checked={form.isEmailVerified}
                    onChange={handleChange}
                  />
                  Email sudah verified
                </label>
              </div>

              <div
                className="flex justify-end gap-2 border-t pt-4"
                style={{ borderColor: colors.border }}
              >
                <button
                  type="button"
                  onClick={onClose}
                  disabled={submitLoading}
                  className="btn btn-soft"
                >
                  Batal
                </button>

                <button
                  type="submit"
                  disabled={submitLoading}
                  className="btn btn-outline btn-primary"
                >
                  {submitLoading ? "Menyimpan..." : "Simpan"}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
