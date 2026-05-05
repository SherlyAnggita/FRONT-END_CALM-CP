import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../lib/api";
import { tokenStorage } from "../lib/token";

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

        const data = await apiFetch("api/auth/google/exchange-code", {
          method: "POST",
          body: JSON.stringify({ code }),
        });

        tokenStorage.setTokens({
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
        });

        if (data.data) {
          tokenStorage.setUser(data.data);
        }

        navigate("/user", { replace: true });
      } catch (error) {
        navigate("/login?error=google_failed", { replace: true });
      }
    };

    handleGoogleSuccess();
  }, [navigate]);

  return <p>Memproses login Google...</p>;
};

export default OAuthSuccess;
