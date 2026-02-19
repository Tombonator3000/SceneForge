/**
 * Suno API Client for SceneForge
 *
 * Handles music generation via Suno (through third-party API providers).
 * Suno does not offer an official API as of Feb 2026.
 *
 * Supported providers:
 * - sunoapi.org (recommended)
 * - CometAPI
 * - Self-hosted (gcui-art/suno-api)
 *
 * Usage:
 *   const suno = new SunoClient({ apiKey: 'your-key', provider: 'sunoapi' });
 *   const task = await suno.generate({ prompt: '...', tags: '...' });
 *   const result = await suno.waitForCompletion(task.taskId);
 */

const PROVIDERS = {
  sunoapi: {
    baseUrl: "https://api.sunoapi.org/v1",
    generateEndpoint: "/music/generate",
    statusEndpoint: "/music/status",
    authHeader: "Authorization",
    authPrefix: "Bearer ",
  },
  cometapi: {
    baseUrl: "https://api.cometapi.com/v1",
    generateEndpoint: "/suno/generate",
    statusEndpoint: "/suno/status",
    authHeader: "Authorization",
    authPrefix: "Bearer ",
  },
};

export class SunoClient {
  constructor({ apiKey, provider = "sunoapi" }) {
    this.apiKey = apiKey;
    this.provider = PROVIDERS[provider];
    if (!this.provider) {
      throw new Error(`Unknown Suno provider: ${provider}`);
    }
  }

  async _request(endpoint, options = {}) {
    const url = `${this.provider.baseUrl}${endpoint}`;
    const headers = {
      "Content-Type": "application/json",
      [this.provider.authHeader]: `${this.provider.authPrefix}${this.apiKey}`,
    };

    const response = await fetch(url, { ...options, headers });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Suno API error (${response.status}): ${error}`);
    }

    return response.json();
  }

  /**
   * Generate music from a text prompt.
   *
   * @param {Object} params
   * @param {string} params.prompt - Description of the music to generate
   * @param {string} [params.tags] - Comma-separated style tags
   * @param {boolean} [params.makeInstrumental=false] - Generate without vocals
   * @param {string} [params.model='v5'] - Suno model version
   * @returns {Promise<{taskId: string, status: string}>}
   */
  async generate({ prompt, tags, makeInstrumental = false, model = "v5" }) {
    const body = {
      prompt,
      tags: tags || "",
      make_instrumental: makeInstrumental,
      model,
    };

    const result = await this._request(this.provider.generateEndpoint, {
      method: "POST",
      body: JSON.stringify(body),
    });

    return {
      taskId: result.task_id || result.id,
      status: result.status || "pending",
    };
  }

  /**
   * Check the status of a generation task.
   *
   * @param {string} taskId
   * @returns {Promise<{status: string, audioUrl?: string, duration?: number}>}
   */
  async getStatus(taskId) {
    const result = await this._request(
      `${this.provider.statusEndpoint}?task_id=${taskId}`
    );

    return {
      status: result.status,
      audioUrl: result.audio_url || null,
      duration: result.duration || null,
      title: result.title || null,
    };
  }

  /**
   * Poll until generation is complete.
   *
   * @param {string} taskId
   * @param {Object} [options]
   * @param {number} [options.interval=3000] - Poll interval in ms
   * @param {number} [options.timeout=120000] - Max wait time in ms
   * @param {function} [options.onProgress] - Callback for status updates
   * @returns {Promise<{audioUrl: string, duration: number}>}
   */
  async waitForCompletion(taskId, options = {}) {
    const { interval = 3000, timeout = 120000, onProgress } = options;
    const start = Date.now();

    while (Date.now() - start < timeout) {
      const status = await this.getStatus(taskId);

      if (onProgress) onProgress(status);

      if (status.status === "complete" || status.status === "SUCCESS") {
        return status;
      }

      if (status.status === "failed" || status.status === "error") {
        throw new Error(`Suno generation failed: ${JSON.stringify(status)}`);
      }

      await new Promise((resolve) => setTimeout(resolve, interval));
    }

    throw new Error(`Suno generation timed out after ${timeout}ms`);
  }
}

export default SunoClient;
