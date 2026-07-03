import type { CreativeGenerationVersion } from "@/types/creative-director";
import type { ResultSelection } from "@/types/self-healing";

function maxBy<T>(items: T[], score: (item: T) => number) {
  return items.reduce((best, item) => (score(item) > score(best) ? item : best), items[0]);
}

export class ResultSelector {
  select(versions: CreativeGenerationVersion[]): ResultSelection {
    const bestOverall = maxBy(versions, (version) => version.scores.overall);
    const bestIdentity = maxBy(versions, (version) => version.scores.identityPreservation);
    const bestRealism = maxBy(versions, (version) => version.scores.overallRealism);
    const bestSportsPhotography = maxBy(versions, (version) => version.scores.sportsPhotographyStyle);
    const bestLighting = maxBy(versions, (version) => version.scores.lighting);
    const bestComposition = maxBy(versions, (version) => version.scores.composition);
    const bestSocialMediaReady = maxBy(versions, (version) => version.scores.composition + version.scores.facialQuality + version.scores.sportsPhotographyStyle);

    return {
      bestOverall: bestOverall.id,
      bestIdentity: bestIdentity.id,
      bestRealism: bestRealism.id,
      bestSportsPhotography: bestSportsPhotography.id,
      bestLighting: bestLighting.id,
      bestComposition: bestComposition.id,
      bestSocialMediaReady: bestSocialMediaReady.id,
      explanations: {
        bestOverall: `${bestOverall.strategy.name} has the best total professional quality score.`,
        bestIdentity: `${bestIdentity.strategy.name} has the strongest identity preservation score.`,
        bestRealism: `${bestRealism.strategy.name} has the strongest realism score.`,
        bestSportsPhotography: `${bestSportsPhotography.strategy.name} best matches professional sports photography.`,
        bestLighting: `${bestLighting.strategy.name} has the best lighting score.`,
        bestComposition: `${bestComposition.strategy.name} has the strongest composition score.`,
        bestSocialMediaReady: `${bestSocialMediaReady.strategy.name} is best prepared for social media presentation.`,
      },
    };
  }
}
