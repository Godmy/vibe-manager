export function hasSvelteStateImport(scriptContent: string): boolean {
  return /from\s+['"].*?\/function\/state\/[^'"]*['"]/.test(scriptContent);
}
