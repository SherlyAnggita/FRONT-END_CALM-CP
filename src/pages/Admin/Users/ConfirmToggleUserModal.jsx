export default function ConfirmToggleUserModal({
  isOpen,
  onClose,
  onConfirm,
  user,
  loading = false,
}) {
  if (!isOpen || !user) return null;

  const actionText = user.isActive ? "nonaktifkan" : "aktifkan";
  const buttonText = user.isActive ? "Nonaktifkan" : "Aktifkan";
  const buttonClass = user.isActive ? "btn-warning" : "btn-success";

  return (
    <dialog className={`modal ${isOpen ? "modal-open" : ""}`}>
      <div className="modal-box">
        <h3 className="text-lg font-bold">Konfirmasi Status User</h3>

        <p className="py-4">
          Yakin ingin {actionText} user{" "}
          <span className="font-semibold">
            {user.fullName || user.username || user.email}
          </span>
          ?
        </p>

        <div className="modal-action">
          <button
            type="button"
            className="btn btn-ghost"
            onClick={onClose}
            disabled={loading}
          >
            Batal
          </button>

          <button
            type="button"
            className={`btn ${buttonClass}`}
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="loading loading-spinner loading-sm" />
                Memproses...
              </>
            ) : (
              buttonText
            )}
          </button>
        </div>
      </div>

      <form method="dialog" className="modal-backdrop">
        <button type="button" onClick={onClose}>
          close
        </button>
      </form>
    </dialog>
  );
}
