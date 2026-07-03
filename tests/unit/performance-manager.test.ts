import { describe, expect, it } from "vitest";

import { PerformanceManager } from "@/services/image-experience/performance-manager";

describe("PerformanceManager", () => {
  it("does not block upload when browser compression APIs are unavailable", async () => {
    const manager = new PerformanceManager();
    const file = new File([new Uint8Array([1, 2, 3])], "portrait.jpg", { type: "image/jpeg" });

    const result = await manager.compressImage(file);

    expect(result).toBe(file);
  });

  it("keeps HEIC files unchanged because browsers usually cannot canvas-compress them", async () => {
    const manager = new PerformanceManager();
    const file = new File([new Uint8Array([1, 2, 3])], "portrait.heic", { type: "image/heic" });

    const result = await manager.compressImage(file);

    expect(result).toBe(file);
  });
});
