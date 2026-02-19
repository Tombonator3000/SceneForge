# TODO

## Phase 1 -- Core UI (Ferdig)
- [x] Musikkopplasting og waveform-visning
- [x] Frase/seksjon-markorsystem pa waveform
- [x] BPM/Key/Duration visning
- [x] Style & Vibe valgrid
- [x] Creative Brief editor
- [x] Scene/Shot list builder
- [x] Drag and drop bildeplassering for storyboard
- [x] Storyboard grid view
- [x] JSON eksport/import
- [x] Mork tema med amber aksenter

## Phase 2 -- Musikkanalyse (Neste)
- [ ] Auto BPM-deteksjon fra lydfil
- [ ] Beat detection og beat-grid overlay pa waveform
- [ ] Automatisk frase-deteksjon (intro, verse, chorus etc.)
- [ ] Toneart-deteksjon
- [ ] Loudness/energy-kurve per seksjon
- [ ] Forslag til klippepunkter basert pa beats/seksjonsskifter

## Phase 3 -- AI Sceneforslag
- [ ] Analysere musikkstruktur og foresla scener automatisk
- [ ] Koble musikkfaser til scene-typer (intro -> etablering, chorus -> action, bridge -> kontrast)
- [ ] Generere creative brief-utkast basert pa musikkanalyse og valgt stil
- [ ] Foresla kamerabevegelsor og editing rhythm per scene
- [ ] Prompt-generering for bilde-AI basert pa scene-beskrivelser

## Phase 4 -- API-integrasjoner
### Suno (Musikkgenerering)
- [ ] Undersoke Suno API tilgjengelighet og prising
- [ ] Implementere API-klient (src/api/suno.js)
- [ ] Generer musikkforslag basert pa brief/stil
- [ ] Last ned generert musikk direkte inn i prosjektet

### Kling (Videogenerering)
- [ ] Undersoke Kling API tilgjengelighet og prising
- [ ] Implementere API-klient (src/api/kling.js)
- [ ] Generer videoklipp per shot fra storyboard-bilder + prompts
- [ ] Preview genererte klipp i storyboard-view
- [ ] Haaandter ulike aspect ratios og varigheter

### Freepik (Bildegenerering)
- [x] Undersoke Freepik AI API tilgjengelighet og prising
- [x] Implementere API-klient (src/api/freepik.js)
- [x] Implementere useFreepik hook (src/hooks/useFreepik.js)
- [x] Generer referansebilder for karakterer, lokasjoner, props (ElementCard)
- [x] Generer storyboard-frames basert pa shot-beskrivelser (ShotCard + StoryboardCard)
- [ ] Bulk-generering av alle storyboard-frames
- [ ] Teste med ekte VITE_FREEPIK_API_KEY

### OpenAI Whisper (Sangtekst-transkribering)
- [x] Implementere useWhisper hook (src/hooks/useWhisper.js)
- [x] "Transkriber sangtekst"-knapp i Musikkanalyse-fanen med tidskoder
- [ ] Teste med ekte OpenAI API-nokkel og MP3-fil

### Andre APIer (vurderes)
- [ ] Midjourney / DALL-E for bildegenerering
- [ ] Runway ML for videogenerering
- [ ] ElevenLabs for voiceover
- [ ] OpenAI/Anthropic for scene-analyse og forslag

## Phase 5 -- Timeline og Sync
- [ ] Visuell tidslinje som synker musikk med scener/shots
- [ ] Dra shots langs tidslinje for a plassere dem pa eksakte tidspunkter
- [ ] Preview-modus: spill av musikk med storyboard-slideshow synket til beats
- [ ] Eksporter timing-data som EDL eller XML for videoproduksjon

## Phase 6 -- Eksport og Deling
- [ ] Eksport creative brief som PDF
- [ ] Eksport storyboard som PDF/bildeserie
- [ ] Eksport shot list som regneark
- [ ] Prosjekt-lagring (localStorage eller filsystem)
- [ ] Delbar lenke (statisk HTML-eksport)

## Phase 7 -- Modularisering
- [x] Splitt MusicVisApp.jsx til separate komponentfiler (ferdig 2026-02-19)
- [ ] Trekk ut hooks (useAudio, useProject, useDragDrop)
- [x] Sett opp Vite med React og Tailwind (ferdig 2026-02-19)
- [ ] Legg til TypeScript-typer
- [ ] Tester

## Backlog
- [ ] Responsivt design (mobil/tablet)
- [ ] Tastatursnarveger
- [ ] Angre/gja om-system
- [ ] Flere stil-templates
- [ ] Flersprakstoette (norsk/engelsk toggle)
- [ ] Mork/lys tema-veksling
