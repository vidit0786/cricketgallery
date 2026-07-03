import type { SceneTemplate } from "@/types/scene-types";

export class SmartCollectionsService {
  build(scenes: SceneTemplate[]) {
    return [
      { title: "Best For Selfies", sceneIds: scenes.filter((scene) => scene.recommendedCamera === "Close-up Portrait").map((scene) => scene.id), reason: "Close portrait framing protects face detail and works well for selfies." },
      { title: "Best For Full Body Photos", sceneIds: scenes.filter((scene) => scene.recommendedCamera === "Wide Stadium" || scene.recommendedCamera === "Ground Level").map((scene) => scene.id), reason: "Wide and ground-level scenes use more body space effectively." },
      { title: "Best For Night Images", sceneIds: scenes.filter((scene) => ["Floodlights", "Night Match"].includes(scene.recommendedLighting)).map((scene) => scene.id), reason: "Floodlit scenes blend well with darker source images." },
      { title: "Best For Indoor Photos", sceneIds: scenes.filter((scene) => scene.tags.includes("Portrait") || scene.recommendedPose === "Press Conference").map((scene) => scene.id), reason: "Portrait and press scenes adapt indoor lighting more naturally." },
      { title: "Best For Portraits", sceneIds: scenes.filter((scene) => scene.tags.includes("Portrait")).map((scene) => scene.id), reason: "Portrait templates emphasize identity and facial clarity." },
      { title: "Best For Social Media", sceneIds: scenes.filter((scene) => scene.tags.includes("Poster") || scene.popularity === "Trending").map((scene) => scene.id), reason: "Poster and trending scenes create higher-impact social compositions." },
      { title: "Best For Wallpapers", sceneIds: scenes.filter((scene) => scene.recommendedCamera === "Wide Stadium").map((scene) => scene.id), reason: "Wide stadium scenes are naturally wallpaper-friendly." },
      { title: "Best For Posters", sceneIds: scenes.filter((scene) => scene.tags.includes("Poster") || scene.tags.includes("Hero")).map((scene) => scene.id), reason: "Hero and poster scenes create strong print-style compositions." },
    ];
  }
}
