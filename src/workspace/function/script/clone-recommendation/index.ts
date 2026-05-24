import { AuditRecommendation } from "../../../../audit/type/struct/recommendation";

export function cloneRecommendation(recommendation: AuditRecommendation): AuditRecommendation {
  return {
    entityType: recommendation.entityType,
    name: recommendation.name,
    line: recommendation.line,
    sourceRelativePath: recommendation.sourceRelativePath,
    recommendedRelativePath: recommendation.recommendedRelativePath,
    reason: recommendation.reason
  };
}
