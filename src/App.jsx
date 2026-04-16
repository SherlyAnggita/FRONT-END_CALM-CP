import { useEffect, useState } from "react";
import AppRouter from "./routes/AppRouter";
import { refreshAccessToken } from "./services/authService";
import { Toaster } from "react-hot-toast";

function App() {
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    async function initAuth() {
      try {
        await refreshAccessToken();
      } catch (error) {
        // tidak apa-apa, artinya user belum login
        // atau refresh token sudah expired
      } finally {
        setCheckingAuth(false);
      }
    }

    initAuth();
  }, []);

  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#111827",
            color: "#fff",
          },
        }}
      />
      <AppRouter />
    </>
  );
}

export default App;
