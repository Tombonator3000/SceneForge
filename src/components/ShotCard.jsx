import { useFreepik } from "../hooks/useFreepik";

const SHOT_TYPES = ["Wide", "Medium", "Close-up", "ECU", "OTS", "POV", "Insert"];

// Build a Freepik prompt from shot data and the current visual style
const buildShotPrompt = (shot, styleInfo) => {
  const parts = [shot.description].filter(Boolean);
  if (styleInfo) {
    parts.push(`${styleInfo.name} style`);
    if (styleInfo.description) parts.push(styleInfo.description);
  }
  parts.push("cinematic, 16:9, high quality");
  return parts.join(", ");
};

export default function ShotCard({ shot, onUpdate, onRemove, styleInfo }) {
  const { generate, loading, error } = useFreepik();

  const handleGenerate = () => {
    const prompt = buildShotPrompt(shot, styleInfo);
    generate({
      prompt,
      onSuccess: (url) => onUpdate(shot.id, { storyboardImage: url }),
    });
  };

  return (
    <div className="bg-slate-700/50 border border-slate-600/50 rounded-lg p-3">
      <div className="flex items-center gap-2 mb-2">
        <select
          className="bg-slate-800 border border-slate-600 text-slate-300 text-xs rounded px-2 py-1 focus:outline-none focus:border-amber-400"
          value={shot.type}
          onChange={(e) => onUpdate(shot.id, { type: e.target.value })}
        >
          {SHOT_TYPES.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
        <input
          className="flex-1 bg-slate-800 border border-slate-600 text-slate-300 text-xs rounded px-2 py-1 focus:outline-none focus:border-amber-400"
          placeholder="Varighet (f.eks. 4s)"
          value={shot.duration}
          onChange={(e) => onUpdate(shot.id, { duration: e.target.value })}
        />
        <button
          onClick={() => onRemove(shot.id)}
          className="text-slate-600 hover:text-red-400 text-xs transition-colors"
        >
          x
        </button>
      </div>
      <textarea
        className="w-full bg-slate-800 border border-slate-600 text-slate-400 text-xs rounded px-2 py-1.5 focus:outline-none focus:border-amber-400 resize-none"
        rows={2}
        placeholder="Beskrivelse av shot..."
        value={shot.description}
        onChange={(e) => onUpdate(shot.id, { description: e.target.value })}
      />
      <div className="mt-2 flex items-center gap-2">
        <button
          onClick={handleGenerate}
          disabled={loading || !shot.description}
          className="text-xs text-amber-400 border border-amber-400/30 px-2 py-1 rounded hover:bg-amber-400/10 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {loading ? "Genererer..." : "Generer bilde"}
        </button>
        {shot.storyboardImage && (
          <button
            onClick={() => onUpdate(shot.id, { storyboardImage: null })}
            className="text-xs text-slate-500 hover:text-red-400 transition-colors"
          >
            Fjern bilde
          </button>
        )}
        {error && (
          <span className="text-xs text-red-400 truncate" title={error}>Feil: {error}</span>
        )}
      </div>
    </div>
  );
}
