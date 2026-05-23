import * as assert from "node:assert/strict";
import * as fs from "node:fs";
import * as os from "node:os";
import * as path from "node:path";
import { FolderCheck } from "../../workspace/class/manager/folder-check";

async function createTempWorkspace(): Promise<string> {
  return fs.promises.mkdtemp(path.join(os.tmpdir(), "vibe-manager-"));
}

describe("FolderCheck", () => {
  it("lists only visible top-level folders", async () => {
    const workspaceRoot = await createTempWorkspace();

    await fs.promises.mkdir(path.join(workspaceRoot, "src"));
    await fs.promises.mkdir(path.join(workspaceRoot, "test"));
    await fs.promises.mkdir(path.join(workspaceRoot, ".git"));
    await fs.promises.writeFile(path.join(workspaceRoot, "README.md"), "readme", "utf8");

    const service = new FolderCheck();
    const folders = await service.listSelectableFolders(workspaceRoot);

    assert.deepEqual(folders, ["src", "test"]);

    await fs.promises.rm(workspaceRoot, { recursive: true, force: true });
  });

  it("builds a recursive report for selected folders", async () => {
    const workspaceRoot = await createTempWorkspace();

    await fs.promises.mkdir(path.join(workspaceRoot, "src", "nested"), { recursive: true });
    await fs.promises.mkdir(path.join(workspaceRoot, "docs"), { recursive: true });
    await fs.promises.writeFile(path.join(workspaceRoot, "src", "index.ts"), "export {};", "utf8");
    await fs.promises.writeFile(
      path.join(workspaceRoot, "src", "package.json"),
      "{}",
      "utf8"
    );
    await fs.promises.writeFile(
      path.join(workspaceRoot, "src", "nested", "helper.ts"),
      "export {};",
      "utf8"
    );
    await fs.promises.writeFile(path.join(workspaceRoot, "docs", "guide.md"), "# guide", "utf8");

    const service = new FolderCheck();
    const report = await service.createReport(workspaceRoot, ["src", "docs"]);

    assert.equal(report.workspaceName, path.basename(workspaceRoot));
    assert.equal(report.folders.length, 2);
    assert.deepEqual(report.folders[0], {
      relativePath: "src",
      folderName: "src",
      fileCount: 3,
      folderCount: 1,
      hasPackageJson: true
    });
    assert.deepEqual(report.folders[1], {
      relativePath: "docs",
      folderName: "docs",
      fileCount: 1,
      folderCount: 0,
      hasPackageJson: false
    });

    await fs.promises.rm(workspaceRoot, { recursive: true, force: true });
  });
});
