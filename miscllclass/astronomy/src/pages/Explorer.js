import React, { useState, useCallback } from "react";
import ImageCard from "../components/ImageCard";
import LoadingSpinner from "../components/LoadingSpinner";

const QUICK_SEARCHES = ["nebula", "black hole", "galaxy", "mars", "apollo", "supernova", "saturn", "hubble"];

export default function Explorer({ onSaveItem, onRemoveItem, isSaved }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searched, setSearched] = useState(false);
  const [page, setPage] = useState(1);
  const [totalHits, setTotalHits] = useState(0);

  const search = useCallback(async (q, pageNum = 1) => {
    if (!q.trim()) return;
    setLoading(true);
    setError(null);
    setSearched(true);

    try {
      const res = await fetch(
        `https://images-api.nasa.gov/search?q=${encodeURIComponent(q)}&media_type=image&page=${pageNum}&page_size=24`
      );
      if (!res.ok) throw new Error(`Search failed: ${res.status}`);
      const data = await res.json();

      const items = (data.collection?.items || []).map((item) => ({
        id: item.data[0]?.nasa_id || Math.random().toString(36),
        title: item.data[0]?.title || "Untitled",
        date: item.data[0]?.date_created?.split("T")[0] || "",
        description: item.data[0]?.description || "",
        imageUrl: item.links?.[0]?.href || null,
        links: item.links,
        type: "nasa-search",
        query: q,
      }));

      if (pageNum === 1) {
        setResults(items);
      } else {
        setResults((prev) => [...prev, ...items]);
      }
      setTotalHits(data.collection?.metadata?.total_hits || 0);
      setPage(pageNum);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    search(query, 1);
  };

  const handleQuickSearch = (term) => {
    setQuery(term);
    search(term, 1);
  };

  return (
    <div className="min-h-screen pt-14 bg-deep">
      {/* Search header — unique layout: sticky band */}
      <div className="sticky top-14 z-40 bg-deep/95 backdrop-blur-md border-b border-dust/30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-faint font-mono text-sm">◎</span>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search NASA image library…"
                className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-cosmos border border-dust text-star text-sm placeholder-faint focus:outline-none focus:border-pulsar transition-colors"
              />
            </div>
            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="px-5 py-2.5 rounded-lg bg-pulsar text-void font-body font-semibold text-sm hover:bg-pulsar/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-95"
            >
              Search
            </button>
          </form>

          {/* Quick searches */}
          <div className="flex flex-wrap gap-1.5 mt-3">
            {QUICK_SEARCHES.map((term) => (
              <button
                key={term}
                onClick={() => handleQuickSearch(term)}
                className={`px-2.5 py-1 rounded-md text-xs font-mono transition-all ${
                  query === term
                    ? "bg-pulsar/20 text-pulsar border border-pulsar/30"
                    : "bg-cosmos border border-dust/40 text-dim hover:border-pulsar/30 hover:text-star"
                }`}
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {/* Not yet searched */}
        {!searched && !loading && (
          <div className="text-center py-20 starfield rounded-2xl">
            <div className="text-5xl mb-4">🔭</div>
            <h2 className="font-display font-bold text-2xl text-star mb-2">Search the cosmos</h2>
            <p className="text-dim text-sm max-w-sm mx-auto">
              Over 140,000 NASA images available. Try "nebula", "apollo 11", or anything that sparks your curiosity.
            </p>
          </div>
        )}

        {/* Loading */}
        {loading && <LoadingSpinner message="Searching NASA archives…" />}

        {/* Error */}
        {error && !loading && (
          <div className="text-center py-12">
            <div className="text-4xl mb-3">🛰️</div>
            <p className="text-dim text-sm">{error}</p>
          </div>
        )}

        {/* Results */}
        {!loading && results.length > 0 && (
          <>
            <div className="flex items-center justify-between mb-5">
              <p className="text-xs font-mono text-faint">
                {totalHits.toLocaleString()} results for <span className="text-pulsar">"{query}"</span>
              </p>
              <p className="text-xs font-mono text-faint">
                Showing {results.length}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {results.map((item) => (
                <ImageCard
                  key={item.id}
                  item={item}
                  isSaved={isSaved(item.id)}
                  onSave={onSaveItem}
                  onRemove={onRemoveItem}
                />
              ))}
            </div>

            {/* Load more */}
            {results.length < totalHits && (
              <div className="text-center mt-8">
                <button
                  onClick={() => search(query, page + 1)}
                  disabled={loading}
                  className="px-6 py-2.5 rounded-lg border border-dust text-dim text-sm hover:border-pulsar/40 hover:text-star transition-all"
                >
                  Load more
                </button>
              </div>
            )}
          </>
        )}

        {/* No results */}
        {!loading && searched && results.length === 0 && !error && (
          <div className="text-center py-16">
            <div className="text-4xl mb-3">🌌</div>
            <p className="text-star font-display text-lg mb-1">No images found</p>
            <p className="text-dim text-sm">Try a different search term.</p>
          </div>
        )}
      </div>
    </div>
  );
}
