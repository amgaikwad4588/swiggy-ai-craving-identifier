"use client";

const categories = [
  { name: "Pizza", emoji: "🍕", bg: "bg-red-50" },
  { name: "Noodles", emoji: "🍜", bg: "bg-yellow-50" },
  { name: "Shawarma", emoji: "🌯", bg: "bg-orange-50" },
  { name: "Ice Cream", emoji: "🍦", bg: "bg-pink-50" },
  { name: "Chicken", emoji: "🍗", bg: "bg-amber-50" },
  { name: "Biryani", emoji: "🍛", bg: "bg-green-50" },
  { name: "Burger", emoji: "🍔", bg: "bg-yellow-50" },
  { name: "Dosa", emoji: "🥞", bg: "bg-orange-50" },
];

export default function FoodCategories() {
  return (
    <div className="mt-4">
      <div className="flex overflow-x-auto hide-scrollbar gap-4 px-4 pb-2">
        {categories.map((cat) => (
          <button
            key={cat.name}
            className="flex flex-col items-center gap-1.5 min-w-[64px] cursor-pointer"
          >
            <div
              className={`w-16 h-16 rounded-full ${cat.bg} flex items-center justify-center text-2xl shadow-sm`}
            >
              {cat.emoji}
            </div>
            <span className="text-[11px] font-medium text-swiggy-gray whitespace-nowrap">
              {cat.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
