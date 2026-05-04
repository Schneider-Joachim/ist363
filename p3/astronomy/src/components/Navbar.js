import React from "react";

const NAV_ITEMS = [
  { id: "home", label: "Picture of the Day", code: "01" },
  { id: "explorer", label: "Image Search", code: "02" },
  { id: "collection", label: "Collection", code: "03" },
  { id: "facts", label: "Space Facts", code: "04" },
];

export default function Navbar({ currentPage, onNavigate, collectionCount }) {
  return (
    <header
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        background: "rgba(7,9,15,0.92)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(167,139,250,0.18)",
      }}
    >
      <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between gap-6">
        <button
          onClick={() => onNavigate("home")}
          className="flex items-center gap-2.5 group flex-shrink-0"
        >
          <span
            className="text-xl animate-pulse"
            style={{ color: "var(--accent)" }}
          >
            ✦
          </span>
          <span
            className="hidden sm:block text-sm font-display font-bold tracking-widest uppercase"
            style={{ color: "var(--text)", letterSpacing: "0.08em" }}
          >
            Astronomy Explorer
          </span>
          <span
            className="sm:hidden text-sm font-display font-bold tracking-widest"
            style={{ color: "var(--text)" }}
          >
            AE
          </span>
        </button>

        <nav className="flex items-stretch gap-0 overflow-x-auto">
          {NAV_ITEMS.map((item) => {
            const active = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className="relative flex items-center gap-2 px-3 sm:px-4 py-1.5 text-xs font-display font-bold tracking-wider uppercase transition-all duration-150 flex-shrink-0"
                style={{
                  color: active ? "var(--accent)" : "var(--muted)",
                  background: active ? "rgba(167,139,250,0.08)" : "transparent",
                  borderLeft: "1px solid rgba(167,139,250,0.1)",
                  letterSpacing: "0.07em",
                }}
              >
                {active && (
                  <span
                    className="absolute top-0 left-0 right-0 h-px"
                    style={{
                      background:
                        "linear-gradient(90deg, transparent, var(--accent), transparent)",
                      boxShadow: "0 0 8px rgba(167,139,250,0.6)",
                    }}
                  />
                )}

                <span
                  className="hidden sm:block opacity-40 text-[10px]"
                  style={{ fontVariantNumeric: "tabular-nums" }}
                >
                  {item.code}
                </span>
                <span>{item.label}</span>

                {item.id === "collection" && collectionCount > 0 && (
                  <span
                    className="w-4 h-4 rounded-sm flex items-center justify-center text-[9px] font-black"
                    style={{ background: "var(--amber)", color: "var(--bg)" }}
                  >
                    {collectionCount > 9 ? "9+" : collectionCount}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
