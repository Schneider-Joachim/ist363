import React, { useState } from "react";

export default function ImageCard({ item, isSaved, onSave, onRemove, showNote, onNoteUpdate }) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [noteOpen, setNoteOpen] = useState(false);
  const [noteText, setNoteText] = useState(item.note || "");

  const handleNoteSave = () => {
    if (onNoteUpdate) onNoteUpdate(item.id, noteText);
    setNoteOpen(false);
  };

  const thumbUrl = item.links?.[0]?.href || item.imageUrl;

  return (
    <div className="group rounded-xl overflow-hidden bg-cosmos border border-dust/40 hover:border-pulsar/40 transition-all duration-300 flex flex-col">
      {/* Image */}
      <div className="relative aspect-video overflow-hidden bg-nebula">
        {!imgLoaded && <div className="absolute inset-0 shimmer" />}
        {thumbUrl ? (
          <img
            src={thumbUrl}
            alt={item.title}
            onLoad={() => setImgLoaded(true)}
            className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-105 ${
              imgLoaded ? "opacity-100" : "opacity-0"
            }`}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-4xl">🌌</div>
        )}

        {/* Save button overlay */}
        <button
          onClick={() => isSaved ? onRemove(item.id) : onSave(item)}
          className={`absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center text-sm transition-all backdrop-blur-sm ${
            isSaved
              ? "bg-gold text-void opacity-100"
              : "bg-void/60 text-dim opacity-0 group-hover:opacity-100 hover:text-gold"
          }`}
          title={isSaved ? "Remove from collection" : "Save to collection"}
        >
          {isSaved ? "★" : "☆"}
        </button>
      </div>

      {/* Info */}
      <div className="p-3 flex-1 flex flex-col gap-1.5">
        <h3 className="font-display font-semibold text-sm text-star leading-snug line-clamp-2">
          {item.title}
        </h3>
        {item.date && (
          <p className="text-xs font-mono text-faint">{item.date}</p>
        )}
        {item.description && (
          <p className="text-xs text-dim leading-relaxed line-clamp-3 flex-1">
            {item.description}
          </p>
        )}

        {/* Note section (collection only) */}
        {showNote && (
          <div className="mt-2 pt-2 border-t border-dust/30">
            {item.note && !noteOpen && (
              <p className="text-xs text-pulsar/80 italic mb-1.5">"{item.note}"</p>
            )}
            {noteOpen ? (
              <div className="flex flex-col gap-1.5">
                <textarea
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  placeholder="Add a note…"
                  rows={2}
                  className="w-full text-xs bg-nebula border border-dust rounded-lg px-2 py-1.5 text-star placeholder-faint resize-none focus:outline-none focus:border-pulsar"
                />
                <div className="flex gap-1.5">
                  <button onClick={handleNoteSave} className="flex-1 text-xs py-1 rounded-md bg-pulsar/20 text-pulsar hover:bg-pulsar/30 transition-colors">
                    Save
                  </button>
                  <button onClick={() => setNoteOpen(false)} className="flex-1 text-xs py-1 rounded-md bg-dust/30 text-dim hover:text-star transition-colors">
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setNoteOpen(true)}
                className="text-xs text-faint hover:text-pulsar transition-colors"
              >
                {item.note ? "Edit note" : "+ Add note"}
              </button>
            )}
          </div>
        )}

        {/* Remove button (collection only) */}
        {onRemove && !showNote && (
          <button
            onClick={() => onRemove(item.id)}
            className="mt-1 text-xs text-faint hover:text-nova transition-colors self-start"
          >
            Remove
          </button>
        )}
      </div>
    </div>
  );
}
