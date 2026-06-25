import { useEffect, useState, useRef } from "react";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import {
  AiOutlineUser,
  AiOutlineMail,
  AiOutlinePhone,
  AiOutlineCamera,
  AiOutlineIdcard,
  AiOutlineCheckCircle,
  AiOutlineCloseCircle,
} from "react-icons/ai";
import { MdOutlineEdit } from "react-icons/md";
import {
  getCurrentUser,
  getUserProfile,
  updateUserProfile,
} from "../../services/authService";

import awanbg from "../../assets/awanbg.png";

export default function ProfilePage() {
  const cropperRef = useRef(null);

  const [form, setForm] = useState({
    fullName: "",
    username: "",
    email: "",
    phoneNumber: "",
  });

  const [preview, setPreview] = useState(null);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);

  const [rawImage, setRawImage] = useState(null);
  const [showCropModal, setShowCropModal] = useState(false);

  const MAX_FILE_SIZE_MB = 2;
  const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
  const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png"];

  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

  function showToast(message, type = "success") {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: "", type: "success" });
    }, 2500);
  }

  useEffect(() => {
    async function fetchProfile() {
      try {
        setIsLoadingProfile(true);
        const result = await getUserProfile();
        const user = result.data;
        setPreview(user.profilePhotoUrl || null);
        setForm({
          fullName: user.fullName || "",
          username: user.username || "",
          email: user.email || "",
          phoneNumber: user.phoneNumber || "",
        });
      } catch (error) {
        console.error("Gagal ambil data profile:", error);
        const currentUser = getCurrentUser();
        if (currentUser) {
          setForm({
            fullName: currentUser.fullName || "",
            username: currentUser.username || "",
            email: currentUser.email || "",
            phoneNumber: currentUser.phoneNumber || "",
          });
        }
      } finally {
        setIsLoadingProfile(false);
      }
    }
    fetchProfile();
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleImageChange(e) {
    const file = e.target.files[0];
    if (!file) return;

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      showToast(
        "Format file tidak didukung. Gunakan JPG, JPEG, atau PNG.",
        "error",
      );
      e.target.value = "";
      return;
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      showToast(
        `Ukuran file terlalu besar. Maksimal ${MAX_FILE_SIZE_MB} MB.`,
        "error",
      );
      e.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setRawImage(reader.result);
      setShowCropModal(true);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  }

  async function handleApplyCroppedPhoto() {
    try {
      const cropper = cropperRef.current?.cropper;
      if (!cropper) return;
      setIsSaving(true);

      const croppedCanvas = cropper.getCroppedCanvas({
        width: 400,
        height: 400,
        imageSmoothingEnabled: true,
        imageSmoothingQuality: "high",
      });

      const croppedImage = croppedCanvas.toDataURL("image/png");
      setPreview(croppedImage);

      const blob = await new Promise((resolve) => {
        croppedCanvas.toBlob(resolve, "image/png");
      });

      const formData = new FormData();
      formData.append("fullName", form.fullName);
      formData.append("username", form.username);
      // formData.append("email", form.email);
      formData.append("phoneNumber", form.phoneNumber);
      formData.append("profilePhoto", blob, "profile.png");

      const result = await updateUserProfile(formData);
      const updatedUser = result.data;

      setPreview(updatedUser.profilePhotoUrl || null);
      setShowCropModal(false);
      setRawImage(null);

      window.dispatchEvent(new Event("profile-photo-updated"));
      showToast("Foto profile berhasil diperbarui.", "success");
    } catch (error) {
      console.error("Gagal update foto profile:", error);
      showToast(
        error?.data?.message || error.message || "Gagal update foto profile",
        "error",
      );
    } finally {
      setIsSaving(false);
    }
  }

  function handleCancelCrop() {
    setShowCropModal(false);
    setRawImage(null);
  }

  async function handleSaveProfile() {
    try {
      setIsSaving(true);
      const formData = new FormData();
      formData.append("fullName", form.fullName);
      formData.append("username", form.username);
      // formData.append("email", form.email);
      formData.append("phoneNumber", form.phoneNumber);

      const result = await updateUserProfile(formData);
      const updatedUser = result.data;

      setForm({
        fullName: updatedUser.fullName || "",
        username: updatedUser.username || "",
        email: updatedUser.email || "",
        phoneNumber: updatedUser.phoneNumber || "",
      });

      setPreview(updatedUser.profilePhotoUrl || null);
      window.dispatchEvent(new Event("profile-photo-updated"));
      setShowSaveModal(false);
      showToast("Profile berhasil diperbarui.", "success");
    } catch (error) {
      console.error("Gagal update profile:", error);
      showToast(
        error?.data?.message || error.message || "Gagal update profile",
        "error",
      );
    } finally {
      setIsSaving(false);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    setShowSaveModal(true);
  }

  return (
    <div className="relative -m-6 min-h-screen w-[calc(100%+3rem)] overflow-y-auto bg-[#f0f6fa] dark:bg-[#0f172a]">
      {/* Background hero */}
      <div className="absolute inset-x-0 top-0 h-[320px] sm:h-[360px] overflow-hidden">
        <img
          src={awanbg}
          alt=""
          className="h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#D5EDF2] dark:to-[#223449]" />
      </div>

      <div className="absolute inset-x-0 top-[320px] sm:top-[360px] bottom-0 bg-gradient-to-b from-[#D5EDF2] to-[#9FBEDB] dark:from-[#223449] dark:to-[#17263c]" />

      {/* Main content */}
      <div className="relative z-10 mx-auto w-full max-w-2xl px-4 pb-16 pt-[100px] sm:pt-[120px]">
        {/* Avatar + name section */}
        <div className="flex flex-col items-center mb-6">
          <div className="relative group">
            <div className="h-28 w-28 sm:h-32 sm:w-32 overflow-hidden rounded-full border-[5px] border-white shadow-2xl dark:border-[#1e293b] ring-2 ring-[#82b6cc]/40 dark:ring-sky-500/30">
              <img
                src={
                  preview ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    form.fullName || form.username || "User",
                  )}&background=random`
                }
                alt="profile"
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>

            <label className="absolute bottom-1 right-1 cursor-pointer rounded-full bg-[#2f6f95] p-2 text-white shadow-lg transition-all duration-200 hover:scale-110 hover:bg-[#245a78] active:scale-95 dark:bg-sky-600 dark:hover:bg-sky-500">
              <AiOutlineCamera size={16} />
              <input
                type="file"
                accept=".jpg,.jpeg,.png,image/jpeg,image/png"
                className="hidden"
                onChange={handleImageChange}
              />
            </label>
          </div>

          <h1 className="mt-4 text-2xl sm:text-3xl font-extrabold lowercase tracking-tight text-[#19445e] dark:text-white">
            {form.username || "username"}
          </h1>
          <p className="mt-1 text-xs text-gray-400 dark:text-slate-500">
            JPG, JPEG, PNG · maks. {MAX_FILE_SIZE_MB} MB
          </p>
        </div>

        {/* Card */}
        <div className="rounded-3xl border border-white/80 bg-white shadow-[0_8px_40px_rgba(60,100,130,0.13)] dark:border-white/[0.07] dark:bg-[#1e293b] dark:shadow-[0_8px_40px_rgba(0,0,0,0.4)]">
          {/* Card header */}
          <div className="flex items-center gap-3 px-6 pt-6 pb-4 border-b border-[#F7F3E7] dark:border-white/[0.07]">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#e8f4fb] text-[#2f6f95] dark:bg-sky-900/40 dark:text-sky-400">
              <MdOutlineEdit size={18} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#19445e] dark:text-white leading-tight">
                Informasi Pribadi
              </h2>
              <p className="text-[11px] text-gray-400 dark:text-slate-500 leading-tight mt-0.5">
                Perbarui data akun kamu
              </p>
            </div>
          </div>

          {/* Form fields */}
          <form onSubmit={handleSubmit}>
            <div className="px-5 sm:px-6 py-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field
                  label="Nama Lengkap"
                  icon={<AiOutlineIdcard size={15} />}
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  placeholder="Nama Lengkap"
                />

                <Field
                  label="Username"
                  icon={<AiOutlineUser size={15} />}
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  placeholder="Username"
                />
              </div>

              <Field
                label="Email"
                icon={<AiOutlineMail size={15} />}
                name="email"
                value={form.email}
                placeholder="email@contoh.com"
                type="email"
                readOnly={true}
                title="Tidak dapat mengubah email"
              />

              <Field
                label="No. Handphone"
                icon={<AiOutlinePhone size={15} />}
                name="phoneNumber"
                value={form.phoneNumber}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "").slice(0, 13);
                  setForm((prev) => ({ ...prev, phoneNumber: value }));
                }}
                placeholder="08xxxxxxxxxx"
              />
            </div>

            {/* Card footer / actions */}
            <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center sm:justify-end justify-between gap-3 px-5 sm:px-6 py-4 border-t border-[#e8f0f5] dark:border-white/[0.07] bg-[#f7fbfd] dark:bg-[#172033] rounded-b-3xl">
              <button
                type="submit"
                disabled={isSaving || isLoadingProfile}
                className="cursor-pointer flex items-center justify-center gap-2 rounded-xl bg-[#5f87b3] px-6 py-2.5 text-xs font-bold text-white shadow-md transition-all duration-200 hover:bg-[#245a78] hover:shadow-lg active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-sky-700 dark:hover:bg-sky-600"
              >
                {isSaving ? (
                  <>
                    <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <AiOutlineCheckCircle size={14} />
                    Simpan Perubahan
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Modal: Crop */}
      {showCropModal && (
        <ModalOverlay>
          <div className="modal-box max-w-2xl w-full bg-white dark:bg-[#1e293b] rounded-2xl">
            <h3 className="text-base font-bold text-[#19445e] dark:text-white">
              Atur Foto Profil
            </h3>
            <p className="mt-1 text-xs text-gray-400 dark:text-slate-500">
              Geser dan sesuaikan area foto yang ingin digunakan.
            </p>

            <div className="mt-4 overflow-hidden rounded-2xl bg-slate-100 dark:bg-[#0f172a]">
              <Cropper
                src={rawImage}
                style={{ height: 360, width: "100%" }}
                initialAspectRatio={1}
                aspectRatio={1}
                guides={false}
                viewMode={1}
                dragMode="move"
                background={false}
                responsive={true}
                autoCropArea={1}
                checkOrientation={false}
                ref={cropperRef}
              />
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              {[
                {
                  label: "Zoom +",
                  action: () => cropperRef.current?.cropper?.zoom(0.1),
                },
                {
                  label: "Zoom −",
                  action: () => cropperRef.current?.cropper?.zoom(-0.1),
                },
                {
                  label: "Reset",
                  action: () => cropperRef.current?.cropper?.reset(),
                },
              ].map(({ label, action }) => (
                <button
                  key={label}
                  type="button"
                  className="btn btn-xs btn-outline rounded-lg"
                  onClick={action}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="modal-action mt-4 gap-2">
              <button
                className="btn btn-ghost btn-sm dark:text-white"
                onClick={handleCancelCrop}
              >
                Batal
              </button>
              <button
                className="btn btn-primary btn-sm"
                onClick={handleApplyCroppedPhoto}
                disabled={isSaving}
              >
                {isSaving ? "Menyimpan..." : "Simpan Foto"}
              </button>
            </div>
          </div>
        </ModalOverlay>
      )}

      {/* Modal: Save Confirm */}
      {showSaveModal && (
        <ModalOverlay>
          <div className="modal-box max-w-sm bg-white dark:bg-[#1e293b] dark:text-white rounded-2xl">
            <div className="flex flex-col items-center text-center gap-3 py-2">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-sky-950/40">
                <AiOutlineCheckCircle
                  size={22}
                  className="text-[#2f6f95] dark:text-sky-400"
                />
              </div>
              <h3 className="text-base font-bold">Simpan perubahan?</h3>
              <p className="text-sm text-gray-500 dark:text-slate-400 leading-relaxed">
                Data profil yang kamu ubah akan disimpan.
              </p>
            </div>
            <div className="modal-action mt-4 gap-2">
              <button
                className="btn btn-ghost btn-sm flex-1 dark:text-white"
                onClick={() => setShowSaveModal(false)}
                disabled={isSaving}
              >
                Batal
              </button>
              <button
                className="btn btn-primary btn-sm flex-1"
                onClick={handleSaveProfile}
                disabled={isSaving}
              >
                {isSaving ? "Menyimpan..." : "Ya, Simpan"}
              </button>
            </div>
          </div>
        </ModalOverlay>
      )}

      {/* Toast */}
      {toast.show && (
        <div className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center pointer-events-none px-4 pb-8 sm:pb-0">
          <div
            className={`flex items-center gap-3 min-w-[260px] max-w-sm w-full rounded-2xl px-5 py-3.5 text-sm font-semibold shadow-2xl animate-[slideUp_0.25s_ease-out] ${
              toast.type === "success"
                ? "bg-green-500 text-white"
                : "bg-red-500 text-white"
            }`}
          >
            {toast.type === "success" ? (
              <AiOutlineCheckCircle size={18} className="shrink-0" />
            ) : (
              <AiOutlineCloseCircle size={18} className="shrink-0" />
            )}
            {toast.message}
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

/* ── Reusable overlay wrapper ── */
function ModalOverlay({ children }) {
  return <div className="modal modal-open">{children}</div>;
}

/* ── Improved Field component ── */
function Field({
  label,
  icon,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
  readOnly = false,
  title,
}) {
  return (
    <div className="group">
      <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wide text-[#4a7a96] dark:text-slate-400">
        {label}
      </label>

      <div
        className={`flex items-center gap-2.5 rounded-xl border border-[#efe7d6] bg-[#f8f3e8]/75 px-3.5 py-2.5 transition-all duration-200 focus-within:border-[#2f6f95] focus-within:bg-white focus-within:shadow-[0_0_0_3px_rgba(47,111,149,0.12)] dark:border-white/[0.08] dark:bg-[#0f172a] dark:focus-within:bg-[#0f172a] dark:focus-within:border-sky-500 dark:focus-within:shadow-[0_0_0_3px_rgba(56,189,248,0.12)] ${
          readOnly ? "bg-gray-100 cursor-not-allowed" : ""
        }`}
      >
        <span className="shrink-0 text-[#82b6cc] transition-colors duration-200 group-focus-within:text-[#2f6f95] dark:text-slate-500 dark:group-focus-within:text-sky-400">
          {icon}
        </span>

        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          readOnly={readOnly}
          title={title}
           className={`w-full bg-transparent text-[13px] text-[#1f2937] outline-none placeholder:text-gray-300 dark:text-white dark:placeholder:text-slate-600 ${
            readOnly ? "cursor-not-allowed" : ""
          }`}
        />
      </div>
    </div>
  );
}
