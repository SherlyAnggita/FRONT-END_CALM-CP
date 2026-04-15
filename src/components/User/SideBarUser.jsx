import { NavLink, useNavigate } from "react-router-dom";
import { logoutUser, getCurrentUser } from "../../services/authService";
import { useState } from "react";
import {
  FiHome,
  FiUser,
  FiLogOut,
  FiCalendar,
  FiBattery,
  FiSettings,
  FiHeart,
} from "react-icons/fi";

export default function SideBarUser({ isCollapsed }) {
  const navigate = useNavigate();
  const user = getCurrentUser();

  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const navClass = ({ isActive }) =>
    `flex items-center rounded-lg px-3 py-2 transition-colors ${
      isCollapsed ? "justify-center" : "gap-3"
    } ${isActive ? "bg-primary text-primary-content" : "hover:bg-base-200"}`;

  function handleLogout() {
    logoutUser();
    navigate("/login");
  }

  return (
    <div className="flex h-full flex-col p-3">
      <div className="mb-6 flex justify-center">
        <h1
          className="text-3xl font-extrabold italic tracking-[0.25em] whitespace-nowrap
          bg-gradient-to-r from-primary via-secondary to-accent
          bg-clip-text text-transparent
          drop-shadow-sm
          transition-all duration-1000 ease-in-out
          hover:scale-105 hover:-translate-y-0.5
          animate-pulse"
        >
          {isCollapsed ? "C" : "CALM"}
        </h1>
      </div>

      <div
        className={`overflow-hidden rounded-xl
        bg-gradient-to-r from-blue-400 via-blue-500 to-blue-700
        drop-shadow-sm transition-all duration-1000 ease-out
        hover:scale-[1.02] hover:-translate-y-0.5
        ${
          isCollapsed
            ? "max-h-0 opacity-0 p-0 mb-0"
            : "max-h-40 opacity-100 p-3 mb-6"
        }`}
      >
        <p className="font-semibold text-white">{user?.username || "User"}</p>
        <p className="text-sm text-white/80">{user?.email || "-"}</p>
      </div>

      <nav className="flex flex-col gap-2">
        <NavLink to="/user" end className={navClass}>
          <FiHome size={18} />
          {!isCollapsed && <span>Home</span>}
        </NavLink>

        <NavLink to="/user/battery" className={navClass}>
          <FiBattery size={18} />
          {!isCollapsed && <span>Social Battery</span>}
        </NavLink>

        <NavLink to="/user/calendar" className={navClass}>
          <FiCalendar size={18} />
          {!isCollapsed && <span>Calendar Event</span>}
        </NavLink>

        <NavLink to="/user/mood" className={navClass}>
          <FiHeart size={18} />
          {!isCollapsed && <span>Mood Jar</span>}
        </NavLink>
      </nav>

      <div className="mt-auto flex flex-col gap-2 pt-4 border-t border-base-300">
        <NavLink to="/user/profile" className={navClass}>
          <FiUser size={18} />
          {!isCollapsed && <span>Profile</span>}
        </NavLink>

        <NavLink to="/user/settings" className={navClass}>
          <FiSettings size={18} />
          {!isCollapsed && <span>Settings</span>}
        </NavLink>

        <button
          onClick={() => setShowLogoutModal(true)}
          className={`flex w-full items-center rounded-lg px-3 py-2 text-red-500 transition-colors hover:bg-base-200 ${
            isCollapsed ? "justify-center" : "gap-3"
          }`}
        >
          <FiLogOut size={18} />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>

      {showLogoutModal && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Yakin ingin logout?</h3>
            <p className="py-3 text-sm text-white-600">
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
    </div>
  );
}