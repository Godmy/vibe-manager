import { toKebabCase } from "../../to/kebab-case";
import { resolveConstJoint } from "../../resolve/const-joint";
import { resolveFunctionPath } from "../../resolve/function-path";
import { resolveInterfaceJoint } from "../../resolve/interface-joint";

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
