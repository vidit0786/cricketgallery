import type { SceneTemplate } from "@/types/scene-types";
import type { SceneRecommendation, SceneRecommendationContext, SceneRecommendationResult, SceneRecommendationSlot } from "@/types/scene-recommendation";
import { SceneConfidenceEngine } from "@/services/confidence-engine/confidence-engine";
import { SceneMatchingEngine } from "@/services/scene-matching/scene-matching-engine";
import { SceneRecommendationExplainer } from "@/services/recommendation-explainer/recommendation-explainer";
import { SmartCollectionsService } from "@/services/smart-collections/smart-collections";
import { PersonalizedScenesService } from "@/services/personalized-scenes/personalized-scenes";
import { TrendingScenesService } from "@/services/trending-scenes/trending-scenes";
import { SceneLearningEngine } from "@/services/scene-learning/scene-learning";

const slots: SceneRecommendationSlot[] = ["Top Pick", "Runner Up", "Alternative Choice", "Creative Choice", "Trending Choice", "Hidden Gem"];

export class SceneRecommendationEngine {
  constructor(
    private readonly matcher = new SceneMatchingEngine(),
    private readonly confidence = new SceneConfidenceEngine(),
    private readonly explainer = new SceneRecommendationExplainer(),
    private readonly smartCollections = new SmartCollectionsService(),
    private readonly personalized = new PersonalizedScenesService(),
    private readonly trending = new TrendingScenesService(),
    private readonly learning = new SceneLearningEngine(),
  ) {}

  recommend(scenes: SceneTemplate[], context: SceneRecommendationContext): SceneRecommendationResult {
    const ranked = scenes
      .map((scene) => {
        const signals = this.matcher.score(scene, context);
        const confidence = this.confidence.calculate(signals);
        return {
          scene,
          signals,
          confidence,
          reason: this.explainer.explain(scene, signals),
          estimatedQuality: this.confidence.estimateQuality(confidence, signals),
          estimatedIdentityMatch: this.confidence.estimateIdentity(confidence, signals),
        };
      })
      .sort((a, b) => b.confidence - a.confidence);

    const recommendations = slots.map((slot, index) => {
      const item = ranked[index] ?? ranked[0];
      return { slot, ...item, estimatedGenerationTimeSeconds: 45 + index * 8 } satisfies SceneRecommendation;
    });

    return {
      createdAt: new Date().toISOString(),
      recommendations,
      smartCollections: this.smartCollections.build(scenes),
      personalizedCollections: this.personalized.build(recommendations),
      trending: this.trending.build(scenes),
      learningSummary: this.learning.summarize(context),
    };
  }
}
