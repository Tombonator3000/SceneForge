import { useState, useRef, useEffect } from "react";
import Waveform from "./components/Waveform";
import StyleCard from "./components/StyleCard";
import ElementCard from "./components/ElementCard";
import SceneEditor from "./components/SceneEditor";
import StoryboardCard from "./components/StoryboardCard";
import SettingsPanel from "./components/SettingsPanel";
import useStoryboardGenerator from "./hooks/useStoryboardGenerator";
import formatTime from "./utils/formatTime";
import generateId from "./utils/generateId";
import useWhisper from "./hooks/useWhisper";
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
  const changeAudioInputRef = useRef(null);

  // Save/load state
  const [saveStatus, setSaveStatus] = useState(null); // null | 'saved'
  const [savedAudioFileName, setSavedAudioFileName] = useState(null);

  // Style state
  const [selectedStyle, setSelectedStyle] = useState("s1");
  const currentStyle = DEFAULT_STYLES.find((s) => s.id === selectedStyle) ?? null;

  // Storyboard generator
  const { generate: generateStoryboard, loading: storyboardLoading, error: storyboardError, clearError: clearStoryboardError } = useStoryboardGenerator();

  const handleGenerateStoryboard = () => {
    generateStoryboard({
      phrases,
      duration,
      lyrics,
      style: currentStyle,
      projectOverview,
      onSuccess: (newScenes) => {
        setScenes(newScenes);
        setActiveTab("scenes");
      },
    });
  };

  // Project state
  const [projectTitle, setProjectTitle] = useState("Bardens Terningkast: En Legende om Skryt og Skatter");
  const [projectOverview, setProjectOverview] = useState(
    "En bardcore RPG-musikkvideo om den uovertrufne Bardens og hans episke ballade om seg selv -- fremfoert for en rekke stadig mer irriterte taverngjester (og en dragon)."
  );
  const [scenes, setScenes] = useState(DEFAULT_SCENES);
  const [elements, setElements] = useState(DEFAULT_ELEMENTS);

  // Storyboard ordering -- flat array of shot IDs in display order
  const [storyboardOrder, setStoryboardOrder] = useState(() =>
    DEFAULT_SCENES.flatMap((s) => s.shots.map((sh) => sh.id))
  );
  const dragIndexRef = useRef(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);

  // Whisper transcription
  const { transcribe, loading: whisperLoading, error: whisperError } = useWhisper();

  const handleTranscribe = () => {
    if (!audioFile) return;
    transcribe({
      file: audioFile,
      onSuccess: (text) => setLyrics(text),
    });
  };

  // Audio handlers
  const handleAudioUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAudioFile(file);
    setSavedAudioFileName(null);
    const url = URL.createObjectURL(file);
    setAudioUrl(url);
  };

  const handleChangeAudio = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    if (audioRef.current) audioRef.current.pause();
    setIsPlaying(false);
    setCurrentTime(0);
    setAudioFile(file);
    setSavedAudioFileName(null);
    const url = URL.createObjectURL(file);
    setAudioUrl(url);
    // Reset input so same file can be re-selected
    if (changeAudioInputRef.current) changeAudioInputRef.current.value = "";
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

  // Sync storyboard order when shots are added or removed
  useEffect(() => {
    setStoryboardOrder((prev) => {
      const allShotIds = scenes.flatMap((s) => s.shots.map((sh) => sh.id));
      const filtered = prev.filter((id) => allShotIds.includes(id));
      const newIds = allShotIds.filter((id) => !prev.includes(id));
      if (filtered.length === prev.length && newIds.length === 0) return prev;
      return [...filtered, ...newIds];
    });
  }, [scenes]);

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
    const data = { projectTitle, projectOverview, bpm, key, lyrics, phrases, selectedStyle, elements, scenes, storyboardOrder };
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
        applyProjectData(data);
      } catch {
        alert("Ugyldig prosjektfil.");
      }
    };
    reader.readAsText(file);
  };

  // Apply project data from any source (localStorage or JSON file)
  const applyProjectData = (data) => {
    if (data.projectTitle !== undefined) setProjectTitle(data.projectTitle);
    if (data.projectOverview !== undefined) setProjectOverview(data.projectOverview);
    if (data.bpm !== undefined) setBpm(data.bpm);
    if (data.key !== undefined) setKey(data.key);
    if (data.lyrics !== undefined) setLyrics(data.lyrics);
    if (data.phrases !== undefined) setPhrases(data.phrases);
    if (data.selectedStyle !== undefined) setSelectedStyle(data.selectedStyle);
    if (data.elements !== undefined) setElements(data.elements);
    if (data.scenes !== undefined) setScenes(data.scenes);
    if (data.storyboardOrder !== undefined) setStoryboardOrder(data.storyboardOrder);
    if (data.audioFileName) setSavedAudioFileName(data.audioFileName);
  };

  // Save project to localStorage
  const handleSave = () => {
    const data = {
      projectTitle,
      projectOverview,
      bpm,
      key,
      lyrics,
      phrases,
      selectedStyle,
      elements,
      scenes,
      storyboardOrder,
      audioFileName: audioFile?.name ?? savedAudioFileName ?? null,
    };
    try {
      localStorage.setItem("sceneforge-project", JSON.stringify(data));
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus(null), 2500);
    } catch {
      alert("Lagring feilet -- localStorage kan vaere full.");
    }
  };

  // Auto-load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("sceneforge-project");
    if (!saved) return;
    try {
      const data = JSON.parse(saved);
      applyProjectData(data);
    } catch {
      // Ignorer korrupt data
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
              Importer JSON
              <input type="file" accept=".json" className="hidden" onChange={handleImport} />
            </label>
            <button
              onClick={handleExport}
              className="text-xs text-slate-400 border border-slate-700 px-3 py-1.5 rounded hover:border-slate-500 transition-colors"
            >
              Eksporter JSON
            </button>
            <button
              onClick={handleSave}
              className={`text-xs px-3 py-1.5 rounded border transition-colors ${
                saveStatus === "saved"
                  ? "text-green-400 border-green-400/40 bg-green-400/10"
                  : "text-amber-400 border-amber-400/30 hover:bg-amber-400/10"
              }`}
            >
              {saveStatus === "saved" ? "Lagret!" : "Lagre prosjekt"}
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
                <div className="space-y-2">
                  <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-slate-700 rounded-xl cursor-pointer hover:border-amber-400/50 transition-colors">
                    <div className="text-slate-400 text-sm mb-1">Last opp lydfil</div>
                    <div className="text-slate-600 text-xs">MP3, WAV, OGG, FLAC</div>
                    <input type="file" accept="audio/*" className="hidden" onChange={handleAudioUpload} />
                  </label>
                  {savedAudioFileName && (
                    <div className="text-xs text-slate-500 bg-slate-800/40 border border-slate-700/40 rounded px-3 py-2">
                      Forrige lydfil: <span className="text-slate-400 font-mono">{savedAudioFileName}</span> -- last den opp paa nytt for avspilling
                    </div>
                  )}
                </div>
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
                    <div className="ml-auto flex items-center gap-3">
                      <span className="text-xs text-slate-500">{audioFile?.name}</span>
                      <label className="text-xs text-slate-400 border border-slate-700 px-2 py-1 rounded cursor-pointer hover:border-slate-500 hover:text-slate-300 transition-colors">
                        Bytt lydfil
                        <input
                          ref={changeAudioInputRef}
                          type="file"
                          accept="audio/*"
                          className="hidden"
                          onChange={handleChangeAudio}
                        />
                      </label>
                    </div>
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
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs text-slate-400">Sangtekst</label>
                  {audioFile && (
                    <button
                      onClick={handleTranscribe}
                      disabled={whisperLoading}
                      className="text-xs text-amber-400 border border-amber-400/30 px-3 py-1 rounded hover:bg-amber-400/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {whisperLoading ? "Transkriberer..." : "Transkriber sangtekst"}
                    </button>
                  )}
                </div>
                {whisperError && (
                  <div className="text-xs text-red-400 bg-red-400/10 border border-red-400/20 rounded px-3 py-2 mb-2">
                    {whisperError}
                  </div>
                )}
                <textarea
                  className="w-full bg-slate-700/50 border border-slate-600 text-slate-300 text-sm rounded px-3 py-2 resize-none focus:outline-none focus:border-amber-400 font-mono"
                  rows={8}
                  placeholder="Lim inn sangtekst her, eller bruk Transkriber-knappen..."
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

            {/* Storyboard generator */}
            <div className="bg-slate-800/60 border border-amber-400/20 rounded-xl p-5 space-y-3">
              <div>
                <div className="text-sm font-semibold text-white mb-1">Generer storyboard</div>
                <div className="text-xs text-slate-400">
                  Bruker Anthropic Claude til aa analysere musikkstrukturen (frasene med tidskoder), sangteksten og valgt visuell stil, og genererer et komplett scene-oppsett med scenetitler, shot-beskrivelser, kameratyper og bilde-prompts. Eksisterende scener erstattes.
                </div>
              </div>
              {storyboardError && (
                <div className="flex items-start gap-2 bg-red-900/20 border border-red-500/30 rounded-lg px-3 py-2">
                  <span className="text-xs text-red-400 flex-1">{storyboardError}</span>
                  <button
                    onClick={clearStoryboardError}
                    className="text-red-600 hover:text-red-400 text-xs leading-none flex-shrink-0"
                  >
                    x
                  </button>
                </div>
              )}
              <button
                onClick={handleGenerateStoryboard}
                disabled={storyboardLoading}
                className="w-full py-2.5 bg-amber-400 text-slate-950 text-sm font-semibold rounded-lg hover:bg-amber-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {storyboardLoading ? "Genererer -- vent litt..." : "Generer storyboard med Claude"}
              </button>
              {storyboardLoading && (
                <div className="text-xs text-slate-500 text-center">
                  Claude analyserer musikk og genererer scener...
                </div>
              )}
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
                  styleInfo={currentStyle}
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
                  styleInfo={currentStyle}
                />
              ))}
            </div>
          </div>
        )}

        {/* Storyboard-tab */}
        {activeTab === "storyboard" && (() => {
          // Build flat ordered shot list from storyboardOrder
          const orderedShots = storyboardOrder
            .map((shotId) => {
              for (const scene of scenes) {
                const shot = scene.shots.find((sh) => sh.id === shotId);
                if (shot) return { shot, scene };
              }
              return null;
            })
            .filter(Boolean);

          const handleDragStart = (index) => {
            dragIndexRef.current = index;
          };

          const handleDragOver = (e, index) => {
            e.preventDefault();
            if (dragOverIndex !== index) setDragOverIndex(index);
          };

          const handleDrop = (index) => {
            const from = dragIndexRef.current;
            if (from !== null && from !== index) {
              const newOrder = [...storyboardOrder];
              const [moved] = newOrder.splice(from, 1);
              newOrder.splice(index, 0, moved);
              setStoryboardOrder(newOrder);
            }
            setDragOverIndex(null);
            dragIndexRef.current = null;
          };

          const handleDragEnd = () => {
            setDragOverIndex(null);
            dragIndexRef.current = null;
          };

          return (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-white">Storyboard</h2>
                <div className="text-xs text-slate-500">Dra kortene for aa endre rekkefolge</div>
              </div>
              {orderedShots.length === 0 ? (
                <div className="text-slate-500 text-sm">Ingen shots enda. Legg til scener og shots i Scener-fanen.</div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {orderedShots.map(({ shot, scene }, index) => (
                    <div
                      key={shot.id}
                      draggable
                      onDragStart={() => handleDragStart(index)}
                      onDragOver={(e) => handleDragOver(e, index)}
                      onDragLeave={() => setDragOverIndex(null)}
                      onDrop={() => handleDrop(index)}
                      onDragEnd={handleDragEnd}
                      className={`cursor-grab active:cursor-grabbing transition-all ${
                        dragOverIndex === index ? "ring-2 ring-amber-400 rounded-xl scale-105" : ""
                      }`}
                    >
                      <StoryboardCard
                        shot={shot}
                        scene={scene}
                        styleInfo={currentStyle}
                        onUpdateShot={handleUpdateShot}
                        orderNumber={index + 1}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })()}

        {/* Innstillinger-tab */}
        {activeTab === "settings" && <SettingsPanel />}

      </main>
    </div>
  );
}
