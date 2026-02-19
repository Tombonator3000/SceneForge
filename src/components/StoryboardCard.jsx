import { useFreepik } from "../hooks/useFreepik";

// Build a Freepik prompt from shot data and current visual style
const buildShotPrompt = (shot, styleInfo) => {
  const parts = [shot.description].filter(Boolean);
  if (styleInfo) {
    parts.push(`${styleInfo.name} style`);
    if (styleInfo.description) parts.push(styleInfo.description);
  }
  parts.push("cinematic, 16:9, high quality");
  return parts.join(", ");
};

export default function StoryboardCard({ shot, scene, styleInfo, onUpdateShot }) {
  const { generate, loading, error } = useFreepik();

  const handleGenerate = () => {
    const prompt = buildShotPrompt(shot, styleInfo);
    generate({
      prompt,
      onSuccess: (url) => onUpdateShot(shot.id, { storyboardImage: url }),
    });
  };

  return (
    <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl overflow-hidden">
      <div className="h-32 bg-slate-700/50 flex items-center justify-center relative">
        {shot.storyboardImage ? (
          <img src={shot.storyboardImage} alt="storyboard" className="w-full h-full object-cover" />
        ) : (
          <div className="text-slate-600 text-xs text-center px-2">
            <div className="mb-1">Ingen bilde</div>
            <div>{shot.type}</div>
          </div>
        )}
        {loading && (
          <div className="absolute inset-0 bg-slate-900/70 flex items-center justify-center">
            <span className="text-amber-400 text-xs">Genererer...</span>
          </div>
        )}
      </div>
      <div className="p-2">
        <div className="text-xs text-amber-400 font-mono mb-0.5">{shot.type} -- {shot.duration}</div>
        <div className="text-xs text-slate-400 leading-tight">{shot.description}</div>
        <div className="text-xs text-slate-600 mt-1">{scene.title}</div>
        <div className="mt-2 flex items-center gap-2">
          <button
            onClick={handleGenerate}
            disabled={loading || !shot.description}
            className="text-xs text-amber-400 border border-amber-400/30 px-2 py-0.5 rounded hover:bg-amber-400/10 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loading ? "Genererer..." : "Generer bilde"}
          </button>
          {shot.storyboardImage && (
            <button
              onClick={() => onUpdateShot(shot.id, { storyboardImage: null })}
              className="text-xs text-slate-500 hover:text-red-400 transition-colors"
            >
              Fjern
            </button>
          )}
        </div>
        {error && (
          <div className="text-xs text-red-400 mt-1 truncate" title={error}>Feil: {error}</div>
        )}
      </div>
    </div>
  );
}
