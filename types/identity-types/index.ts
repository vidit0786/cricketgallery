export interface IdentityProfile {
  id?: string;
  sourceImageHash: string;
  faceShape: string | null;
  eyeShape: string | null;
  eyeColor: string | null;
  eyebrowCharacteristics: string | null;
  noseShape: string | null;
  lips: string | null;
  jawline: string | null;
  hairStyle: string | null;
  hairColor: string | null;
  beardOrMoustache: string | null;
  skinTone: string | null;
  facialExpression: string | null;
  glasses: string | null;
  headAngle: string | null;
  cameraAngle: string | null;
  lightingCharacteristics: string | null;
  confidence: number;
  createdAt?: string;
}

export type IdentityMatchLabel = "Excellent" | "Good" | "Fair" | "Needs Improvement";

export interface IdentityConsistencyScore {
  label: IdentityMatchLabel;
  confidence: number;
  identityMatch: number;
  facialStructure: number;
  hairConsistency: number;
  skinToneConsistency: number;
  expressionConsistency: number;
  notes: string[];
}

export interface FaceQualityScore {
  eyeQuality: number;
  facialSymmetry: number;
  expressionConsistency: number;
  sharpness: number;
  skinDetail: number;
  identityConsistency: number;
  overall: number;
  recommendations: string[];
}

export interface IdentityEvaluation {
  profile: IdentityProfile;
  consistency: IdentityConsistencyScore;
  faceQuality: FaceQualityScore;
  improvementSuggestions: string[];
}
