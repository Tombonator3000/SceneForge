import { useState, useRef, useEffect, useCallback } from "react";

// -- Constants --

const PHRASE_COLORS = {
  start: "bg-slate-500",
  intro: "bg-blue-500",
  verse: "bg-green-600",
  chorus: "bg-amber-500",
  solo: "bg-purple-500",
  bridge: "bg-pink-500",
  outro: "bg-orange-500",
  end: "bg-slate-600",
};

const PHRASE_LABEL_COLORS = {
  start: "text-slate-400",
  intro: "text-blue-400",
  verse: "text-green-400",
  chorus: "text-amber-400",
  solo: "text-purple-400",
  bridge: "text-pink-400",
  outro: "text-orange-400",
  end: "text-slate-400",
};

const DEFAULT_PHRASES = [
  { id: "p1", label: "start", time: 0.0 },
  { id: "p2", label: "intro", time: 0.12 },
  { id: "p3", label: "verse", time: 0.22 },
  { id: "p4", label: "chorus", time: 0.42 },
  { id: "p5", label: "verse", time: 0.52 },
  { id: "p6", label: "chorus", time: 0.72 },
  { id: "p7", label: "solo", time: 0.82 },
  { id: "p8", label: "outro", time: 0.90 },
  { id: "p9", label: "end", time: 0.98 },
];

const DEFAULT_STYLES = [
  { id: "s1", name: "Dark Fantasy", description: "Guillermo del Toro-inspirert. Skapninger, gotisk arkitektur, dram.", color: "from-purple-900 to-slate-900" },
  { id: "s2", name: "Epic Cinematic", description: "Hans Zimmer-stemning. Store landskap, langsomme kamerabevegelser.", color: "from-amber-900 to-slate-900" },
  { id: "s3", name: "Retro Anime", description: "80-talls anime-estetikk. Cel-shading, neonfarger, action-linjer.", color: "from-pink-900 to-purple-900" },
  { id: "s4", name: "Lo-fi Chill", description: "Avslappet, nostalgisk. Varme fargetoner, kaffekrus, regnvinduer.", color: "from-amber-800 to-slate-800" },
  { id: "s5", name: "Cyberpunk", description: "Neon, regn, hologrammer. Blade Runner-atmosfaere.", color: "from-cyan-900 to-purple-900" },
  { id: "s6", name: "Nature Documentary", description: "Attenborough-estetikk. Tidslaps, makro, naturlige farger.", color: "from-green-900 to-slate-900" },
  { id: "s7", name: "Vintage Film", description: "Super 8 eller 16mm-look. Korn, lekket lys, varme farger.", color: "from-amber-700 to-slate-800" },
  { id: "s8", name: "Surrealist Art", description: "Dali-inspirert. Droemmelogikk, umulige strukturer.", color: "from-violet-900 to-pink-900" },
  { id: "s9", name: "Street Photography", description: "Urban, raa, autentisk. Sort/hvit eller desaturert.", color: "from-slate-800 to-slate-950" },
  { id: "s10", name: "Watercolor World", description: "Myke akvarell-teksturer. Pasteller, papir-tekstur.", color: "from-sky-800 to-teal-900" },
  { id: "s11", name: "Neon Noir", description: "Detektiv-estetikk. Regnvaate gater, neonrefleksjoner.", color: "from-indigo-900 to-slate-950" },
  { id: "s12", name: "Bardcore Medieval", description: "Middelaldersk piksel-kunst eller illuminerte manuskripter.", color: "from-yellow-900 to-amber-950" },
];

const generateId = () => Math.random().toString(36).slice(2, 9);

const DEFAULT_ELEMENTS = [
  { id: "e1", type: "character", name: "Bardens", description: "En umaatelig selvsikker barde med en luttspiller av gull og en kappe av koboltblatt flosjet med stjerner.", image: null },
  { id: "e2", type: "character", name: "Taveita den Skeptiske", description: "En drager med hornbriller og en saerlig lav terskel for banal lyrikk.", image: null },
  { id: "e3", type: "prop", name: "Luttspiller av gull", description: "Magisk luttspiller som lager visual echos naar den spilles.", image: null },
  { id: "e4", type: "prop", name: "Terning av skjebne", description: "En stor terning som svever over scenen og bestemmer handlingens utfall.", image: null },
  { id: "e5", type: "location", name: "Tavernaen 'Rusten Rustning'", description: "Middelaldersk kro med roykfylte bjelker, skaeve bord og en gildigt humorsans.", image: null },
  { id: "e6", type: "location", name: "Dragehula", description: "En hule full av gull og boeker. Taveitas hjem.", image: null },
];

const DEFAULT_SCENES = [
  {
    id: "sc1",
    title: "Bardens Storslaaende Entré",
    description: "Bardens entrer Tavernaen 'Rusten Rustning' med maksimal dramatikk.",
    phraseRef: "p3",
    shots: [
      { id: "sh1", type: "Wide", description: "Doeren slaar opp. Bardens silhuett mot sollyset.", duration: "4s", storyboardImage: null },
      { id: "sh2", type: "Medium", description: "Bardens svinger kaapen og setter seg ved scenen.", duration: "3s", storyboardImage: null },
    ],
  },
  {
    id: "sc2",
    title: "Balladen Begynner",
    description: "Bardens setter seg og begynner aa spille paa luttspilleren. Gjestene lytter skeptisk.",
    phraseRef: "p4",
    shots: [
      { id: "sh3", type: "Close-up", description: "Luttspillerens strenger. Lydbolgene er synlige.", duration: "4s", storyboardImage: null },
      { id: "sh4", type: "Wide", description: "Gjestene i tavernaen snur seg. Blandede reaksjoner.", duration: "5s", storyboardImage: null },
    ],
  },
  {
    id: "sc3",
    title: "Terningkastet",
    description: "Bardens kaster terningen. Alle holder pusten. En sekser -- naturligvis.",
    phraseRef: "p7",
    shots: [
      { id: "sh5", type: "ECU", description: "Terningen snurrer i luften. Slow motion.", duration: "4s", storyboardImage: null },
      { id: "sh6", type: "Medium", description: "Bardens smiler selvtilfreds. Taveita ruller med oynene.", duration: "3s", storyboardImage: null },
    ],
  },
  {
    id: "sc4",
    title: "Triumferende Avslutning",
    description: "Bardens forlater tavernaen med gull og applaus. Taveita ser nesten imponert ut.",
    phraseRef: "p8",
    shots: [
      { id: "sh7", type: "Wide", description: "Alle klapper (motvillig). Bardens bukker.", duration: "5s", storyboardImage: null },
      { id: "sh8", type: "Close-up", description: "Taveita nikker anerkjennende. Dette var faktisk bra.", duration: "3s", storyboardImage: null },
    ],
  },
];

const TABS = [
  { id: "music", label: "Musikk" },
  { id: "style", label: "Stil & Vibe" },
  { id: "brief", label: "Creative Brief" },
  { id: "elements", label: "Elementer" },
  { id: "scenes", label: "Scener" },
  { id: "storyboard", label: "Storyboard" },
];

// -- Helpers --

const formatTime = (seconds) => {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
};

// -- Sub-components --

function Waveform({ phrases, duration, currentTime, onSeek, onAddPhrase, onRemovePhrase }) {
  const canvasRef = useRef(null);
  const [hoveredPhrase, setHoveredPhrase] = useState(null);

  const handleCanvasClick = useCallback(
    (e) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const ratio = (e.clientX - rect.left) / rect.width;
      if (onSeek) onSeek(ratio * duration);
    },
    [duration, onSeek]
  );

  return (
    <div className="relative">
      <div
        className="relative h-24 bg-slate-800/60 rounded-lg overflow-hidden cursor-pointer border border-slate-700/50"
        onClick={handleCanvasClick}
      >
        {/* Placeholder waveform bars */}
        <div className="absolute inset-0 flex items-center gap-px px-2">
          {Array.from({ length: 120 }).map((_, i) => {
            const h = 20 + Math.sin(i * 0.3) * 15 + Math.sin(i * 0.7) * 10 + Math.random() * 20;
            return (
              <div
                key={i}
                className="flex-1 bg-amber-400/40 rounded-sm"
                style={{ height: `${h}%` }}
              />
            );
          })}
        </div>
        {/* Playhead */}
        {duration > 0 && (
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-amber-400"
            style={{ left: `${(currentTime / duration) * 100}%` }}
          />
        )}
        {/* Phrase markers */}
        {phrases.map((phrase) => (
          <div
            key={phrase.id}
            className="absolute top-0 bottom-0 flex flex-col items-center"
            style={{ left: `${phrase.time * 100}%` }}
            onMouseEnter={() => setHoveredPhrase(phrase.id)}
            onMouseLeave={() => setHoveredPhrase(null)}
          >
            <div className={`w-0.5 h-full ${PHRASE_COLORS[phrase.label] ?? "bg-slate-500"} opacity-70`} />
            <div
              className={`absolute top-1 text-xs font-mono px-1 rounded ${PHRASE_COLORS[phrase.label] ?? "bg-slate-500"} text-white whitespace-nowrap`}
              style={{ fontSize: "10px" }}
            >
              {phrase.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StyleCard({ style, selected, onSelect }) {
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

function ElementCard({ element, onRemove, onUpdate }) {
  const typeColors = {
    character: "text-blue-400 border-blue-500/30 bg-blue-500/10",
    prop: "text-green-400 border-green-500/30 bg-green-500/10",
    location: "text-amber-400 border-amber-500/30 bg-amber-500/10",
  };

  const typeLabels = {
    character: "Karakter",
    prop: "Rekvisitt",
    location: "Lokasjon",
  };

  return (
    <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-4">
      <div className="flex items-start gap-3">
        <div className={`px-2 py-0.5 rounded text-xs font-mono border ${typeColors[element.type]}`}>
          {typeLabels[element.type]}
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

function ShotCard({ shot, onUpdate, onRemove }) {
  const shotTypes = ["Wide", "Medium", "Close-up", "ECU", "OTS", "POV", "Insert"];

  return (
    <div className="bg-slate-700/50 border border-slate-600/50 rounded-lg p-3">
      <div className="flex items-center gap-2 mb-2">
        <select
          className="bg-slate-800 border border-slate-600 text-slate-300 text-xs rounded px-2 py-1 focus:outline-none focus:border-amber-400"
          value={shot.type}
          onChange={(e) => onUpdate(shot.id, { type: e.target.value })}
        >
          {shotTypes.map((t) => (
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

function SceneEditor({ scene, onUpdate, onRemove, onAddShot, onUpdateShot, onRemoveShot }) {
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
