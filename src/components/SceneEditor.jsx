import { useState } from "react";
import ShotCard from "./ShotCard";

export default function SceneEditor({ scene, onUpdate, onRemove, onAddShot, onUpdateShot, onRemoveShot, styleInfo }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl overflow-hidden">
      <button
        className="w-full flex items-center gap-3 p-4 text-left hover:bg-slate-700/30 transition-colors"
        onClick={() => setCollapsed(!collapsed)}
      >
        <span className="text-slate-400 text-sm font-mono">{collapsed ? "+" : "-"}</span>
        <span className="font-semibold text-white">{scene.title}</span>
        <span className="ml-auto text-xs text-slate-500">{scene.shots.length} shots</span>
      </button>

      {!collapsed && (
        <div className="px-4 pb-4 space-y-3">
          <div>
            <input
              className="w-full bg-slate-700/50 border border-slate-600 text-white text-sm rounded px-3 py-2 mb-2 focus:outline-none focus:border-amber-400"
              placeholder="Scenetittel"
              value={scene.title}
              onChange={(e) => onUpdate(scene.id, { title: e.target.value })}
            />
            <textarea
              className="w-full bg-slate-700/50 border border-slate-600 text-slate-300 text-sm rounded px-3 py-2 resize-none focus:outline-none focus:border-amber-400"
              rows={2}
              placeholder="Scenebeskrivelse..."
              value={scene.description}
              onChange={(e) => onUpdate(scene.id, { description: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            {scene.shots.map((shot) => (
              <ShotCard
                key={shot.id}
                shot={shot}
                onUpdate={onUpdateShot}
                onRemove={onRemoveShot}
                styleInfo={styleInfo}
              />
            ))}
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => onAddShot(scene.id)}
              className="text-xs text-amber-400 border border-amber-400/30 px-3 py-1 rounded hover:bg-amber-400/10 transition-colors"
            >
              + Legg til shot
            </button>
            <button
              onClick={() => onRemove(scene.id)}
              className="text-xs text-slate-500 border border-slate-700 px-3 py-1 rounded hover:text-red-400 hover:border-red-400/30 transition-colors ml-auto"
            >
              Slett scene
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
