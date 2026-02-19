import { useState, useRef, useEffect } from "react";
import Waveform from "./components/Waveform";
import StyleCard from "./components/StyleCard";
import ElementCard from "./components/ElementCard";
import SceneEditor from "./components/SceneEditor";
import formatTime from "./utils/formatTime";
import generateId from "./utils/generateId";
import {
  PHRASE_COLORS,
  PHRASE_LABEL_COLORS,
  DEFAULT_PHRASES,
  DEFAULT_STYLES,
  DEFAULT_ELEMENTS,
  DEFAULT_SCENES,
  TABS,
} from "./utils/defaults";

// -- Main App --

export default function MusicVisApp() {
  const [activeTab, setActiveTab] = useState("music");

  // Music state
  const [audioFile, setAudioFile] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(275); // 4:35 default
  const [bpm, setBpm] = useState("79");
  const [key, setKey] = useState("G-dur");
  const [lyrics, setLyrics] = useState("");
  const [phrases, setPhrases] = useState(DEFAULT_PHRASES);
  const audioRef = useRef(null);

  // Style state
  const [selectedStyle, setSelectedStyle] = useState("s1");

  // Project state
  const [projectTitle, setProjectTitle] = useState("Bardens Terningkast: En Legende om Skryt og Skatter");
  const [projectOverview, setProjectOverview] = useState(
    "En bardcore RPG-musikkvideo om den uovertrufne Bardens og hans episke ballade om seg selv -- fremfoert for en rekke stadig mer irriterte taverngjester (og en dragon)."
  );
  const [scenes, setScenes] = useState(DEFAULT_SCENES);
  const [elements, setElements] = useState(DEFAULT_ELEMENTS);

  // Audio handlers
  const handleAudioUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAudioFile(file);
    const url = URL.createObjectURL(file);
    setAudioUrl(url);
  };

  const handlePlayPause = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (time) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
    setCurrentTime(time);
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onDurationChange = () => setDuration(audio.duration);
    const onEnded = () => setIsPlaying(false);
    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("durationchange", onDurationChange);
    audio.addEventListener("ended", onEnded);
    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("durationchange", onDurationChange);
      audio.removeEventListener("ended", onEnded);
    };
  }, [audioUrl]);

  // Scene handlers
  const handleUpdateScene = (id, updates) => {
    setScenes((prev) => prev.map((s) => (s.id === id ? { ...s, ...updates } : s)));
  };

  const handleRemoveScene = (id) => {
    setScenes((prev) => prev.filter((s) => s.id !== id));
  };

  const handleAddScene = () => {
    setScenes((prev) => [
      ...prev,
      {
        id: generateId(),
        title: "Ny scene",
        description: "",
        phraseRef: null,
        shots: [],
      },
    ]);
  };

  const handleAddShot = (sceneId) => {
    setScenes((prev) =>
      prev.map((s) =>
        s.id === sceneId
          ? { ...s, shots: [...s.shots, { id: generateId(), type: "Wide", description: "", duration: "4s", storyboardImage: null }] }
          : s
      )
    );
  };

  const handleUpdateShot = (shotId, updates) => {
    setScenes((prev) =>
      prev.map((s) => ({
        ...s,
        shots: s.shots.map((sh) => (sh.id === shotId ? { ...sh, ...updates } : sh)),
      }))
    );
  };

  const handleRemoveShot = (shotId) => {
    setScenes((prev) =>
      prev.map((s) => ({
        ...s,
        shots: s.shots.filter((sh) => sh.id !== shotId),
      }))
    );
  };

  // Element handlers
  const handleUpdateElement = (id, updates) => {
    setElements((prev) => prev.map((e) => (e.id === id ? { ...e, ...updates } : e)));
  };

  const handleRemoveElement = (id) => {
    setElements((prev) => prev.filter((e) => e.id !== id));
  };

  const handleAddElement = (type) => {
    setElements((prev) => [
      ...prev,
      { id: generateId(), type, name: "Nytt element", description: "", image: null },
    ]);
  };

  // Phrase handlers
  const handleAddPhrase = (time) => {
    setPhrases((prev) => [
      ...prev,
      { id: generateId(), label: "verse", time },
    ].sort((a, b) => a.time - b.time));
  };

  const handleRemovePhrase = (id) => {
    setPhrases((prev) => prev.filter((p) => p.id !== id));
  };

  // Export / Import
  const handleExport = () => {
    const data = { projectTitle, projectOverview, bpm, key, lyrics, phrases, selectedStyle, elements, scenes };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${projectTitle.replace(/\s+/g, "_")}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target.result);
        if (data.projectTitle) setProjectTitle(data.projectTitle);
        if (data.projectOverview) setProjectOverview(data.projectOverview);
        if (data.bpm) setBpm(data.bpm);
        if (data.key) setKey(data.key);
        if (data.lyrics) setLyrics(data.lyrics);
        if (data.phrases) setPhrases(data.phrases);
        if (data.selectedStyle) setSelectedStyle(data.selectedStyle);
        if (data.elements) setElements(data.elements);
        if (data.scenes) setScenes(data.scenes);
      } catch {
        alert("Ugyldig prosjektfil.");
      }
    };
    reader.readAsText(file);
  };

  // -- Render --

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {audioUrl && (
        <audio ref={audioRef} src={audioUrl} />
      )}

      {/* Header */}
      <header className="border-b border-slate-800 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-amber-400 rounded-lg flex items-center justify-center">
              <span className="text-slate-950 font-black text-sm">SF</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-white leading-none">SceneForge</h1>
              <div className="text-xs text-slate-500">AI-drevet musikkvideo-planlegger</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs text-slate-400 border border-slate-700 px-3 py-1.5 rounded cursor-pointer hover:border-slate-500 transition-colors">
              Importer
              <input type="file" accept=".json" className="hidden" onChange={handleImport} />
            </label>
            <button
              onClick={handleExport}
              className="text-xs text-amber-400 border border-amber-400/30 px-3 py-1.5 rounded hover:bg-amber-400/10 transition-colors"
            >
              Eksporter JSON
            </button>
          </div>
        </div>
      </header>

      {/* Project Title */}
      <div className="border-b border-slate-800/50 px-6 py-3">
        <div className="max-w-7xl mx-auto">
          <input
            className="bg-transparent text-xl font-semibold text-white focus:outline-none w-full"
            value={projectTitle}
            onChange={(e) => setProjectTitle(e.target.value)}
            placeholder="Prosjekttittel..."
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-800 px-6">
        <div className="max-w-7xl mx-auto flex gap-1">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 text-sm font-medium transition-colors border-b-2 ${
                activeTab === tab.id
                  ? "text-amber-400 border-amber-400"
                  : "text-slate-400 border-transparent hover:text-slate-300"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">

        {/* Musikk-tab */}
        {activeTab === "music" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-white mb-4">Musikkanalyse</h2>

              {/* Upload */}
              {!audioUrl ? (
                <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-slate-700 rounded-xl cursor-pointer hover:border-amber-400/50 transition-colors">
                  <div className="text-slate-400 text-sm mb-1">Last opp lydfil</div>
                  <div className="text-slate-600 text-xs">MP3, WAV, OGG, FLAC</div>
                  <input type="file" accept="audio/*" className="hidden" onChange={handleAudioUpload} />
                </label>
              ) : (
                <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={handlePlayPause}
                      className="w-10 h-10 bg-amber-400 rounded-full flex items-center justify-center text-slate-950 font-bold hover:bg-amber-300 transition-colors"
                    >
                      {isPlaying ? "||" : "|>"}
                    </button>
                    <div className="text-sm text-slate-400 font-mono">
                      {formatTime(currentTime)} / {formatTime(duration)}
                    </div>
                    <div className="ml-auto text-xs text-slate-500">{audioFile?.name}</div>
                  </div>
                  <Waveform
                    phrases={phrases}
                    duration={duration}
                    currentTime={currentTime}
                    onSeek={handleSeek}
                    onAddPhrase={handleAddPhrase}
                    onRemovePhrase={handleRemovePhrase}
                  />
                </div>
              )}

              {/* Metadata */}
              <div className="grid grid-cols-3 gap-4 mt-4">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">BPM</label>
                  <input
                    className="w-full bg-slate-700/50 border border-slate-600 text-white rounded px-3 py-2 text-sm focus:outline-none focus:border-amber-400"
                    value={bpm}
                    onChange={(e) => setBpm(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Toneart</label>
                  <input
                    className="w-full bg-slate-700/50 border border-slate-600 text-white rounded px-3 py-2 text-sm focus:outline-none focus:border-amber-400"
                    value={key}
                    onChange={(e) => setKey(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Varighet</label>
                  <input
                    className="w-full bg-slate-700/50 border border-slate-600 text-slate-400 rounded px-3 py-2 text-sm focus:outline-none"
                    value={formatTime(duration)}
                    readOnly
                  />
                </div>
              </div>

              {/* Phrase markers legend */}
              <div className="mt-4">
                <div className="text-xs text-slate-400 mb-2">Frasemark&oslash;rer</div>
                <div className="flex flex-wrap gap-2">
                  {phrases.map((phrase) => (
                    <div key={phrase.id} className="flex items-center gap-1.5 bg-slate-800/60 border border-slate-700/50 px-2.5 py-1 rounded-full">
                      <div className={`w-2 h-2 rounded-full ${PHRASE_COLORS[phrase.label] ?? "bg-slate-500"}`} />
                      <span className={`text-xs font-mono ${PHRASE_LABEL_COLORS[phrase.label] ?? "text-slate-400"}`}>{phrase.label}</span>
                      <span className="text-xs text-slate-500">{Math.round(phrase.time * 100)}%</span>
                      <button
                        onClick={() => handleRemovePhrase(phrase.id)}
                        className="text-slate-600 hover:text-red-400 ml-0.5 text-xs leading-none"
                      >
                        x
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Lyrics */}
              <div className="mt-4">
                <label className="block text-xs text-slate-400 mb-1">Sangtekst</label>
                <textarea
                  className="w-full bg-slate-700/50 border border-slate-600 text-slate-300 text-sm rounded px-3 py-2 resize-none focus:outline-none focus:border-amber-400 font-mono"
                  rows={8}
                  placeholder="Lim inn sangtekst her..."
                  value={lyrics}
                  onChange={(e) => setLyrics(e.target.value)}
                />
              </div>
            </div>
          </div>
        )}

        {/* Stil & Vibe-tab */}
        {activeTab === "style" && (
          <div>
            <h2 className="text-lg font-semibold text-white mb-4">Visuell stil</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {DEFAULT_STYLES.map((style) => (
                <StyleCard
                  key={style.id}
                  style={style}
                  selected={selectedStyle === style.id}
                  onSelect={setSelectedStyle}
                />
              ))}
            </div>
          </div>
        )}

        {/* Creative Brief-tab */}
        {activeTab === "brief" && (
          <div className="space-y-6 max-w-3xl">
            <h2 className="text-lg font-semibold text-white">Creative Brief</h2>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Prosjektoversikt</label>
              <textarea
                className="w-full bg-slate-700/50 border border-slate-600 text-slate-300 text-sm rounded px-3 py-2.5 resize-none focus:outline-none focus:border-amber-400"
                rows={5}
                value={projectOverview}
                onChange={(e) => setProjectOverview(e.target.value)}
                placeholder="Beskriv musikkvideo-konseptet..."
              />
            </div>
            <div className="grid grid-cols-3 gap-4 bg-slate-800/60 border border-slate-700/50 rounded-xl p-4">
              <div>
                <div className="text-xs text-slate-400 mb-0.5">BPM</div>
                <div className="text-white font-mono">{bpm}</div>
              </div>
              <div>
                <div className="text-xs text-slate-400 mb-0.5">Toneart</div>
                <div className="text-white font-mono">{key}</div>
              </div>
              <div>
                <div className="text-xs text-slate-400 mb-0.5">Stil</div>
                <div className="text-white text-sm">{DEFAULT_STYLES.find((s) => s.id === selectedStyle)?.name ?? "--"}</div>
              </div>
            </div>
          </div>
        )}

        {/* Elementer-tab */}
        {activeTab === "elements" && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">Core Elements</h2>
              <div className="flex gap-2">
                {["character", "prop", "location"].map((type) => (
                  <button
                    key={type}
                    onClick={() => handleAddElement(type)}
                    className="text-xs text-amber-400 border border-amber-400/30 px-3 py-1 rounded hover:bg-amber-400/10 transition-colors"
                  >
                    + {type === "character" ? "Karakter" : type === "prop" ? "Rekvisitt" : "Lokasjon"}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-3">
              {elements.map((element) => (
                <ElementCard
                  key={element.id}
                  element={element}
                  onUpdate={handleUpdateElement}
                  onRemove={handleRemoveElement}
                />
              ))}
            </div>
          </div>
        )}

        {/* Scener-tab */}
        {activeTab === "scenes" && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">Scener</h2>
              <button
                onClick={handleAddScene}
                className="text-xs text-amber-400 border border-amber-400/30 px-3 py-1.5 rounded hover:bg-amber-400/10 transition-colors"
              >
                + Ny scene
              </button>
            </div>
            <div className="space-y-3">
              {scenes.map((scene) => (
                <SceneEditor
                  key={scene.id}
                  scene={scene}
                  onUpdate={handleUpdateScene}
                  onRemove={handleRemoveScene}
                  onAddShot={handleAddShot}
                  onUpdateShot={handleUpdateShot}
                  onRemoveShot={handleRemoveShot}
                />
              ))}
            </div>
          </div>
        )}

        {/* Storyboard-tab */}
        {activeTab === "storyboard" && (
          <div>
            <h2 className="text-lg font-semibold text-white mb-4">Storyboard</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {scenes.flatMap((scene) =>
                scene.shots.map((shot) => (
                  <div key={shot.id} className="bg-slate-800/60 border border-slate-700/50 rounded-xl overflow-hidden">
                    <div
                      className="h-32 bg-slate-700/50 flex items-center justify-center cursor-pointer hover:bg-slate-700 transition-colors relative"
                    >
                      {shot.storyboardImage ? (
                        <img src={shot.storyboardImage} alt="storyboard" className="w-full h-full object-cover" />
                      ) : (
                        <div className="text-slate-600 text-xs text-center px-2">
                          <div className="mb-1">Dra bilde hit</div>
                          <div>{shot.type}</div>
                        </div>
                      )}
                    </div>
                    <div className="p-2">
                      <div className="text-xs text-amber-400 font-mono mb-0.5">{shot.type} -- {shot.duration}</div>
                      <div className="text-xs text-slate-400 leading-tight">{shot.description}</div>
                      <div className="text-xs text-slate-600 mt-1">{scene.title}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
