import type { FaceEnhancementPreset } from "@/types/face-enhancement";

export interface EnhancementPresetDefinition {
  name: FaceEnhancementPreset;
  instructions: string[];
}

export const FACE_ENHANCEMENT_PRESETS: EnhancementPresetDefinition[] = [
  {
    name: "Natural Portrait",
    instructions: [
      "natural face realism without beautification",
      "preserve real skin texture, natural pores and subtle asymmetry",
      "keep expression close to the uploaded image",
    ],
  },
  {
    name: "Professional Athlete",
    instructions: [
      "professional athlete face clarity",
      "sharp eyes, realistic sweat or skin detail only if natural",
      "confident sports portrait expression",
    ],
  },
  {
    name: "Broadcast Ready",
    instructions: [
      "broadcast-ready facial sharpness",
      "clean eye highlights and realistic stadium lighting on face",
      "no waxy skin or distorted facial anatomy",
    ],
  },
  {
    name: "Magazine Cover",
    instructions: [
      "editorial magazine face detail",
      "premium but realistic retouching",
      "high-end portrait lighting while preserving identity",
    ],
  },
  {
    name: "Ultra Realistic",
    instructions: [
      "ultra-realistic facial micro-details",
      "realistic facial proportions and skin texture",
      "avoid plastic, airbrushed or stylized appearance",
    ],
  },
  {
    name: "Soft Lighting",
    instructions: [
      "soft natural light on face",
      "gentle shadows with clear eyes",
      "balanced contrast without flattening facial structure",
    ],
  },
  {
    name: "Sharp Detail",
    instructions: [
      "maximum face sharpness and crisp eye detail",
      "clear eyelashes, eyebrows and facial hair when visible",
      "reduce blur while preserving natural skin",
    ],
  },
  {
    name: "Balanced Enhancement",
    instructions: [
      "balanced identity preservation and realistic enhancement",
      "improve clarity without changing face shape",
      "keep facial details consistent with the source image",
    ],
  },
];

export function getEnhancementPreset(name: FaceEnhancementPreset = "Balanced Enhancement") {
  return FACE_ENHANCEMENT_PRESETS.find((preset) => preset.name === name) ?? FACE_ENHANCEMENT_PRESETS[FACE_ENHANCEMENT_PRESETS.length - 1];
}
