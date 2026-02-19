# Memory

## Prosjekt: SceneForge -- AI Music Video Production Planner

### Opprinnelse
- Inspirert av VidMuse.ai (analysert fra 8 screenshots)
- Forste versjon bygget som enkeltstaaende React artifact (musicvis.jsx, 1377 linjer)
- Alternativ kompilert versjon: sceneforge-compiled.html (346KB bundlet)
- Privat prosjekt, ikke en kopi -- eget verktoey med egne funksjoner

### Eksisterende funksjonalitet (Phase 1 -- ferdig)
- Musikkopplasting med Web Audio API waveform-rendering
- Frase-markorer med fargekodede labels (start, intro, verse, chorus, solo, bridge, outro, end)
- Redigerbar BPM/Key/Duration metadata
- Sangtekst-textarea
- 12 visuelle stilkort med utvalg
- Creative Brief-editor (prosjektoversikt, script and sound)
- Core Elements-haandtering (karakterer, props, lokasjoner) med bildeopplasting
- Scene-editor med sammenleggbare paneler, shot-haandtering
- Storyboard-grid med drag-and-drop bildeplassering og reordering
- Egendefinert bildeopplasting til storyboard-kort ("Last opp"-knapp, FileReader -> data URL)
- Rekkefolgenumre (#1, #2, ...) pa storyboard-kort som oppdateres automatisk ved reordering
- JSON eksport/import for prosjektpersistens
- Mork slate-tema med amber aksent

### Planlagt funksjonalitet (Phase 2+)
- API-integrasjoner: Suno (musikkgenerering), Kling (videogenerering), Freepik (bildegenerering)
- Avansert musikkanalyse (beat detection, auto BPM)
- AI-drevet sceneforslag basert pa musikkstruktur
- Timeline-sync mellom musikk og scener
- Prompt-generering for bilde/video-AI
- Eksport som PDF/dokument

### Teknisk stack
- React 18 + Vite 6 (satt opp 2026-02-19)
- Tailwind CSS 3 med postcss + autoprefixer
- Web Audio API for waveform (implementert i MusicVisApp.jsx)
- HTML5 Drag and Drop API
- Fremtidig: API-klienter for Suno, Kling, Freepik

### Vite-oppsett (ferdig 2026-02-19)
- package.json, vite.config.js, tailwind.config.js, postcss.config.js opprettet
- index.html -> src/main.jsx -> src/App.jsx -> src/MusicVisApp.jsx
- src/index.css med Tailwind-direktiver
- `npm run dev` starter pa localhost:5173
- `npm run build` produserer dist/ uten feil
- MusicVisApp.jsx er skrevet fra bunnen av basert pa CLAUDE.md/memory.md (original ble ikke commitet til repo)

### Komponentoppsplitting (ferdig 2026-02-19)
- MusicVisApp.jsx splittet til separate komponentfiler
- src/components/: Waveform.jsx, StyleCard.jsx, ElementCard.jsx, ShotCard.jsx, SceneEditor.jsx
- src/utils/: defaults.js (alle konstanter), formatTime.js, generateId.js
- MusicVisApp.jsx er naa et rent orkestreringskomponent med imports
- `npm run build` -- 0 feil etter refaktorering

### Eksempeldata fra forrige okt
- Bardcore RPG-musikkvideotronsept
- Tittel: "Bardens Terningkast: En Legende om Skryt og Skatter"
- Stil: Guillermo del Toro Dark Fantasy
- 79 BPM, G-dur, 4:35 varighet
- 4 scener med 8 shots totalt i eksempeldata

### Freepik API-integrasjon (ferdig 2026-02-19)
- src/hooks/useFreepik.js -- hook som wrapper FreepikClient, haandterer submit+poll, loading/error state
- API-nokkel leses fra VITE_FREEPIK_API_KEY i .env
- ShotCard og ElementCard har "Generer bilde"-knapp med per-kort loading state
- StoryboardCard i storyboard-tab har tilsvarende knapp med loading-overlay
- Prompts bygges fra: beskrivelse + valgt stil (navn + beskrivelse) + quality tags
- currentStyle beregnes i MusicVisApp og sendes som styleInfo ned til alle relevante komponenter

### OpenAI Whisper-integrasjon (ferdig 2026-02-19)
- src/hooks/useWhisper.js -- hook som sender lydfil til OpenAI Whisper API (whisper-1, verbose_json)
- API-nokkel leses fra localStorage via getApiKey("openai") -- konsistent med Freepik-integrasjonen
- Resultat formateres med tidskoder ([M:SS] per segment) og settes inn i lyrics-feltet
- "Transkriber sangtekst"-knapp vises kun nar lydfil er lastet opp i Musikkanalyse-fanen
- Feilmelding vises inline over textarea (ikke modal/alert)

### GitHub Pages kompatibilitetsfikser (ferdig 2026-02-19)
- `public/.nojekyll` -- hindrer Jekyll fra a prosessere filer, kopieres til dist/ av Vite
- `src/components/ErrorBoundary.jsx` -- class component, fanger runtime-feil, viser feilside i stedet for blank skjerm
- `src/main.jsx` -- App pakket i ErrorBoundary
- `.github/workflows/deploy.yml` -- Node 22, NODE_ENV=production, bruker `JamesIves/github-pages-deploy-action@v4` som pusher til `gh-pages`-branch
- GitHub Pages ma aktiveres manuelt: Settings -> Pages -> Source: "Deploy from a branch" -> "gh-pages / root"
- `src/components/Waveform.jsx` -- Math.random() erstattet med useMemo for stabile barhoyder (forhindrer flimring under avspilling)

### Storyboard reordering og egendefinerte bilder (ferdig 2026-02-19)
- `storyboardOrder` state i MusicVisApp -- flat array av shot-IDer i display-rekkefolge
- useEffect synkroniserer `storyboardOrder` med `scenes` (legger til nye shots sist, fjerner slettede)
- HTML5 Drag and Drop: `draggable` + onDragStart/onDragOver/onDrop/onDragEnd pa wrapper-div
- Visuell feedback: amber ring + scale-105 pa drop-target
- StoryboardCard: `orderNumber` prop viser #N badge oeverst til venstre i bildeomnraadet
- StoryboardCard: "Last opp"-knapp trigger skjult file-input, FileReader konverterer til data URL
- storyboardOrder inkluderes i JSON-eksport/-import for persistens

### Brukerpreferanser
- Ingen emoji
- Ingen em dash (bruk --)
- Alltid sjekk for agents.md
- Alltid vedlikehold log.md, memory.md, todo.md
