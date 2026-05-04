import React from "react";

const NAV_ITEMS = [
  { id: "home", label: "Today", icon: "✦" },
  { id: "explorer", label: "Explorer", icon: "◎" },
  { id: "collection", label: "Collection", icon: "◈" },
  { id: "facts", label: "Space Facts", icon: "◇" },
];

export default function Navbar({ currentPage, onNavigate, collectionCount }) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-dust/30 bg-void/80 backdrop-blur-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={() => onNavigate("home")}
          className="flex items-center gap-2 group"
        >
          <span className="text-gold font-mono text-lg group-hover:animate-spin-slow transition-transform">✦</span>
          <span className="font-display font-bold text-base text-star hidden sm:block tracking-wide">
            Astronomy Explorer
          </span>
          <span className="font-display font-bold text-base text-star sm:hidden tracking-wide">
            AE
          </span>
        </button>

        {/* Nav links */}
        <div className="flex items-center gap-1">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-all ${
                currentPage === item.id
                  ? "text-star bg-nebula"
                  : "text-dim hover:text-star hover:bg-cosmos"
              }`}
            >
              <span className="hidden sm:block font-mono text-xs opacity-60">{item.icon}</span>
              <span className="font-body font-medium">{item.label}</span>
              {item.id === "collection" && collectionCount > 0 && (
                <span className="ml-0.5 w-4 h-4 rounded-full bg-gold text-void text-xs font-bold font-mono flex items-center justify-center leading-none">
                  {collectionCount > 9 ? "9+" : collectionCount}
                </span>
              )}
              {currentPage === item.id && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-pulsar" />
              )}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}
