import { AuditRecommendation } from "../../../type/struct/recommendation";
import { buildEntityRelativePath } from "../../build/entity-relative-path";
import { createAuditRecommendation } from "../../create/audit-recommendation";

export function toAuditRecommendation(
  segments: string[],
  sourceRelativePath: string,
  entityType: AuditRecommendation["entityType"],
  name: string,
  line: number
): AuditRecommendation {
  const domain = segments[0] ?? "unknown";
  const recommendedRelativePath = buildRecommendedRelativePath(domain, entityType, name);

  return createAuditRecommendation(
    entityType,
    name,
    line,
    sourceRelativePath,
    recommendedRelativePath,
    buildRecommendationReason(entityType, name)
  );
}

function buildRecommendedRelativePath(
  domain: string,
  entityType: AuditRecommendation["entityType"],
  name: string
): string {
  return buildEntityRelativePath(domain, entityType, name);
}

function buildRecommendationReason(
  entityType: AuditRecommendation["entityType"],
  name: string
): string {
  if (entityType === "const") {
    return `Extract const '${name}' into the const cluster.`;
  }

  if (entityType === "type") {
    return `Extract type '${name}' into the type/interface cluster.`;
  }

  if (entityType === "interface") {
    return `Extract interface '${name}' into the interface cluster.`;
  }

  return `Extract function '${name}' into the function cluster.`;
}
