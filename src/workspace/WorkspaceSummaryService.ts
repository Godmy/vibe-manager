import * as fs from "node:fs";
import * as path from "node:path";
import { WorkspaceSummary } from "./WorkspaceSummary";

type DirectoryReader = (rootPath: string) => Promise<fs.Dirent[]>;

export class WorkspaceSummaryService {
  public constructor(
    private readonly readDirectory: DirectoryReader = async (rootPath) =>
      fs.promises.readdir(rootPath, { withFileTypes: true })
  ) {}

  public async read(rootPath: string): Promise<WorkspaceSummary> {
    const entries = await this.readDirectory(rootPath);
    const visibleEntries = entries.filter((entry) => !entry.name.startsWith("."));

    return {
      workspaceName: path.basename(rootPath),
      folderCount: visibleEntries.filter((entry) => entry.isDirectory()).length,
      fileCount: visibleEntries.filter((entry) => entry.isFile()).length,
      hasPackageJson: visibleEntries.some(
        (entry) => entry.isFile() && entry.name === "package.json"
      )
    };
  }
}
