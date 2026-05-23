import * as fs from "node:fs";
import * as path from "node:path";
import { FolderCheckEntry } from "../../../type/struct/folder-check-entry";
import { FolderCheckReport } from "../../../type/struct/folder-check-report";

type DirectoryReader = (targetPath: string) => Promise<fs.Dirent[]>;

export class FolderCheck {
  public constructor(
    private readonly readDirectory: DirectoryReader = async (targetPath) =>
      fs.promises.readdir(targetPath, { withFileTypes: true })
  ) {}

  public async listSelectableFolders(workspaceRoot: string): Promise<string[]> {
    const entries = await this.readVisibleEntries(workspaceRoot);

    return entries
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name)
      .sort((left, right) => left.localeCompare(right));
  }

  public async createReport(
    workspaceRoot: string,
    selectedFolders: string[]
  ): Promise<FolderCheckReport> {
    const folders = await Promise.all(
      selectedFolders.map(async (selectedFolder) =>
        this.inspectFolder(workspaceRoot, selectedFolder)
      )
    );

    return {
      workspaceName: path.basename(workspaceRoot),
      checkedAt: new Date().toISOString(),
      folders
    };
  }

  private async inspectFolder(
    workspaceRoot: string,
    relativePath: string
  ): Promise<FolderCheckEntry> {
    const absolutePath = path.join(workspaceRoot, relativePath);
    const entries = await this.readVisibleEntries(absolutePath);

    let fileCount = 0;
    let folderCount = 0;

    for (const entry of entries) {
      if (entry.isFile()) {
        fileCount += 1;
        continue;
      }

      if (entry.isDirectory()) {
        folderCount += 1;

        const nestedFolder = await this.inspectFolder(
          workspaceRoot,
          path.join(relativePath, entry.name)
        );

        fileCount += nestedFolder.fileCount;
        folderCount += nestedFolder.folderCount;
      }
    }

    return {
      relativePath,
      folderName: path.basename(relativePath),
      fileCount,
      folderCount,
      hasPackageJson: entries.some((entry) => entry.isFile() && entry.name === "package.json")
    };
  }

  private async readVisibleEntries(targetPath: string): Promise<fs.Dirent[]> {
    const entries = await this.readDirectory(targetPath);

    return entries.filter((entry) => !entry.name.startsWith("."));
  }
}
