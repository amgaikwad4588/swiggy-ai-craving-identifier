"use client";

import { HiOutlineLocationMarker } from "react-icons/hi";
import { MdKeyboardArrowDown } from "react-icons/md";
import { BiUser } from "react-icons/bi";
import { RiDiscountPercentLine } from "react-icons/ri";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white px-4 py-3 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-1 cursor-pointer">
        <HiOutlineLocationMarker className="text-swiggy-orange text-xl" />
        <div className="flex items-center gap-0.5">
          <span className="font-bold text-sm text-swiggy-dark">Ayodhya Nagar,Nagpur</span>
          <MdKeyboardArrowDown className="text-swiggy-orange text-xl" />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <button className="flex items-center gap-1 text-sm font-medium text-swiggy-dark">
          <RiDiscountPercentLine className="text-lg text-swiggy-orange" />
          <span>Offers</span>
        </button>
        <button>
          <BiUser className="text-2xl text-swiggy-dark" />
        </button>
      </div>
    </header>
  );
}
