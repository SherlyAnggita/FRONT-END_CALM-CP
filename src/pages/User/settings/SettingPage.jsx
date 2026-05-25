import { useNavigate } from "react-router-dom";
import { FiLock, FiChevronRight, FiFileText, FiShield } from "react-icons/fi";

export default function SettingPage() {
  const navigate = useNavigate();

  return (
    <div className="space-y-3">
      <div>
        <h1 className="text-2xl text-white font-bold">Settings</h1>
        <p className="text-sm text-white">
          Kelola pengaturan akun kamu.
        </p>
      </div>

      <div className="rounded-3xl border border-white/40 bg-white/20 p-6 shadow-[0_8px_30px_rgba(255,255,255,0.12)] backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.05]">
        <button
          type="button"
          onClick={() => navigate("/user/settings/change-password")}
          className="flex w-full items-center justify-between rounded-xl p-4 text-left transition "
        >
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-primary/20 p-3 text-primary">
              <FiLock size={20} />
            </div>

            <div>
              <p className="font-semibold text-white">Ubah Password</p>
              <p className="text-sm text-white/60">
                Ganti password akun kamu secara aman.
              </p>
            </div>
          </div>
          <FiChevronRight size={20} />
        </button>
      </div>

      <div className="rounded-3xl border border-white/40 bg-white/20 p-6 shadow-[0_8px_30px_rgba(255,255,255,0.12)] backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.05]">
        <button
          type="button"
          onClick={() => navigate("/privacy-policy")}
          className="flex w-full items-center justify-between rounded-xl p-4 text-left transition "
        >
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-primary/20 p-3 text-primary">
              <FiFileText size={20} />
            </div>

            <div>
              <p className="font-semibold text-white">Syarat dan Ketentuan</p>
              <p className="text-sm text-white/60">
                Baca syarat dan ketentuan penggunaan layanan.
              </p>
            </div>
          </div>
          <FiChevronRight size={20} />
        </button>
      </div>

      <div className="rounded-3xl border border-white/40 bg-white/20 p-6 shadow-[0_8px_30px_rgba(255,255,255,0.12)] backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.05]">
        <button
          type="button"
          onClick={() => navigate("/terms")}
          className="flex w-full items-center justify-between rounded-xl p-4 text-left transition "
        >
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-primary/20 p-3 text-primary">
              <FiShield size={20} />
            </div>

            <div>
              <p className="font-semibold text-white">Kebijakan Privasi</p>
              <p className="text-sm text-white/60">
                Pahami bagaimana data anda dikelola dan dilindungi.
              </p>
            </div>
          </div>
          <FiChevronRight size={20} />
        </button>
      </div>
      
    </div>
  );
}