import { Outlet } from "react-router-dom";
import { useState } from "react";
import SideBarAdmin from "../../components/Admin/SideBarAdmin";
import HeaderAdmin from "../../components/Admin/HeaderAdmin";

export default function AdminLayout() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  function handleToggleSidebar() {
    if (window.innerWidth < 768) {
      setIsMobileSidebarOpen((prev) => !prev);
    } else {
      setIsCollapsed((prev) => !prev);
    }
  }

  function handleCloseMobileSidebar() {
    setIsMobileSidebarOpen(false);
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-base-200">
      <div className="flex min-h-screen overflow-x-hidden">
        {/* Sidebar desktop */}
        <aside
          className={`fixed top-0 left-0 z-40 hidden h-screen border-r border-base-300 bg-base-100 shadow-sm transition-all duration-300 md:block ${
            isCollapsed ? "w-20" : "w-64"
          }`}
        >
          <SideBarAdmin isCollapsed={isCollapsed} />
        </aside>

        {/* Sidebar mobile overlay */}
        {isMobileSidebarOpen && (
          <>
            <div
              className="fixed inset-0 z-40 bg-black/40 md:hidden"
              onClick={handleCloseMobileSidebar}
            />
            <aside className="fixed top-0 left-0 z-50 h-screen w-64 border-r border-base-300 bg-base-100 shadow-sm md:hidden">
              <SideBarAdmin isCollapsed={false} />
            </aside>
          </>
        )}

        {/* Main content */}
        <div
          className={`flex min-h-screen min-w-0 flex-1 flex-col overflow-x-hidden transition-all duration-300 ${
            isCollapsed ? "md:ml-20" : "md:ml-64"
          }`}
        >
          <HeaderAdmin toggleSidebar={handleToggleSidebar} />

          <main className="min-w-0 flex-1 overflow-x-hidden p-4 pb-24 md:p-6 md:pb-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
