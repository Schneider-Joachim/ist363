import React, { useState, useEffect } from "react";
import LoadingSpinner from "../components/LoadingSpinner";

const TOPICS = [
  { id: "universe", label: "Universe", icon: "🌌", query: "Universe" },
  { id: "blackhole", label: "Black Holes", icon: "⚫", query: "Black hole" },
  { id: "milkyway", label: "Milky Way", icon: "🌀", query: "Milky Way" },
  { id: "jameswebb", label: "James Webb", icon: "🔭", query: "James Webb Space Telescope" },
  { id: "mars", label: "Mars", icon: "🔴", query: "Mars" },
  { id: "neutron", label: "Neutron Stars", icon: "⭐", query: "Neutron star" },
  { id: "darkmatter", label: "Dark Matter", icon: "🌑", query: "Dark matter" },
  { id: "bigbang", label: "The Big Bang", icon: "💥", query: "Big Bang" },
  { id: "exoplanet", label: "Exoplanets", icon: "🪐", query: "Exoplanet" },
];

function useWikiArticle(query) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!query) return;
    let cancelled = false;
    const fetchWiki = async () => {
      setLoading(true);
      setError(null);
      setData(null);
      try {
        const res = await fetch(
          `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`
        );
        if (!res.ok) throw new Error(`Wikipedia error: ${res.status}`);
        const json = await res.json();
        if (!cancelled) setData(json);
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchWiki();
    return () => { cancelled = true; };
  }, [query]);

  return { data, loading, error };
}

export default function SpaceFacts() {
  const [activeTopic, setActiveTopic] = useState(TOPICS[0]);
  const { data, loading, error } = useWikiArticle(activeTopic.query);

  // Break extract into paragraphs
  const paragraphs = data?.extract?.split("\n").filter(Boolean) || [];

  return (
    <div className="min-h-screen pt-14 bg-deep">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="mb-8 animate-fade-up">
          <p className="text-xs font-mono text-gold tracking-widest uppercase mb-1">◇ Space Facts · Wikipedia</p>
          <h1 className="font-display font-bold text-3xl sm:text-4xl text-star">Knowledge Base</h1>
          <p className="text-dim text-sm mt-1">Powered by the Wikipedia API</p>
        </div>

        {/* Two-column layout: topics list + content */}
        <div className="flex flex-col sm:flex-row gap-6">
          {/* Topic sidebar */}
          <div className="sm:w-48 flex-shrink-0">
            <p className="text-xs font-mono text-faint uppercase tracking-wider mb-2 px-1">Topics</p>
            <div className="flex sm:flex-col gap-1.5 flex-wrap sm:flex-nowrap">
              {TOPICS.map((topic) => (
                <button
                  key={topic.id}
                  onClick={() => setActiveTopic(topic)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-left transition-all ${
                    activeTopic.id === topic.id
                      ? "bg-nebula border border-pulsar/30 text-star"
                      : "bg-cosmos border border-dust/30 text-dim hover:border-dust hover:text-star"
                  }`}
                >
                  <span className="text-base">{topic.icon}</span>
                  <span className="font-body">{topic.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Article content */}
          <div className="flex-1 min-w-0">
            {loading && <LoadingSpinner message="Fetching from Wikipedia…" />}

            {error && !loading && (
              <div className="p-6 rounded-xl bg-cosmos border border-dust text-center">
                <p className="text-dim text-sm">{error}</p>
              </div>
            )}

            {data && !loading && (
              <div className="animate-fade-in">
                {/* Article header */}
                <div className="flex flex-col sm:flex-row gap-5 mb-6">
                  {data.thumbnail?.source && (
                    <div className="sm:w-48 flex-shrink-0">
                      <img
                        src={data.thumbnail.source}
                        alt={data.title}
                        className="w-full rounded-xl object-cover border border-dust/50"
                        style={{ maxHeight: 180 }}
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <h2 className="font-display font-bold text-2xl sm:text-3xl text-star mb-2">
                      {data.title}
                    </h2>
                    {data.description && (
                      <p className="text-xs font-mono text-pulsar mb-3 capitalize">{data.description}</p>
                    )}
                    <a
                      href={data.content_urls?.desktop?.page}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-faint hover:text-pulsar transition-colors font-mono"
                    >
                      View full article on Wikipedia →
                    </a>
                  </div>
                </div>

                {/* Body text */}
                <div className="space-y-4 p-5 rounded-xl bg-cosmos border border-dust/40">
                  {paragraphs.map((para, i) => (
                    <p key={i} className="text-dim text-sm leading-7">
                      {para}
                    </p>
                  ))}
                </div>

                {/* Fun stats strip if available */}
                {(data.coordinates || data.type) && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {data.type && (
                      <span className="px-3 py-1 rounded-full bg-nebula border border-dust text-xs font-mono text-faint capitalize">
                        Type: {data.type}
                      </span>
                    )}
                    {data.coordinates && (
                      <span className="px-3 py-1 rounded-full bg-nebula border border-dust text-xs font-mono text-faint">
                        {data.coordinates.lat?.toFixed(2)}°, {data.coordinates.lon?.toFixed(2)}°
                      </span>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
