import { useFreepik } from "../hooks/useFreepik";

const TYPE_COLORS = {
  character: "text-blue-400 border-blue-500/30 bg-blue-500/10",
  prop: "text-green-400 border-green-500/30 bg-green-500/10",
  location: "text-amber-400 border-amber-500/30 bg-amber-500/10",
};

const TYPE_LABELS = {
  character: "Karakter",
  prop: "Rekvisitt",
  location: "Lokasjon",
};

// Build a Freepik prompt from element data and the current visual style
const buildElementPrompt = (element, styleInfo) => {
  const parts = [element.name, element.description].filter(Boolean);
  if (styleInfo) {
    parts.push(`${styleInfo.name} style`);
    if (styleInfo.description) parts.push(styleInfo.description);
  }
  parts.push("reference image, high quality");
  return parts.join(", ");
};

export default function ElementCard({ element, onRemove, onUpdate, styleInfo }) {
  const { generate, loading, error } = useFreepik();

  const handleGenerate = () => {
    const prompt = buildElementPrompt(element, styleInfo);
    generate({
      prompt,
      onSuccess: (url) => onUpdate(element.id, { image: url }),
    });
  };

  return (
    <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-4">
      <div className="flex items-start gap-3">
        <div className={`px-2 py-0.5 rounded text-xs font-mono border ${TYPE_COLORS[element.type]}`}>
          {TYPE_LABELS[element.type]}
        </div>
        <div className="flex-1 min-w-0">
          <input
            className="w-full bg-transparent text-white font-semibold text-sm focus:outline-none border-b border-transparent focus:border-slate-600 mb-1"
            value={element.name}
            onChange={(e) => onUpdate(element.id, { name: e.target.value })}
          />
          <textarea
            className="w-full bg-transparent text-slate-400 text-xs resize-none focus:outline-none"
            rows={2}
            value={element.description}
            onChange={(e) => onUpdate(element.id, { description: e.target.value })}
          />
          {element.image && (
            <img
              src={element.image}
              alt={element.name}
              className="mt-2 w-full max-h-40 object-cover rounded-lg border border-slate-700/50"
            />
          )}
          <div className="mt-2 flex items-center gap-2">
            <button
              onClick={handleGenerate}
              disabled={loading || (!element.name && !element.description)}
              className="text-xs text-amber-400 border border-amber-400/30 px-2 py-1 rounded hover:bg-amber-400/10 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {loading ? "Genererer..." : "Generer bilde"}
            </button>
            {element.image && (
              <button
                onClick={() => onUpdate(element.id, { image: null })}
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
        <button
          onClick={() => onRemove(element.id)}
          className="text-slate-600 hover:text-red-400 text-xs transition-colors"
        >
          fjern
        </button>
      </div>
    </div>
  );
}
