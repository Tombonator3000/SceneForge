// Default constants and configuration data for SceneForge

export const PHRASE_COLORS = {
  start: "bg-slate-500",
  intro: "bg-blue-500",
  verse: "bg-green-600",
  chorus: "bg-amber-500",
  solo: "bg-purple-500",
  bridge: "bg-pink-500",
  outro: "bg-orange-500",
  end: "bg-slate-600",
};

export const PHRASE_LABEL_COLORS = {
  start: "text-slate-400",
  intro: "text-blue-400",
  verse: "text-green-400",
  chorus: "text-amber-400",
  solo: "text-purple-400",
  bridge: "text-pink-400",
  outro: "text-orange-400",
  end: "text-slate-400",
};

export const DEFAULT_PHRASES = [
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

export const DEFAULT_STYLES = [
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

export const DEFAULT_ELEMENTS = [
  { id: "e1", type: "character", name: "Bardens", description: "En umaatelig selvsikker barde med en luttspiller av gull og en kappe av koboltblatt flosjet med stjerner.", image: null },
  { id: "e2", type: "character", name: "Taveita den Skeptiske", description: "En drager med hornbriller og en saerlig lav terskel for banal lyrikk.", image: null },
  { id: "e3", type: "prop", name: "Luttspiller av gull", description: "Magisk luttspiller som lager visual echos naar den spilles.", image: null },
  { id: "e4", type: "prop", name: "Terning av skjebne", description: "En stor terning som svever over scenen og bestemmer handlingens utfall.", image: null },
  { id: "e5", type: "location", name: "Tavernaen 'Rusten Rustning'", description: "Middelaldersk kro med roykfylte bjelker, skaeve bord og en gildigt humorsans.", image: null },
  { id: "e6", type: "location", name: "Dragehula", description: "En hule full av gull og boeker. Taveitas hjem.", image: null },
];

export const DEFAULT_SCENES = [
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

export const TABS = [
  { id: "music", label: "Musikk" },
  { id: "style", label: "Stil & Vibe" },
  { id: "brief", label: "Creative Brief" },
  { id: "elements", label: "Elementer" },
  { id: "scenes", label: "Scener" },
  { id: "storyboard", label: "Storyboard" },
  { id: "settings", label: "Innstillinger" },
];
