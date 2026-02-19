# API Integration Plan

## Oversikt

SceneForge skal integrere med flere AI-tjenester for a automatisere og forbedre musikkvideo-produksjon. Denne planen dekker status, tilnerminger og implementasjonsdetaljer for hver API.

---

## 1. Suno -- Musikkgenerering

### Status (per feb 2026)
- Suno har IKKE en offisiell offentlig API
- Tredjepartstjenester tilbyr uoffisiell tilgang (sunoapi.org, CometAPI, PiAPI, gcui-art/suno-api pa GitHub)
- Suno V5 lansert sept 2025 -- ELO score 1293, studio-kvalitet
- Suno Studio (offisiell "Generative Audio Workstation") finnes, men uten API
- Prising via tredjeparter: ca $0.14 per generering

### Tilnerminger (rangert etter anbefaling)
1. **Tredjepartstjeneste (sunoapi.org/CometAPI)** -- enklest, REST API, pay-per-use
2. **Selvhostet (gcui-art/suno-api)** -- krever Suno-konto + 2Captcha, mer kontroll, mer vedlikehold
3. **Vent pa offisiell API** -- Suno har hintet om developer tools

### Planlagt bruk i SceneForge
- Generer musikk fra tekstbeskrivelse (sjanger, stemning, tempo)
- Generer varianter av eksisterende spor
- Last ned generert lyd direkte inn i prosjektet
- Analysere generert musikks struktur for automatisk scene-mapping

### API-flyt (asynkron)
1. POST /api/generate -- send prompt, fa task_id
2. GET /api/status?task_id=X -- poll til status = "complete"
3. Hent audio_url fra response

### Eksempel-request
```json
{
  "prompt": "bardcore medieval tavern song, acoustic instruments, theatrical vocals, D&D fantasy adventure theme",
  "tags": "bardcore, medieval, acoustic, fantasy, RPG",
  "make_instrumental": false,
  "model": "v5"
}
```

---

## 2. Kling -- Videogenerering

### Status (per feb 2026)
- Kling 3.0 Omni lansert -- stoetter audio+video generering
- Offisiell API finnes: klingai.com/global/dev
- Tredjepartstilgang: PiAPI, Kie.ai, WaveSpeedAI, Atlas Cloud
- Offisiell API-prising: fra ca $4200 for 30000 units (enterprise-nivaa)
- Tredjeparter: langt billigere, credit-basert (Kie.ai fra $5)
- Stoetter: text-to-video, image-to-video, lip sync, video extension, motion brush, multi-elements

### Tilnerminger
1. **Tredjepartstjeneste (Kie.ai/PiAPI)** -- billigere, rask start, credit-basert
2. **Offisiell API (klingai.com)** -- dyrere, mer stabil, direkte tilgang
3. **Aggregator (WaveSpeedAI/Atlas Cloud)** -- en API for mange modeller

### Planlagt bruk i SceneForge
- Generer videoklipp per shot fra storyboard-bilde + prompt
- Image-to-video: animer storyboard-frames
- Text-to-video: generer shots fra kun tekstbeskrivelse
- Lip sync: synkroniser karakter-munnbevegelser med sangtekst
- Video extension: forleng genererte klipp til onsket varighet

### API-flyt
1. POST /api/generate -- send type, prompt, image(valgfritt), duration, aspect_ratio
2. GET /api/status?task_id=X -- poll til ferdig
3. Hent video-URL fra response

### Eksempel-request (image-to-video)
```json
{
  "type": "pro-image-to-video",
  "prompt": "The bard slowly draws his sword, candlelight flickering, chiaroscuro lighting",
  "image": "https://example.com/storyboard-frame-01.jpg",
  "duration": 5,
  "aspect_ratio": "16:9"
}
```

---

## 3. Freepik -- Bildegenerering

### Status (per feb 2026)
- Offisiell API tilgjengelig: freepik.com/api/image-generation
- Dokumentasjon: docs.freepik.com
- Stoetter flere modeller: Mystic (fotorealistisk), Flux, GPT-modeller, Google Imagen, Runway
- MCP-server tilgjengelig (bade open source og remote)
- Prising: credit-basert, $5 gratis ved oppstart
- API-nokkel via x-freepik-api-key header

### Planlagt bruk i SceneForge
- Generer referansebilder for karakterer, lokasjoner, props
- Generer storyboard-frames basert pa shot-beskrivelser
- Bulk-generering av alle frames i en sekvens
- Upscale genererte bilder (Magnific-integrasjon)
- Stilkonsistens via "Objects" og "Custom Style" funksjoner

### API-flyt
1. POST /v1/ai/text-to-image -- send prompt + parametere
2. Motta bilde-URL(er) i response (eller task_id for 4K)
3. For 4K: poll task status til ferdig

### Eksempel-request
```json
{
  "prompt": "Guillermo del Toro style dark fantasy medieval tavern interior, chiaroscuro lighting, 35mm film, cinematic photography, warm candlelight, dark wood beams, smoke",
  "negative_prompt": "blurry, low quality, cartoon, anime",
  "guidance_scale": 7.5,
  "num_images": 1,
  "image": {
    "size": "landscape_16_9"
  }
}
```

---

## 4. Andre APIer (fremtidig vurdering)

### OpenAI / Anthropic -- Tekstanalyse og sceneforslag
- Bruk for a analysere sangtekster og foresla scener
- Generer creative briefs automatisk
- Prompt-optimalisering for bilde/video-generering

### ElevenLabs -- Voiceover
- Generer voiceover for scener som trenger det
- Tekst-til-tale med karakter-stemmer

### Runway ML -- Alternativ videogenerering
- Backup/alternativ til Kling
- Stoetter image-to-video og text-to-video

---

## Implementasjonsstrategi

### Steg 1: API-klienter (src/api/)
Lag separate moduler per tjeneste med enhetlig grensesnitt:
- Asynkron task-haandtering (submit -> poll -> result)
- Feilhaandtering og retry-logikk
- API-nokkel-haandtering (.env)
- Rate limiting

### Steg 2: UI-integrasjon
- "Generer"-knapper pa relevante steder (storyboard, elements, brief)
- Status-indikatorer (venter, genererer, ferdig, feilet)
- Forhaaandsvisning av generert innhold for aksept
- Batch-generering med fremgangslinje

### Steg 3: Konfigurasjon
- Settings-side for API-nokler
- Valg av foretrukket leverandor per tjeneste
- Kostnadsoversikt og credit-sporing

---

## Sikkerhet

- API-nokler lagres ALDRI i kildekode
- Bruk .env-filer lokalt
- For web-deploy: bruk backend proxy for a skjule nokler
- Vurder serverless functions (Vercel/Netlify) som mellomlag
