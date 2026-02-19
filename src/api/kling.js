/**
 * Kling API Client for SceneForge
 *
 * Handles video generation via Kling (by Kuaishou).
 *
 * Supported providers:
 * - official (klingai.com) -- enterprise pricing
 * - kie (kie.ai) -- credit-based, affordable
 * - piapi (piapi.ai) -- unofficial, developer-friendly
 * - kling3api (kling3api.com) -- third-party
 *
 * Supports: text-to-video, image-to-video, video extension, lip sync
 *
 * Usage:
 *   const kling = new KlingClient({ apiKey: 'your-key', provider: 'kie' });
 *   const task = await kling.textToVideo({ prompt: '...', duration: 5 });
 *   const result = await kling.waitForCompletion(task.taskId);
 */

const PROVIDERS = {
  official: {
    baseUrl: "https://api.klingai.com/v1",
    authHeader: "Authorization",
    authPrefix: "Bearer ",
  },
  kie: {
    baseUrl: "https://api.kie.ai/v1",
    authHeader: "Authorization",
    authPrefix: "Bearer ",
  },
  piapi: {
    baseUrl: "https://api.piapi.ai",
    authHeader: "X-API-Key",
    authPrefix: "",
  },
  kling3api: {
    baseUrl: "https://kling3api.com/api",
    authHeader: "Authorization",
    authPrefix: "Bearer ",
  },
};

export class KlingClient {
  constructor({ apiKey, provider = "kie" }) {
    this.apiKey = apiKey;
    this.provider = PROVIDERS[provider];
    if (!this.provider) {
      throw new Error(`Unknown Kling provider: ${provider}`);
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
      throw new Error(`Kling API error (${response.status}): ${error}`);
    }

    return response.json();
  }

  /**
   * Generate video from text prompt.
   *
   * @param {Object} params
   * @param {string} params.prompt - Description of the video
   * @param {number} [params.duration=5] - Video duration in seconds
   * @param {string} [params.aspectRatio='16:9'] - Aspect ratio
   * @param {string} [params.quality='pro'] - Quality tier (standard/pro/master)
   * @param {boolean} [params.sound=false] - Include audio generation
   * @returns {Promise<{taskId: string, status: string}>}
   */
  async textToVideo({
    prompt,
    duration = 5,
    aspectRatio = "16:9",
    quality = "pro",
    sound = false,
  }) {
    const body = {
      type: `${quality}-text-to-video`,
      prompt,
      duration,
      aspect_ratio: aspectRatio,
      sound,
    };

    const result = await this._request("/generate", {
      method: "POST",
      body: JSON.stringify(body),
    });

    return {
      taskId: result.data?.task_id || result.task_id,
      status: result.data?.status || "pending",
    };
  }

  /**
   * Generate video from an image + text prompt.
   *
   * @param {Object} params
   * @param {string} params.prompt - Description of the animation/motion
   * @param {string} params.imageUrl - URL of the source image
   * @param {number} [params.duration=5] - Video duration in seconds
   * @param {string} [params.quality='pro'] - Quality tier
   * @returns {Promise<{taskId: string, status: string}>}
   */
  async imageToVideo({
    prompt,
    imageUrl,
    duration = 5,
    quality = "pro",
  }) {
    const body = {
      type: `${quality}-image-to-video`,
      prompt,
      image: imageUrl,
      duration,
    };

    const result = await this._request("/generate", {
      method: "POST",
      body: JSON.stringify(body),
    });

    return {
      taskId: result.data?.task_id || result.task_id,
      status: result.data?.status || "pending",
    };
  }

  /**
   * Check task status.
   */
  async getStatus(taskId) {
    const result = await this._request(`/status?task_id=${taskId}`);
    const data = result.data || result;

    return {
      status: data.status,
      videoUrl: data.response?.[0] || data.video_url || null,
      credits: data.consumed_credits || null,
    };
  }

  /**
   * Poll until video generation is complete.
   */
  async waitForCompletion(taskId, options = {}) {
    const { interval = 5000, timeout = 300000, onProgress } = options;
    const start = Date.now();

    while (Date.now() - start < timeout) {
      const status = await this.getStatus(taskId);

      if (onProgress) onProgress(status);

      if (status.status === "SUCCESS" || status.status === "complete") {
        return status;
      }

      if (status.status === "FAILED" || status.status === "error") {
        throw new Error(`Kling generation failed: ${JSON.stringify(status)}`);
      }

      await new Promise((resolve) => setTimeout(resolve, interval));
    }

    throw new Error(`Kling generation timed out after ${timeout}ms`);
  }
}

export default KlingClient;
