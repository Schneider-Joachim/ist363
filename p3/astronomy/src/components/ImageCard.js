import React, { useState } from "react";

export default function ImageCard({ item, isSaved, onSave, onRemove, showNote, onNoteUpdate }) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [noteOpen, setNoteOpen]   = useState(false);
  const [noteText, setNoteText]   = useState(item.note || "");

  const handleNoteSave = () => {
    if (onNoteUpdate) onNoteUpdate(item.id, noteText);
    setNoteOpen(false);
  };

  const thumbUrl = item.links?.[0]?.href || item.imageUrl;

  return (
    <div
      className="group flex flex-col overflow-hidden transition-colors duration-200"
      style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "12px" }}
      onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(167,139,250,0.4)"}
      onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}
    >
      {/* Image */}
      <div className="relative overflow-hidden" style={{ aspectRatio: "16/9", background: "var(--surface)" }}>
        {!imgLoaded && <div className="absolute inset-0 shimmer" />}
        {thumbUrl ? (
          <img
            src={thumbUrl} alt={item.title}
            onLoad={() => setImgLoaded(true)}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            style={{ opacity: imgLoaded ? 1 : 0 }}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center opacity-20 text-3xl" style={{ color: "var(--accent)" }}>✦</div>
        )}
        {/* Save / unsave */}
        <button
          onClick={() => isSaved ? onRemove(item.id) : onSave(item)}
          className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center text-sm transition-all"
          style={{
            background:   isSaved ? "rgba(246,173,85,0.15)" : "rgba(7,9,15,0.75)",
            color:        isSaved ? "var(--amber)"          : "var(--muted)",
            border:       "1px solid " + (isSaved ? "rgba(246,173,85,0.4)" : "var(--border)"),
            borderRadius: "6px",
            backdropFilter: "blur(6px)",
          }}
        >{isSaved ? "✕" : "☆"}</button>
      </div>

      {/* Body */}
      <div className="p-3 flex-1 flex flex-col gap-1.5">
        <h3 className="text-xs font-display font-bold leading-snug line-clamp-2"
            style={{ color: "var(--amber)", letterSpacing: "0.04em" }}>
          {item.title}
        </h3>
        {item.date && (
          <p className="text-xs" style={{ color: "var(--muted)", fontSize: "0.75rem" }}>📅 {item.date}</p>
        )}
        {item.description && (
          <p className="text-xs flex-1 line-clamp-3" style={{ color: "var(--muted)", lineHeight: 1.65 }}>
            {item.description}
          </p>
        )}

        {/* Notes — collection only */}
        {showNote && (
          <div className="mt-2 pt-2" style={{ borderTop: "1px solid var(--border)" }}>
            {item.note && !noteOpen && (
              <p className="text-xs italic mb-1.5" style={{ color: "var(--accent)", opacity: 0.85 }}>"{item.note}"</p>
            )}
            {noteOpen ? (
              <div className="flex flex-col gap-1.5">
                <textarea
                  value={noteText} onChange={e => setNoteText(e.target.value)}
                  placeholder="Add a note…" rows={2}
                  className="w-full text-xs px-2 py-1.5 resize-none outline-none"
                  style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "6px", color: "var(--text)", fontFamily: "inherit" }}
                />
                <div className="flex gap-1.5">
                  <button onClick={handleNoteSave} className="flex-1 text-[10px] py-1 font-display font-bold tracking-wider uppercase"
                    style={{ background: "rgba(167,139,250,0.12)", color: "var(--accent)", border: "1px solid rgba(167,139,250,0.3)", borderRadius: "6px" }}>
                    Save
                  </button>
                  <button onClick={() => setNoteOpen(false)} className="flex-1 text-[10px] py-1 font-display font-bold tracking-wider uppercase"
                    style={{ background: "transparent", color: "var(--muted)", border: "1px solid var(--border)", borderRadius: "6px" }}>
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button onClick={() => setNoteOpen(true)}
                className="text-[10px] font-display font-bold tracking-wider uppercase"
                style={{ color: "var(--muted)" }}
                onMouseEnter={e => e.target.style.color = "var(--accent)"}
                onMouseLeave={e => e.target.style.color = "var(--muted)"}>
                {item.note ? "Edit note" : "+ Add note"}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
