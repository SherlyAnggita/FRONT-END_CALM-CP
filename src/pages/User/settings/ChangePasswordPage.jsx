import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft, FiEye, FiEyeOff } from "react-icons/fi";
import { updatePassword } from "../../../services/User/userSettingService";
import { logoutUser } from "../../../services/authService";

export default function ChangePasswordPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  function handleChange(e) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (error) setError("");
  }

  function togglePassword(field) {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!form.currentPassword || !form.newPassword || !form.confirmPassword) {
      setError("Semua field password wajib diisi");
      return;
    }

    if (form.newPassword.length < 8) {
      setError("Password baru minimal 8 karakter");
      return;
    }

    if (form.newPassword !== form.confirmPassword) {
      setError("Konfirmasi password tidak cocok");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccessMessage("");

      const res = await updatePassword(form);

      setSuccessMessage(res.message || "Password berhasil diubah");

      setForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      setTimeout(async () => {
        await logoutUser();
        navigate("/login", { replace: true });
      }, 1500);
    } catch (err) {
      setError(err?.message || "Gagal mengubah password");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div>
        <button
          type="button"
          onClick={() => navigate("/user/settings")}
          className="mb-4 flex items-center gap-2 text-sm text-base-content/70 hover:text-base-content"
        >
          <FiArrowLeft />
          Kembali ke Settings
        </button>

        <h1 className="text-2xl font-bold">Ubah Password</h1>
        <p className="text-sm text-base-content/60">
          Setelah password berhasil diubah, kamu akan diminta login kembali.
        </p>
      </div>

      <div className="rounded-2xl bg-base-100 p-6 shadow">
        {error && (
          <div className="alert alert-error mb-4">
            <span>{error}</span>
          </div>
        )}

        {successMessage && (
          <div className="alert alert-success mb-4">
            <span>{successMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <PasswordInput
            label="Password Lama"
            name="currentPassword"
            value={form.currentPassword}
            show={showPassword.currentPassword}
            onChange={handleChange}
            onToggle={() => togglePassword("currentPassword")}
            disabled={loading}
            placeholder="Masukkan password lama"
          />

          <PasswordInput
            label="Password Baru"
            name="newPassword"
            value={form.newPassword}
            show={showPassword.newPassword}
            onChange={handleChange}
            onToggle={() => togglePassword("newPassword")}
            disabled={loading}
            placeholder="Masukkan password baru"
          />

          <PasswordInput
            label="Konfirmasi Password"
            name="confirmPassword"
            value={form.confirmPassword}
            show={showPassword.confirmPassword}
            onChange={handleChange}
            onToggle={() => togglePassword("confirmPassword")}
            disabled={loading}
            placeholder="Ulangi password baru"
          />

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => navigate("/user/settings")}
              disabled={loading}
              className="btn flex-1"
            >
              Kembali
            </button>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary flex-1"
            >
              {loading ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function PasswordInput({
  label,
  name,
  value,
  show,
  onChange,
  onToggle,
  disabled,
  placeholder,
}) {
  return (
    <div className="form-control">
      <label className="mb-2 label">
        <span className="label-text">{label}</span>
      </label>

      <div className="relative">
        <input
          type={show ? "text" : "password"}
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className="input input-bordered w-full pr-12"
          placeholder={placeholder}
          required
        />

        <button
          type="button"
          onClick={onToggle}
          disabled={disabled}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/50 hover:text-base-content"
        >
          {show ? <FiEyeOff size={18} /> : <FiEye size={18} />}
        </button>
      </div>
    </div>
  );
}