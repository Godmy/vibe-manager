import { AuditRecommendation } from "../../../type/struct/recommendation";

export function groupRecommendationBySourcePath(
  recommendationList: AuditRecommendation[]
): Record<string, AuditRecommendation[]> {
  const recommendationListBySourcePath: Record<string, AuditRecommendation[]> = {};

  for (const recommendation of recommendationList) {
    recommendationListBySourcePath[recommendation.sourceRelativePath] ??= [];
    recommendationListBySourcePath[recommendation.sourceRelativePath].push(recommendation);
  }

  return recommendationListBySourcePath;
}
