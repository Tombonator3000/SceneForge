import { useState, useCallback } from "react";
import { getApiKey } from "../utils/apiKeys";

// Formats seconds as [M:SS] timestamp label.
const formatTimestamp = (seconds) => {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `[${m}:${s.toString().padStart(2, "0")}]`;
};

// Converts verbose_json segments to timestamped lyrics text.
const buildLyricsFromSegments = (segments) => {
  if (!segments || segments.length === 0) return "";
  return segments
    .map((seg) => `${formatTimestamp(seg.start)} ${seg.text.trim()}`)
    .join("\n");
};

/**
 * Hook for transcribing audio via OpenAI Whisper API.
 * Reads API key from localStorage via getApiKey('openai').
 *
 * @returns {{ transcribe, loading, error }}
 */
export function useWhisper() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const transcribe = useCallback(async ({ file, onSuccess }) => {
    const apiKey = getApiKey("openai");
    if (!apiKey) {
      setError("OpenAI API-nokkel mangler. Legg den inn under Innstillinger.");
      return;
    }
    if (!file) {
      setError("Ingen lydfil valgt.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("model", "whisper-1");
      formData.append("response_format", "verbose_json");

      const response = await fetch("https://api.openai.com/v1/audio/transcriptions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errBody = await response.json().catch(() => null);
        const msg = errBody?.error?.message ?? `HTTP ${response.status}`;
        throw new Error(msg);
      }

      const data = await response.json();
      const text = buildLyricsFromSegments(data.segments);
      if (onSuccess) onSuccess(text || data.text || "");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  return { transcribe, loading, error };
}

export default useWhisper;
