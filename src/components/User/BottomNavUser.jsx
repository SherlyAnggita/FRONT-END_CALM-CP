import { NavLink } from "react-router-dom";
import { FiHome, FiBattery, } from "react-icons/fi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faJar } from "@fortawesome/free-solid-svg-icons";

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
          <span className="flex h-[20px] w-[20px] items-center justify-center">
            <FontAwesomeIcon
              icon={faJar}
              className="translate-y-[1px] text-[18px]"
            />
          </span>
          <span>Mood Jar</span>
        </NavLink>
      </div>
    </nav>
  );
}
