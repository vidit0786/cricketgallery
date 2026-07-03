import { NextResponse } from "next/server";

import { getServerConfig } from "@/config/env";
import { requireUser } from "@/server/auth/session";
import { getRecentImages } from "@/server/repositories/generated-image-repository";
import { getIdentityProfile, upsertIdentityProfile } from "@/server/repositories/identity-repository";
import { getProjectById } from "@/server/repositories/project-repository";
import { logger } from "@/server/observability/logger";
import { rateLimitRequest } from "@/server/security/rate-limit";
import { assertSameOrigin } from "@/server/security/request-guards";
import { createImageAnalysisService } from "@/services/image-analysis";
import { IdentityProfileBuilder } from "@/services/identity-profile";
import { createIdentityHash } from "@/services/identity-utils/identity-cache";
import { sceneLibrary } from "@/services/scene-library/scene-library";
import { SceneLearningEngine } from "@/services/scene-learning/scene-learning";
import { SceneRecommendationEngine } from "@/services/scene-recommendation-engine/scene-recommendation-engine";
import type { CricketSelections } from "@/lib/cricket-options";
import { AppError, toErrorResponse } from "@/utils/api-errors";
import { fileToUploadedImageInput } from "@/utils/server-image";

export const runtime = "nodejs";
export const maxDuration = 60;

function parseImage(value: FormDataEntryValue | null): File {
  if (!(value instanceof File)) throw new AppError("Please upload an image before requesting scene recommendations.", 400, "INVALID_IMAGE");
  return value;
}

function parseProjectId(value: FormDataEntryValue | null) {
  if (typeof value !== "string" || !value) throw new AppError("Please select a project before requesting scene recommendations.", 400, "INVALID_REQUEST");
  return value;
}

function parseJson<T>(value: FormDataEntryValue | null, fallback: T): T {
  if (typeof value !== "string" || !value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    const user = await requireUser();
    rateLimitRequest(request, "scene-recommendations", 30, 60_000, user.id);

    const formData = await request.formData();
    const imageFile = parseImage(formData.get("image"));
    const projectId = parseProjectId(formData.get("projectId"));
    const currentSelections = parseJson<CricketSelections | undefined>(formData.get("selections"), undefined);
    const favoriteSceneIds = parseJson<string[]>(formData.get("favoriteSceneIds"), []);
    const recentlyUsedSceneIds = parseJson<string[]>(formData.get("recentlyUsedSceneIds"), []);

    const project = await getProjectById(user.id, projectId);
    if (!project) throw new AppError("Selected project was not found.", 404, "INVALID_REQUEST");

    const sourceImage = await fileToUploadedImageInput(imageFile);
    const config = getServerConfig();
    const analysis = await createImageAnalysisService(config).analyzeImage(sourceImage);
    const sourceImageHash = createIdentityHash(sourceImage);
    const existingProfile = await getIdentityProfile(user.id, projectId, sourceImageHash);
    const identityProfile = existingProfile ?? (await upsertIdentityProfile(user.id, projectId, new IdentityProfileBuilder().build(sourceImage, analysis)));
    const recentImages = await getRecentImages(user.id, 30);
    const learned = new SceneLearningEngine().fromHistory(recentImages, favoriteSceneIds, recentlyUsedSceneIds);

    const result = new SceneRecommendationEngine().recommend(sceneLibrary.getAll(), {
      imageAnalysis: analysis,
      identityProfile,
      currentSelections,
      ...learned,
    });

    logger.info("scene_recommendations_completed", { userId: user.id, projectId, count: result.recommendations.length });
    return NextResponse.json(result);
  } catch (error) {
    logger.error("scene_recommendations_failed", error);
    const { status, body } = toErrorResponse(error);
    return NextResponse.json(body, { status });
  }
}
