import { NavLink, useNavigate } from "react-router-dom";
import { logoutUser, getCurrentUser } from "../../services/authService";
import { useState } from "react";
import {
  FiHome,
  FiUser,
  FiLogOut,
  FiSettings,
  FiActivity,
  FiUsers,
} from "react-icons/fi";
import { TbBattery, TbMoodNerd } from "react-icons/tb";

export default function SideBarAdmin({ isCollapsed }) {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const navClass = ({ isActive }) =>
    `flex items-center rounded-lg px-3 py-2 transition-colors ${
      isCollapsed ? "justify-center" : "gap-3"
    } ${isActive ? "bg-primary text-primary-content" : "hover:bg-base-200"}`;

  async function handleLogout() {
  await logoutUser();
  navigate("/login", { replace: true });
}

  return (
    <div className="flex h-full flex-col p-3">
      {/* LOGO */}
      <div className="mb-6 flex justify-center">
        <h1
          className="text-3xl font-extrabold italic tracking-[0.25em] whitespace-nowrap
          bg-linear-to-r from-primary via-secondary to-accent
          bg-clip-text text-transparent
          drop-shadow-sm
          transition-all duration-1000 ease-in-out
          hover:scale-105 hover:-translate-y-0.5
          animate-pulse"
        >
          {isCollapsed ? "C" : "CALM"}
        </h1>
      </div>

      {/* USER INFO */}
      <div
        className={`overflow-hidden rounded-xl
        bg-linear-to-r from-blue-400 via-blue-500 to-blue-700
        drop-shadow-sm transition-all duration-1000 ease-out
        hover:scale-[1.02] hover:-translate-y-0.5
        ${
          isCollapsed
            ? "max-h-0 opacity-0 p-0 mb-0"
            : "max-h-40 opacity-100 p-3 mb-6"
        }`}
      >
        <p className="font-semibold">{user?.username || "Admin"}</p>
        <p className="text-sm opacity-80">{user?.email}</p>
      </div>

      {/* MENU */}
      <nav className="flex flex-col gap-2">
        <NavLink to="/admin" end className={navClass}>
          <FiHome size={18} />
          {!isCollapsed && <span>Dashboard</span>}
        </NavLink>

        <NavLink to="/admin/activity" className={navClass}>
          <FiActivity size={18} />
          {!isCollapsed && <span>Activity</span>}
        </NavLink>

        <NavLink to="/admin/users" className={navClass}>
          <FiUsers size={18} />
          {!isCollapsed && <span>Users</span>}
        </NavLink>
        <NavLink to="/admin/mood-labels" className={navClass}>
          <TbMoodNerd size={18} />
          {!isCollapsed && <span>Mood Label</span>}
        </NavLink>
        <NavLink to="/admin/status-battery" className={navClass}>
          <TbBattery size={18} />
          {!isCollapsed && <span>Status Battery</span>}
        </NavLink>
      </nav>

      {/* BOTTOM */}
      <div className="mt-auto flex flex-col gap-2 pt-4 border-t border-base-300">
        <NavLink to="/admin/profile" className={navClass}>
          <FiUser size={18} />
          {!isCollapsed && <span>Profile</span>}
        </NavLink>

        <NavLink to="/admin/settings" className={navClass}>
          <FiSettings size={18} />
          {!isCollapsed && <span>Settings</span>}
        </NavLink>

        <button
          onClick={() => setShowLogoutModal(true)}
          className={`flex w-full items-center px-3 py-2 text-red-500 hover:bg-base-200 rounded-lg ${
            isCollapsed ? "justify-center" : "gap-3"
          }`}
        >
          <FiLogOut size={18} />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>

      {/* MODAL */}
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
