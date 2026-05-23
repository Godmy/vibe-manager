export function extractSvelteManagerImportNameList(
  scriptContent: string
): string[] {
  const managerImportPathList = [
    "/class/manager/",
    "/class/style-manager/",
    "/class/object-manager/"
  ];
  const managerImportNameSet = new Set<string>();

  for (const line of scriptContent.split(/\r?\n/)) {
    if (!managerImportPathList.some((pathPart) => line.includes(pathPart))) {
      continue;
    }

    const match = line.match(/import\s+(?:type\s+)?\{([^}]+)\}/);

    if (!match) {
      continue;
    }

    for (const part of match[1].split(",")) {
      const importedName = part.trim().split(" as ").pop()?.trim();

      if (importedName) {
        managerImportNameSet.add(importedName);
      }
    }
  }

  return Array.from(managerImportNameSet);
}
