export function toRelativeSegmentList(relativeDirectory: string): string[] {
  if (relativeDirectory === ".") {
    return [];
  }

  return relativeDirectory.split("/").filter((segment) => segment.length > 0);
}
