import React, { useState, useEffect } from "react";
import LoadingSpinner from "../components/LoadingSpinner";

const NASA_KEY = "DEMO_KEY"; // works for low-volume use; replace with real key for prod

export default function Home({ onNavigate, onSaveItem, isSaved }) {
  const [apod, setApod] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [showFullDesc, setShowFullDesc] = useState(false);

  useEffect(() => {
    const fetchApod = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `https://api.nasa.gov/planetary/apod?api_key=${NASA_KEY}`
        );
        if (!res.ok) throw new Error(`NASA API error: ${res.status}`);
        const data = await res.json();
        setApod(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchApod();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen pt-14 starfield">
        <LoadingSpinner message="Contacting NASA…" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen pt-14 flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <div className="text-5xl mb-4">🛰️</div>
          <h2 className="font-display text-xl font-bold mb-2 text-star">Signal lost</h2>
          <p className="text-dim text-sm mb-6">{error}</p>
          <button onClick={() => window.location.reload()} className="px-5 py-2.5 rounded-lg bg-pulsar/20 text-pulsar text-sm hover:bg-pulsar/30 transition-colors">
            Retry
          </button>
        </div>
      </div>
    );
  }

  const isVideo = apod?.media_type === "video";
  const apodItem = apod ? {
    id: `apod-${apod.date}`,
    title: apod.title,
    date: apod.date,
    description: apod.explanation,
    imageUrl: apod.url,
    hdUrl: apod.hdurl,
    copyright: apod.copyright,
    type: "apod",
  } : null;

  const saved = apodItem ? isSaved(apodItem.id) : false;
  const descWords = apod?.explanation?.split(" ") || [];
  const shortDesc = descWords.slice(0, 60).join(" ") + (descWords.length > 60 ? "…" : "");

  return (
    <div className="min-h-screen">
      {/* Hero — full bleed image */}
      <div className="relative min-h-screen flex flex-col">
        {/* Background image */}
        {!isVideo && apod?.url && (
          <>
            {!imgLoaded && <div className="absolute inset-0 bg-deep starfield" />}
            <img
              src={apod.hdurl || apod.url}
              alt={apod.title}
              onLoad={() => setImgLoaded(true)}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${imgLoaded ? "opacity-100" : "opacity-0"}`}
            />
          </>
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-void via-void/60 to-void/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-void/50 via-transparent to-transparent" />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-end min-h-screen pb-16 pt-24 px-6 sm:px-10 max-w-5xl">
          {/* Label */}
          <div className="animate-fade-up mb-4 flex items-center gap-3">
            <span className="text-xs font-mono text-gold tracking-widest uppercase">
              ✦ Astronomy Picture of the Day
            </span>
            <span className="text-xs font-mono text-faint">{apod?.date}</span>
          </div>

          {/* Title */}
          <h1 className="animate-fade-up delay-100 font-display font-black text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-star leading-[1.05] mb-4 max-w-3xl" style={{ opacity: 0 }}>
            {apod?.title}
          </h1>

          {/* Description */}
          <div className="animate-fade-up delay-200 max-w-xl mb-6" style={{ opacity: 0 }}>
            <p className="text-dim text-sm sm:text-base leading-relaxed">
              {showFullDesc ? apod?.explanation : shortDesc}
            </p>
            {descWords.length > 60 && (
              <button
                onClick={() => setShowFullDesc(!showFullDesc)}
                className="text-xs text-pulsar mt-2 hover:text-pulsar/70 transition-colors font-mono"
              >
                {showFullDesc ? "Show less ↑" : "Read more ↓"}
              </button>
            )}
          </div>

          {/* Actions */}
          <div className="animate-fade-up delay-300 flex flex-wrap gap-3" style={{ opacity: 0 }}>
            {apodItem && (
              <button
                onClick={() => saved ? null : onSaveItem(apodItem)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  saved
                    ? "bg-gold/20 text-gold border border-gold/30"
                    : "bg-star/10 text-star border border-star/20 hover:bg-star/20"
                }`}
              >
                <span>{saved ? "★ Saved" : "☆ Save to Collection"}</span>
              </button>
            )}
            <button
              onClick={() => onNavigate("explorer")}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium bg-pulsar/10 text-pulsar border border-pulsar/20 hover:bg-pulsar/20 transition-all"
            >
              Explore more images →
            </button>
          </div>

          {/* Copyright */}
          {apod?.copyright && (
            <p className="mt-4 text-xs text-faint font-mono">
              © {apod.copyright.trim()}
            </p>
          )}
        </div>

        {/* Video embed fallback */}
        {isVideo && (
          <div className="relative z-10 pt-20 px-6 pb-10 starfield min-h-screen flex flex-col justify-center">
            <div className="max-w-4xl mx-auto w-full">
              <p className="text-xs font-mono text-gold tracking-widest uppercase mb-4">✦ Astronomy Picture of the Day · {apod?.date}</p>
              <h1 className="font-display font-black text-4xl sm:text-5xl text-star mb-6">{apod?.title}</h1>
              <div className="aspect-video rounded-xl overflow-hidden border border-dust mb-6">
                <iframe src={apod?.url} title={apod?.title} className="w-full h-full" allowFullScreen />
              </div>
              <p className="text-dim text-sm leading-relaxed max-w-2xl">{apod?.explanation}</p>
            </div>
          </div>
        )}
      </div>

      {/* Bottom teaser strip */}
      <div className="bg-deep border-t border-dust/30 py-10 px-6">
        <div className="max-w-5xl mx-auto grid sm:grid-cols-3 gap-4">
          {[
            { icon: "◎", label: "NASA Image Library", desc: "Search millions of space images", page: "explorer" },
            { icon: "◈", label: "My Collection", desc: "Your saved favorites", page: "collection" },
            { icon: "◇", label: "Space Facts", desc: "Wikipedia-powered knowledge", page: "facts" },
          ].map((item) => (
            <button
              key={item.page}
              onClick={() => onNavigate(item.page)}
              className="flex items-start gap-3 p-4 rounded-xl bg-cosmos border border-dust/40 hover:border-pulsar/30 text-left transition-all group"
            >
              <span className="text-xl text-pulsar font-mono mt-0.5">{item.icon}</span>
              <div>
                <div className="font-body font-semibold text-sm text-star group-hover:text-pulsar transition-colors">{item.label}</div>
                <div className="text-xs text-dim mt-0.5">{item.desc}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
