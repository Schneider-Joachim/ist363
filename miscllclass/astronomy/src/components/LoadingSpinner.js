import React from "react";

export default function LoadingSpinner({ message = "Loading…" }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <div className="relative w-10 h-10">
        <div className="absolute inset-0 rounded-full border-2 border-dust animate-spin border-t-pulsar" />
        <div className="absolute inset-2 rounded-full border border-dust/40 animate-spin-slow border-t-gold" style={{ animationDirection: "reverse" }} />
      </div>
      <p className="text-sm text-dim font-mono">{message}</p>
    </div>
  );
}
