export function isSvelteDispatchConst(
  rightHandSide: string,
  hasCreateEventDispatcherImport: boolean
): boolean {
  if (!hasCreateEventDispatcherImport) {
    return false;
  }

  return /\bcreateEventDispatcher\s*(?:<[^>]+>)?\s*\(/.test(rightHandSide);
}
