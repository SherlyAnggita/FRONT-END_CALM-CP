import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getGoogleAccessToken } from "../services/authService";

const OAuthSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleGoogleSuccess = async () => {
      try {
        const result = await getGoogleAccessToken();

        localStorage.setItem("accessToken", result.accessToken);

        navigate("/dashboard");
      } catch (error) {
        navigate("/login?error=google_failed");
      }
    };

    handleGoogleSuccess();
  }, [navigate]);

  return (
    <div>
      <p>Memproses login Google...</p>
    </div>
  );
};

export default OAuthSuccess;