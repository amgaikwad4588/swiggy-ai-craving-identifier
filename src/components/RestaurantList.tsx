"use client";

import { FaStar } from "react-icons/fa";
import { BiFilter } from "react-icons/bi";
import { MdKeyboardArrowDown } from "react-icons/md";

interface Restaurant {
  name: string;
  rating: number;
  deliveryTime: string;
  cuisines: string;
  location: string;
  offer?: string;
  image: string;
  bgColor: string;
  promoted?: boolean;
}

const filters = [
  { label: "Sort", icon: true },
  { label: "Fast Delivery" },
  { label: "Filters" },
  { label: "Cuisines" },
];

const restaurants: Restaurant[] = [
  {
    name: "Burger King",
    rating: 4.2,
    deliveryTime: "30 mins",
    cuisines: "Burgers, American",
    location: "Koramangala",
    offer: "EVERY ITEM ₹129",
    image: "🍔",
    bgColor: "bg-orange-100",
    promoted: true,
  },
  {
    name: "Rollaking",
    rating: 3.7,
    deliveryTime: "25 mins",
    cuisines: "Rolls, Fast Food",
    location: "HSR Layout",
    offer: "₹125 OFF",
    image: "🌯",
    bgColor: "bg-yellow-100",
  },
  {
    name: "Olio - The Wood..",
    rating: 4.3,
    deliveryTime: "35 mins",
    cuisines: "Pizza, Italian, Fast Fo..",
    location: "Koramangala",
    offer: "₹125 OFF",
    image: "🍕",
    bgColor: "bg-red-100",
    promoted: true,
  },
  {
    name: "Sandotchi Kojo...",
    rating: 4.1,
    deliveryTime: "20 mins",
    cuisines: "Sandwich, Fast Food",
    location: "Indiranagar",
    offer: "₹150 OFF",
    image: "🥪",
    bgColor: "bg-green-100",
  },
  {
    name: "Meghana Foods",
    rating: 4.5,
    deliveryTime: "30 mins",
    cuisines: "Biryani, North Indian",
    location: "Koramangala",
    offer: "20% OFF",
    image: "🍛",
    bgColor: "bg-amber-100",
  },
  {
    name: "Pizza Hut",
    rating: 4.0,
    deliveryTime: "25 mins",
    cuisines: "Pizza, Italian",
    location: "BTM Layout",
    offer: "BUY 1 GET 1",
    image: "🍕",
    bgColor: "bg-red-50",
  },
];

export default function RestaurantList() {
  return (
    <div className="mt-6 pb-24">
      <div className="px-4 border-t border-gray-100 pt-4">
        <h2 className="text-base font-bold text-swiggy-dark mb-3">
          Restaurants with online food delivery in Bangalore
        </h2>

        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-3">
          {filters.map((filter) => (
            <button
              key={filter.label}
              className="flex items-center gap-1 px-3 py-1.5 border border-gray-200 rounded-full text-xs font-medium text-swiggy-gray whitespace-nowrap"
            >
              {filter.icon && <BiFilter className="text-base" />}
              {filter.label}
              {filter.label === "Sort" && (
                <MdKeyboardArrowDown className="text-base" />
              )}
            </button>
          ))}
        </div>

        {/* Restaurant Grid */}
        <div className="grid grid-cols-2 gap-4 mt-2">
          {restaurants.map((restaurant) => (
            <div key={restaurant.name} className="cursor-pointer">
              <div className="relative">
                <div
                  className={`w-full h-[130px] rounded-2xl ${restaurant.bgColor} flex items-center justify-center text-5xl overflow-hidden`}
                >
                  {restaurant.image}
                </div>
                {restaurant.promoted && (
                  <span className="absolute top-2 left-2 bg-white/90 text-[9px] text-swiggy-light-gray font-medium px-1.5 py-0.5 rounded">
                    Promoted
                  </span>
                )}
                {restaurant.offer && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent rounded-b-2xl px-2 py-2">
                    <p className="text-white text-[11px] font-extrabold">
                      {restaurant.offer}
                    </p>
                  </div>
                )}
              </div>
              <div className="mt-2">
                <h3 className="text-sm font-semibold text-swiggy-dark truncate">
                  {restaurant.name}
                </h3>
                <div className="flex items-center gap-1 mt-0.5">
                  <div className="flex items-center gap-0.5 bg-green-600 text-white px-1 py-0.5 rounded text-[10px]">
                    <FaStar className="text-[8px]" />
                    <span className="font-bold">{restaurant.rating}</span>
                  </div>
                  <span className="text-xs text-swiggy-light-gray">
                    · {restaurant.deliveryTime}
                  </span>
                </div>
                <p className="text-[11px] text-swiggy-light-gray truncate mt-0.5">
                  {restaurant.cuisines}
                </p>
                <p className="text-[11px] text-swiggy-light-gray">
                  {restaurant.location}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
