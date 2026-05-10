import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { resetPassword } from "../services/authPasswordService";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { motion } from "framer-motion";

import cloudSmall1 from "../assets/cloud-small1.png";
import cloudSmall2 from "../assets/cloud-small2.png";
import cloudSmall3 from "../assets/cloud-small3.png";
import cloudSmall4 from "../assets/cloud-small4.png";
import calmLogo from "../assets/calm.png";
import star1 from "../assets/star1.png";
import star2 from "../assets/star2.png";
import star3 from "../assets/star3.png";
import star4 from "../assets/star4.png";

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
    <motion.div
      initial={{ x: 120, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -120, opacity: 0 }}
      transition={{ duration: 1.0, ease: [0.22, 1, 0.36, 1] }}
      className="relative min-h-[100dvh] w-full overflow-hidden bg-gradient-to-br from-[#4d739a] via-[#7fb0da] to-[#d8ecfb]"
    >
      <img
        src={cloudSmall1}
        alt=""
        className="absolute left-2 top-6 w-40 opacity-60 sm:left-8 sm:top-8 sm:w-32 lg:left-10 lg:top-10 lg:w-52"
      />
      <img
        src={cloudSmall2}
        alt=""
        className="absolute right-0 top-30 w-40 opacity-60 sm:right-8 sm:top-10 sm:w-28 lg:right-20 lg:top-16 lg:w-44"
      />
      <img
        src={cloudSmall3}
        alt=""
        className="absolute bottom-6 left-4 w-40 opacity-50 sm:bottom-8 sm:left-8 sm:w-28 lg:bottom-10 lg:left-20 lg:w-40"
      />
      <img
        src={cloudSmall4}
        alt=""
        className="absolute bottom-8 right-4 w-40 opacity-40 sm:bottom-8 sm:right-8 sm:w-32 lg:bottom-12 lg:right-10 lg:w-48"
      />

      <img
        src={star1}
        alt=""
        className="absolute left-10 top-20 hidden w-100 animate-pulse opacity-80 lg:block"
      />
      <img
        src={star2}
        alt=""
        className="absolute right-10 top-32 hidden w-100 animate-pulse opacity-80 lg:block"
      />
      <img
        src={star3}
        alt=""
        className="absolute bottom-48 right-[25%] hidden w-100 animate-pulse opacity-80 lg:block"
      />
      <img
        src={star4}
        alt=""
        className="absolute bottom-32 left-[30%] hidden w-100 animate-pulse opacity-80 lg:block"
      />

      <div className="relative z-10 flex min-h-[100dvh] items-center justify-center px-4 py-8 sm:px-6 lg:px-12">
        <div className="flex w-full max-w-md flex-col items-center sm:max-w-lg">
          <div className="relative mb-6 flex h-[230px] flex-col items-center justify-start overflow-visible text-center lg:hidden">
            <img
              src={star1}
              alt=""
              className="absolute left-2 top-[-10px] z-20 w-35 animate-pulse opacity-90"
            />
            <img
              src={star2}
              alt=""
              className="absolute right-1 top-[-20px] z-20 w-55 animate-pulse opacity-90"
            />
            <img
              src={star3}
              alt=""
              className="absolute right-10 top-[-40px] z-20 w-35 animate-pulse opacity-90"
            />
            <img
              src={star4}
              alt=""
              className="absolute left-14 top-[-50px] z-20 w-25 animate-pulse opacity-90"
            />

            <img
              src={calmLogo}
              alt="Calm"
              className="absolute left-1/2 top-[-130px] h-[490px] w-[490px] -translate-x-[55%] object-contain"
            />
          </div>

          <div className="w-full rounded-3xl border border-white/30 bg-[#d9ebf7]/95 p-6 shadow-xl backdrop-blur sm:p-8">
            <h1 className="text-center text-2xl font-bold text-black sm:text-3xl">
              Reset Password
            </h1>

            <p className="mt-3 text-center text-sm text-black/70">
              Masukkan password baru untuk akun kamu.
            </p>

            {!token && (
              <div className="mt-5 rounded-2xl bg-red-100 px-4 py-3 text-sm text-red-600 shadow-sm">
                Token reset password tidak ditemukan atau link tidak valid.
              </div>
            )}

            {error && (
              <div className="mt-5 rounded-2xl bg-red-100 px-4 py-3 text-sm text-red-600 shadow-sm">
                {error}
              </div>
            )}

            {successMessage && (
              <div className="mt-5 rounded-2xl bg-green-100 px-4 py-3 text-sm text-green-700 shadow-sm">
                {successMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label className="mb-2 block text-sm font-semibold text-black">
                  Password Baru
                </label>

                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    name="newPassword"
                    value={form.newPassword}
                    onChange={handleChange}
                    className="h-14 w-full rounded-full border border-white/40 bg-white/75 px-6 pr-14 text-base text-black shadow-sm outline-none transition focus:border-[#7aa8d6] focus:bg-white placeholder:text-gray-500 [&::-ms-clear]:hidden [&::-ms-reveal]:hidden"
                    placeholder="Masukkan password baru"
                    disabled={loading || !token}
                    required
                  />

                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 transition hover:text-[#04264d]"
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
                <label className="mb-2 block text-sm font-semibold text-black">
                  Konfirmasi Password
                </label>

                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    className="h-14 w-full rounded-full border border-white/40 bg-white/75 px-6 pr-14 text-base text-black shadow-sm outline-none transition focus:border-[#7aa8d6] focus:bg-white placeholder:text-gray-500 [&::-ms-clear]:hidden [&::-ms-reveal]:hidden"
                    placeholder="Ulangi password baru"
                    disabled={loading || !token}
                    required
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(!showConfirmPassword)
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 transition hover:text-[#04264d]"
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
                className="h-14 w-full rounded-full bg-gradient-to-r from-[#04264d] to-[#0a3a6d] text-lg font-semibold text-white shadow-[0_10px_25px_rgba(4,38,77,0.35)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_30px_rgba(4,38,77,0.4)] disabled:opacity-70"
              >
                {loading ? "Menyimpan..." : "Reset Password"}
              </button>

              <div className="mt-2 text-center">
                <Link
                  to="/login"
                  className="text-sm font-semibold text-[#04264d] hover:underline"
                >
                  Kembali ke Login
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </motion.div>
  );
}