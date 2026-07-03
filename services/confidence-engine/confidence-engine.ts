import type { SceneMatchSignals } from "@/types/scene-recommendation";

export function clampScore(value: number) {
  return Math.max(1, Math.min(99, Math.round(value)));
}

export class SceneConfidenceEngine {
  calculate(signals: SceneMatchSignals) {
    return clampScore(
      signals.poseSimilarity * 0.2 +
        signals.lightingMatch * 0.16 +
        signals.identityCompatibility * 0.16 +
        signals.sceneCompatibility * 0.16 +
        signals.promptCompatibility * 0.12 +
        signals.creativeStrategy * 0.1 +
        signals.historicalSuccess * 0.1,
    );
  }

  estimateQuality(confidence: number, signals: SceneMatchSignals) {
    return clampScore(confidence * 0.55 + signals.sceneCompatibility * 0.2 + signals.promptCompatibility * 0.15 + signals.lightingMatch * 0.1);
  }

  estimateIdentity(confidence: number, signals: SceneMatchSignals) {
    return clampScore(confidence * 0.5 + signals.identityCompatibility * 0.5);
  }
}
