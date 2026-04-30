import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { registerUser } from "../services/authService";
import { motion } from "framer-motion";
import cloudMain from "../assets/cloud.png";
import cloudSmall1 from "../assets/cloud-small1.png";
import cloudSmall2 from "../assets/cloud-small2.png";
import cloudSmall3 from "../assets/cloud-small3.png";
import cloudSmall4 from "../assets/cloud-small4.png";
import calmLogo from "../assets/calm.png";
import star1 from "../assets/star1.png";
import star2 from "../assets/star2.png";
import star3 from "../assets/star3.png";
import star4 from "../assets/star4.png";

export default function RegisterPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    fullName: "",
    username: "",
    phoneNumber: "",
    password: "",
    showPassword: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError("");
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [error]);

  function showToast(message, type = "success") {
    setToast({
      show: true,
      message,
      type,
    });

    setTimeout(() => {
      setToast({
        show: false,
        message: "",
        type: "success",
      });
    }, 2000);
  }

  function handleChange(e) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const payload = {
        email: form.email,
        password: form.password,
        fullName: form.fullName,
        username: form.username,
        phoneNumber: form.phoneNumber,
      };

      await registerUser(payload);

      showToast("Registrasi berhasil, silahkan login", "success");

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      setError(err.message || "Registrasi gagal");
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
      className="relative min-h-[100dvh] overflow-hidden bg-gradient-to-br from-[#4d739a] via-[#7fb0da] to-[#d8ecfb]"
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

      <img src={star1} alt="" className="hidden lg:block absolute top-20 left-10 w-100 opacity-80 animate-pulse" />
      <img src={star2} alt="" className="hidden lg:block absolute top-32 right-10 w-100 opacity-80 animate-pulse" />
      <img src={star3} alt="" className="hidden lg:block absolute bottom-48 right-[25%] w-100 opacity-80 animate-pulse"/>
      <img src={star4} alt="" className="hidden lg:block absolute bottom-32 left-[30%] w-100 opacity-80 animate-pulse"/>
      

      <div className="relative z-10 flex min-h-[100dvh] items-center justify-center px-4 py-4 sm:px-6 lg:px-12">
        <div className="mx-auto flex min-h-[100dvh] w-full max-w-7xl items-center justify-between gap-8 lg:gap-12">
          <div className="flex w-full items-center justify-center lg:w-1/2">
            <div className="w-full max-w-md sm:max-w-lg lg:max-w-[600px]">
              
              {/* MOBILE HERO */}
               <div className="relative mb-6 h-[260px] flex flex-col items-center justify-start overflow-visible text-center lg:hidden">
                  <img src={star1} alt="" className="absolute left-2 top-[-10px] z-20 w-35 opacity-90 animate-pulse" />
                  <img src={star2} alt="" className="absolute right-1 top-[-20px] z-20 w-55 opacity-90 animate-pulse" />
                  <img src={star3} alt="" className="absolute right-10 top-[-40px] z-20 w-35 opacity-90 animate-pulse" />
                  <img src={star4} alt="" className="absolute left-14 top-[-50px] z-20 w-25 opacity-90 animate-pulse"/>
              
                  <img src={calmLogo} alt="Calm" className="absolute top-[-100px] left-1/2 h-[470px] w-[470px] -translate-x-[55%] object-contain" />
                </div>

              <div className="relative w-full rounded-3xl border border-white/30 bg-[#d9ebf7]/95 p-6 shadow-xl backdrop-blur-sm sm:p-8 lg:rounded-[28px] lg:shadow-[0_20px_60px_rgba(15,35,60,0.22)]">
                <div className="pointer-events-none absolute inset-0 rounded-[28px] bg-gradient-to-br from-white/35 via-transparent to-transparent" />

                <div className="relative z-10">
                  <h2 className="text-center text-3xl font-bold text-black">
                    Sign up to your Calm
                  </h2>

                  <form onSubmit={handleSubmit} className="mt-8 space-y-4">
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-black">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        placeholder="Masukan Email"
                        value={form.email}
                        onChange={handleChange}
                        className="h-14 w-full rounded-full border border-white/40 bg-white/75 px-6 text-base text-black shadow-sm outline-none transition focus:border-[#7aa8d6] focus:bg-white placeholder:text-gray-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-black">
                        Nama Lengkap
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        placeholder="Masukan Nama Lengkap"
                        value={form.fullName}
                        onChange={handleChange}
                        className="h-14 w-full rounded-full border border-white/40 bg-white/75 px-6 text-base text-black shadow-sm outline-none transition focus:border-[#7aa8d6] focus:bg-white placeholder:text-gray-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-black">
                        Username
                      </label>
                      <input
                        type="text"
                        name="username"
                        placeholder="Masukan Username"
                        value={form.username}
                        onChange={handleChange}
                        className="h-14 w-full rounded-full border border-white/40 bg-white/75 px-6 text-base text-black shadow-sm outline-none transition focus:border-[#7aa8d6] focus:bg-white placeholder:text-gray-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-black">
                        No Handphone
                      </label>
                      <input
                        type="text"
                        name="phoneNumber"
                        placeholder="Masukan No Handphone"
                        value={form.phoneNumber}
                        onChange={(e) => {
                          const value = e.target.value;

                          if (/^\d*$/.test(value) && value.length <= 13) {
                            setForm((prev) => ({
                              ...prev,
                              phoneNumber: value,
                            }));
                          }
                        }}
                        inputMode="numeric"
                        pattern="[0-9]*"
                        className="h-14 w-full rounded-full border border-white/40 bg-white/75 px-6 text-base text-black shadow-sm outline-none transition focus:border-[#7aa8d6] focus:bg-white placeholder:text-gray-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-black">
                        Password
                      </label>

                      <div className="relative">
                        <input
                          type={form.showPassword ? "text" : "password"}
                          name="password"
                          placeholder="Masukan Password"
                          value={form.password}
                          onChange={handleChange}
                          className="h-14 w-full rounded-full border border-white/40 bg-white/75 px-6 pr-14 text-base text-black shadow-sm outline-none transition focus:border-[#7aa8d6] focus:bg-white placeholder:text-gray-500 [&::-ms-clear]:hidden [&::-ms-reveal]:hidden"
                          required
                        />

                        <button
                          type="button"
                          onClick={() =>
                            setForm((prev) => ({
                              ...prev,
                              showPassword: !prev.showPassword,
                            }))
                          }
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 transition hover:text-[#04264d]"
                        >
                          {form.showPassword ? (
                            <AiOutlineEyeInvisible size={22} />
                          ) : (
                            <AiOutlineEye size={22} />
                          )}
                        </button>
                      </div>
                    </div>

                    {error && (
                      <div className="rounded-2xl bg-red-100 px-4 py-3 text-sm text-red-600 shadow-sm">
                        {error}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={loading}
                      className="h-14 w-full rounded-full bg-gradient-to-r from-[#04264d] to-[#0a3a6d] text-lg font-semibold text-white shadow-[0_10px_25px_rgba(4,38,77,0.35)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_30px_rgba(4,38,77,0.4)] disabled:opacity-70"
                    >
                      {loading ? "Loading..." : "Sign up"}
                    </button>
                  </form>

                  <p className="mt-4 text-center text-sm text-black">
                    Already have an account?{" "}
                    <Link to="/login" className="text-red-500 hover:underline">
                      Sign in
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="hidden h-full w-1/2 lg:flex lg:flex-col lg:items-end lg:justify-center">
            <div className="max-w-xl text-right">
              <h1 className="tagline text-4xl font-extrabold leading-tight tracking-wide text-white drop-shadow-[0_3px_10px_rgba(0,0,0,0.18)] xl:text-5xl">
                Find your <span className="text-white/90">CALM</span> side
              </h1>

              <p className="mt-4 ml-auto max-w-md text-lg leading-relaxed text-white/95 drop-shadow-[0_2px_6px_rgba(0,0,0,0.15)]">
                Karena setiap perasaanmu berharga. Mari rawat ketenanganmu hari ini
              </p>

              <div className="mt-6 flex justify-center lg:justify-end">
                <img
                  src={cloudMain}
                  alt="Cloud"
                  className="relative right-2 h-[420px] w-[420px] animate-float object-contain drop-shadow-[0_20px_40px_rgba(255,255,255,0.18)] lg:right-6 xl:h-[560px] xl:w-[560px]"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {toast.show && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center pointer-events-none">
          <div className="min-w-[260px] max-w-md rounded-2xl bg-green-500 px-6 py-4 text-center text-sm font-semibold text-white shadow-2xl">
            {toast.message}
          </div>
        </div>
      )}
    </motion.div>
  );
}