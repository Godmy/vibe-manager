import * as assert from "node:assert/strict";
import * as fs from "node:fs";
import { WorkspaceSummaryService } from "../../workspace/WorkspaceSummaryService";

function createDirent(name: string, kind: "file" | "directory"): fs.Dirent {
  return {
    name,
    isBlockDevice: () => false,
    isCharacterDevice: () => false,
    isDirectory: () => kind === "directory",
    isFIFO: () => false,
    isFile: () => kind === "file",
    isSocket: () => false,
    isSymbolicLink: () => false
  } as fs.Dirent;
}

describe("WorkspaceSummaryService", () => {
  it("counts only visible top-level entries", async () => {
    const service = new WorkspaceSummaryService(async () => [
      createDirent("src", "directory"),
      createDirent("test", "directory"),
      createDirent("package.json", "file"),
      createDirent("README.md", "file"),
      createDirent(".git", "directory")
    ]);

    const summary = await service.read("D:\\2026\\code\\template\\stylist\\stylist");

    assert.deepEqual(summary, {
      workspaceName: "stylist",
      folderCount: 2,
      fileCount: 2,
      hasPackageJson: true
    });
  });

  it("reports missing package.json", async () => {
    const service = new WorkspaceSummaryService(async () => [
      createDirent("src", "directory"),
      createDirent("README.md", "file")
    ]);

    const summary = await service.read("D:\\projects\\example-extension");

    assert.equal(summary.workspaceName, "example-extension");
    assert.equal(summary.hasPackageJson, false);
  });
});
