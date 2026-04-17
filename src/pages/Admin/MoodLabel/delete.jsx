import { deleteMoodLabel } from "../../../services/Admin/moodLabel";
import toast from "react-hot-toast";

export default function DeleteMoodLabel({
  isOpen,
  onClose,
  selectedMoodLabel,
  refetch,
}) {
  if (!isOpen || !selectedMoodLabel) return null;

  const handleDelete = async () => {
    try {
      const response = await deleteMoodLabel(selectedMoodLabel.id);
      toast.success(response?.message || "Mood label berhasil dihapus");
      onClose();
      await refetch();
    } catch (err) {
      toast.error(err?.message || "Gagal menghapus mood label");
    }
  };

  return (
    <dialog className={`modal ${isOpen ? "modal-open" : ""}`}>
      <div className="modal-box">
        <h3 className="text-lg font-bold">Hapus Mood Label</h3>
        <p className="py-4">
          Yakin mau hapus mood label{" "}
          <span className="font-semibold">{selectedMoodLabel.name}</span>?
        </p>

        <div className="modal-action">
          <button type="button" className="btn" onClick={onClose}>
            Batal
          </button>
          <button
            type="button"
            className="btn btn-error"
            onClick={handleDelete}
          >
            Hapus
          </button>
        </div>
      </div>

      <form method="dialog" className="modal-backdrop">
        <button onClick={onClose}>close</button>
      </form>
    </dialog>
  );
}
