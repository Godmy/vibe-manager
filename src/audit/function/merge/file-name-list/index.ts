export function mergeFileNameList(baseFileNameList: string[], customFileNameList: string[]): Set<string> {
  const fileNameSet = new Set<string>(baseFileNameList);

  for (const fileName of customFileNameList) {
    const normalizedFileName = fileName.trim();

    if (normalizedFileName.length > 0) {
      fileNameSet.add(normalizedFileName);
    }
  }

  return fileNameSet;
}
