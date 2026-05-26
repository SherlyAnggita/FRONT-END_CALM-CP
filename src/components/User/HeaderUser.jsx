import { useEffect, useState, useRef, useCallback } from "react";
import { getCurrentUser, logoutUser } from "../../services/authService";
import { FiMenu, FiBell, FiUser, FiSettings, FiLogOut, FiSun, FiMoon } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import {
  getNotifications,
  getUnreadNotificationCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "../../services/User/notificationService";

import cloudSmall from "../../assets/cloud-small1.png";
import LogoutModal from "../LogoutModal/LogoutModal";

export default function HeaderUser({ toggleSidebar }) {
  const [user, setUser] = useState(getCurrentUser());
  const profileDropdownRef = useRef(null);

  const [notifOpen, setNotifOpen] = useState(false);
  const notifDropdownRef = useRef(null);

  const closeProfileDropdown = () => {
    profileDropdownRef.current?.removeAttribute("open");
  };

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  async function handleLogout() {
    await logoutUser();
    navigate("/login", { replace: true });
  }

  const loadNotifications = useCallback(async () => {
    try {
      const notifRes = await getNotifications();
      const countRes = await getUnreadNotificationCount();

      setNotifications(notifRes.data || []);
      setUnreadCount(countRes.data?.count || 0);
    } catch (error) {
      console.error("Gagal mengambil notifikasi:", error);
    }
  }, []);

  const handleReadNotification = async (id) => {
    setNotifications((prev) =>
      prev.map((n) =>
        n.id === id ? { ...n, readAt: new Date().toISOString() } : n,
      ),
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
    try {
      await markNotificationAsRead(id);
      await loadNotifications();
    } catch (error) {
      console.error("Gagal membaca notifikasi:", error);
    }
  };

  const handleReadAll = async () => {
    setNotifications((prev) =>
      prev.map((n) => ({ ...n, readAt: new Date().toISOString() })),
    );
    setUnreadCount(0);
    try {
      await markAllNotificationsAsRead();
      await loadNotifications();
    } catch (error) {
      console.error("Gagal membaca semua notifikasi:", error);
    }
  };

  useEffect(() => {
    const loadUser = () => {
      setUser(getCurrentUser());
    };

    loadUser();
    window.addEventListener("profile-photo-updated", loadUser);

    return () => {
      window.removeEventListener("profile-photo-updated", loadUser);
    };
  }, []);

  useEffect(() => {
    const init = async () => {
      try {
        const notifRes = await getNotifications();
        const countRes = await getUnreadNotificationCount();
        setNotifications(notifRes.data || []);
        setUnreadCount(countRes.data?.count || 0);
      } catch (error) {
        console.error("Gagal mengambil notifikasi:", error);
      }
    };
    init();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target)
      ) {
        closeProfileDropdown();
      }
      if (
        notifDropdownRef.current &&
        !notifDropdownRef.current.contains(event.target)
      ) {
        setNotifOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

const [isDark, setIsDark] = useState(() => {
  return localStorage.getItem("theme") === "dark";
});

useEffect(() => {
  const theme = isDark ? "dark" : "light";

  document.documentElement.classList.toggle("dark", isDark);
  document.body.classList.toggle("dark", isDark);

  document.documentElement.setAttribute("data-theme", theme);
  document.body.setAttribute("data-theme", theme);

  localStorage.setItem("theme", theme);
}, [isDark]);

  return (
    <>
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
              <h2 className="text-lg font-semibold md:text-xl">
                Dashboard User
              </h2>
              {/* <p className="text-sm text-base-content/60">
              Selamat datang, {user?.username || "User"}
            </p> */}
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
            {/* <div className="hidden text-right sm:block">
            <p className="font-medium">{user?.username || "User"}</p>
            <p className="text-sm text-base-content/60">{user?.email || "-"}</p>
          </div> */}

          <button
            type="button"
            onClick={() => setIsDark((prev) => !prev)}
            className={`relative flex h-9 w-20 items-center overflow-hidden rounded-full border transition-all duration-700 ${
              isDark
                ? "border-slate-600 bg-gradient-to-r from-[#0F172A] to-[#1E293B]"
                : "border-[#B9DDF5] bg-gradient-to-r from-[#BFE7FF] to-[#D9F1FF]"
            }`}
          >
            {/* STARS */}
            <div
              className={`absolute inset-0 transition-opacity duration-700 ${
                isDark ? "opacity-100" : "opacity-0"
              }`}
            >
              <span className="absolute left-4 top-2 h-1 w-1 rounded-full bg-white" />
              <span className="absolute right-5 top-3 h-1.5 w-1.5 rounded-full bg-white" />
              <span className="absolute bottom-3 left-7 h-1 w-1 rounded-full bg-white" />
              <span className="absolute bottom-2 right-8 h-2 w-2 rounded-full bg-white/90" />
            </div>

            {/* CLOUD */}
            {!isDark && (
              <img  src={cloudSmall}  alt="cloud"  className=" absolute left-5 top-1/2 z-10 w-12 -translate-y-1/2 opacity-100 "
              />
            )}

            {/* TOGGLE */}
            <div
              className={`absolute top-1/2 z-20 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full shadow-lg transition-all duration-700 ${
                isDark
                  ? "left-1 bg-[#F8FAFC] shadow-white/20"
                  : "left-[48px] bg-[#FFD76A] shadow-yellow-300/50"
              }`}
            >
              {isDark ? (
                <div className="relative h-5 w-5 rounded-full bg-[#E5E7EB]">
                  <span className="absolute left-0 top-0 h-2 w-2 rounded-full bg-[#D4D4C8]" />
                  <span className="absolute bottom-1 right-0 h-1.5 w-1.5 rounded-full bg-[#D4D4C8]" />
                </div>
              ) : (
                <FiSun
                  size={16}
                  className="text-yellow-500"
                />
              )}
            </div>
          </button>

            <div ref={notifDropdownRef} className="relative">
              <button
                onClick={() => {
                  if (!notifOpen) loadNotifications();
                  setNotifOpen((prev) => !prev);
                }}
                className="btn btn-ghost btn-sm btn-circle relative"
              >
                <FiBell size={24} />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                    {unreadCount}
                  </span>
                )}
              </button>

              {notifOpen && (
                <div className="absolute right-0 z-50 mt-3 w-80 rounded-xl bg-base-100 shadow-lg">
                  <div className="p-4">
                    <h3 className="mb-3 font-semibold">Notifications</h3>
                    <div className="max-h-60 space-y-2 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <p className="text-center text-sm text-base-content/60">
                          Tidak ada notifikasi
                        </p>
                      ) : (
                        notifications.slice(0, 5).map((notif) => (
                          <div
                            key={notif.id}
                            onClick={() => handleReadNotification(notif.id)}
                            className={`rounded-lg p-3 transition hover:bg-base-300 ${
                              !notif.readAt ? "bg-primary/10" : "bg-base-200"
                            }`}
                          >
                            <p className="font-medium">{notif.title}</p>
                            <p className="text-sm text-base-content/70 whitespace-pre-line line-clamp-3">
                              {notif.message}
                            </p>
                          </div>
                        ))
                      )}
                    </div>
                    <div className="mt-3 flex items-center gap-2">
                      <button
                        onClick={handleReadAll}
                        className="btn btn-ghost btn-sm flex-1 text-base-content/60 hover:text-primary"
                      >
                        Tandai dibaca
                      </button>
                      <Link
                        to="/user/notifications"
                        onClick={() => setNotifOpen(false)}
                        className="btn btn-primary btn-sm flex-1"
                      >
                        Lihat semua
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <details ref={profileDropdownRef} className="dropdown dropdown-end">
              <summary className="list-none cursor-pointer avatar transition hover:scale-105">
                <div className="w-10 rounded-full overflow-hidden bg-primary text-primary-content">
                  {user?.profilePhotoUrl ? (
                    <img
                      src={`${user.profilePhotoUrl}?updated=${encodeURIComponent(
                        user.updatedAt || Date.now(),
                      )}`}
                      alt="Profile"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="flex h-full w-full items-center justify-center text-sm font-medium">
                      {(user?.username || user?.email || "U")
                        .charAt(0)
                        .toUpperCase()}
                    </span>
                  )}
                </div>
              </summary>

              <ul className="menu dropdown-content z-[1] mt-3 w-48 rounded-xl bg-base-100 p-2 shadow-lg">
                <li>
                  <Link
                    to="/user/profile"
                    onClick={closeProfileDropdown}
                    className="flex items-center gap-2"
                  >
                    <FiUser size={16} />
                    Profile
                  </Link>
                </li>

                <li>
                  <Link
                    to="/user/settings"
                    onClick={closeProfileDropdown}
                    className="flex items-center gap-2"
                  >
                    <FiSettings size={16} />
                    Settings
                  </Link>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => {
                      closeProfileDropdown();
                      setShowLogoutModal(true);
                    }}
                    className="flex items-center gap-2 text-red-500"
                  >
                    <FiLogOut size={16} />
                    Logout
                  </button>
                </li>
              </ul>
            </details>
          </div>
        </div>
      </header>

      <LogoutModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={() => {
          setShowLogoutModal(false);
          handleLogout();
        }}
      />
    </>
  );
}
