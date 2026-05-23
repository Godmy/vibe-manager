export function hasSvelteStateConst(scriptContent: string): boolean {
  return /const\s+state\s*(?::\s*\S+\s*)?=\s*\w+\s*\(/.test(scriptContent);
}
