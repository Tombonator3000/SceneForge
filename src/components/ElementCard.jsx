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

export default function ElementCard({ element, onRemove, onUpdate }) {
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
