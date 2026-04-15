export default function MoodJarModal({ open, title, onClose, children }) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 px-4 pb-24 pt-4 sm:items-center sm:pb-4"
      onClick={onClose}
    >
      <div
        className="max-h-[calc(100vh-7rem)] w-full max-w-2xl overflow-hidden rounded-2xl bg-base-100 shadow-xl sm:max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-base-200 px-5 py-4">
          <h3 className="text-lg font-bold text-base-content">{title}</h3>
          {/* <button
            type="button"
            className="btn btn-sm btn-ghost"
            onClick={onClose}
          >
            ✕
          </button> */}
        </div>

        <div className="max-h-[calc(100vh-11rem)] overflow-y-auto p-5 text-base-content sm:max-h-[calc(85vh-72px)]">
          {children}
        </div>
      </div>
    </div>
  );
}