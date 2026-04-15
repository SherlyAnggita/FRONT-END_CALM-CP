import { Outlet } from "react-router-dom";
import { useState } from "react";
import SideBarUser from "../../components/User/SideBarUser";
import HeaderUser from "../../components/User/HeaderUser";
import BottomNavUser from "../../components/User/BottomNavUser";

export default function UserLayout() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-base-200">
      <div className="flex min-h-screen">
        <aside
          className={`hidden md:block fixed top-0 left-0 h-screen z-40 border-r border-base-300 bg-base-100 shadow-sm transition-all duration-300 ${
            isCollapsed ? "w-20" : "w-64"
          }`}
        >
          <SideBarUser isCollapsed={isCollapsed} />
        </aside>

        <div
          className={`flex min-h-screen flex-1 flex-col transition-all duration-300
  ${isCollapsed ? "md:ml-20" : "md:ml-64"}`}
        >
          <HeaderUser toggleSidebar={() => setIsCollapsed(!isCollapsed)} />

          <main className="flex-1 p-4 pb-24 md:p-6 md:pb-6">
            <Outlet />
          </main>
        </div>
      </div>

      <BottomNavUser />
    </div>
  );
}
