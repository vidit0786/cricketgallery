import type { CricketContext } from "@/types/prompt-pipeline";
import type { IdentityProfile } from "@/types/identity-types";

function line(label: string, value: string | null) {
  return value ? `${label}: ${value}.` : null;
}

export class IdentityEngine {
  buildPromptFragment(profile: IdentityProfile, context?: CricketContext) {
    return [
      "IDENTITY ENGINE — preserve recognizable appearance as much as the selected provider supports:",
      "Maintain recognizable facial structure and do not replace the person with a different identity.",
      "Preserve facial proportions, hairstyle, facial hair, skin tone, expression when appropriate, and realistic face anatomy.",
      "Avoid altering recognizable facial characteristics beyond what is necessary for the requested cricket scene.",
      line("Face shape", profile.faceShape),
      line("Eye shape", profile.eyeShape),
      line("Eye color", profile.eyeColor),
      line("Eyebrows", profile.eyebrowCharacteristics),
      line("Nose", profile.noseShape),
      line("Lips", profile.lips),
      line("Jawline", profile.jawline),
      line("Hair style", profile.hairStyle),
      line("Hair color", profile.hairColor),
      line("Beard or moustache", profile.beardOrMoustache),
      line("Skin tone", profile.skinTone),
      line("Facial expression", profile.facialExpression),
      line("Glasses", profile.glasses),
      line("Head angle", profile.headAngle),
      line("Source camera angle", profile.cameraAngle),
      line("Source lighting", profile.lightingCharacteristics),
      context ? `Blend identity naturally into cricket scene: ${context.playerRole}, ${context.pose}, ${context.camera}, ${context.lighting}.` : null,
    ]
      .filter(Boolean)
      .join("\n");
  }
}
