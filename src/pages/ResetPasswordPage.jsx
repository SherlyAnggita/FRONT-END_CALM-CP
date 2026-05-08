import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { resetPassword } from "../services/authPasswordService";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

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

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
    <div className="flex min-h-screen items-center justify-center bg-[#bdd8e9] px-4">
     <div className="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl">


        <div className="relative flex min-h-[520px] items-center justify-center bg-[#fffaf0] px-8 py-10">
          <div className="relative w-full max-w-sm">
            <h1 className="text-center text-4xl font-extrabold text-slate-900">
              Reset Password
            </h1>
            <p className="mt-3 text-center text-sm text-slate-700">
              Masukkan password baru untuk akun kamu.
            </p>

            {!token && (
              <div className="alert alert-error mt-5">
                <span>
                  Token reset password tidak ditemukan atau link tidak valid.
                </span>
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
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Password Baru
                </label>

                <div className="relative">
                  <input
                    type={
                      showNewPassword ? "text" : "password"
                    }
                    name="newPassword"
                    value={form.newPassword}
                    onChange={handleChange}
                    className="input input-bordered h-14 w-full rounded-xl bg-gray-100 px-5 pr-14"
                    placeholder="Masukkan password baru"
                    disabled={loading || !token}
                    required
                  />

                  <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showNewPassword ? (
                    <AiOutlineEyeInvisible size={22} />
                  ) : (
                    <AiOutlineEye size={22} />
                  )}
                </button>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Konfirmasi Password
                </label>

                <div className="relative">
                  <input
                    type={
                      showConfirmPassword
                        ? "text"
                        : "password"
                    }
                    name="confirmPassword"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    className="input input-bordered h-14 w-full rounded-xl bg-gray-100 px-5 pr-14"
                    placeholder="Ulangi password baru"
                    disabled={loading || !token}
                    required
                  />

                  <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showConfirmPassword ? (
                    <AiOutlineEyeInvisible size={22} />
                  ) : (
                    <AiOutlineEye size={22} />
                  )}
                </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !token}
                className="btn h-14 w-full rounded-full border-none bg-[#49769f] text-base font-bold text-white hover:bg-[#bdd8e9]"
              >
                {loading ? "Menyimpan..." : "Reset Password"}
              </button>

               <div className="mt-2 text-center">
              <Link
                to="/login"
                className="font-semibold text-[#49769f] hover:underline"
              >
                Kembali ke Login
              </Link>
            </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}