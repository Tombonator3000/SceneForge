/**
 * Freepik API Client for SceneForge
 *
 * Handles AI image generation via Freepik's official API.
 * Docs: docs.freepik.com
 *
 * Features:
 * - Text-to-image generation (multiple AI models)
 * - Image upscaling (Magnific)
 * - Stock resource search
 *
 * Models available:
 * - mystic -- Freepik's photorealistic model
 * - flux -- Fast generation
 * - gpt -- OpenAI models
 * - imagen -- Google's model
 *
 * Usage:
 *   const freepik = new FreepikClient({ apiKey: 'your-key' });
 *   const images = await freepik.generate({ prompt: '...', numImages: 4 });
 */

const BASE_URL = "https://api.freepik.com";

export class FreepikClient {
  constructor({ apiKey }) {
    this.apiKey = apiKey;
  }

  async _request(endpoint, options = {}) {
    const url = `${BASE_URL}${endpoint}`;
    const headers = {
      "Content-Type": "application/json",
      "x-freepik-api-key": this.apiKey,
    };

    const response = await fetch(url, { ...options, headers });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Freepik API error (${response.status}): ${error}`);
    }

    return response.json();
  }

  /**
   * Generate images from a text prompt.
   *
   * @param {Object} params
   * @param {string} params.prompt - Text description of the image
   * @param {string} [params.negativePrompt] - What to exclude
   * @param {number} [params.numImages=1] - Number of images (1-4)
   * @param {number} [params.guidanceScale=7.5] - Prompt adherence (1-20)
   * @param {string} [params.aspectRatio='landscape_16_9'] - Image shape
   * @param {string} [params.resolution='2k'] - '2k' or '4k'
   * @param {boolean} [params.realism=true] - Photorealistic mode
   * @param {string} [params.engine='automatic'] - AI engine
   * @returns {Promise<{images: Array<{url: string}>} | {taskId: string}>}
   */
  async generate({
    prompt,
    negativePrompt = "",
    numImages = 1,
    guidanceScale = 7.5,
    aspectRatio = "landscape_16_9",
    resolution = "2k",
    realism = true,
    engine = "automatic",
  }) {
    const body = {
      prompt,
      negative_prompt: negativePrompt,
      num_images: numImages,
      guidance_scale: guidanceScale,
      image: {
        size: aspectRatio,
      },
      resolution,
      realism,
      engine,
    };

    const result = await this._request("/v1/ai/text-to-image", {
      method: "POST",
      body: JSON.stringify(body),
    });

    // For 4K, returns a task_id that needs polling
    if (result.task_id) {
      return { taskId: result.task_id, status: "processing" };
    }

    // For 2K, returns images directly
    return {
      images: (result.data || []).map((img) => ({
        url: img.url || img.base64,
        id: img.id,
      })),
    };
  }

  /**
   * Generate a Mystic (photorealistic) image.
   *
   * @param {Object} params
   * @param {string} params.prompt
   * @param {string} [params.aspectRatio='widescreen_16_9']
   * @param {string} [params.resolution='2k']
   * @param {number} [params.creativeDetailing=50] - 0-100
   * @returns {Promise<{taskId: string}>}
   */
  async generateMystic({
    prompt,
    aspectRatio = "widescreen_16_9",
    resolution = "2k",
    creativeDetailing = 50,
  }) {
    const body = {
      prompt,
      resolution,
      aspect_ratio: aspectRatio,
      realism: true,
      engine: "magnific_sharpy",
      creative_detailing: creativeDetailing,
    };

    const result = await this._request("/v1/ai/mystic", {
      method: "POST",
      body: JSON.stringify(body),
    });

    return {
      taskId: result.task_id,
      status: "processing",
    };
  }

  /**
   * Check task status (for 4K or Mystic generations).
   */
  async getTaskStatus(taskId) {
    const result = await this._request(`/v1/ai/tasks/${taskId}`);

    return {
      status: result.status,
      images: (result.data || []).map((img) => ({
        url: img.url,
        id: img.id,
      })),
    };
  }

  /**
   * Search Freepik stock resources.
   *
   * @param {Object} params
   * @param {string} params.term - Search term
   * @param {number} [params.limit=10] - Results per page
   * @param {string} [params.order='relevance'] - Sort order
   * @returns {Promise<{resources: Array}>}
   */
  async searchResources({ term, limit = 10, order = "relevance" }) {
    const params = new URLSearchParams({
      term,
      limit: limit.toString(),
      order,
    });

    return this._request(`/v1/resources?${params}`);
  }

  /**
   * Poll until task is complete.
   */
  async waitForCompletion(taskId, options = {}) {
    const { interval = 3000, timeout = 120000, onProgress } = options;
    const start = Date.now();

    while (Date.now() - start < timeout) {
      const status = await this.getTaskStatus(taskId);

      if (onProgress) onProgress(status);

      if (status.status === "completed" || status.images?.length > 0) {
        return status;
      }

      if (status.status === "failed") {
        throw new Error(`Freepik generation failed: ${JSON.stringify(status)}`);
      }

      await new Promise((resolve) => setTimeout(resolve, interval));
    }

    throw new Error(`Freepik generation timed out after ${timeout}ms`);
  }
}

export default FreepikClient;
