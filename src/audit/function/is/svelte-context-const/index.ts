export function isSvelteContextConst(
  rightHandSide: string,
  hasGetContextImport: boolean
): boolean {
  if (!hasGetContextImport) {
    return false;
  }

  return /\bgetContext\s*(?:<[^>]+>)?\s*\(/.test(rightHandSide);
}
