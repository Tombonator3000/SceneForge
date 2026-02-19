// Utility for reading and writing API keys from/to localStorage.
// Keys are namespaced under 'sceneforge_' to avoid conflicts.

const LS_KEYS = {
  freepik: "sceneforge_freepik_key",
  kling: "sceneforge_kling_key",
  openai: "sceneforge_openai_key",
  anthropic: "sceneforge_anthropic_key",
};

/**
 * Get an API key from localStorage.
 * @param {'freepik'|'kling'|'openai'|'anthropic'} service
 * @returns {string} The stored key, or empty string if not set.
 */
export function getApiKey(service) {
  return localStorage.getItem(LS_KEYS[service]) ?? "";
}

/**
 * Save an API key to localStorage.
 * @param {'freepik'|'kling'|'openai'|'anthropic'} service
 * @param {string} value
 */
export function setApiKey(service, value) {
  if (value && value.trim()) {
    localStorage.setItem(LS_KEYS[service], value.trim());
  } else {
    localStorage.removeItem(LS_KEYS[service]);
  }
}

/**
 * Get all stored API keys.
 * @returns {{ freepik: string, kling: string, openai: string, anthropic: string }}
 */
export function getAllApiKeys() {
  return {
    freepik: getApiKey("freepik"),
    kling: getApiKey("kling"),
    openai: getApiKey("openai"),
    anthropic: getApiKey("anthropic"),
  };
}
