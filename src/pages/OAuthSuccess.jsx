import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { exchangeGoogleCode } from "../services/authService";

const OAuthSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleGoogleSuccess = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const code = params.get("code");

        if (!code) {
          throw new Error("No OAuth code");
        }

        await exchangeGoogleCode(code);

        navigate("/user", { replace: true });
      } catch (error) {
        navigate("/login?error=google_failed", { replace: true });
      }
    };

    handleGoogleSuccess();
  }, [navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#d8ecfb] px-4">
      <div className="w-full max-w-sm rounded-3xl bg-white/80 p-8 text-center shadow-xl backdrop-blur">
        <span className="loading loading-spinner loading-lg text-primary"></span>

        <h1 className="mt-5 text-2xl font-bold text-slate-800">
          Memproses Login Google
        </h1>

        <p className="mt-2 text-sm text-slate-600">
          Tunggu sebentar, kami sedang menyiapkan akun kamu.
        </p>
      </div>
    </div>
  );
};

export default OAuthSuccess;
