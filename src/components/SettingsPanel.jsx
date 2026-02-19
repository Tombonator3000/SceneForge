import { useState, useEffect } from "react";
import { getApiKey, setApiKey } from "../utils/apiKeys";

const API_FIELDS = [
  {
    service: "freepik",
    label: "Freepik API-nokkel",
    placeholder: "fp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    description: "For bildegenerering via Freepik AI. Fa nokkel pa docs.freepik.com.",
  },
  {
    service: "kling",
    label: "Kling API-nokkel",
    placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    description: "For videogenerering via Kling (kie.ai eller piapi.ai).",
  },
  {
    service: "openai",
    label: "OpenAI API-nokkel",
    placeholder: "sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    description: "For GPT-modeller. Fa nokkel pa platform.openai.com.",
  },
  {
    service: "anthropic",
    label: "Anthropic API-nokkel",
    placeholder: "sk-ant-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    description: "For Claude-modeller. Fa nokkel pa console.anthropic.com.",
  },
];

export default function SettingsPanel() {
  const [keys, setKeys] = useState({
    freepik: "",
    kling: "",
    openai: "",
    anthropic: "",
  });
  const [saved, setSaved] = useState(false);

  // Load stored keys on mount
  useEffect(() => {
    setKeys({
      freepik: getApiKey("freepik"),
      kling: getApiKey("kling"),
      openai: getApiKey("openai"),
      anthropic: getApiKey("anthropic"),
    });
  }, []);

  const handleChange = (service, value) => {
    setKeys((prev) => ({ ...prev, [service]: value }));
    setSaved(false);
  };

  const handleSave = () => {
    for (const { service } of API_FIELDS) {
      setApiKey(service, keys[service]);
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleClear = (service) => {
    setApiKey(service, "");
    setKeys((prev) => ({ ...prev, [service]: "" }));
    setSaved(false);
  };

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h2 className="text-lg font-semibold text-white mb-1">Innstillinger</h2>
        <p className="text-sm text-slate-400">
          API-nokler lagres lokalt i nettleseren (localStorage). De sendes aldri til noen server.
        </p>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-medium text-slate-300 uppercase tracking-wide">API-nokler</h3>

        {API_FIELDS.map(({ service, label, placeholder, description }) => {
          const hasValue = Boolean(keys[service]);
          return (
            <div key={service} className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-white">{label}</label>
                {hasValue && (
                  <span className="text-xs text-green-400 bg-green-400/10 border border-green-400/20 px-2 py-0.5 rounded-full">
                    Lagret
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500">{description}</p>
              <div className="flex gap-2">
                <input
                  type="password"
                  className="flex-1 bg-slate-700/50 border border-slate-600 text-white rounded px-3 py-2 text-sm font-mono focus:outline-none focus:border-amber-400 placeholder-slate-600"
                  placeholder={placeholder}
                  value={keys[service]}
                  onChange={(e) => handleChange(service, e.target.value)}
                  autoComplete="off"
                  spellCheck={false}
                />
                {hasValue && (
                  <button
                    onClick={() => handleClear(service)}
                    className="text-xs text-slate-400 border border-slate-700 px-3 py-2 rounded hover:border-red-500/50 hover:text-red-400 transition-colors"
                  >
                    Slett
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={handleSave}
          className="text-sm text-slate-950 bg-amber-400 px-4 py-2 rounded font-medium hover:bg-amber-300 transition-colors"
        >
          Lagre nokler
        </button>
        {saved && (
          <span className="text-sm text-green-400">Nokler lagret.</span>
        )}
      </div>

      <div className="border-t border-slate-800 pt-6">
        <h3 className="text-sm font-medium text-slate-300 uppercase tracking-wide mb-3">Om GitHub Pages</h3>
        <p className="text-sm text-slate-400">
          SceneForge kjorer som en statisk app pa GitHub Pages. Ingen backend, ingen server.
          API-kall gjores direkte fra nettleseren. API-nokler er dine -- de lagres kun lokalt.
        </p>
      </div>
    </div>
  );
}
