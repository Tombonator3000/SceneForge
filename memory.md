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
- Storyboard-grid med drag-and-drop bildeplassering
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
- React (single file artifact, skal modulariseres)
- Tailwind CSS
- Web Audio API for waveform
- HTML5 Drag and Drop API
- Fremtidig: API-klienter for Suno, Kling, Freepik

### Eksempeldata fra forrige okt
- Bardcore RPG-musikkvideotronsept
- Tittel: "Bardens Terningkast: En Legende om Skryt og Skatter"
- Stil: Guillermo del Toro Dark Fantasy
- 79 BPM, G-dur, 4:35 varighet
- 4 scener med 8 shots totalt i eksempeldata

### Brukerpreferanser
- Ingen emoji
- Ingen em dash (bruk --)
- Alltid sjekk for agents.md
- Alltid vedlikehold log.md, memory.md, todo.md
