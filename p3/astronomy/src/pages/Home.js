import React, { useState, useEffect } from "react";
import LoadingSpinner from "../components/LoadingSpinner";

const NASA_KEY = "nFRxLotPbsEI2xeJ1hz819xnqt4ROSVTSzLP0koZ";

function Section({ label, title, children, delay = "0s" }) {
  return (
    <section
      className="relative overflow-hidden"
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: "12px",
        padding: "32px",
        animation: `fadeUp 0.5s ease ${delay} both`,
      }}
    >
      <span
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, var(--accent), transparent)",
          opacity: 0.6,
          boxShadow: "0 0 12px rgba(167,139,250,0.5)",
        }}
      />
      <style>{`@keyframes fadeUp { from { opacity:0; transform:translateY(20px) } to { opacity:1; transform:translateY(0) } }`}</style>
      {label && (
        <p
          className="font-display font-bold uppercase text-[10px] tracking-[0.15em] mb-2"
          style={{ color: "var(--accent)", opacity: 0.8 }}
        >
          {label}
        </p>
      )}
      {title && (
        <h2
          className="font-display font-bold mb-5"
          style={{
            fontSize: "clamp(1rem,3vw,1.4rem)",
            letterSpacing: "0.05em",
            color: "var(--text)",
          }}
        >
          {title}
        </h2>
      )}
      {children}
    </section>
  );
}

export default function Home({ onNavigate, onSaveItem, isSaved }) {
  const [apod, setApod] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [showFull, setShowFull] = useState(false);

  useEffect(() => {
    const urls = [
      `https://api.nasa.gov/planetary/apod?api_key=${NASA_KEY}`,
      `https://api.nasa.gov/planetary/apod?api_key=${NASA_KEY}&date=2024-04-08`,
      `https://api.nasa.gov/planetary/apod?api_key=${NASA_KEY}&date=2024-01-01`,
    ];
    (async () => {
      for (const url of urls) {
        try {
          const res = await fetch(url);
          if (!res.ok) continue;
          const data = await res.json();
          setApod(data);
          setLoading(false);
          return;
        } catch {
          continue;
        }
      }
      setError("NASA APOD is temporarily unavailable.");
      setLoading(false);
    })();
  }, []);

  const apodItem = apod
    ? {
        id: `apod-${apod.date}`,
        title: apod.title,
        date: apod.date,
        description: apod.explanation,
        imageUrl: apod.url,
        hdUrl: apod.hdurl,
        copyright: apod.copyright,
        type: "apod",
      }
    : null;

  const words = apod?.explanation?.split(" ") || [];
  const short = words.slice(0, 60).join(" ") + (words.length > 60 ? "…" : "");

  return (
    <div className="min-h-screen pt-16" style={{ background: "var(--bg)" }}>
      <div className="max-w-5xl mx-auto px-5 py-8 flex flex-col gap-6">
        {/* APOD Section */}
        <Section label="API 1 · NASA APOD" title="Astronomy Picture of the Day">
          {loading && <LoadingSpinner message="Contacting NASA…" />}

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

          {apod && !loading && (
            <div>
              <h3
                className="font-display font-bold mb-1"
                style={{
                  color: "var(--amber)",
                  fontSize: "1rem",
                  letterSpacing: "0.05em",
                }}
              >
                {apod.title}
              </h3>
              <p
                className="mb-4 text-xs font-display tracking-widest"
                style={{ color: "var(--muted)" }}
              >
                📅 {apod.date}
              </p>

              {apod.media_type === "image" ? (
                <div
                  className="relative mb-4 overflow-hidden"
                  style={{
                    borderRadius: "12px",
                    border: "1px solid var(--border)",
                  }}
                >
                  {!imgLoaded && (
                    <div className="shimmer w-full" style={{ height: 400 }} />
                  )}
                  <img
                    src={apod.hdurl || apod.url}
                    alt={apod.title}
                    onLoad={() => setImgLoaded(true)}
                    className="w-full object-cover"
                    style={{
                      maxHeight: 520,
                      display: imgLoaded ? "block" : "none",
                    }}
                  />

                  {imgLoaded && apodItem && (
                    <div className="absolute bottom-3 right-3 flex gap-2">
                      <button
                        onClick={() =>
                          isSaved(apodItem.id) ? null : onSaveItem(apodItem)
                        }
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-display font-bold tracking-wider uppercase transition-all"
                        style={{
                          background: isSaved(apodItem.id)
                            ? "rgba(246,173,85,0.15)"
                            : "rgba(7,9,15,0.8)",
                          color: isSaved(apodItem.id)
                            ? "var(--amber)"
                            : "var(--text)",
                          border:
                            "1px solid " +
                            (isSaved(apodItem.id)
                              ? "rgba(246,173,85,0.4)"
                              : "var(--border)"),
                          borderRadius: "8px",
                          backdropFilter: "blur(8px)",
                        }}
                      >
                        {isSaved(apodItem.id) ? "★ Saved" : "☆ Save"}
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div
                  className="mb-4 overflow-hidden"
                  style={{
                    aspectRatio: "16/9",
                    borderRadius: "12px",
                    border: "1px solid var(--border)",
                  }}
                >
                  <iframe
                    src={apod.url}
                    title={apod.title}
                    className="w-full h-full"
                    allowFullScreen
                  />
                </div>
              )}

              <p
                className="text-sm leading-relaxed"
                style={{ color: "var(--muted)", lineHeight: 1.75 }}
              >
                {showFull ? apod.explanation : short}
              </p>
              {words.length > 60 && (
                <button
                  onClick={() => setShowFull(!showFull)}
                  className="mt-2 text-xs font-display font-bold tracking-wider uppercase transition-colors"
                  style={{ color: "var(--accent)" }}
                >
                  {showFull ? "Show less ↑" : "Read more ↓"}
                </button>
              )}
              {apod.copyright && (
                <p
                  className="mt-3 text-xs"
                  style={{ color: "var(--muted)", letterSpacing: "0.04em" }}
                >
                  © {apod.copyright.trim()}
                </p>
              )}
            </div>
          )}
        </Section>

        <div className="grid sm:grid-cols-3 gap-4">
          {[
            {
              icon: "◎",
              label: "API 1 · NASA Image Library",
              desc: "Search NASA archives",
              page: "explorer",
            },
            {
              icon: "◈",
              label: "My Collection",
              desc: "Your saved images",
              page: "collection",
            },
            {
              icon: "◇",
              label: "API 2 · Wikipedia",
              desc: "Space knowledge base",
              page: "facts",
            },
          ].map((item) => (
            <button
              key={item.page}
              onClick={() => onNavigate(item.page)}
              className="flex items-start gap-3 p-4 text-left transition-colors group"
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: "12px",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.borderColor = "rgba(167,139,250,0.4)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.borderColor = "var(--border)")
              }
            >
              <span
                className="font-display text-lg mt-0.5"
                style={{ color: "var(--accent)" }}
              >
                {item.icon}
              </span>
              <div>
                <p
                  className="text-[10px] font-display font-bold uppercase tracking-[0.12em] mb-0.5"
                  style={{ color: "var(--accent)" }}
                >
                  {item.label}
                </p>
                <p className="text-xs" style={{ color: "var(--muted)" }}>
                  {item.desc}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export { Section };
