import * as fs from "node:fs";
import * as path from "node:path";
import { FolderCheckConfig } from "./FolderCheckConfig";

export class FolderCheckConfigLoader {
  public async load(workspaceRoot: string): Promise<FolderCheckConfig | null> {
    const configPath = path.join(workspaceRoot, "vibe-manager.config.json");

    if (!fs.existsSync(configPath)) {
      return null;
    }

    const content = await fs.promises.readFile(configPath, "utf8");
    const parsed = JSON.parse(content) as Partial<FolderCheckConfig>;

    if (
      !Array.isArray(parsed.folders) ||
      parsed.folders.some((folder) => typeof folder !== "string")
    ) {
      throw new Error("vibe-manager.config.json must contain a string[] field named 'folders'.");
    }

    if (typeof parsed.outputFile !== "string" || parsed.outputFile.trim() === "") {
      throw new Error("vibe-manager.config.json must contain a string field named 'outputFile'.");
    }

    return {
      folders: parsed.folders,
      outputFile: parsed.outputFile
    };
  }
}
