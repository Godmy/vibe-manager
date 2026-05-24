import * as fs from "node:fs";
import { joinRelativePath } from "../../join/relative-path";

export async function hasSiblingStateEntry(siblingStateDirectory: string): Promise<boolean> {
  try {
    const stat = await fs.promises.stat(siblingStateDirectory);

    if (!stat.isDirectory()) {
      return false;
    }
  } catch {
    return false;
  }

  return (
    fs.existsSync(joinRelativePath(siblingStateDirectory, "index.svelte.ts")) ||
    fs.existsSync(joinRelativePath(siblingStateDirectory, "index.ts"))
  );
}
