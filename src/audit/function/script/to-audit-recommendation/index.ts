import { AuditRecommendation } from "../../../type/struct/recommendation";
import { createAuditRecommendation } from "../create-audit-recommendation";
import { toKebabCase } from "../to-kebab-case";

const FUNCTION_JOINT_BY_PREFIX: Array<[string, string]> = [
  ["use", "hook"],
  ["handle", "script"],
  ["on", "script"],
  ["create", "state"],
  ["load", "async"],
  ["fetch", "async"],
  ["save", "async"],
  ["update", "async"],
  ["delete", "async"],
  ["convert", "transform"],
  ["map", "transform"],
  ["filter", "transform"],
  ["sort", "transform"],
  ["group", "transform"],
  ["format", "script"],
  ["parse", "script"],
  ["validate", "script"],
  ["calculate", "script"],
  ["compute", "script"],
  ["compare", "script"],
  ["generate", "script"]
];

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
  const family = toKebabCase(name);

  if (entityType === "const") {
    return `${domain}/const/${resolveConstJoint(name)}/${family}/index.ts`;
  }

  if (entityType === "type") {
    if (/(Props|Options|Config|Settings|Params|State)$/.test(name)) {
      return `${domain}/interface/recipe/${family}/index.ts`;
    }

    return `${domain}/type/alias/${family}/index.ts`;
  }

  if (entityType === "interface") {
    return `${domain}/interface/${resolveInterfaceJoint(name)}/${family}/index.ts`;
  }

  return `${domain}/function/${resolveFunctionJoint(name)}/${family}/index.ts`;
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

function resolveConstJoint(name: string): string {
  const upperName = name.toUpperCase();

  if (upperName.includes("MAP") || upperName.includes("MAPPING")) {
    return "map";
  }

  if (upperName.includes("RECORD") || upperName.includes("DICT")) {
    return "record";
  }

  if (
    upperName.includes("KEY") ||
    upperName.includes("TYPE") ||
    upperName.includes("STATUS") ||
    upperName.includes("STATE")
  ) {
    return "enum";
  }

  if (
    upperName.includes("CONFIG") ||
    upperName.includes("OPTION") ||
    upperName.includes("SETTING") ||
    upperName.includes("PRESET")
  ) {
    return "preset";
  }

  return "value";
}

function resolveFunctionJoint(name: string): string {
  const lowerName = name.toLowerCase();

  for (const [prefix, joint] of FUNCTION_JOINT_BY_PREFIX) {
    if (lowerName.startsWith(prefix)) {
      return joint;
    }
  }

  return "script";
}

function resolveInterfaceJoint(name: string): string {
  if (/Behavior$/.test(name)) {
    return "behavior";
  }

  if (/Slot$/.test(name)) {
    return "slot";
  }

  if (/Contract$/.test(name)) {
    return "contract";
  }

  return "recipe";
}
