import { AuditRecommendation } from "../../../type/struct/recommendation";
import { buildEntityRelativePath } from "../../build/entity-relative-path";
import { buildRecommendationReason } from "../../build/recommendation-reason";
import { createAuditRecommendation } from "../../create/audit-recommendation";

export function toAuditRecommendation(
  segments: string[],
  sourceRelativePath: string,
  entityType: AuditRecommendation["entityType"],
  name: string,
  line: number
): AuditRecommendation {
  const domain = segments[0] ?? "unknown";
  const recommendedRelativePath = buildEntityRelativePath(domain, entityType, name);

  return createAuditRecommendation(
    entityType,
    name,
    line,
    sourceRelativePath,
    recommendedRelativePath,
    buildRecommendationReason(entityType, name)
  );
}
