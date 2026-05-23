import { AuditRecommendation } from "../../../type/struct/recommendation";

export function createAuditRecommendation(
  entityType: AuditRecommendation["entityType"],
  name: string,
  line: number,
  sourceRelativePath: string,
  recommendedRelativePath: string,
  reason: string
): AuditRecommendation {
  return {
    entityType,
    name,
    line,
    sourceRelativePath,
    recommendedRelativePath,
    reason
  };
}
