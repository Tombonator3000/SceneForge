import { useState, useCallback } from "react";
import FreepikClient from "../api/freepik";
import { getApiKey } from "../utils/apiKeys";

/**
 * Hook for generating images via Freepik API.
 * Handles submit + poll pattern and loading/error state.
 * Reads API key from localStorage via getApiKey('freepik').
 *
 * @returns {{ generate, loading, error }}
 */
export function useFreepik() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generate = useCallback(async ({ prompt, onSuccess }) => {
    const apiKey = getApiKey("freepik");
    if (!apiKey) {
      setError("Freepik API-nokkel mangler. Legg den inn under Innstillinger.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const client = new FreepikClient({ apiKey });
      const result = await client.generate({ prompt });

      if (result.taskId) {
        // 4K -- poll until done
        const final = await client.waitForCompletion(result.taskId);
        const url = final.images?.[0]?.url;
        if (url && onSuccess) onSuccess(url);
      } else {
        // 2K -- images returned directly
        const url = result.images?.[0]?.url;
        if (url && onSuccess) onSuccess(url);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  return { generate, loading, error };
}

export default useFreepik;
