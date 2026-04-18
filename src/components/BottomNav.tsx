"use client";

import { GoHome, GoHomeFill } from "react-icons/go";
import { MdFastfood, MdOutlineFastfood } from "react-icons/md";
import { BsLightning, BsLightningFill } from "react-icons/bs";
import { RiStore2Line, RiStore2Fill } from "react-icons/ri";
import { IoFlashOutline } from "react-icons/io5";

interface NavItem {
  label: string;
  icon: React.ReactNode;
  activeIcon: React.ReactNode;
  active?: boolean;
}

const navItems: NavItem[] = [
  {
    label: "Swiggy",
    icon: <GoHome className="text-xl" />,
    activeIcon: <GoHomeFill className="text-xl" />,
    active: true,
  },
  {
    label: "Food",
    icon: <MdOutlineFastfood className="text-xl" />,
    activeIcon: <MdFastfood className="text-xl" />,
  },
  {
    label: "Genie",
    icon: <BsLightning className="text-xl" />,
    activeIcon: <BsLightningFill className="text-xl" />,
  },
  {
    label: "Bolt",
    icon: <IoFlashOutline className="text-xl" />,
    activeIcon: <IoFlashOutline className="text-xl" />,
  },
  {
    label: "Dineout",
    icon: <RiStore2Line className="text-xl" />,
    activeIcon: <RiStore2Fill className="text-xl" />,
  },
];

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] bg-white border-t border-gray-100 z-50">
      <div className="flex justify-around items-center py-2">
        {navItems.map((item) => (
          <button
            key={item.label}
            className="flex flex-col items-center gap-0.5 cursor-pointer"
          >
            <span
              className={
                item.active ? "text-swiggy-orange" : "text-swiggy-light-gray"
              }
            >
              {item.active ? item.activeIcon : item.icon}
            </span>
            <span
              className={`text-[10px] font-semibold ${
                item.active ? "text-swiggy-orange" : "text-swiggy-light-gray"
              }`}
            >
              {item.label}
            </span>
          </button>
        ))}
      </div>
      {/* Home indicator bar */}
      <div className="flex justify-center pb-1">
        <div className="w-32 h-1 bg-gray-900 rounded-full" />
      </div>
    </nav>
  );
}
