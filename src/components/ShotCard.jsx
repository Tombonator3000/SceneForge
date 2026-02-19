const SHOT_TYPES = ["Wide", "Medium", "Close-up", "ECU", "OTS", "POV", "Insert"];

export default function ShotCard({ shot, onUpdate, onRemove }) {
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
    </div>
  );
}
