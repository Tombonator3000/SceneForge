# SceneForge

AI-drevet musikkvideo-produksjonsplanlegger. Analyser musikk, bygg scener, lag storyboards, og generer bilder/video med AI.

## Hva er SceneForge?

SceneForge er et privat verktoey for a planlegge og produsere musikkvideo-innhold. Du laster opp en musikkfil, analyserer strukturen, velger visuell stil, bygger scener med drag-and-drop, og kan generere bilder og videoklipp via AI-tjenester.

Inspirert av VidMuse.ai, men bygget som eget verktoey med egne funksjoner og integrasjoner.

## Funksjoner

**Ferdig (Phase 1)**
- Musikkopplasting med waveform-visning (Web Audio API)
- Frase-markorer (intro, verse, chorus, bridge, etc.)
- Redigerbar BPM/Key/Duration
- 12+ visuelle stilmaler
- Creative Brief-editor
- Core Elements (karakterer, props, lokasjoner) med bildehaandtering
- Scene/Shot-editor med sammenleggbare paneler
- Storyboard-grid med drag-and-drop
- JSON eksport/import

**Planlagt**
- Auto BPM/beat detection
- AI-drevet sceneforslag basert pa musikkstruktur
- API-integrasjoner: Suno (musikk), Kling (video), Freepik (bilder)
- Tidslinje-sync mellom musikk og scener
- Eksport som PDF

## Mappestruktur

```
sceneforge/
  README.md
  agents.md           # Instrukser for AI-agenter
  memory.md           # Prosjektminne
  todo.md             # Oppgaveliste
  log.md              # Endringslogg
  .env.example         # API-nokkel-template
  .gitignore
  src/
    MusicVisApp.jsx    # Hovedapplikasjon (React, 1377 linjer)
    api/
      index.js         # API-eksporter
      suno.js          # Suno musikkgenerering
      kling.js         # Kling videogenerering
      freepik.js       # Freepik bildegenerering
    components/        # (fremtidig) Oppdelte React-komponenter
    hooks/             # (fremtidig) Custom React hooks
    utils/             # (fremtidig) Hjelpefunksjoner
  public/
    sceneforge-compiled.html  # Kompilert standalone-versjon (346KB)
  docs/
    api-integration-plan.md   # Detaljert plan for API-integrasjoner
```

## Hurtigstart

### Kjoer som React artifact (enklest)
1. Kopier innholdet av `src/MusicVisApp.jsx`
2. Lim inn i en React-kompatibel playground (f.eks. Claude artifact, StackBlitz)
3. Appen kjorer umiddelbart med eksempeldata

### Kjoer kompilert versjon
1. Apne `public/sceneforge-compiled.html` i en nettleser
2. Alt er innebygd -- ingen avhengigheter

### Sett opp med Vite (fremtidig)
```bash
npm create vite@latest sceneforge -- --template react
cp src/MusicVisApp.jsx sceneforge/src/App.jsx
cd sceneforge && npm install && npm run dev
```

## API-integrasjoner

Se [docs/api-integration-plan.md](docs/api-integration-plan.md) for detaljert plan.

### Oppsett
```bash
cp .env.example .env
# Rediger .env med dine API-nokler
```

### Tjenester

| Tjeneste | Type | Status | Offisiell API |
|----------|------|--------|---------------|
| Suno | Musikk | Stub klar | Nei (tredjepartstilgang) |
| Kling | Video | Stub klar | Ja (enterprise) + tredjeparter |
| Freepik | Bilder | Stub klar | Ja (offisiell, credit-basert) |

## Teknisk stack

- React (enkeltstaaende artifact)
- Tailwind CSS (utility classes)
- Web Audio API (waveform rendering)
- HTML5 Drag and Drop API
- Fetch API (for AI-tjenester)

## Lisens

Privat prosjekt.
