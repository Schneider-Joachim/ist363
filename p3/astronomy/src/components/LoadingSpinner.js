import React from "react";

export default function LoadingSpinner({ message = "Loading…" }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-4">
      <div
        className="w-9 h-9 rounded-full border-2 animate-spin"
        style={{
          borderColor: "rgba(167,139,250,0.18)",
          borderTopColor: "var(--accent)",
        }}
      />
      <p className="text-sm font-display tracking-widest uppercase" style={{ color: "var(--muted)", fontSize: "0.75rem" }}>
        {message}
      </p>
    </div>
  );
}
