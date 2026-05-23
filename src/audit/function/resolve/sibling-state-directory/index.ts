import * as path from "node:path";

export function resolveSiblingStateDirectory(
  currentDirectory: string,
  segments: string[]
): string {
  const parentSegmentCount = Math.max(0, segments.length - 1);
  const relativeUpSegmentList = Array.from({ length: parentSegmentCount }, () => "..");

  return path.resolve(
    currentDirectory,
    ...relativeUpSegmentList,
    "function",
    "state",
    ...segments.slice(3)
  );
}
