import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import {
  AiOutlineUser,
  AiOutlineMail,
  AiOutlinePhone,
  AiOutlineLock,
  AiOutlineCamera,
  AiOutlineEye,
  AiOutlineEyeInvisible,
  AiOutlineIdcard,
} from "react-icons/ai";
import {
  getCurrentUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
} from "../../services/authService";

import awanbg from "../../assets/awanbg.png";

export default function AdminProfilePage() {
  const navigate = useNavigate();
  const cropperRef = useRef(null);

  const [form, setForm] = useState({
    fullName: "",
    username: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  });

  const [preview, setPreview] = useState(null);
  const [savedPreview, setSavedPreview] = useState(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [userData, setUserData] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);

  const [rawImage, setRawImage] = useState(null);
  const [showCropModal, setShowCropModal] = useState(false);
  const [hasPendingPhotoChange, setHasPendingPhotoChange] = useState(false);

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
    }, 2000);
  }

  useEffect(() => {
    async function fetchProfile() {
      try {
        setIsLoadingProfile(true);

        const result = await getUserProfile();
        const user = result.data;

        setUserData(user);
        setForm((prev) => ({
          ...prev,
          fullName: user.fullName || "",
          username: user.username || "",
          email: user.email || "",
          phoneNumber: user.phoneNumber || "",
        }));
      } catch (error) {
        console.error("Gagal ambil data profile admin:", error);

        const currentUser = getCurrentUser();
        if (currentUser) {
          setUserData(currentUser);
          setForm((prev) => ({
            ...prev,
            fullName: currentUser.fullName || "",
            username: currentUser.username || "",
            email: currentUser.email || "",
            phoneNumber: currentUser.phoneNumber || "",
          }));
        }
      } finally {
        setIsLoadingProfile(false);
      }
    }

    fetchProfile();
  }, []);

  useEffect(() => {
    const savedPhoto = localStorage.getItem("adminProfilePhoto");

    if (savedPhoto) {
      setPreview(savedPhoto);
      setSavedPreview(savedPhoto);
    }
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleImageChange(e) {
    const file = e.target.files[0];
    if (!file) return;

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      showToast("Format file tidak didukung. Gunakan JPG, JPEG, atau PNG.", "error");
      e.target.value = "";
      return;
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      showToast(
        `Ukuran file terlalu besar. Maksimal ukuran file adalah ${MAX_FILE_SIZE_MB} MB.`,
        "error"
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

  function handleApplyCroppedPhoto() {
    const cropper = cropperRef.current?.cropper;
    if (!cropper) return;

    const croppedImage = cropper
      .getCroppedCanvas({
        width: 400,
        height: 400,
        imageSmoothingEnabled: true,
        imageSmoothingQuality: "high",
      })
      .toDataURL("image/png");

    setPreview(croppedImage);
    setHasPendingPhotoChange(true);
    setShowCropModal(false);
    setRawImage(null);

    showToast("Foto baru berhasil dipilih.", "success");
  }

  function handleCancelCrop() {
    setShowCropModal(false);
    setRawImage(null);
  }

  function handleCancelPhotoChange() {
    setPreview(savedPreview);
    setHasPendingPhotoChange(false);
    showToast("Perubahan foto dibatalkan.", "error");
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (form.password.trim() !== "" && form.password.length < 6) {
      showToast("Password minimal 6 karakter.", "error");
      return;
    }

    if (form.password.trim() !== "" && form.password !== form.confirmPassword) {
      showToast("Konfirmasi password tidak sama.", "error");
      return;
    }

    setShowSaveModal(true);
  }

  async function handleSaveProfile() {
    try {
      setIsSaving(true);

      const payload = {
        fullName: form.fullName,
        username: form.username,
        email: form.email,
        phoneNumber: form.phoneNumber,
      };

      if (form.password.trim() !== "") {
        payload.password = form.password;
      }

      const result = await updateUserProfile(payload);
      const updatedUser = result.data;

      setUserData(updatedUser);
      setForm((prev) => ({
        ...prev,
        fullName: updatedUser.fullName || "",
        username: updatedUser.username || "",
        email: updatedUser.email || "",
        phoneNumber: updatedUser.phoneNumber || "",
        password: "",
        confirmPassword: "",
      }));

      if (hasPendingPhotoChange && preview) {
        localStorage.setItem("adminProfilePhoto", preview);
        window.dispatchEvent(new Event("profile-photo-updated"));
        setSavedPreview(preview);
        setHasPendingPhotoChange(false);
      }

      setShowSaveModal(false);
      showToast("Profile admin berhasil diperbarui.", "success");
    } catch (error) {
      console.error("Gagal update profile admin:", error);
      showToast(
        error?.data?.message || error.message || "Gagal update profile admin",
        "error"
      );
    } finally {
      setIsSaving(false);
    }
  }

  async function handleLogout() {
    await logoutUser();
    navigate("/login", { replace: true });
  }

  return (
    <div className="relative min-h-screen w-full overflow-y-auto bg-white dark:bg-[#0f172a]">
      <div className="absolute inset-x-0 top-0 h-[460px] overflow-hidden">
        <img
          src={awanbg}
          alt=""
          className="h-full w-full object-cover object-center"
        />
      </div>

      <div className="absolute inset-x-0 top-[460px] bottom-0 bg-white dark:bg-[#111827]" />

      <div className="relative z-10 mx-auto w-full max-w-[760px] px-4 pb-12 pt-[120px]">
        <div className="relative mx-auto w-full max-w-[650px]">
          <div className="absolute left-0 right-0 top-[90px] bottom-0 rounded-[28px] border border-white/70 bg-white/70 shadow-[0_16px_45px_rgba(60,90,110,0.18)] backdrop-blur-md dark:border-white/10 dark:bg-[#1f2937]/90 dark:shadow-[0_16px_45px_rgba(0,0,0,0.45)]" />

          <div className="relative z-10 flex flex-col items-center">
            <div className="relative">
              <div className="h-32 w-32 overflow-hidden rounded-full border-[6px] border-white bg-white shadow-xl dark:border-[#111827] dark:bg-[#111827]">
                <img
                  src={
                    preview ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      form.fullName || form.username || "Admin"
                    )}&background=random`
                  }
                  alt="admin profile"
                  className="h-full w-full object-cover"
                />
              </div>

              <label className="absolute bottom-2 right-2 cursor-pointer rounded-full bg-white p-2 text-[#3f7ca8] shadow-md transition hover:scale-105 dark:bg-[#0f172a] dark:text-sky-300">
                <AiOutlineCamera size={20} />
                <input
                  type="file"
                  accept=".jpg,.jpeg,.png,image/jpeg,image/png"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </label>
            </div>

            <p className="mt-3 text-center text-sm font-medium text-[#294b5f] dark:text-slate-200">
              Klik icon untuk mengganti foto
            </p>

            <p className="mt-1 text-center text-xs text-gray-500 dark:text-slate-300">
              Format: JPG, JPEG, PNG • Maksimal {MAX_FILE_SIZE_MB} MB
            </p>

            {hasPendingPhotoChange && (
              <button
                type="button"
                onClick={handleCancelPhotoChange}
                className="mt-2 rounded-full bg-red-50 px-4 py-1 text-xs font-semibold text-red-500 hover:bg-red-100 dark:bg-red-500/10 dark:text-red-300 dark:hover:bg-red-500/20"
              >
                Batalkan foto baru
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="relative z-10 mt-8 px-4 md:px-8">
            <div className="space-y-5">
              <div className="rounded-2xl border border-[#d8e7ed] bg-white p-5 shadow-[0_8px_24px_rgba(70,110,130,0.14)] dark:border-white/10 dark:bg-[#1e293b] dark:shadow-[0_8px_24px_rgba(0,0,0,0.35)]">
                <h2 className="mb-4 text-base font-bold text-[#19445e] dark:text-white">
                  Admin Profile
                </h2>

                <div className="space-y-3">
                  <Field
                    label="Nama Lengkap"
                    icon={<AiOutlineIdcard />}
                    name="fullName"
                    value={form.fullName}
                    onChange={handleChange}
                    placeholder="Nama Lengkap"
                  />

                  <Field
                    label="Username"
                    icon={<AiOutlineUser />}
                    name="username"
                    value={form.username}
                    onChange={handleChange}
                    placeholder="Username"
                  />

                  <Field
                    label="Email"
                    icon={<AiOutlineMail />}
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Email"
                  />

                  <Field
                    label="No Handphone"
                    icon={<AiOutlinePhone />}
                    name="phoneNumber"
                    value={form.phoneNumber}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "").slice(0, 13);
                      setForm((prev) => ({
                        ...prev,
                        phoneNumber: value,
                      }));
                    }}
                    placeholder="No Handphone"
                  />

                  <h2 className="pt-2 text-base font-bold text-[#19445e] dark:text-white">
                    Update Password
                  </h2>

                  <p className="mb-4 text-xs text-gray-500 dark:text-slate-300">
                    Kosongkan jika tidak ingin mengganti password.
                  </p>

                  <div className="space-y-3">
                    <PasswordInput
                      label="New Password"
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      show={showPassword}
                      setShow={setShowPassword}
                      placeholder="Password baru"
                    />

                    <PasswordInput
                      label="Confirm Password"
                      name="confirmPassword"
                      value={form.confirmPassword}
                      onChange={handleChange}
                      show={showConfirmPassword}
                      setShow={setShowConfirmPassword}
                      placeholder="Konfirmasi password"
                    />
                  </div>
                </div>

                <div className="mt-6 flex justify-between gap-3">
                  <button
                    type="submit"
                    className="rounded-full bg-[#2f6f95] px-5 py-2 text-xs font-bold text-white shadow-md transition hover:bg-[#245a78] disabled:cursor-not-allowed disabled:opacity-60 dark:bg-sky-700 dark:hover:bg-sky-600"
                    disabled={isSaving || isLoadingProfile}
                  >
                    {isSaving ? "Menyimpan..." : "Simpan Perubahan"}
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowLogoutModal(true)}
                    className="rounded-full bg-[#e56b5f] px-5 py-2 text-xs font-bold text-white shadow-md transition hover:bg-[#d35247] dark:bg-red-600 dark:hover:bg-red-500"
                  >
                    Keluar
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>

      {showLogoutModal && (
        <div className="modal modal-open">
          <div className="modal-box bg-white dark:bg-[#1e293b] dark:text-white">
            <h3 className="text-lg font-bold">Yakin ingin logout?</h3>
            <p className="py-3 text-sm text-gray-600 dark:text-slate-300">
              Kamu akan keluar dari akun admin ini.
            </p>

            <div className="modal-action">
              <button
                className="btn btn-ghost dark:text-white"
                onClick={() => setShowLogoutModal(false)}
              >
                Batal
              </button>

              <button
                className="btn btn-error"
                onClick={async () => {
                  setShowLogoutModal(false);
                  await handleLogout();
                }}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {showCropModal && (
        <div className="modal modal-open">
          <div className="modal-box max-w-3xl bg-white dark:bg-[#1e293b]">
            <h3 className="text-lg font-bold text-[#19445e] dark:text-white">
              Atur foto profile
            </h3>

            <p className="py-2 text-sm text-gray-600 dark:text-slate-300">
              Geser dan sesuaikan area foto yang ingin digunakan.
            </p>

            <div className="mt-4 overflow-hidden rounded-2xl bg-slate-100 dark:bg-[#0f172a]">
              <Cropper
                src={rawImage}
                style={{ height: 400, width: "100%" }}
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

            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                className="btn btn-sm"
                onClick={() => cropperRef.current?.cropper?.zoom(0.1)}
              >
                Zoom +
              </button>

              <button
                type="button"
                className="btn btn-sm"
                onClick={() => cropperRef.current?.cropper?.zoom(-0.1)}
              >
                Zoom -
              </button>

              <button
                type="button"
                className="btn btn-sm"
                onClick={() => cropperRef.current?.cropper?.reset()}
              >
                Reset
              </button>
            </div>

            <div className="modal-action">
              <button className="btn btn-ghost dark:text-white" onClick={handleCancelCrop}>
                Batal
              </button>

              <button
                className="btn btn-primary"
                onClick={handleApplyCroppedPhoto}
              >
                Gunakan Foto
              </button>
            </div>
          </div>
        </div>
      )}

      {showSaveModal && (
        <div className="modal modal-open">
          <div className="modal-box bg-white dark:bg-[#1e293b] dark:text-white">
            <h3 className="text-lg font-bold">Simpan perubahan?</h3>

            <p className="py-3 text-sm text-gray-600 dark:text-slate-300">
              Data profile admin yang kamu ubah akan disimpan.
            </p>

            <div className="modal-action">
              <button
                className="btn btn-ghost dark:text-white"
                onClick={() => setShowSaveModal(false)}
                disabled={isSaving}
              >
                Batal
              </button>

              <button
                className="btn btn-primary"
                onClick={handleSaveProfile}
                disabled={isSaving}
              >
                {isSaving ? "Menyimpan..." : "Ya, Simpan"}
              </button>
            </div>
          </div>
        </div>
      )}

      {toast.show && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center pointer-events-none">
          <div
            className={`min-w-[260px] max-w-md rounded-2xl px-6 py-4 text-center text-sm font-semibold shadow-2xl ${
              toast.type === "success"
                ? "bg-green-500 text-white"
                : "bg-red-500 text-white"
            }`}
          >
            {toast.message}
          </div>
        </div>
      )}
    </div>
  );
}

function Field({
  label,
  icon,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
}) {
  return (
    <div>
      <label className="mb-1 block text-xs font-bold text-[#294b5f] dark:text-slate-200">
        {label}
      </label>

      <div className="flex items-center gap-2 rounded-lg border border-[#dce8ed] bg-[#f9fcfd] px-3 py-2 focus-within:border-[#82b6cc] dark:border-white/10 dark:bg-[#0f172a] dark:focus-within:border-[#38bdf8]">
        <span className="text-base text-gray-500 dark:text-slate-400">{icon}</span>

        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full bg-transparent text-xs text-[#1f2937] outline-none placeholder:text-gray-400 dark:text-white dark:placeholder:text-slate-500"
        />
      </div>
    </div>
  );
}

function PasswordInput({
  label,
  name,
  value,
  onChange,
  show,
  setShow,
  placeholder,
}) {
  return (
    <div>
      <label className="mb-1 block text-xs font-bold text-[#294b5f] dark:text-slate-200">
        {label}
      </label>

      <div className="flex items-center gap-2 rounded-lg border border-[#dce8ed] bg-[#f9fcfd] px-3 py-2 focus-within:border-[#82b6cc] dark:border-white/10 dark:bg-[#0f172a] dark:focus-within:border-[#38bdf8]">
        <AiOutlineLock className="text-base text-gray-500 dark:text-slate-400" />

        <input
          type={show ? "text" : "password"}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full bg-transparent text-xs text-[#1f2937] outline-none placeholder:text-gray-400 dark:text-white dark:placeholder:text-slate-500"
        />

        <button
          type="button"
          onClick={() => setShow(!show)}
          className="text-gray-400 hover:text-[#19445e] dark:text-slate-400 dark:hover:text-white"
        >
          {show ? (
            <AiOutlineEyeInvisible size={18} />
          ) : (
            <AiOutlineEye size={18} />
          )}
        </button>
      </div>
    </div>
  );
}