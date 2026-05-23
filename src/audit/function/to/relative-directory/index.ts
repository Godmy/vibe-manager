import * as path from "node:path";

export function toRelativeDirectory(targetRoot: string, currentDirectory: string): string {
  const relativePath = path.relative(targetRoot, currentDirectory);

  return relativePath === "" ? "." : relativePath.split(path.sep).join("/");
}
