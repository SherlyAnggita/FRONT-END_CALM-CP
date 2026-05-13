import { NavLink } from "react-router-dom";
import { FiHome, FiBattery, FiHeart, } from "react-icons/fi";

export default function BottomNavUser() {
    const mobileNavClass = ({ isActive }) =>
    `flex flex-col items-center justify-center gap-1 py-2 text-xs transition-colors ${
      isActive ? "text-primary" : "text-base-content/70"
    }`;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 h-16 border-t border-base-300 bg-base-100 shadow md:hidden">
      <div className="grid h-full grid-cols-3">
        <NavLink to="/user/social-battery" className={mobileNavClass}>
          <FiBattery size={20} />
          <span>Battery</span>
        </NavLink>

        <NavLink to="/user" end className={mobileNavClass}>
          <FiHome size={20} />
          <span>Home</span>
        </NavLink>

        <NavLink to="/user/mood" className={mobileNavClass}>
          <FiHeart size={20} />
          <span>Mood</span>
        </NavLink>
      </div>
    </nav>
  );
}
