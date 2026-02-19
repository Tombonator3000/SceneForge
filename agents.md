# agents.md -- Instrukser for AI-agenter

## Generelle regler

1. Logg alltid alle handlinger til log.md med timestamp (ISO 8601).
2. Hold memory.md oppdatert med relevant kontekst og beslutninger.
3. Sjekk todo.md for prioriterte oppgaver for du starter arbeid.
4. Les denne filen forst nar du gar igjennom dette repoet.
5. Ikke bruk emoji.
6. Ikke bruk em dash (bruk -- i stedet).

## Prosjektspesifikke instrukser

- Prosjektnavn: SceneForge
- Type: AI-drevet musikkvideo-produksjonsplanlegger
- Inspirert av VidMuse.ai, men som eget privat verktoey
- Hovedsprak i UI: Norsk
- Kodefiler: Engelsk variabelnavn, norske UI-strenger
- Teknisk stack: React, Tailwind CSS, Web Audio API
- Fremtidige API-integrasjoner: Suno (musikk), Kling (video), Freepik (bilder)

## Filkonvensjoner

- Dokumentasjon i docs/ bruker Markdown
- Alle timestamps i log.md: YYYY-MM-DDTHH:MM:SSZ
- Komponentfiler: PascalCase.jsx
- Utility-filer: camelCase.js
- API-klienter: serviceName.js (f.eks. suno.js, kling.js)

## Arbeidsflyt

1. Les agents.md (denne filen)
2. Les memory.md for kontekst
3. Sjekk todo.md for oppgaver
4. Utfor arbeid
5. Logg til log.md
6. Oppdater memory.md og todo.md etter behov
