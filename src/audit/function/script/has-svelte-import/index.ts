export function hasSvelteImport(
  scriptContent: string,
  importedName: string
): boolean {
  const pattern = new RegExp(
    `import\\s*\\{[^}]*\\b${escapeRegExp(importedName)}\\b[^}]*\\}\\s*from\\s*['"]svelte['"]`
  );

  return pattern.test(scriptContent);
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
