export function readSvelteScriptContent(
  fullContent: string
): string | null {
  const scriptMatch = fullContent.match(/<script[^>]*>([\s\S]*?)<\/script>/);

  if (!scriptMatch) {
    return null;
  }

  return scriptMatch[1];
}
