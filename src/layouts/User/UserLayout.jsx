import { Outlet } from "react-router-dom";
import { useState } from "react";

import SideBarUser from "../../components/User/SideBarUser";
import HeaderUser from "../../components/User/HeaderUser";
import BottomNavUser from "../../components/User/BottomNavUser";

import cloudSmall from "../../assets/cloud-small1.png";
import star1 from "../../assets/star1.png";

export default function UserLayout() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#1f4d7a] via-[#5f87b3] to-[#dbe8f5] dark:from-[#0f172a] dark:via-[#17263c] dark:to-[#223449]">
      {/* ===== STARS ===== */}
      <img
        src={star1}
        alt=""
        className="pointer-events-none absolute top-[5%] left-[55%] w-90 opacity-80"
      />

      <img
        src={star1}
        alt=""
        className="pointer-events-none absolute top-[60%] left-[20%] w-60 opacity-100"
      />

      <img
        src={star1}
        alt=""
        className="pointer-events-none absolute top-[6%] right-[0%] w-80 opacity-100"
      />

      <img
        src={star1}
        alt=""
        className="pointer-events-none absolute top-[20%] right-[10%] w-4 opacity-80"
      />

      <img
        src={star1}
        alt=""
        className="pointer-events-none absolute top-[5%] left-[10%] w-80 opacity-100"
      />

      <img
        src={star1}
        alt=""
        className="pointer-events-none absolute bottom-[1%] left-[15%] w-90 opacity-80"
      />

      <img
        src={star1}
        alt=""
        className="pointer-events-none absolute bottom-[1%] right-[28%] w-80 opacity-100"
      />

      <img
        src={star1}
        alt=""
        className="pointer-events-none absolute bottom-[8%] right-[35%] w-4 opacity-80"
      />

      {/* ===== CLOUDS ===== */}
      <img
        src={cloudSmall}
        alt=""
        className="pointer-events-none absolute top-[10%] left-[35%] w-50 opacity-60"
      />

      <img
        src={cloudSmall}
        alt=""
        className="pointer-events-none absolute top-[12%] right-[-2%] w-60 opacity-60"
      />

      <img
        src={cloudSmall}
        alt=""
        className="pointer-events-none absolute bottom-[24%] right-[-1%] w-70 opacity-60"
      />

      <img
        src={cloudSmall}
        alt=""
        className="pointer-events-none absolute bottom-[15%] left-[-20%] w-45 opacity-100"
      />

      {/* ===== MAIN LAYOUT ===== */}
      <div className="relative z-10 flex min-h-screen">
        <aside
          className={`hidden md:block fixed top-0 left-0 h-screen z-40 bg-base-100 shadow-sm transition-all duration-300 ${
            isCollapsed ? "w-20" : "w-64"
          }`}
        >
          <SideBarUser isCollapsed={isCollapsed} />
        </aside>

        {/* <div
          className={`flex min-h-screen flex-1 flex-col transition-all duration-300 ${
            isCollapsed ? "md:ml-20" : "md:ml-64"
          }`}
        >
          <HeaderUser toggleSidebar={() => setIsCollapsed(!isCollapsed)} />

          <main className="flex-1 p-4 pb-24 md:p-6 md:pb-6">
            <Outlet />
          </main>
        </div> */}

        <div
          className={`flex h-screen w-full flex-col transition-all duration-300 ${
            isCollapsed ? "md:ml-20" : "md:ml-64"
          }`}
        >
          <HeaderUser toggleSidebar={() => setIsCollapsed(!isCollapsed)} />

          <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 pb-24 md:p-6 md:pb-6">
            <Outlet />
          </main>
        </div>
      </div>

      <BottomNavUser />
    </div>
  );
}
