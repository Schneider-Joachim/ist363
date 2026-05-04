import React, { useState } from "react";
import ImageCard from "../components/ImageCard";

const SORT_OPTIONS = [
  { id: "newest", label: "Newest saved" },
  { id: "oldest", label: "Oldest saved" },
  { id: "title", label: "Title A–Z" },
];

export default function Collection({ collection, onRemove, onNoteUpdate, onNavigate }) {
  const [sortBy, setSortBy] = useState("newest");
  const [filterType, setFilterType] = useState("all");

  const types = ["all", ...new Set(collection.map((i) => i.type))];

  const sorted = [...collection]
    .filter((i) => filterType === "all" || i.type === filterType)
    .sort((a, b) => {
      if (sortBy === "newest") return new Date(b.savedAt) - new Date(a.savedAt);
      if (sortBy === "oldest") return new Date(a.savedAt) - new Date(b.savedAt);
      if (sortBy === "title") return a.title.localeCompare(b.title);
      return 0;
    });

  return (
    <div className="min-h-screen pt-14 bg-deep">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="mb-8 animate-fade-up">
          <p className="text-xs font-mono text-gold tracking-widest uppercase mb-1">◈ My Collection</p>
          <h1 className="font-display font-bold text-3xl sm:text-4xl text-star">
            Saved Images
          </h1>
          {collection.length > 0 && (
            <p className="text-dim text-sm mt-1">{collection.length} item{collection.length !== 1 ? "s" : ""} saved</p>
          )}
        </div>

        {/* Empty state */}
        {collection.length === 0 && (
          <div className="text-center py-24 rounded-2xl bg-cosmos border border-dust/30 starfield">
            <div className="text-5xl mb-4">◈</div>
            <h2 className="font-display font-bold text-xl text-star mb-2">Your collection is empty</h2>
            <p className="text-dim text-sm mb-6 max-w-xs mx-auto">
              Save images from the daily picture or the NASA image explorer to build your collection.
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => onNavigate("home")}
                className="px-5 py-2.5 rounded-lg bg-gold/10 text-gold text-sm border border-gold/20 hover:bg-gold/20 transition-all"
              >
                Today's Picture
              </button>
              <button
                onClick={() => onNavigate("explorer")}
                className="px-5 py-2.5 rounded-lg bg-pulsar/10 text-pulsar text-sm border border-pulsar/20 hover:bg-pulsar/20 transition-all"
              >
                Explore Images
              </button>
            </div>
          </div>
        )}

        {/* Filters + sort */}
        {collection.length > 0 && (
          <>
            <div className="flex flex-wrap gap-3 mb-6 justify-between">
              {/* Type filter */}
              <div className="flex flex-wrap gap-1.5">
                {types.map((t) => (
                  <button
                    key={t}
                    onClick={() => setFilterType(t)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono capitalize transition-all ${
                      filterType === t
                        ? "bg-aurora/20 text-aurora border border-aurora/30"
                        : "bg-cosmos border border-dust/40 text-dim hover:border-aurora/20"
                    }`}
                  >
                    {t === "apod" ? "Picture of the Day" : t === "nasa-search" ? "NASA Search" : t}
                    {t !== "all" && (
                      <span className="ml-1.5 opacity-60">
                        ({collection.filter((i) => i.type === t).length})
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-cosmos border border-dust text-dim text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-pulsar"
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.id} value={o.id}>{o.label}</option>
                ))}
              </select>
            </div>

            {sorted.length === 0 ? (
              <div className="text-center py-12 text-dim text-sm">No items match this filter.</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {sorted.map((item) => (
                  <ImageCard
                    key={item.id}
                    item={item}
                    isSaved={true}
                    onSave={() => {}}
                    onRemove={onRemove}
                    showNote={true}
                    onNoteUpdate={onNoteUpdate}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
