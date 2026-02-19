export default function StyleCard({ style, selected, onSelect }) {
  return (
    <button
      onClick={() => onSelect(style.id)}
      className={`relative p-4 rounded-xl text-left transition-all border ${
        selected
          ? "border-amber-400 bg-amber-400/10"
          : "border-slate-700/50 bg-slate-800/60 hover:border-slate-600"
      }`}
    >
      <div className={`absolute inset-0 rounded-xl bg-gradient-to-br ${style.color} opacity-20`} />
      <div className="relative">
        <div className="font-semibold text-white mb-1">{style.name}</div>
        <div className="text-xs text-slate-400">{style.description}</div>
      </div>
      {selected && (
        <div className="absolute top-2 right-2 w-3 h-3 rounded-full bg-amber-400" />
      )}
    </button>
  );
}
