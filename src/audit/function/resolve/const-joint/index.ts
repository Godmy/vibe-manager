export function resolveConstJoint(name: string): string {
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
