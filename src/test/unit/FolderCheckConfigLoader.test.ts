import * as assert from "node:assert/strict";
import * as fs from "node:fs";
import * as os from "node:os";
import * as path from "node:path";
import { FolderCheckConfigLoader } from "../../workspace/class/manager/folder-check-config-loader";

async function createTempWorkspace(): Promise<string> {
  return fs.promises.mkdtemp(path.join(os.tmpdir(), "vibe-manager-config-"));
}

describe("FolderCheckConfigLoader", () => {
  it("returns null when no config file exists", async () => {
    const workspaceRoot = await createTempWorkspace();
    const loader = new FolderCheckConfigLoader();

    const config = await loader.load(workspaceRoot);

    assert.equal(config, null);

    await fs.promises.rm(workspaceRoot, { recursive: true, force: true });
  });

  it("loads folder selection and output file from config", async () => {
    const workspaceRoot = await createTempWorkspace();
    const loader = new FolderCheckConfigLoader();

    await fs.promises.writeFile(
      path.join(workspaceRoot, "vibe-manager.config.json"),
      JSON.stringify(
        {
          folders: ["src", "docs"],
          outputFile: "reports/audit.json"
        },
        null,
        2
      ),
      "utf8"
    );

    const config = await loader.load(workspaceRoot);

    assert.deepEqual(config, {
      folders: ["src", "docs"],
      outputFile: "reports/audit.json",
      customClusterList: [],
      customDataExtensionList: [],
      customJointConstList: [],
      customJointTypeList: [],
      customJointInterfaceList: [],
      customJointClassList: [],
      customJointFunctionList: [],
      customJointComponentList: [],
      customJointDataList: [],
      customFileNameAllList: [],
      customFileNameOtherList: [],
      customFileNameComponentList: [],
      customFileNameStateList: [],
      customFileNameTestList: []
    });

    await fs.promises.rm(workspaceRoot, { recursive: true, force: true });
  });

  it("loads custom cluster list from config", async () => {
    const workspaceRoot = await createTempWorkspace();
    const loader = new FolderCheckConfigLoader();

    await fs.promises.writeFile(
      path.join(workspaceRoot, "vibe-manager.config.json"),
      JSON.stringify(
        {
          folders: ["src"],
          outputFile: "reports/audit.json",
          customClusterList: ["schema", "asset"],
          customDataExtensionList: [".glsl", "txt"],
          customJointConstList: ["single"],
          customJointTypeList: ["shape"],
          customJointInterfaceList: ["boundary"],
          customJointClassList: ["factory"],
          customJointFunctionList: ["factory"],
          customJointComponentList: ["template"],
          customJointDataList: ["toml"],
          customFileNameAllList: ["readme.md"],
          customFileNameOtherList: ["main.ts"],
          customFileNameComponentList: ["index.vue"],
          customFileNameStateList: ["state.ts"],
          customFileNameTestList: ["spec.ts"]
        },
        null,
        2
      ),
      "utf8"
    );

    const config = await loader.load(workspaceRoot);

    assert.deepEqual(config, {
      folders: ["src"],
      outputFile: "reports/audit.json",
      customClusterList: ["schema", "asset"],
      customDataExtensionList: [".glsl", "txt"],
      customJointConstList: ["single"],
      customJointTypeList: ["shape"],
      customJointInterfaceList: ["boundary"],
      customJointClassList: ["factory"],
      customJointFunctionList: ["factory"],
      customJointComponentList: ["template"],
      customJointDataList: ["toml"],
      customFileNameAllList: ["readme.md"],
      customFileNameOtherList: ["main.ts"],
      customFileNameComponentList: ["index.vue"],
      customFileNameStateList: ["state.ts"],
      customFileNameTestList: ["spec.ts"]
    });

    await fs.promises.rm(workspaceRoot, { recursive: true, force: true });
  });
});
