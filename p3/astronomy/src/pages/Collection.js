import React, { useState } from "react";
import ImageCard from "../components/ImageCard";
import { Section } from "./Home";

const SORT_OPTIONS = [
  { id: "newest", label: "Newest saved" },
  { id: "oldest", label: "Oldest saved" },
  { id: "title",  label: "Title A–Z"    },
];

export default function Collection({ collection, onRemove, onNoteUpdate, onNavigate }) {
  const [sortBy, setSortBy]       = useState("newest");
  const [filterType, setFilterType] = useState("all");

  const types = ["all", ...new Set(collection.map(i => i.type))];

  const sorted = [...collection]
    .filter(i => filterType === "all" || i.type === filterType)
    .sort((a, b) => {
      if (sortBy === "newest") return new Date(b.savedAt) - new Date(a.savedAt);
      if (sortBy === "oldest") return new Date(a.savedAt) - new Date(b.savedAt);
      if (sortBy === "title")  return a.title.localeCompare(b.title);
      return 0;
    });

  return (
    <div className="min-h-screen pt-16" style={{ background: "var(--bg)" }}>
      <div className="max-w-5xl mx-auto px-5 py-8">
        <Section label="My Collection" title="Saved Images">

          {collection.length === 0 ? (
            <div className="text-center py-16">
              <p className="font-display font-bold text-4xl mb-4" style={{ color: "var(--accent)", opacity: 0.3 }}>◈</p>
              <h3 className="font-display font-bold mb-2" style={{ color: "var(--text)", fontSize: "1rem", letterSpacing: "0.05em" }}>
                Your collection is empty
              </h3>
              <p className="text-sm mb-6" style={{ color: "var(--muted)" }}>
                Save images from the daily picture or the NASA image search.
              </p>
              <div className="flex justify-center gap-3">
                {[
                  { label: "Picture of the Day", page: "home" },
                  { label: "Image Search",       page: "explorer" },
                ].map(item => (
                  <button key={item.page} onClick={() => onNavigate(item.page)}
                    className="text-xs font-display font-bold uppercase tracking-wider px-5 py-2.5 transition-all"
                    style={{ background: "rgba(167,139,250,0.08)", color: "var(--accent)", border: "1px solid rgba(167,139,250,0.3)", borderRadius: "8px" }}
                    onMouseEnter={e => e.currentTarget.style.background = "rgba(167,139,250,0.15)"}
                    onMouseLeave={e => e.currentTarget.style.background = "rgba(167,139,250,0.08)"}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {/* Filter + sort bar */}
              <div className="flex flex-wrap justify-between gap-3 mb-6">
                <div className="flex flex-wrap gap-1.5">
                  {types.map(t => (
                    <button key={t} onClick={() => setFilterType(t)}
                      className="text-xs font-display font-bold uppercase tracking-wider px-3 py-1.5 transition-all capitalize"
                      style={{
                        background:   filterType === t ? "rgba(167,139,250,0.12)" : "var(--card)",
                        color:        filterType === t ? "var(--accent)"          : "var(--muted)",
                        border:       "1px solid " + (filterType === t ? "rgba(167,139,250,0.4)" : "var(--border)"),
                        borderRadius: "20px",
                      }}
                    >
                      {t === "apod" ? "Pic of the Day" : t === "nasa-search" ? "NASA Search" : t}
                      {t !== "all" && (
                        <span className="ml-1.5 opacity-50">({collection.filter(i => i.type === t).length})</span>
                      )}
                    </button>
                  ))}
                </div>

                <select value={sortBy} onChange={e => setSortBy(e.target.value)}
                  className="text-xs font-display uppercase tracking-wider outline-none px-3 py-1.5"
                  style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "8px", color: "var(--muted)" }}>
                  {SORT_OPTIONS.map(o => <option key={o.id} value={o.id}>{o.label}</option>)}
                </select>
              </div>

              {sorted.length === 0 ? (
                <p className="text-sm" style={{ color: "var(--muted)" }}>No items match this filter.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {sorted.map(item => (
                    <ImageCard key={item.id} item={item}
                      isSaved={true} onSave={() => {}} onRemove={onRemove}
                      showNote={true} onNoteUpdate={onNoteUpdate} />
                  ))}
                </div>
              )}
            </>
          )}
        </Section>
      </div>
    </div>
  );
}
