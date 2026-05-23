export function isHardcodedSvelteValue(rightHandSide: string): boolean {
  const value = rightHandSide.trim().replace(/;$/, "");

  if (/^-?\d[\d._xXa-fA-F]*$/.test(value)) {
    return true;
  }

  if (
    (value.startsWith("'") && value.endsWith("'")) ||
    (value.startsWith("\"") && value.endsWith("\"")) ||
    (value.startsWith("`") && value.endsWith("`") && !value.includes("${"))
  ) {
    return true;
  }

  return ["true", "false", "null", "undefined"].includes(value);
}
