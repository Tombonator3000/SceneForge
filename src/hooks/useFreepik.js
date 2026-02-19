import { useState, useCallback } from "react";
import FreepikClient from "../api/freepik";

const API_KEY = import.meta.env.VITE_FREEPIK_API_KEY;

/**
 * Hook for generating images via Freepik API.
 * Handles submit + poll pattern and loading/error state.
 *
 * @returns {{ generate, loading, error }}
 */
export function useFreepik() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generate = useCallback(async ({ prompt, onSuccess }) => {
    if (!API_KEY) {
      setError("VITE_FREEPIK_API_KEY mangler i .env");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const client = new FreepikClient({ apiKey: API_KEY });
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
