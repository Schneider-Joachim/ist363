import React, { useState, useCallback } from "react";
import ImageCard from "../components/ImageCard";
import LoadingSpinner from "../components/LoadingSpinner";
import { Section } from "./Home";

const NASA_KEY = "nFRxLotPbsEI2xeJ1hz819xnqt4ROSVTSzLP0koZ";
const QUICK = [
  "nebula",
  "black hole",
  "galaxy",
  "mars",
  "apollo",
  "saturn",
  "hubble",
  "supernova",
];

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
        `https://images-api.nasa.gov/search?q=${encodeURIComponent(q)}&media_type=image&page=${pageNum}&page_size=24`,
      );
      if (!res.ok) throw new Error(`NASA API returned ${res.status}`);
      const data = await res.json();
      const items = (data.collection?.items || []).map((item) => ({
        id: item.data[0]?.nasa_id || Math.random().toString(36),
        title: item.data[0]?.title || "Untitled",
        date: item.data[0]?.date_created?.split("T")[0] || "",
        description: item.data[0]?.description || "",
        imageUrl: item.links?.[0]?.href || null,
        links: item.links,
        type: "nasa-search",
      }));
      setResults(pageNum === 1 ? items : (prev) => [...prev, ...items]);
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
  const handleQuick = (term) => {
    setQuery(term);
    search(term, 1);
  };

  return (
    <div className="min-h-screen pt-16" style={{ background: "var(--bg)" }}>
      <div
        className="sticky z-40"
        style={{
          top: "64px",
          background: "rgba(7,9,15,0.92)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid var(--border)",
          padding: "16px 20px",
        }}
      >
        <div className="max-w-5xl mx-auto">
          <form onSubmit={handleSubmit} className="flex gap-2 mb-3">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Try: nebula, mars, black hole…"
              className="flex-1 outline-none text-sm"
              style={{
                minWidth: 200,
                padding: "10px 16px",
                background: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: "8px",
                color: "var(--text)",
                fontFamily: "inherit",
              }}
              onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
              onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
            />
            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="font-display font-bold text-xs tracking-widest uppercase transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
              style={{
                padding: "10px 22px",
                background: "linear-gradient(135deg, #a78bfa, #7c3aed)",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
              }}
            >
              Search
            </button>
          </form>

          {/* Quick searches */}
          <div className="flex flex-wrap gap-1.5">
            {QUICK.map((term) => (
              <button
                key={term}
                onClick={() => handleQuick(term)}
                className="text-xs font-display font-bold uppercase tracking-wider px-3 py-1 transition-all"
                style={{
                  background:
                    query === term ? "rgba(167,139,250,0.12)" : "var(--card)",
                  color: query === term ? "var(--accent)" : "var(--muted)",
                  border:
                    "1px solid " +
                    (query === term
                      ? "rgba(167,139,250,0.4)"
                      : "var(--border)"),
                  borderRadius: "20px",
                }}
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-5 py-8">
        <Section label="API 1 · NASA Image Library" title="Search NASA Images">
          {/* Idle */}
          {!searched && !loading && (
            <p className="text-sm" style={{ color: "var(--muted)" }}>
              Results will appear here.
            </p>
          )}

          {loading && <LoadingSpinner message="Searching NASA library…" />}

          {error && !loading && (
            <div
              className="text-sm px-4 py-3 rounded-lg"
              style={{
                color: "#fc8181",
                background: "rgba(252,129,129,0.08)",
                border: "1px solid rgba(252,129,129,0.2)",
              }}
            >
              ⚠️ {error}
            </div>
          )}

          {!loading && results.length > 0 && (
            <>
              <p
                className="text-xs font-display mb-4"
                style={{ color: "var(--muted)", letterSpacing: "0.05em" }}
              >
                {totalHits.toLocaleString()} results for "
                <span style={{ color: "var(--accent)" }}>{query}</span>" ·
                showing {results.length}
              </p>
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
              {results.length < totalHits && (
                <div className="text-center mt-8">
                  <button
                    onClick={() => search(query, page + 1)}
                    disabled={loading}
                    className="text-xs font-display font-bold uppercase tracking-wider px-6 py-2.5 transition-all"
                    style={{
                      background: "var(--card)",
                      color: "var(--muted)",
                      border: "1px solid var(--border)",
                      borderRadius: "8px",
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.borderColor = "rgba(167,139,250,0.4)";
                      e.target.style.color = "var(--accent)";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.borderColor = "var(--border)";
                      e.target.style.color = "var(--muted)";
                    }}
                  >
                    Load more
                  </button>
                </div>
              )}
            </>
          )}

          {!loading && searched && results.length === 0 && !error && (
            <p className="text-sm" style={{ color: "var(--muted)" }}>
              No images found for "{query}".
            </p>
          )}
        </Section>
      </div>
    </div>
  );
}
