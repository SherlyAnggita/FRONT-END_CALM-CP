import { useState } from "react";
import { Link } from "react-router-dom";
import { forgotPassword } from "../services/authPasswordService";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    if (!email) {
      setError("Email wajib diisi");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccessMessage("");

      const res = await forgotPassword(email);

      setSuccessMessage(
        res.message || "Jika email terdaftar, link reset password akan dikirim",
      );
    } catch (err) {
      setError(err?.message || "Gagal mengirim link reset password");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#d8ecfb] px-4">
      <div className="w-full max-w-md rounded-3xl bg-white/80 p-8 shadow-xl backdrop-blur">
        <h1 className="text-center text-3xl font-bold">Forgot Password</h1>
        <p className="mt-2 text-center text-sm text-slate-600">
          Masukkan email akun kamu untuk menerima link reset password.
        </p>

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
            <label className="mb-2 block text-sm font-semibold">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError("");
              }}
              className="input input-bordered w-full rounded-full"
              placeholder="Masukkan email kamu"
              disabled={loading}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary w-full rounded-full"
          >
            {loading ? "Mengirim..." : "Kirim Link Reset"}
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