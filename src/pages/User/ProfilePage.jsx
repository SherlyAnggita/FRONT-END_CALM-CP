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
import cloudSmall1 from "../../assets/cloud-small1.png";
import cloudSmall2 from "../../assets/cloud-small2.png";
import cloudSmall3 from "../../assets/cloud-small3.png";
import cloudSmall4 from "../../assets/cloud-small4.png";
import star1 from "../../assets/star1.png";
import star2 from "../../assets/star2.png";
import star3 from "../../assets/star3.png";
import star4 from "../../assets/star4.png";

export default function ProfilePage() {
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

  const [savedPreview, setSavedPreview] = useState(null);

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
        console.error("Gagal ambil data profile:", error);

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
    const savedPhoto = localStorage.getItem("profilePhoto");
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

    if (
      form.password.trim() !== "" &&
      form.password !== form.confirmPassword
    ) {
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
        localStorage.setItem("profilePhoto", preview);
        window.dispatchEvent(new Event("profile-photo-updated"));
        setSavedPreview(preview);
        setHasPendingPhotoChange(false);
      }

      setShowSaveModal(false);
      showToast("Profile berhasil diperbarui.", "success");
    } catch (error) {
      console.error("Gagal update profile:", error);
      showToast(
        error?.data?.message || error.message || "Gagal update profile",
        "error"
      );
    } finally {
      setIsSaving(false);
    }
  }

  function handleLogout() {
    logoutUser();
    navigate("/login");
  }

  return (
    <div className="w-full overflow-y-auto bg-gradient-to-br from-[#4d739a] via-[#7fb0da] to-[#d8ecfb] py-8">
      <div className="container mx-auto px-4 lg:px-8 pb-10">
        <div className="mx-auto w-full max-w-3xl">
          <img
            src={cloudSmall1}
            alt=""
            className="absolute left-8 top-8 w-40 opacity-70 lg:left-10 lg:top-10 lg:w-52"
          />
          <img
            src={cloudSmall2}
            alt=""
            className="absolute right-10 top-12 w-36 opacity-60 lg:right-20 lg:top-16 lg:w-44"
          />
          <img
            src={cloudSmall3}
            alt=""
            className="absolute bottom-8 left-10 w-32 opacity-60 lg:bottom-10 lg:left-20 lg:w-40"
          />
          <img
            src={cloudSmall4}
            alt=""
            className="absolute bottom-10 right-8 w-36 opacity-50 lg:bottom-12 lg:right-10 lg:w-48"
          />

          <img
            src={star1}
            alt=""
            className="absolute top-20 left-10 w-100 opacity-80 animate-pulse"
          />
          <img
            src={star2}
            alt=""
            className="absolute top-32 right-10 w-100 opacity-80 animate-pulse"
          />
          <img
            src={star3}
            alt=""
            className="absolute bottom-48 right-[25%] w-100 opacity-80 animate-pulse"
          />
          <img
            src={star4}
            alt=""
            className="absolute bottom-32 left-[30%] w-100 opacity-80 animate-pulse"
          />

          <div className="card bg-white/60 backdrop-blur-lg shadow-[0_10px_40px_rgba(120,170,220,0.25)] border border-white/40">
            <div className="card-body p-6 lg:p-10">
              <h1 className="mb-6 text-center text-3xl font-extrabold text-[#19445e] drop-shadow-sm">
                Profile
              </h1>

              <div className="flex flex-col items-center mb-6">
                <div className="relative">
                  <div className="avatar">
                    <div className="w-28 rounded-full ring ring-[#a8d0f0] ring-offset-base-100 ring-offset-2">
                      <img
                        src={
                          preview ||
                          `https://ui-avatars.com/api/?name=${encodeURIComponent(
                            form.fullName || form.username || "User"
                          )}&background=random`
                        }
                        alt="profile"
                      />
                    </div>
                  </div>

                  <label className="absolute bottom-0 right-0 cursor-pointer rounded-full bg-primary p-2 text-white shadow-md hover:scale-105 transition">
                    <AiOutlineCamera size={18} />
                    <input
                      type="file"
                      accept=".jpg,.jpeg,.png,image/jpeg,image/png"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                  </label>
                </div>

                <p className="mt-3 text-sm text-gray-600 text-center">
                  Klik icon untuk mengganti foto
                </p>
                <p className="mt-1 text-xs text-gray-500 text-center">
                  Format: JPG, JPEG, PNG • Maksimal {MAX_FILE_SIZE_MB} MB
                </p>

                {hasPendingPhotoChange && (
                  <button
                    type="button"
                    onClick={handleCancelPhotoChange}
                    className="mt-3 btn btn-ghost btn-sm text-[#19445e]"
                  >
                    Batalkan foto baru
                  </button>
                )}
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <Field
                  label="Nama Lengkap"
                  icon={<AiOutlineUser />}
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
                    let value = e.target.value;
                    value = value.replace(/\D/g, "");
                    value = value.slice(0, 13);

                    setForm((prev) => ({
                      ...prev,
                      phoneNumber: value,
                    }));
                  }}
                  placeholder="No Handphone"
                />

                <div className="mt-6 rounded-2xl bg-[#f0f7ff] p-5 shadow-inner">
                  <h2 className="text-lg font-semibold text-[#19445e]">
                    Ubah Password
                  </h2>
                  <p className="mb-4 text-sm text-gray-600">
                    Isi jika ingin mengganti password
                  </p>

                  <div className="space-y-4">
                    <div>
                      <label className="mb-1 block text-sm font-semibold text-[#19445e]">
                        Password baru
                      </label>

                      <div className="flex items-center gap-3 rounded-xl border border-[#dbeafe] bg-white/70 px-4 py-3 focus-within:border-[#93c5fd] focus-within:ring-2 focus-within:ring-[#bfdbfe]">
                        <AiOutlineLock className="text-gray-500 text-lg" />

                        <input
                          type={showPassword ? "text" : "password"}
                          name="password"
                          value={form.password}
                          onChange={handleChange}
                          placeholder="Password baru"
                          className="w-full bg-transparent text-sm text-[#1f2937] outline-none placeholder:text-gray-400"
                        />

                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="text-gray-400 hover:text-[#19445e]"
                        >
                          {showPassword ? (
                            <AiOutlineEyeInvisible size={20} />
                          ) : (
                            <AiOutlineEye size={20} />
                          )}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="mb-1 block text-sm font-semibold text-[#19445e]">
                        Konfirmasi Password
                      </label>

                      <div className="flex items-center gap-3 rounded-xl border border-[#dbeafe] bg-white/70 px-4 py-3 focus-within:border-[#93c5fd] focus-within:ring-2 focus-within:ring-[#bfdbfe]">
                        <AiOutlineLock className="text-gray-500 text-lg" />

                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          name="confirmPassword"
                          value={form.confirmPassword}
                          onChange={handleChange}
                          placeholder="Konfirmasi password"
                          className="w-full bg-transparent text-sm text-[#1f2937] outline-none placeholder:text-gray-400"
                        />

                        <button
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          className="text-gray-400 hover:text-[#19445e]"
                        >
                          {showConfirmPassword ? (
                            <AiOutlineEyeInvisible size={20} />
                          ) : (
                            <AiOutlineEye size={20} />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-between">
                  <button
                    type="button"
                    onClick={() => setShowLogoutModal(true)}
                    className="btn btn-error rounded-full px-6"
                  >
                    Logout
                  </button>

                  <button
                    type="submit"
                    className="btn btn-primary rounded-full px-8"
                    disabled={isSaving}
                  >
                    {isSaving ? "Menyimpan..." : "Simpan"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {showLogoutModal && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Yakin ingin logout?</h3>
            <p className="py-3 text-sm text-gray-600">
              Kamu akan keluar dari akun ini.
            </p>

            <div className="modal-action">
              <button
                className="btn btn-ghost"
                onClick={() => setShowLogoutModal(false)}
              >
                Batal
              </button>

              <button
                className="btn btn-error"
                onClick={() => {
                  setShowLogoutModal(false);
                  handleLogout();
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
          <div className="modal-box max-w-3xl">
            <h3 className="text-lg font-bold text-[#19445e]">
              Atur foto profile
            </h3>
            <p className="py-2 text-sm text-gray-600">
              Geser dan sesuaikan area foto yang ingin digunakan.
            </p>

            <div className="mt-4 overflow-hidden rounded-2xl bg-slate-100">
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
              <button className="btn btn-ghost" onClick={handleCancelCrop}>
                Batal
              </button>
              <button className="btn btn-primary" onClick={handleApplyCroppedPhoto}>
                Gunakan Foto
              </button>
            </div>
          </div>
        </div>
      )}

      {showSaveModal && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="text-lg font-bold">Simpan perubahan?</h3>
            <p className="py-3 text-sm text-gray-600">
              Data profile yang kamu ubah akan disimpan.
            </p>

            <div className="modal-action">
              <button
                className="btn btn-ghost"
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

/* FIELD COMPONENT */
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
      <label className="mb-1 block text-sm font-semibold text-[#19445e]">
        {label}
      </label>

      <div className="flex items-center gap-3 rounded-xl border border-[#dbeafe] bg-white/70 px-4 py-3 focus-within:border-[#93c5fd] focus-within:ring-2 focus-within:ring-[#bfdbfe]">
        <span className="text-lg text-gray-500">{icon}</span>
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full bg-transparent text-sm text-[#1f2937] outline-none placeholder:text-gray-400"
        />
      </div>
    </div>
  );
}