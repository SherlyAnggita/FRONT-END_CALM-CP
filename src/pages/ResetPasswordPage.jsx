import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { resetPassword } from "../services/authPasswordService";

export default function ResetPasswordPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const token = new URLSearchParams(location.search).get("token");

  const [form, setForm] = useState({
    newPassword: "",
    confirmPassword: "",
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

  async function handleSubmit(e) {
    e.preventDefault();

    if (!token) {
      setError("Token reset password tidak ditemukan");
      return;
    }

    if (!form.newPassword || !form.confirmPassword) {
      setError("Semua field wajib diisi");
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

      const res = await resetPassword({
        token,
        newPassword: form.newPassword,
        confirmPassword: form.confirmPassword,
      });

      setSuccessMessage(res.message || "Password berhasil direset");

      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 1500);
    } catch (err) {
      setError(err?.message || "Gagal reset password");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#d8ecfb] px-4">
      <div className="w-full max-w-md rounded-3xl bg-white/80 p-8 shadow-xl backdrop-blur">
        <h1 className="text-center text-3xl font-bold">Reset Password</h1>
        <p className="mt-2 text-center text-sm text-slate-600">
          Masukkan password baru untuk akun kamu.
        </p>

        {!token && (
          <div className="alert alert-error mt-5">
            <span>Token reset password tidak ditemukan atau link tidak valid.</span>
          </div>
        )}

        {error && (
          <div className="alert alert-error mt-5">
            <span>{error}</span>
          </div>
        )}

        {successMessage && (
          <div className="alert alert-success mt-5">
            <span>{successMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="mb-2 block text-sm font-semibold">
              Password Baru
            </label>
            <input
              type="password"
              name="newPassword"
              value={form.newPassword}
              onChange={handleChange}
              className="input input-bordered w-full rounded-full"
              placeholder="Masukkan password baru"
              disabled={loading || !token}
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold">
              Konfirmasi Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              className="input input-bordered w-full rounded-full"
              placeholder="Ulangi password baru"
              disabled={loading || !token}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading || !token}
            className="btn btn-primary w-full rounded-full"
          >
            {loading ? "Menyimpan..." : "Reset Password"}
          </button>
        </form>

        <div className="mt-5 text-center text-sm">
          <Link to="/login" className="text-primary hover:underline">
            Kembali ke Login
          </Link>
        </div>
      </div>
    </div>
  );
}