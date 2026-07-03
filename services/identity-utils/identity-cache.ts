import { createHash } from "crypto";

import type { UploadedImageInput } from "@/types/ai";
import type { IdentityProfile } from "@/types/identity-types";

const profileCache = new Map<string, IdentityProfile>();

export function createIdentityHash(image: UploadedImageInput) {
  return createHash("sha256").update(image.buffer).update(image.mimeType).digest("hex");
}

export function getCachedIdentityProfile(hash: string) {
  return profileCache.get(hash);
}

export function setCachedIdentityProfile(hash: string, profile: IdentityProfile) {
  profileCache.set(hash, profile);
}
