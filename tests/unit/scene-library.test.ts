import { describe, expect, it } from "vitest";

import { sceneLibrary } from "@/services/scene-library/scene-library";
import { sceneSearchService } from "@/services/scene-search/scene-search";
import { sceneToSelections } from "@/services/scene-utils/scene-apply";

describe("Scene Library", () => {
  it("contains professional scenes and supports searching/applying", () => {
    const scenes = sceneLibrary.getAll();
    expect(scenes.length).toBeGreaterThanOrEqual(30);

    const iplScenes = sceneSearchService.search(scenes, { category: "IPL", tags: ["Hero"] });
    expect(iplScenes.length).toBeGreaterThan(0);

    const scene = sceneLibrary.getById("ipl-final-trophy-lift");
    expect(scene?.sceneName).toBe("IPL Final Trophy Lift");

    const selections = sceneToSelections(scene!);
    expect(selections.cameraStyle).toBe(scene?.recommendedCamera);
    expect(selections.lightingStyle).toBe(scene?.recommendedLighting);
    expect(selections.promptPreset).toBe(scene?.recommendedPromptPreset);
  });
});
