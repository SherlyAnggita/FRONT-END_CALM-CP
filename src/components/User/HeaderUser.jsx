import { useEffect, useState } from "react";
import { getCurrentUser } from "../../services/authService";
import { FiMenu, FiBell } from "react-icons/fi";
import { Link } from "react-router-dom";

export default function HeaderUser({ toggleSidebar }) {
  const user = getCurrentUser();
  const [profilePhoto, setProfilePhoto] = useState(null);

  const notifications = [
    {
      id: 1,
      title: "Mood Reminder",
      desc: "Jangan lupa isi mood hari ini ya 😊",
    },
    {
      id: 2,
      title: "Calendar Event",
      desc: "Ada event 30 menit lagi",
    },
  ];

  const unreadCount = notifications.length;

  useEffect(() => {
    const loadProfilePhoto = () => {
      const savedPhoto = localStorage.getItem("profilePhoto");
      setProfilePhoto(savedPhoto);
    };

    loadProfilePhoto();
    window.addEventListener("profile-photo-updated", loadProfilePhoto);

    return () => {
      window.removeEventListener("profile-photo-updated", loadProfilePhoto);
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-base-300 bg-base-100/90 backdrop-blur">
      <div className="flex items-center justify-between px-4 py-4 md:px-6">
        <div className="flex items-center gap-3">
          <button
            onClick={toggleSidebar}
            className="btn btn-ghost btn-sm btn-square hidden md:inline-flex"
          >
            <FiMenu size={20} />
          </button>

          <div className="hidden md:block">
            <h2 className="text-lg font-semibold md:text-xl">Dashboard User</h2>
            <p className="text-sm text-base-content/60">
              Selamat datang, {user?.username || "User"}
            </p>
          </div>

          <div className="block md:hidden">
            <Link to="/user" className="block md:hidden">
              <h1
                className="text-2xl font-extrabold italic tracking-[0.25em] whitespace-nowrap
                bg-gradient-to-r from-primary via-secondary to-accent
                bg-clip-text text-transparent
                drop-shadow-sm
                transition-all duration-700 ease-in-out"
              >
                CALM
              </h1>
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden text-right sm:block">
            <p className="font-medium">{user?.username || "User"}</p>
            <p className="text-sm text-base-content/60">{user?.email || "-"}</p>
          </div>

          <div className="dropdown dropdown-end">
            <button
              tabIndex={0}
              className="btn btn-ghost btn-sm btn-circle relative"
            >
              <FiBell size={20} />

              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                  {unreadCount}
                </span>
              )}
            </button>

            <div
              tabIndex={0}
              className="dropdown-content z-[1] mt-3 w-80 rounded-xl bg-base-100 shadow-lg"
            >
              <div className="p-4">
                <h3 className="mb-3 font-semibold">Notifications</h3>

                <div className="max-h-60 space-y-2 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <p className="text-center text-sm text-base-content/60">
                      Tidak ada notifikasi
                    </p>
                  ) : (
                    notifications.map((notif) => (
                      <div
                        key={notif.id}
                        className="rounded-lg bg-base-200 p-3 transition hover:bg-base-300"
                      >
                        <p className="font-medium">{notif.title}</p>
                        <p className="text-sm text-base-content/70">
                          {notif.desc}
                        </p>
                      </div>
                    ))
                  )}
                </div>

                <button className="btn btn-primary btn-sm mt-3 w-full">
                  Lihat semua
                </button>
              </div>
            </div>
          </div>

          <Link to="/user/profile" className="avatar">
            <div className="w-10 rounded-full overflow-hidden bg-primary text-primary-content transition hover:scale-105">
              {profilePhoto ? (
                <img
                  src={profilePhoto}
                  alt="Profile"
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="flex h-full w-full items-center justify-center text-sm font-medium">
                  {(user?.username || user?.email || "U").charAt(0).toUpperCase()}
                </span>
              )}
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
}