import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "../../services/authService";

export default function HomePage() {
  const navigate = useNavigate();
  const user = getCurrentUser();

  return (
    <div>
      <div className="hero bg-base-100 rounded-2xl shadow-md">
        <div className="hero-content text-center py-16">
          <div className="max-w-xl">
            <h1 className="text-4xl font-bold">
              Selamat Datang, {user?.username || "User"} 👋
            </h1>
            <p className="py-4 text-base-content/70">
              Kamu berhasil login. Dari sini kamu bisa lanjut ke halaman profile
              untuk melihat dan mengubah data akunmu.
            </p>

            <div className="flex justify-center gap-3 mt-4">
              <button
                className="btn btn-primary"
                onClick={() => navigate("/user/profile")}
              >
                Buka Profile
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4 mt-6">
        <div className="card bg-base-100 shadow-md">
          <div className="card-body">
            <h2 className="card-title">Username</h2>
            <p>{user?.username || "-"}</p>
          </div>
        </div>

        <div className="card bg-base-100 shadow-md">
          <div className="card-body">
            <h2 className="card-title">Email</h2>
            <p>{user?.email || "-"}</p>
          </div>
        </div>

        <div className="card bg-base-100 shadow-md">
          <div className="card-body">
            <h2 className="card-title">Provider</h2>
            <p>{user?.authProvider || "local"}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
