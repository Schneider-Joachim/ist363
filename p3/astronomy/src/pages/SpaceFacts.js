import React, { useState, useEffect } from "react";
import LoadingSpinner from "../components/LoadingSpinner";
import { Section } from "./Home";

const TOPICS = [
  { id: "universe", label: "Universe", query: "Universe" },
  { id: "blackhole", label: "Black Hole", query: "Black hole" },
  { id: "milkyway", label: "Milky Way", query: "Milky Way" },
  { id: "jameswebb", label: "James Webb", query: "James Webb Space Telescope" },
  { id: "mars", label: "Mars", query: "Mars" },
  { id: "neutron", label: "Neutron Stars", query: "Neutron star" },
  { id: "darkmatter", label: "Dark Matter", query: "Dark matter" },
  { id: "bigbang", label: "Big Bang", query: "Big Bang" },
  { id: "exoplanet", label: "Exoplanets", query: "Exoplanet" },
];

function useWikiArticle(query) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!query) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      setData(null);
      try {
        const res = await fetch(
          `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`,
        );
        if (!res.ok) throw new Error(`Wikipedia API returned ${res.status}`);
        const json = await res.json();
        if (!cancelled) setData(json);
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [query]);

  return { data, loading, error };
}

export default function SpaceFacts() {
  const [active, setActive] = useState(TOPICS[0]);
  const { data, loading, error } = useWikiArticle(active.query);
  const paragraphs = data?.extract?.split("\n").filter(Boolean) || [];

  return (
    <div className="min-h-screen pt-16" style={{ background: "var(--bg)" }}>
      <div className="max-w-5xl mx-auto px-5 py-8">
        <Section label="API 2 · Wikipedia" title="Space Knowledge Base">
          <div className="flex flex-wrap gap-2 mb-6">
            {TOPICS.map((t) => (
              <button
                key={t.id}
                onClick={() => setActive(t)}
                className="text-xs px-4 py-1.5 transition-all"
                style={{
                  background:
                    active.id === t.id
                      ? "rgba(167,139,250,0.12)"
                      : "var(--card)",
                  color: active.id === t.id ? "var(--accent)" : "var(--muted)",
                  border:
                    "1px solid " +
                    (active.id === t.id
                      ? "rgba(167,139,250,0.4)"
                      : "var(--border)"),
                  borderRadius: "20px",
                  fontFamily: "inherit",
                  letterSpacing: "0.02em",
                }}
                onMouseEnter={(e) => {
                  if (active.id !== t.id) {
                    e.currentTarget.style.background = "rgba(167,139,250,0.12)";
                    e.currentTarget.style.color = "var(--accent)";
                    e.currentTarget.style.borderColor = "rgba(167,139,250,0.4)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (active.id !== t.id) {
                    e.currentTarget.style.background = "var(--card)";
                    e.currentTarget.style.color = "var(--muted)";
                    e.currentTarget.style.borderColor = "var(--border)";
                  }
                }}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Article */}
          {loading && <LoadingSpinner message="Loading Wikipedia article…" />}

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

          {data && !loading && (
            <div
              className="p-6"
              style={{
                background: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: "12px",
              }}
            >
              {data.thumbnail?.source && (
                <img
                  src={data.thumbnail.source}
                  alt={data.title}
                  style={{
                    float: "right",
                    maxWidth: 180,
                    borderRadius: "8px",
                    margin: "0 0 12px 20px",
                    border: "1px solid rgba(99,179,237,0.15)",
                  }}
                />
              )}
              <h3
                className="font-display font-bold mb-3"
                style={{
                  color: "var(--amber)",
                  fontSize: "1rem",
                  letterSpacing: "0.05em",
                }}
              >
                {data.title}
              </h3>
              {paragraphs.map((para, i) => (
                <p
                  key={i}
                  className="text-sm mb-3"
                  style={{ color: "var(--muted)", lineHeight: 1.75 }}
                >
                  {para}
                </p>
              ))}
              <div style={{ clear: "both" }} />
              <a
                href={data.content_urls?.desktop?.page}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-xs mt-2 px-4 py-2 transition-colors"
                style={{
                  color: "var(--accent)",
                  border: "1px solid rgba(167,139,250,0.3)",
                  borderRadius: "6px",
                  textDecoration: "none",
                }}
                onMouseEnter={(e) =>
                  (e.target.style.background = "rgba(167,139,250,0.1)")
                }
                onMouseLeave={(e) =>
                  (e.target.style.background = "transparent")
                }
              >
                Read full article on Wikipedia →
              </a>
            </div>
          )}
        </Section>
      </div>
    </div>
  );
}
