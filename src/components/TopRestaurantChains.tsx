"use client";

import { FaStar } from "react-icons/fa";

interface RestaurantChain {
  name: string;
  rating: number;
  deliveryTime: string;
  offer: string;
  offerSubtext?: string;
  image: string;
  bgColor: string;
}

const chains: RestaurantChain[] = [
  {
    name: "Burger King",
    rating: 4.2,
    deliveryTime: "30 mins",
    offer: "EVERY ITEM ₹129",
    image: "🍔",
    bgColor: "bg-green-700",
  },
  {
    name: "Baskin Robbins",
    rating: 4.5,
    deliveryTime: "25 mins",
    offer: "30% OFF",
    offerSubtext: "UPTO ₹75",
    image: "🍦",
    bgColor: "bg-pink-500",
  },
  {
    name: "WarmOven Cake",
    rating: 4.3,
    deliveryTime: "35 mins",
    offer: "₹125 OFF",
    offerSubtext: "ABOVE ₹249",
    image: "🎂",
    bgColor: "bg-amber-600",
  },
  {
    name: "McDonald's",
    rating: 4.4,
    deliveryTime: "20 mins",
    offer: "20% OFF",
    offerSubtext: "UPTO ₹50",
    image: "🍟",
    bgColor: "bg-red-600",
  },
  {
    name: "KFC",
    rating: 4.1,
    deliveryTime: "30 mins",
    offer: "BUY 1 GET 1",
    image: "🍗",
    bgColor: "bg-red-700",
  },
];

export default function TopRestaurantChains() {
  return (
    <div className="mt-6">
      <h2 className="text-base font-bold text-swiggy-dark px-4 mb-3">
        Top restaurant chains in Bangalore
      </h2>
      <div className="flex overflow-x-auto hide-scrollbar gap-3 px-4 pb-4">
        {chains.map((chain) => (
          <div
            key={chain.name}
            className="min-w-[140px] max-w-[140px] cursor-pointer"
          >
            <div className="relative">
              <div
                className={`w-full h-[140px] rounded-2xl ${chain.bgColor} flex items-center justify-center text-5xl overflow-hidden`}
              >
                {chain.image}
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent rounded-b-2xl px-2 py-2">
                <p className="text-white text-[11px] font-extrabold leading-tight">
                  {chain.offer}
                </p>
                {chain.offerSubtext && (
                  <p className="text-white text-[9px] font-medium">
                    {chain.offerSubtext}
                  </p>
                )}
              </div>
            </div>
            <div className="mt-2 px-1">
              <h3 className="text-sm font-semibold text-swiggy-dark truncate">
                {chain.name}
              </h3>
              <div className="flex items-center gap-1 mt-0.5">
                <FaStar className="text-green-600 text-xs" />
                <span className="text-xs font-medium text-swiggy-gray">
                  {chain.rating}
                </span>
                <span className="text-xs text-swiggy-light-gray">
                  · {chain.deliveryTime}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
