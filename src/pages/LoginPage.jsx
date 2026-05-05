import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { loginUser } from "../services/authService";
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

export default function LoginPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    identifier: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError("");
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [error]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  const API_URL = import.meta.env.VITE_API_BASE_URL;

  function handleGoogleLogin() {
    window.location.href = `${API_URL}api/auth/google/login`;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await loginUser(form);
      navigate("/");
    } catch (err) {
      setError(err.message || "Login gagal");
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
      {/* background clouds */}
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

     {/* stars desktop only */}
      <img src={star1} alt="" className="hidden lg:block absolute top-20 left-10 w-100 opacity-80 animate-pulse" />
      <img src={star2} alt="" className="hidden lg:block absolute top-32 right-10 w-100 opacity-80 animate-pulse" />
      <img src={star3} alt="" className="hidden lg:block absolute bottom-48 right-[25%] w-100 opacity-80 animate-pulse"/>
      <img src={star4} alt="" className="hidden lg:block absolute bottom-32 left-[30%] w-100 opacity-80 animate-pulse"/>

      <div className="relative z-10 flex min-h-[100dvh] items-center justify-center px-4 py-8 sm:px-6 lg:px-12">
        <div className="grid w-full max-w-7xl grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-10">
          
          {/* LEFT SIDE DESKTOP */}
          <div className="hidden lg:flex flex-col justify-center">
            <div className="max-w-xl">
              <h1 className="text-3xl font-extrabold leading-tight text-white drop-shadow xl:text-5xl">
                Find your <span className="text-white/90">CALM</span> side
              </h1>

              <p className="mt-4 text-base text-white/90 sm:text-lg">
                Karena setiap perasaanmu berharga. Mari rawat ketenanganmu hari ini
              </p>

              <div className="mt-6 flex justify-center lg:justify-start">
                <img
                  src={cloudMain}
                  alt="Cloud"
                  className="h-[320px] w-[320px] object-contain animate-float xl:h-[500px] xl:w-[500px]"
                />
              </div>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="flex items-center justify-center">
            <div className="w-full max-w-md sm:max-w-lg">
              
              {/* MOBILE HERO */}
              <div className="relative mb-6 h-[260px] flex flex-col items-center justify-start overflow-visible text-center lg:hidden">
                <img src={star1} alt="" className="absolute left-2 top-[-10px] z-20 w-35 opacity-90 animate-pulse" />
                <img src={star2} alt="" className="absolute right-1 top-[-20px] z-20 w-55 opacity-90 animate-pulse" />
                <img src={star3} alt="" className="absolute right-10 top-[-40px] z-20 w-35 opacity-90 animate-pulse" />
                <img src={star4} alt="" className="absolute left-14 top-[-50px] z-20 w-25 opacity-90 animate-pulse"/>

                <img src={calmLogo} alt="Calm" className="absolute top-[-130px] left-1/2 h-[490px] w-[490px] -translate-x-[55%] object-contain" />
              </div>

              {/* LOGIN CARD */}
              <div className="rounded-3xl border border-white/30 bg-[#d9ebf7]/95 p-6 shadow-xl backdrop-blur sm:p-8">
                <h2 className="text-center text-2xl font-bold text-black sm:text-3xl">
                  Sign in to your Calm
                </h2>

                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-black">
                      Email / Username
                    </label>
                    <input
                      type="text"
                      name="identifier"
                      placeholder="Masukan Email/Username"
                      value={form.identifier}
                      onChange={handleChange}
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
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder="Masukan Password"
                        value={form.password}
                        onChange={handleChange}
                        className="h-14 w-full rounded-full border border-white/40 bg-white/75 px-6 pr-14 text-base text-black shadow-sm outline-none transition focus:border-[#7aa8d6] focus:bg-white placeholder:text-gray-500 [&::-ms-clear]:hidden [&::-ms-reveal]:hidden"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 transition hover:text-[#04264d]"

                        
                      >
                        {showPassword ? (
                          <AiOutlineEyeInvisible size={22} />
                        ) : (
                          <AiOutlineEye size={22} />
                        )}
                      </button>
                    </div>

                     <div className="mt-2 text-right">
                      <Link to="/forgot-password" className="text-sm text-[#04264d] hover:underline">
                        Forgot Password?
                      </Link>
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
                    {loading ? "Loading..." : "Sign in"}
                  </button>
                </form>

                <div className="my-5 flex items-center gap-4">
                  <div className="h-px flex-1 bg-gray-500/50" />
                  <span className="text-sm text-black">OR</span>
                  <div className="h-px flex-1 bg-gray-500/50" />
                </div>

                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  className="flex h-14 w-full items-center justify-center gap-3 rounded-full border border-white/50 bg-white/70 text-lg text-black shadow-sm transition hover:bg-white"
                >
                  <FcGoogle size={24} />
                  Sign in with google
                </button>

                <p className="mt-4 text-center text-sm text-black">
                  Need an account?{" "}
                  <Link
                    to="/register"
                    className="cursor-pointer text-red-500 hover:underline"
                  >
                    Sign up
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}