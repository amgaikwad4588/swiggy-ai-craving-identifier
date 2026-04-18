"use client";

import Link from "next/link";
import { MdKeyboardArrowRight } from "react-icons/md";

const features = [
  {
    id: "pickup",
    href: "/pickup",
    emoji: "🏃‍♂️",
    badge: "NEW",
    badgeColor: "bg-green-500",
    title: "Ready on Arrival",
    subtitle: "Order ahead, pick up on your way",
    desc: "Skip the wait. Food is ready when you reach the restaurant",
    bg: "from-green-50 to-emerald-50",
    borderColor: "border-green-200",
    iconBg: "bg-green-500",
  },
  {
    id: "advisor",
    href: "/food-advisor",
    emoji: "🧠",
    badge: "AI",
    badgeColor: "bg-purple-500",
    title: "Food Advisor",
    subtitle: "Can't decide? Let AI help",
    desc: "Answer quick questions, get personalized food recommendations",
    bg: "from-purple-50 to-pink-50",
    borderColor: "border-purple-200",
    iconBg: "bg-purple-500",
  },
];

export default function NewFeatures() {
  return (
    <div className="mt-6 px-4">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xs font-extrabold text-white bg-swiggy-orange px-2 py-0.5 rounded-full">
          ✨ NEW
        </span>
        <h2 className="text-base font-bold text-swiggy-dark">Try Something New</h2>
      </div>
      <div className="space-y-3">
        {features.map((f) => (
          <Link
            key={f.id}
            href={f.href}
            className={`block rounded-2xl border ${f.borderColor} bg-gradient-to-r ${f.bg} p-4 active:scale-[0.98] transition-transform`}
          >
            <div className="flex items-start gap-3">
              <div
                className={`w-12 h-12 ${f.iconBg} rounded-xl flex items-center justify-center text-2xl shrink-0`}
              >
                {f.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-extrabold text-swiggy-dark">{f.title}</h3>
                  <span
                    className={`text-[9px] ${f.badgeColor} text-white px-1.5 py-0.5 rounded-full font-bold`}
                  >
                    {f.badge}
                  </span>
                </div>
                <p className="text-xs text-swiggy-gray mt-0.5">{f.subtitle}</p>
                <p className="text-[11px] text-swiggy-light-gray mt-1">{f.desc}</p>
              </div>
              <MdKeyboardArrowRight className="text-xl text-swiggy-light-gray shrink-0 mt-1" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
