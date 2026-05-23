import { AuditRecommendation } from "../../../type/struct/recommendation";

export function countRecommendationByEntityType(
  recommendationList: AuditRecommendation[]
): Record<string, number> {
  const recommendationCountByEntityType: Record<string, number> = {};

  for (const recommendation of recommendationList) {
    recommendationCountByEntityType[recommendation.entityType] =
      (recommendationCountByEntityType[recommendation.entityType] ?? 0) + 1;
  }

  return recommendationCountByEntityType;
}
