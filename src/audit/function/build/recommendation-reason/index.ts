import { AuditRecommendation } from "../../../type/struct/recommendation";

export function buildRecommendationReason(
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
