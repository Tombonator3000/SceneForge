import { useState, useCallback } from "react";
import { getApiKey } from "../utils/apiKeys";
import generateId from "../utils/generateId";
import formatTime from "../utils/formatTime";

const ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages";
const CLAUDE_MODEL = "claude-sonnet-4-20250514";

// Build a structured prompt for Claude based on music data and project context
const buildPrompt = ({ phrases, duration, lyrics, style, projectOverview }) => {
  const phraseList = phrases
    .map((p) => `- ${p.label} at ${formatTime(p.time * duration)} (ID: ${p.id})`)
    .join("\n");

  const styleText = style
    ? `${style.name}: ${style.description}`
    : "No style selected";

  return `You are a music video director and storyboard artist. Based on the music structure, lyrics, visual style, and project overview provided below, generate a complete scene setup for a music video.

## Project Overview
${projectOverview || "No overview provided."}

## Visual Style
${styleText}

## Music Structure (phrases with timestamps, total duration: ${formatTime(duration)})
${phraseList}

## Lyrics
${lyrics || "No lyrics provided."}

## Task
Generate a complete storyboard as a JSON object. Create scenes that align with the music structure -- each scene should correspond to one or more musical phrases. For each scene, create 2-4 shots with camera types, descriptions, durations, and image prompts.

Return ONLY valid JSON in this exact format, with no additional text before or after:

{
  "scenes": [
    {
      "title": "Scene title",
      "description": "Description of the scene mood, action, and visual content",
      "phraseRef": "phrase marker ID from the list above (e.g. p1)",
      "shots": [
        {
          "type": "Wide|Medium|Close-up|ECU|OTS|POV|Insert",
          "description": "Detailed shot description including action, composition, lighting",
          "duration": "4s",
          "imagePrompt": "Detailed image generation prompt for this shot in ${styleText} style, cinematic, 16:9"
        }
      ]
    }
  ]
}

Match scene energy to the musical phrase type -- intro/outro scenes are slower and more atmospheric, chorus scenes are high-energy and visually bold, verse scenes build narrative, bridge/solo scenes offer contrast. Use the lyrics as direct inspiration for visual content.`;
};

export function useStoryboardGenerator() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generate = useCallback(async ({ phrases, duration, lyrics, style, projectOverview, onSuccess }) => {
    const apiKey = getApiKey("anthropic");
    if (!apiKey) {
      setError("Anthropic API-nokkel mangler. Legg den inn under Innstillinger.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const prompt = buildPrompt({ phrases, duration, lyrics, style, projectOverview });

      const response = await fetch(ANTHROPIC_API_URL, {
        method: "POST",
        headers: {
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true",
          "content-type": "application/json",
        },
        body: JSON.stringify({
          model: CLAUDE_MODEL,
          max_tokens: 4096,
          messages: [{ role: "user", content: prompt }],
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error?.message ?? `API-feil: ${response.status}`);
      }

      const data = await response.json();
      const text = data.content?.[0]?.text ?? "";

      // Extract JSON from response (Claude may add surrounding text despite instructions)
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("Klarte ikke parse JSON fra Claude-respons.");
      }

      const parsed = JSON.parse(jsonMatch[0]);
      if (!parsed.scenes || !Array.isArray(parsed.scenes)) {
        throw new Error("Ugyldig format fra Claude -- mangler 'scenes' array.");
      }

      // Assign stable IDs to scenes and shots
      const scenes = parsed.scenes.map((scene) => ({
        id: generateId(),
        title: scene.title ?? "Scene",
        description: scene.description ?? "",
        phraseRef: scene.phraseRef ?? null,
        shots: (scene.shots ?? []).map((shot) => ({
          id: generateId(),
          type: shot.type ?? "Wide",
          description: shot.description ?? "",
          duration: shot.duration ?? "4s",
          imagePrompt: shot.imagePrompt ?? "",
          storyboardImage: null,
        })),
      }));

      if (onSuccess) onSuccess(scenes);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => setError(null), []);

  return { generate, loading, error, clearError };
}

export default useStoryboardGenerator;
