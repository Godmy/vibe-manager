import { FUNCTION_JOINT_BY_PREFIX } from "../../../const/value/function-joint-by-prefix";
import { FUNCTION_JOINT_SET } from "../../../const/value/function-joint-set";
import { toKebabCase } from "../../to/kebab-case";

export function resolveFunctionPath(name: string): { joint: string; family: string } {
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
