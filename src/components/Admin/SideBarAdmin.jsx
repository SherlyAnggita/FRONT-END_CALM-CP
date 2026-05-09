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
  FiHeart,
  FiChevronRight,
  FiDatabase,
} from "react-icons/fi";

import { IoPulseOutline } from "react-icons/io5";
import { TbBattery, TbMoodNerd, TbMessageHeart } from "react-icons/tb";

export default function SideBarAdmin({ isCollapsed }) {
  const navigate = useNavigate();
  const user = getCurrentUser();

  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [openMasterData, setOpenMasterData] = useState(false);

  const hideUserInfo = isCollapsed || openMasterData;

  const navClass = ({ isActive }) =>
    `flex items-center rounded-lg px-3 py-2 transition-all duration-200 ${
      isCollapsed ? "justify-center" : "gap-3"
    } ${isActive ? "bg-primary text-primary-content" : "hover:bg-base-200"}`;

  async function handleLogout() {
    await logoutUser();
    navigate("/login", { replace: true });
  }

  return (
    <div className="flex h-full min-h-0 flex-col p-3">
      {/* LOGO */}
      <div className="mb-6 flex justify-center">
        <h1
          className="text-3xl font-extrabold italic tracking-[0.25em] whitespace-nowrap
          bg-linear-to-r from-primary via-secondary to-accent
          bg-clip-text text-transparent
          drop-shadow-sm transition-all duration-1000 ease-in-out
          hover:scale-105 hover:-translate-y-0.5 animate-pulse"
        >
          {isCollapsed ? "C" : "CALM"}
        </h1>
      </div>

      {/* USER INFO */}
      <div
        className={`overflow-hidden rounded-xl
        bg-linear-to-r from-blue-400 via-blue-500 to-blue-700
        drop-shadow-sm transition-all duration-500 ease-out
        hover:scale-[1.02] hover:-translate-y-0.5
        ${
          hideUserInfo
            ? "max-h-0 opacity-0 p-0 mb-0"
            : "max-h-40 opacity-100 p-3 mb-6"
        }`}
      >
        <p className="font-semibold">{user?.username || "Admin"}</p>
        <p className="text-sm opacity-80">{user?.email}</p>
      </div>

      {/* MENU */}
      <nav className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto pr-1">
        <NavLink to="/admin" end className={navClass}>
          <FiHome size={18} />
          {!isCollapsed && <span>Dashboard</span>}
        </NavLink>

        <NavLink to="/admin/activity" className={navClass}>
          <FiActivity size={18} />
          {!isCollapsed && <span>Activity</span>}
        </NavLink>

        <NavLink to="/admin/mood-entries" className={navClass}>
          <FiHeart size={18} />
          {!isCollapsed && <span>Mood Entries</span>}
        </NavLink>

        <NavLink to="/admin/encouragement-results" className={navClass}>
          <TbMessageHeart size={18} />
          {!isCollapsed && <span>Encouragement Results</span>}
        </NavLink>

        <NavLink to="/admin/social-battery-logs" className={navClass}>
          <IoPulseOutline size={18} />
          {!isCollapsed && <span>Social Battery Logs</span>}
        </NavLink>

        {/* MASTER DATA */}
        <button
          type="button"
          onClick={() => setOpenMasterData(!openMasterData)}
          className={`flex items-center rounded-lg px-3 py-2 transition-all duration-200 hover:bg-base-200 ${
            isCollapsed ? "justify-center" : "gap-3"
          }`}
        >
          <FiDatabase size={18} />

          {!isCollapsed && (
            <>
              <span className="flex-1 text-left">Master Data</span>

              <FiChevronRight
                size={16}
                className={`transition-transform duration-300 ${
                  openMasterData ? "rotate-90" : "rotate-0"
                }`}
              />
            </>
          )}
        </button>

        {/* MASTER DATA CONTENT */}
        <div
          className={`ml-6 overflow-hidden transition-all duration-300 ease-in-out ${
            openMasterData && !isCollapsed
              ? "max-h-40 opacity-100 translate-y-0 mt-1"
              : "max-h-0 opacity-0 -translate-y-2 mt-0"
          }`}
        >
          <div className="flex flex-col gap-1">
            <NavLink to="/admin/users" className={navClass}>
              <FiUsers size={16} />
              <span>Users</span>
            </NavLink>

            <NavLink to="/admin/mood-labels" className={navClass}>
              <TbMoodNerd size={16} />
              <span>Mood Label</span>
            </NavLink>

            <NavLink to="/admin/status-battery" className={navClass}>
              <TbBattery size={16} />
              <span>Status Battery</span>
            </NavLink>
          </div>
        </div>
      </nav>

      {/* BOTTOM */}
      <div className="flex shrink-0 flex-col gap-2 border-t border-base-300 pt-4">
        <NavLink to="/admin/profile" className={navClass}>
          <FiUser size={18} />
          {!isCollapsed && <span>Profile</span>}
        </NavLink>

        <NavLink to="/admin/settings" className={navClass}>
          <FiSettings size={18} />
          {!isCollapsed && <span>Settings</span>}
        </NavLink>

        <button
          type="button"
          onClick={() => setShowLogoutModal(true)}
          className={`flex w-full items-center rounded-lg px-3 py-2 text-error transition-all duration-200 hover:bg-error/10 active:scale-[0.98] ${
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
          <div className="modal-box animate-[fadeIn_0.15s_ease-out]">
            <h3 className="text-lg font-bold">Yakin ingin logout?</h3>

            <p className="py-3 text-sm opacity-70">
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
                <FiLogOut size={16} />
                Logout
              </button>
            </div>
          </div>

          <div
            className="modal-backdrop"
            onClick={() => setShowLogoutModal(false)}
          />
        </div>
      )}
    </div>
  );
}
