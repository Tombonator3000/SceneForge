# CLAUDE.md

## Prosjekt

SceneForge -- AI-drevet musikkvideo-produksjonsplanlegger. Bruker laster opp musikk, analyserer strukturen, velger visuell stil, bygger scener med drag-and-drop, og genererer bilder/video via AI-tjenester (Freepik, Kling, Suno).

Privat prosjekt. Norsk UI, engelsk kode.

## For du gjor noe

1. Les denne filen ferdig
2. Les `memory.md` for prosjektkontekst og status
3. Les `todo.md` for prioriterte oppgaver
4. Les `docs/api-integration-plan.md` hvis oppgaven involverer API-integrasjoner

## Regler

- Ikke bruk emoji. Aldri. Ingen steder.
- Ikke bruk em dash. Bruk -- (dobbel bindestrek) i stedet.
- Logg ALLE handlinger til `log.md` med timestamp (ISO 8601, f.eks. 2026-02-19T16:30:00Z)
- Oppdater `memory.md` nar du tar viktige beslutninger eller legger til ny funksjonalitet
- Oppdater `todo.md` nar oppgaver fullforst eller nye oppgaver oppdages
- Norske UI-strenger, engelske variabel- og funksjonsnavn
- Norske kommentarer i docs, engelske kommentarer i kode

## Teknisk stack

- React 18+ med Vite
- Tailwind CSS (utility classes, ikke custom CSS med mindre nodvendig)
- Web Audio API for waveform-rendering og musikkanalyse
- HTML5 Drag and Drop API
- Fetch API for eksterne tjenester

## Kommandoer

```bash
npm run dev        # Start utviklingsserver
npm run build      # Bygg for produksjon
npm run preview    # Forhaaandsvis produksjonsbygg
npm run lint       # Kjor linter (nar konfigurert)
```

## Mappestruktur

```
sceneforge/
  CLAUDE.md                # Denne filen -- les forst
  agents.md                # Generelle agent-instrukser
  memory.md                # Prosjektminne -- les for kontekst
  todo.md                  # Oppgaveliste -- sjekk for prioriteringer
  log.md                   # Endringslogg -- skriv til etter endringer
  .env.example             # API-nokkel-template
  .env                     # Faktiske nokler (ALDRI commit)
  docs/
    api-integration-plan.md  # Detaljert API-plan med research
  src/
    App.jsx                # Hovedinngang (wrapper)
    MusicVisApp.jsx        # Hovedapplikasjon (opprinnelig enkeltfil)
    components/            # Oppdelte React-komponenter
      Waveform.jsx
      PhraseMarkers.jsx
      StyleCard.jsx
      SceneEditor.jsx
      ShotCard.jsx
      ElementCard.jsx
      CreativeBriefEditor.jsx
      ImageDropZone.jsx
    api/                   # API-klienter
      index.js             # Re-eksporter
      suno.js              # Suno musikkgenerering
      kling.js             # Kling videogenerering
      freepik.js           # Freepik bildegenerering
    hooks/                 # Custom React hooks
      useAudio.js          # Lydavspilling og waveform
      useProject.js        # Prosjektstate-haandtering
    utils/                 # Hjelpefunksjoner
      formatTime.js
      generateId.js
  public/
    sceneforge-compiled.html  # Eldre kompilert standalone (referanse)
```

## Kodestil

### Generelt
- Funksjonelle React-komponenter med hooks
- Destructure props i komponent-signaturer
- Bruk `const` som default, `let` kun nar reassignment trengs
- Ingen `var`
- Template literals fremfor string concatenation
- Optional chaining (?.) og nullish coalescing (??) fremfor lange if-sjekker

### Navngivning
- Komponenter: PascalCase (SceneEditor.jsx)
- Hooks: camelCase med "use" prefix (useAudio.js)
- Utilities: camelCase (formatTime.js)
- API-klienter: camelCase (freepik.js)
- Konstanter: SCREAMING_SNAKE_CASE (DEFAULT_PHRASES, PHRASE_COLORS)
- CSS-klasser: Tailwind utilities, ingen custom class-navn med mindre helt nodvendig

### Komponentstruktur
```jsx
import { useState, useEffect } from "react";

// Konstanter oeverst
const SOME_CONSTANT = "value";

// Hjelpefunksjoner
const helperFunction = (x) => x * 2;

// Komponent
export default function ComponentName({ prop1, prop2, onAction }) {
  const [state, setState] = useState(null);

  // Effects
  useEffect(() => { /* ... */ }, []);

  // Handlers
  const handleClick = () => { /* ... */ };

  // Render
  return (
    <div className="...">
      {/* JSX */}
    </div>
  );
}
```

### Tailwind-konvensjoner i dette prosjektet
- Bakgrunn: `bg-slate-950` (appen), `bg-slate-800/60` (kort), `bg-slate-700/50` (inputs)
- Tekst: `text-white` (primaer), `text-slate-300` (sekundaer), `text-slate-400` (muted), `text-slate-500` (hint)
- Aksent: `text-amber-400`, `bg-amber-400/10`, `border-amber-400`
- Kanter: `border-slate-700/50` (subtil), `border-slate-600` (input)
- Avrunding: `rounded-lg` (standard), `rounded-xl` (store kort)

## Viktig kontekst

### Naavaerende status
Phase 1 (Core UI) er ferdig som en enkelt fil (src/MusicVisApp.jsx, 1377 linjer).
Appen fungerer, men trenger:
1. Vite-oppsett for ordentlig dev-miljoe
2. Oppsplitting i separate komponenter
3. API-integrasjoner (Freepik forst, deretter Kling, deretter Suno)

### API-prioritering
1. **Freepik** (bildegenerering) -- offisiell API, enklest, $5 gratis credits. Header: `x-freepik-api-key`. Docs: docs.freepik.com
2. **Kling** (videogenerering) -- image-to-video fra storyboard-frames. Bruk Kie.ai eller PiAPI som provider.
3. **Suno** (musikkgenerering) -- ingen offisiell API, bruk tredjepartstjeneste. Lavest prioritet.

### Asynkront API-monster
Alle tre APIene bruker submit-poll-monsteret:
1. POST request -> fa task_id
2. Poll GET med task_id til status = complete/success
3. Hent resultat-URL fra response

Implementer dette som en gjenbrukbar utility, ikke per-API.

### Eksempeldata
Appen er forhaaandsutfylt med et bardcore RPG-musikkvideokonsept ("Bardens Terningkast"). Behold dette som eksempeldata/demo, ikke slett det.

## Logg-format

Nar du skriver til log.md, bruk dette formatet:

```markdown
## YYYY-MM-DDTHH:MM:SSZ -- Kort beskrivelse

**Handling:** Hva ble gjort
**Filer endret:** Liste over filer
**Beslutninger:** Eventuelle valg som ble tatt og hvorfor
**Neste steg:** Hva som bor gjores videre
```

## Vanlige oppgaver

### Legge til en ny komponent
1. Lag filen i `src/components/ComponentName.jsx`
2. Eksporter som default
3. Importer i forelderkomponenten
4. Logg til log.md

### Legge til en ny API-integrasjon
1. Les `docs/api-integration-plan.md` for kontekst
2. Oppdater klienten i `src/api/`
3. Lag en hook i `src/hooks/` for UI-integrasjon
4. Legg til "Generer"-knapp i relevant komponent
5. Haandter loading/error/success states
6. Logg til log.md, oppdater todo.md

### Splitte opp MusicVisApp.jsx
Filen inneholder disse komponentene som skal bli egne filer:
- Waveform (linje ~153-263)
- PhraseMarkers (linje ~268-294)
- StyleCard (linje ~299-325)
- ImageDropZone (linje ~330-389)
- ShotCard (linje ~394-422)
- SceneEditor (linje ~427-599)
- ElementCard (linje ~604-654)
- CreativeBriefEditor (linje ~659-711)
- MusicVisApp / hovedkomponent (linje ~716-1377)

Konstanter (DEFAULT_STYLES, DEFAULT_PHRASES, PHRASE_COLORS, DEFAULT_SCENES, DEFAULT_ELEMENTS) bor flyttes til `src/utils/defaults.js`.
