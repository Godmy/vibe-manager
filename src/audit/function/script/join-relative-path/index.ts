export function joinRelativePath(relativeDirectory: string, fileName: string): string {
  if (relativeDirectory === ".") {
    return fileName;
  }

  return `${relativeDirectory}/${fileName}`;
}
