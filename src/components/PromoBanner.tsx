"use client";

export default function PromoBanner() {
  return (
    <div className="mx-4 mt-4 rounded-2xl overflow-hidden bg-gradient-to-r from-amber-50 to-orange-50 border border-orange-100">
      <div className="flex items-center p-4">
        <div className="flex-1">
          <h2 className="text-lg font-extrabold text-swiggy-dark leading-tight">
            Delivery
          </h2>
          <h2 className="text-lg font-extrabold text-swiggy-orange leading-tight">
            Under 30 Mins
          </h2>
          <p className="text-[11px] text-swiggy-light-gray mt-1">
            Enjoy fast delivery
            <br />
            on our best items
          </p>
          <button className="mt-3 bg-swiggy-orange text-white text-xs font-bold px-4 py-1.5 rounded-md">
            ORDER NOW
          </button>
        </div>
        <div className="w-28 h-28 relative">
          <div className="w-full h-full rounded-xl bg-gradient-to-br from-orange-200 to-amber-100 flex items-center justify-center">
            <span className="text-4xl">🍔</span>
          </div>
        </div>
      </div>
    </div>
  );
}
