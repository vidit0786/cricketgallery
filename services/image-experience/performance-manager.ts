export interface ProgressState {
  stage: "queued" | "analyzing" | "prompt" | "generating" | "saving" | "complete";
  value: number;
  label: string;
}

export class PerformanceManager {
  private cache = new Map<string, string>();

  cacheImage(key: string, dataUrl: string) {
    this.cache.set(key, dataUrl);
  }

  getCachedImage(key: string) {
    return this.cache.get(key);
  }

  getProgress(stage: ProgressState["stage"]): ProgressState {
    const states: Record<ProgressState["stage"], ProgressState> = {
      queued: { stage: "queued", value: 8, label: "Queued" },
      analyzing: { stage: "analyzing", value: 28, label: "Analyzing image" },
      prompt: { stage: "prompt", value: 52, label: "Building prompt" },
      generating: { stage: "generating", value: 78, label: "Generating image" },
      saving: { stage: "saving", value: 92, label: "Saving result" },
      complete: { stage: "complete", value: 100, label: "Complete" },
    };

    return states[stage];
  }

  /**
   * Browser-side compression for Vercel/serverless uploads.
   * Vercel has strict request body limits, so large phone photos need to be
   * compressed before recommendation/generation APIs receive them.
   * If compression is unsupported, return the original file so callers can
   * decide whether to reject it with a clear size message.
   */
  async compressImage(file: File, maxSize = 1400, quality = 0.86, maxBytes = 3.8 * 1024 * 1024): Promise<File> {
    if (!file.type.startsWith("image/") || file.type.includes("heic") || file.type.includes("heif")) return file;
    if (typeof createImageBitmap === "undefined" || typeof document === "undefined") return file;

    try {
      const bitmap = await createImageBitmap(file);
      const scale = Math.min(1, maxSize / Math.max(bitmap.width, bitmap.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.round(bitmap.width * scale));
      canvas.height = Math.max(1, Math.round(bitmap.height * scale));
      const context = canvas.getContext("2d");

      if (!context) {
        bitmap.close?.();
        return file;
      }

      context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
      bitmap.close?.();

      // Encode as JPEG for serverless-safe payload size. Portrait photos do not
      // need alpha transparency for this workflow, and JPEG is far smaller than PNG.
      let currentQuality = quality;
      let blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", currentQuality));

      while (blob && blob.size > maxBytes && currentQuality > 0.55) {
        currentQuality -= 0.08;
        blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", currentQuality));
      }

      if (!blob) return file;
      if (blob.size >= file.size && file.size <= maxBytes) return file;

      const safeName = file.name.replace(/\.(png|webp|jpg|jpeg)$/i, "") + ".jpg";
      return new File([blob], safeName, { type: "image/jpeg", lastModified: file.lastModified });
    } catch {
      return file;
    }
  }
}

export const performanceManager = new PerformanceManager();
