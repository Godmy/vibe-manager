import { FUNCTION_JOINT } from "../../../const/array/joint-function";
import { toKebabCase } from "../../to/kebab-case";

const FUNCTION_JOINT_BY_PREFIX: Array<[string, string]> = [
  ["use", "hook"],
  ["handle", "script"],
  ["on", "script"],
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
const FUNCTION_JOINT_SET = new Set(FUNCTION_JOINT);

export function buildEntityRelativePath(
  domain: string,
  entityKind: "const" | "type" | "interface" | "function" | "class",
  name: string
): string {
  if (entityKind === "const") {
    const family = toKebabCase(name);
    return `${domain}/const/${resolveConstJoint(name)}/${family}/index.ts`;
  }

  if (entityKind === "type") {
    const family = toKebabCase(name);

    if (/(Props|Options|Config|Settings|Params|State)$/.test(name)) {
      return `${domain}/interface/recipe/${family}/index.ts`;
    }

    return `${domain}/type/alias/${family}/index.ts`;
  }

  if (entityKind === "interface") {
    const family = toKebabCase(name);
    return `${domain}/interface/${resolveInterfaceJoint(name)}/${family}/index.ts`;
  }

  if (entityKind === "class") {
    const family = toKebabCase(name);
    return `${domain}/class/manager/${family}/index.ts`;
  }

  const { joint, family } = resolveFunctionPath(name);

  return `${domain}/function/${joint}/${family}/index.ts`;
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

function resolveFunctionPath(name: string): { joint: string; family: string } {
  const directJoint = name.match(/^[a-z]+/)?.[0]?.toLowerCase();

  if (directJoint && FUNCTION_JOINT_SET.has(directJoint)) {
    return {
      joint: directJoint,
      family: toKebabCase(name.slice(directJoint.length) || name)
    };
  }

  const lowerName = name.toLowerCase();

  for (const [prefix, joint] of FUNCTION_JOINT_BY_PREFIX) {
    if (lowerName.startsWith(prefix)) {
      return {
        joint,
        family: toKebabCase(name)
      };
    }
  }

  return {
    joint: "script",
    family: toKebabCase(name)
  };
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
