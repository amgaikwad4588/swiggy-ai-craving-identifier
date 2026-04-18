"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { MdKeyboardArrowLeft, MdAccessTime, MdDirectionsBike } from "react-icons/md";
import { FaStar, FaWalking, FaMotorcycle, FaCar } from "react-icons/fa";
import { BiCheck } from "react-icons/bi";
import { IoFastFoodOutline } from "react-icons/io5";
import { BsClockHistory } from "react-icons/bs";

// --- Types ---
interface MenuItem {
  name: string;
  price: number;
  emoji: string;
  tag?: string;
}

interface Restaurant {
  id: number;
  name: string;
  rating: number;
  cuisines: string;
  distance: string;
  prepTime: number; // in minutes
  emoji: string;
  bgColor: string;
  menu: MenuItem[];
}

interface CartItem extends MenuItem {
  qty: number;
}

// --- Mock Data ---
const travelModes = [
  { id: "walk", label: "Walking", icon: <FaWalking />, speed: "15 min" },
  { id: "bike", label: "Bike", icon: <FaMotorcycle />, speed: "8 min" },
  { id: "car", label: "Car/Auto", icon: <FaCar />, speed: "5 min" },
];

const restaurants: Restaurant[] = [
  {
    id: 1,
    name: "Meghana Foods",
    rating: 4.5,
    cuisines: "Biryani, North Indian",
    distance: "1.2 km",
    prepTime: 15,
    emoji: "🍛",
    bgColor: "bg-amber-500",
    menu: [
      { name: "Chicken Biryani", price: 249, emoji: "🍛", tag: "Bestseller" },
      { name: "Paneer Butter Masala", price: 199, emoji: "🧈" },
      { name: "Chicken 65", price: 179, emoji: "🍗", tag: "Spicy" },
      { name: "Gulab Jamun (2pc)", price: 59, emoji: "🍮" },
    ],
  },
  {
    id: 2,
    name: "Burger King",
    rating: 4.2,
    cuisines: "Burgers, American",
    distance: "0.8 km",
    prepTime: 10,
    emoji: "🍔",
    bgColor: "bg-orange-500",
    menu: [
      { name: "Whopper", price: 179, emoji: "🍔", tag: "Bestseller" },
      { name: "Chicken Royale", price: 149, emoji: "🍗" },
      { name: "Veg Crispy Burger", price: 99, emoji: "🥬" },
      { name: "Fries (Large)", price: 99, emoji: "🍟" },
    ],
  },
  {
    id: 3,
    name: "Domino's Pizza",
    rating: 4.0,
    cuisines: "Pizza, Italian",
    distance: "1.5 km",
    prepTime: 20,
    emoji: "🍕",
    bgColor: "bg-red-500",
    menu: [
      { name: "Margherita", price: 199, emoji: "🍕" },
      { name: "Farmhouse", price: 349, emoji: "🍕", tag: "Bestseller" },
      { name: "Peppy Paneer", price: 299, emoji: "🧀" },
      { name: "Garlic Bread", price: 99, emoji: "🥖" },
    ],
  },
  {
    id: 4,
    name: "Chai Point",
    rating: 4.3,
    cuisines: "Beverages, Snacks",
    distance: "0.5 km",
    prepTime: 5,
    emoji: "☕",
    bgColor: "bg-green-600",
    menu: [
      { name: "Masala Chai", price: 49, emoji: "☕", tag: "Bestseller" },
      { name: "Samosa (2pc)", price: 39, emoji: "🥟" },
      { name: "Vada Pav", price: 49, emoji: "🍔" },
      { name: "Cold Coffee", price: 89, emoji: "🥤" },
    ],
  },
];

// --- Steps ---
type Step = "intro" | "location" | "restaurants" | "menu" | "tracking";

export default function PickupPage() {
  const [step, setStep] = useState<Step>("intro");
  const [travelMode, setTravelMode] = useState("bike");
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [trackingProgress, setTrackingProgress] = useState(0);
  const [foodProgress, setFoodProgress] = useState(0);

  const addToCart = (item: MenuItem) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.name === item.name);
      if (existing) {
        return prev.map((c) => (c.name === item.name ? { ...c, qty: c.qty + 1 } : c));
      }
      return [...prev, { ...item, qty: 1 }];
    });
  };

  const removeFromCart = (itemName: string) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.name === itemName);
      if (existing && existing.qty > 1) {
        return prev.map((c) => (c.name === itemName ? { ...c, qty: c.qty - 1 } : c));
      }
      return prev.filter((c) => c.name !== itemName);
    });
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);

  // Simulate tracking progress
  useEffect(() => {
    if (step !== "tracking") return;
    const travelInterval = setInterval(() => {
      setTrackingProgress((p) => {
        if (p >= 100) { clearInterval(travelInterval); return 100; }
        return p + 2;
      });
    }, 300);
    const foodInterval = setInterval(() => {
      setFoodProgress((p) => {
        if (p >= 100) { clearInterval(foodInterval); return 100; }
        return p + 3;
      });
    }, 300);
    return () => { clearInterval(travelInterval); clearInterval(foodInterval); };
  }, [step]);

  const selectedTravelMode = travelModes.find((m) => m.id === travelMode);
  const etaMinutes = travelMode === "walk" ? 15 : travelMode === "bike" ? 8 : 5;

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white px-4 py-3 flex items-center gap-3 shadow-sm">
        <Link href="/">
          <MdKeyboardArrowLeft className="text-2xl text-swiggy-dark" />
        </Link>
        <div>
          <h1 className="text-sm font-bold text-swiggy-dark">Ready on Arrival</h1>
          <p className="text-[10px] text-swiggy-light-gray">Order ahead, skip the wait</p>
        </div>
      </header>

      {/* STEP 1: Intro */}
      {step === "intro" && (
        <div className="px-4 pt-8 animate-fadeIn">
          {/* Hero illustration */}
          <div className="relative bg-gradient-to-br from-orange-50 to-amber-50 rounded-3xl p-6 mb-6 overflow-hidden">
            <div className="text-6xl mb-4">🏃‍♂️➡️🍽️</div>
            <h2 className="text-xl font-extrabold text-swiggy-dark leading-tight">
              Skip the Wait.<br />
              <span className="text-swiggy-orange">Pick Up on Your Way.</span>
            </h2>
            <p className="text-sm text-swiggy-gray mt-3 leading-relaxed">
              Coming from college or work? Order while you travel, your food
              will be ready exactly when you arrive at the restaurant.
            </p>
            <div className="absolute -right-4 -bottom-4 text-8xl opacity-20">🍔</div>
          </div>

          {/* How it works */}
          <div className="mb-8">
            <h3 className="text-sm font-bold text-swiggy-dark mb-4">How it works</h3>
            <div className="space-y-4">
              {[
                { step: "1", icon: "📍", title: "Set your travel mode", desc: "Tell us how you're getting there" },
                { step: "2", icon: "🏪", title: "Pick a restaurant", desc: "We show prep time vs your ETA" },
                { step: "3", icon: "📋", title: "Order from menu", desc: "Select items, we sync with your arrival" },
                { step: "4", icon: "✅", title: "Walk in & pick up", desc: "Food is ready, zero wait time!" },
              ].map((item) => (
                <div key={item.step} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-swiggy-orange text-white text-xs font-bold flex items-center justify-center shrink-0">
                    {item.step}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-swiggy-dark">{item.icon} {item.title}</p>
                    <p className="text-xs text-swiggy-light-gray">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Value props */}
          <div className="grid grid-cols-3 gap-3 mb-8">
            {[
              { icon: "⏱️", label: "Save 15-20 min", sub: "No waiting" },
              { icon: "💰", label: "No delivery fee", sub: "You pick up" },
              { icon: "🔥", label: "Fresh & hot", sub: "Just prepared" },
            ].map((prop) => (
              <div key={prop.label} className="bg-gray-50 rounded-xl p-3 text-center">
                <div className="text-2xl mb-1">{prop.icon}</div>
                <p className="text-[11px] font-bold text-swiggy-dark">{prop.label}</p>
                <p className="text-[9px] text-swiggy-light-gray">{prop.sub}</p>
              </div>
            ))}
          </div>

          <button
            onClick={() => setStep("location")}
            className="w-full py-3.5 bg-swiggy-orange text-white font-bold rounded-xl text-sm active:scale-[0.98] transition-transform"
          >
            Get Started
          </button>
        </div>
      )}

      {/* STEP 2: Travel Mode */}
      {step === "location" && (
        <div className="px-4 pt-6 animate-fadeIn">
          <h2 className="text-lg font-bold text-swiggy-dark mb-1">How are you travelling?</h2>
          <p className="text-xs text-swiggy-light-gray mb-6">
            We&apos;ll calculate your ETA to nearby restaurants
          </p>

          {/* Current location */}
          <div className="flex items-center gap-2 bg-green-50 rounded-xl p-3 mb-6">
            <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
              <HiOutlineLocationMarker className="text-white text-sm" />
            </div>
            <div>
              <p className="text-xs font-bold text-swiggy-dark">Your Location</p>
              <p className="text-[11px] text-swiggy-light-gray">Ayodhya Nagar,Nagpur</p>
            </div>
          </div>

          {/* Travel modes */}
          <div className="space-y-3 mb-8">
            {travelModes.map((mode) => (
              <button
                key={mode.id}
                onClick={() => setTravelMode(mode.id)}
                className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                  travelMode === mode.id
                    ? "border-swiggy-orange bg-orange-50"
                    : "border-gray-100 bg-white"
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-xl ${
                    travelMode === mode.id ? "bg-swiggy-orange text-white" : "bg-gray-100 text-swiggy-gray"
                  }`}
                >
                  {mode.icon}
                </div>
                <div className="text-left flex-1">
                  <p className="text-sm font-bold text-swiggy-dark">{mode.label}</p>
                  <p className="text-xs text-swiggy-light-gray">
                    Avg. {mode.speed} to nearby restaurants
                  </p>
                </div>
                {travelMode === mode.id && (
                  <div className="w-6 h-6 rounded-full bg-swiggy-orange flex items-center justify-center">
                    <BiCheck className="text-white text-lg" />
                  </div>
                )}
              </button>
            ))}
          </div>

          <button
            onClick={() => setStep("restaurants")}
            className="w-full py-3.5 bg-swiggy-orange text-white font-bold rounded-xl text-sm active:scale-[0.98] transition-transform"
          >
            Find Restaurants Near My Route
          </button>
        </div>
      )}

      {/* STEP 3: Restaurant Selection */}
      {step === "restaurants" && (
        <div className="px-4 pt-6 animate-fadeIn">
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-lg font-bold text-swiggy-dark">Restaurants on your route</h2>
          </div>
          <div className="flex items-center gap-1 mb-6">
            <MdDirectionsBike className="text-swiggy-orange text-sm" />
            <p className="text-xs text-swiggy-light-gray">
              Your ETA: ~{etaMinutes} min by {selectedTravelMode?.label.toLowerCase()}
            </p>
          </div>

          <div className="space-y-3">
            {restaurants.map((r) => {
              const timeDiff = r.prepTime - etaMinutes;
              const isReady = timeDiff <= 0;
              const statusText = isReady
                ? "Ready when you arrive!"
                : `Food ready ${timeDiff} min after you arrive`;
              const statusColor = isReady ? "text-green-600" : "text-amber-600";

              return (
                <button
                  key={r.id}
                  onClick={() => {
                    setSelectedRestaurant(r);
                    setCart([]);
                    setStep("menu");
                  }}
                  className="w-full flex items-start gap-3 p-3 rounded-2xl border border-gray-100 hover:border-swiggy-orange transition-colors text-left"
                >
                  <div
                    className={`w-16 h-16 ${r.bgColor} rounded-xl flex items-center justify-center text-3xl shrink-0`}
                  >
                    {r.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-swiggy-dark truncate">{r.name}</h3>
                      <div className="flex items-center gap-0.5 bg-green-600 text-white px-1.5 py-0.5 rounded text-[10px] shrink-0">
                        <FaStar className="text-[8px]" />
                        <span className="font-bold">{r.rating}</span>
                      </div>
                    </div>
                    <p className="text-[11px] text-swiggy-light-gray">{r.cuisines}</p>
                    <div className="flex items-center gap-3 mt-1.5">
                      <span className="flex items-center gap-1 text-[10px] text-swiggy-gray">
                        <HiOutlineLocationMarker className="text-xs" />
                        {r.distance}
                      </span>
                      <span className="flex items-center gap-1 text-[10px] text-swiggy-gray">
                        <BsClockHistory className="text-xs" />
                        Prep: {r.prepTime} min
                      </span>
                    </div>
                    {/* Timing sync indicator */}
                    <div className={`flex items-center gap-1 mt-2 ${statusColor}`}>
                      <span className="text-[10px] font-bold">{isReady ? "✅" : "⏳"} {statusText}</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* STEP 4: Menu & Order */}
      {step === "menu" && selectedRestaurant && (
        <div className="animate-fadeIn pb-28">
          {/* Restaurant header */}
          <div className={`${selectedRestaurant.bgColor} px-4 py-6 flex items-center gap-4`}>
            <div className="text-5xl">{selectedRestaurant.emoji}</div>
            <div>
              <h2 className="text-lg font-extrabold text-white">{selectedRestaurant.name}</h2>
              <p className="text-xs text-white/80">{selectedRestaurant.cuisines}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="bg-white/20 text-white text-[10px] px-2 py-0.5 rounded-full font-medium">
                  ⏱️ Prep: {selectedRestaurant.prepTime} min
                </span>
                <span className="bg-white/20 text-white text-[10px] px-2 py-0.5 rounded-full font-medium">
                  📍 {selectedRestaurant.distance}
                </span>
              </div>
            </div>
          </div>

          {/* ETA sync banner */}
          <div className="mx-4 -mt-3 bg-green-50 border border-green-200 rounded-xl p-3 flex items-center gap-2">
            <MdAccessTime className="text-green-600 text-lg shrink-0" />
            <div>
              <p className="text-[11px] font-bold text-green-800">
                {selectedRestaurant.prepTime <= etaMinutes
                  ? "Perfect timing! Food will be ready when you arrive"
                  : `You'll arrive in ~${etaMinutes} min, food ready in ~${selectedRestaurant.prepTime} min`}
              </p>
              <p className="text-[10px] text-green-600">
                Prep starts as soon as you order
              </p>
            </div>
          </div>

          {/* Menu items */}
          <div className="px-4 mt-4">
            <h3 className="text-sm font-bold text-swiggy-dark mb-3">Quick Pick Menu</h3>
            <div className="space-y-3">
              {selectedRestaurant.menu.map((item) => {
                const inCart = cart.find((c) => c.name === item.name);
                return (
                  <div
                    key={item.name}
                    className="flex items-center justify-between p-3 rounded-xl border border-gray-100"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{item.emoji}</span>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold text-swiggy-dark">{item.name}</p>
                          {item.tag && (
                            <span className="text-[9px] bg-orange-100 text-swiggy-orange px-1.5 py-0.5 rounded font-medium">
                              {item.tag}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-swiggy-gray">₹{item.price}</p>
                      </div>
                    </div>
                    {inCart ? (
                      <div className="flex items-center gap-2 bg-swiggy-orange rounded-lg">
                        <button
                          onClick={() => removeFromCart(item.name)}
                          className="text-white font-bold px-2.5 py-1 text-sm"
                        >
                          −
                        </button>
                        <span className="text-white font-bold text-sm">{inCart.qty}</span>
                        <button
                          onClick={() => addToCart(item)}
                          className="text-white font-bold px-2.5 py-1 text-sm"
                        >
                          +
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => addToCart(item)}
                        className="px-4 py-1.5 border-2 border-swiggy-orange text-swiggy-orange rounded-lg text-xs font-bold active:scale-95 transition-transform"
                      >
                        ADD
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Cart footer */}
          {cartCount > 0 && (
            <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] bg-swiggy-orange p-4 z-50">
              <button
                onClick={() => {
                  setTrackingProgress(0);
                  setFoodProgress(0);
                  setStep("tracking");
                }}
                className="w-full flex items-center justify-between text-white"
              >
                <div>
                  <p className="text-sm font-bold">
                    {cartCount} item{cartCount > 1 ? "s" : ""} | ₹{cartTotal}
                  </p>
                  <p className="text-[10px] text-white/80">Ready for pickup</p>
                </div>
                <div className="flex items-center gap-1 bg-white/20 px-4 py-2 rounded-lg">
                  <span className="text-sm font-bold">Place Pickup Order</span>
                  <IoFastFoodOutline className="text-lg" />
                </div>
              </button>
            </div>
          )}
        </div>
      )}

      {/* STEP 5: Live Tracking */}
      {step === "tracking" && selectedRestaurant && (
        <div className="px-4 pt-6 animate-fadeIn">
          {/* Order confirmed banner */}
          <div className="bg-green-50 rounded-2xl p-4 mb-6 text-center">
            <div className="text-4xl mb-2">🎉</div>
            <h2 className="text-lg font-extrabold text-green-800">Order Confirmed!</h2>
            <p className="text-xs text-green-600 mt-1">
              {selectedRestaurant.name} is preparing your food
            </p>
          </div>

          {/* Dual progress tracking */}
          <div className="space-y-6 mb-8">
            {/* Your travel progress */}
            <div className="bg-blue-50 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                    <MdDirectionsBike className="text-white text-sm" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-swiggy-dark">You</p>
                    <p className="text-[10px] text-swiggy-light-gray">
                      {trackingProgress >= 100 ? "Arrived!" : `${etaMinutes} min away`}
                    </p>
                  </div>
                </div>
                <span className="text-sm font-bold text-blue-600">{Math.min(trackingProgress, 100)}%</span>
              </div>
              <div className="w-full bg-blue-200 rounded-full h-2.5">
                <div
                  className="bg-blue-500 h-2.5 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(trackingProgress, 100)}%` }}
                />
              </div>
              <div className="flex justify-between mt-2 text-[9px] text-blue-400">
                <span>📍 Your location</span>
                <span>🏪 {selectedRestaurant.name}</span>
              </div>
            </div>

            {/* Food prep progress */}
            <div className="bg-orange-50 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-swiggy-orange flex items-center justify-center">
                    <IoFastFoodOutline className="text-white text-sm" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-swiggy-dark">Your Food</p>
                    <p className="text-[10px] text-swiggy-light-gray">
                      {foodProgress >= 100
                        ? "Ready for pickup!"
                        : foodProgress > 60
                        ? "Almost done..."
                        : "Being prepared"}
                    </p>
                  </div>
                </div>
                <span className="text-sm font-bold text-swiggy-orange">{Math.min(foodProgress, 100)}%</span>
              </div>
              <div className="w-full bg-orange-200 rounded-full h-2.5">
                <div
                  className="bg-swiggy-orange h-2.5 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(foodProgress, 100)}%` }}
                />
              </div>
              <div className="flex justify-between mt-2 text-[9px] text-orange-400">
                <span>🔥 Cooking</span>
                <span>📦 Ready!</span>
              </div>
            </div>
          </div>

          {/* Status message */}
          <div className="bg-gray-50 rounded-2xl p-4 text-center mb-6">
            {trackingProgress >= 100 && foodProgress >= 100 ? (
              <>
                <div className="text-5xl mb-2">🎊</div>
                <p className="text-sm font-extrabold text-green-700">
                  Walk in and collect your order!
                </p>
                <p className="text-xs text-swiggy-light-gray mt-1">
                  Show this screen at the counter
                </p>
                <div className="mt-3 bg-white rounded-xl p-3 border border-green-200">
                  <p className="text-[10px] text-swiggy-light-gray">Order ID</p>
                  <p className="text-lg font-extrabold text-swiggy-dark tracking-wider">
                    #SW{selectedRestaurant.id}4829
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="text-3xl mb-2">
                  {foodProgress > trackingProgress ? "🏃‍♂️💨" : "👨‍🍳🔥"}
                </div>
                <p className="text-sm font-bold text-swiggy-dark">
                  {foodProgress > trackingProgress
                    ? "Food is ahead of you, hurry up! 😄"
                    : "You're faster than the kitchen, food will catch up!"}
                </p>
              </>
            )}
          </div>

          {/* Order summary */}
          <div className="bg-gray-50 rounded-2xl p-4">
            <h3 className="text-xs font-bold text-swiggy-dark mb-3">Your Order</h3>
            {cart.map((item) => (
              <div key={item.name} className="flex justify-between items-center py-1.5">
                <span className="text-xs text-swiggy-gray">
                  {item.emoji} {item.name} × {item.qty}
                </span>
                <span className="text-xs font-medium text-swiggy-dark">
                  ₹{item.price * item.qty}
                </span>
              </div>
            ))}
            <div className="border-t border-gray-200 mt-2 pt-2 flex justify-between">
              <span className="text-xs font-bold text-swiggy-dark">Total (No delivery fee!)</span>
              <span className="text-xs font-bold text-swiggy-orange">₹{cartTotal}</span>
            </div>
          </div>
        </div>
      )}

      {/* Bottom spacing */}
      <div className="h-8" />
    </div>
  );
}
