import { useState, useCallback, useMemo } from "react";
import { PHRASE_COLORS } from "../utils/defaults";

export default function Waveform({ phrases, duration, currentTime, onSeek, onAddPhrase, onRemovePhrase }) {
  const [hoveredPhrase, setHoveredPhrase] = useState(null);

  // Generate stable bar heights once on mount -- Math.random() inside render causes flickering on every re-render
  const barHeights = useMemo(
    () => Array.from({ length: 120 }, (_, i) =>
      20 + Math.sin(i * 0.3) * 15 + Math.sin(i * 0.7) * 10 + Math.abs(Math.sin(i * 1.9 + 0.5)) * 20
    ),
    []
  );

  const handleCanvasClick = useCallback(
    (e) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const ratio = (e.clientX - rect.left) / rect.width;
      if (onSeek) onSeek(ratio * duration);
    },
    [duration, onSeek]
  );

  return (
    <div className="relative">
      <div
        className="relative h-24 bg-slate-800/60 rounded-lg overflow-hidden cursor-pointer border border-slate-700/50"
        onClick={handleCanvasClick}
      >
        {/* Placeholder waveform bars */}
        <div className="absolute inset-0 flex items-center gap-px px-2">
          {barHeights.map((h, i) => (
            <div
              key={i}
              className="flex-1 bg-amber-400/40 rounded-sm"
              style={{ height: `${h}%` }}
            />
          ))}
        </div>
        {/* Playhead */}
        {duration > 0 && (
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-amber-400"
            style={{ left: `${(currentTime / duration) * 100}%` }}
          />
        )}
        {/* Phrase markers */}
        {phrases.map((phrase) => (
          <div
            key={phrase.id}
            className="absolute top-0 bottom-0 flex flex-col items-center"
            style={{ left: `${phrase.time * 100}%` }}
            onMouseEnter={() => setHoveredPhrase(phrase.id)}
            onMouseLeave={() => setHoveredPhrase(null)}
          >
            <div className={`w-0.5 h-full ${PHRASE_COLORS[phrase.label] ?? "bg-slate-500"} opacity-70`} />
            <div
              className={`absolute top-1 text-xs font-mono px-1 rounded ${PHRASE_COLORS[phrase.label] ?? "bg-slate-500"} text-white whitespace-nowrap`}
              style={{ fontSize: "10px" }}
            >
              {phrase.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
