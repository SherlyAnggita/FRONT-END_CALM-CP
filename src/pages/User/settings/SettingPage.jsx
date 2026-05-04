import { useNavigate } from "react-router-dom";
import { FiLock, FiChevronRight } from "react-icons/fi";

export default function SettingPage() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-sm text-base-content/60">
          Kelola pengaturan akun kamu.
        </p>
      </div>

      <div className="rounded-2xl bg-base-100 p-4 shadow">
        <button
          type="button"
          onClick={() => navigate("/user/settings/change-password")}
          className="flex w-full items-center justify-between rounded-xl p-4 text-left transition hover:bg-base-200"
        >
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-primary/10 p-3 text-primary">
              <FiLock size={20} />
            </div>

            <div>
              <p className="font-semibold">Ubah Password</p>
              <p className="text-sm text-base-content/60">
                Ganti password akun kamu secara aman.
              </p>
            </div>
          </div>

          <FiChevronRight size={20} />
        </button>
      </div>
    </div>
  );
}