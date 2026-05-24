import { createPortal } from "react-dom";
import { FiLogOut } from "react-icons/fi";

export default function LogoutModal({ isOpen, onClose, onConfirm }) {
  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 dark:bg-[#1e293b] dark:text-white">
        <div className="flex flex-col items-center gap-3 py-2 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-950/40">
            <FiLogOut size={22} className="text-red-500 dark:text-red-400" />
          </div>
          <h3 className="text-base font-bold">Yakin ingin keluar?</h3>
          <p className="text-sm leading-relaxed text-gray-500 dark:text-slate-400">
            Kamu akan keluar dari sesi ini.
          </p>
        </div>

        <div className="mt-4 flex gap-2">
          <button
            className="btn btn-ghost btn-sm flex-1 dark:text-white"
            onClick={onClose}
          >
            Batal
          </button>
          <button
            className="btn btn-sm flex-1 border-red-500 bg-red-500 text-white hover:border-red-600 hover:bg-red-600"
            onClick={onConfirm}
          >
            Ya, Keluar
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
