import * as assert from "node:assert/strict";
import * as fs from "node:fs";
import * as os from "node:os";
import * as path from "node:path";
import { StructuralAudit } from "../../audit/class/manager/structural-audit";

async function createTempWorkspace(): Promise<string> {
  return fs.promises.mkdtemp(path.join(os.tmpdir(), "vibe-manager-audit-"));
}

describe("StructuralAudit", () => {
  it("reports invalid clusters, joints, and file names", async () => {
    const workspaceRoot = await createTempWorkspace();
    const libRoot = path.join(workspaceRoot, "stylist-svelte", "src", "lib");

    await fs.promises.mkdir(
      path.join(libRoot, "color", "function", "state", "palette"),
      { recursive: true }
    );
    await fs.promises.mkdir(
      path.join(libRoot, "theme", "wrong-cluster", "state", "mode"),
      { recursive: true }
    );
    await fs.promises.mkdir(
      path.join(libRoot, "layout", "class", "state", "stack"),
      { recursive: true }
    );

    await fs.promises.writeFile(
      path.join(libRoot, "color", "function", "state", "palette", "bad.ts"),
      "export const x = 1;",
      "utf8"
    );
    await fs.promises.writeFile(
      path.join(libRoot, "theme", "wrong-cluster", "state", "mode", "index.ts"),
      "export const x = 1;",
      "utf8"
    );
    await fs.promises.writeFile(
      path.join(libRoot, "layout", "class", "state", "stack", "index.ts"),
      "export class X {}",
      "utf8"
    );

    const service = new StructuralAudit();
    const report = await service.createReport(workspaceRoot, ["stylist-svelte/src/lib"]);
    const target = report.targets[0];

    assert.equal(target.targetPath, "stylist-svelte/src/lib");
    assert.equal(target.violationCount >= 3, true);
    assert.equal(target.errorCount >= 3, true);
    assert.equal(
      target.violations.some((violation) => violation.ruleId === "invalid-cluster"),
      true
    );
    assert.equal(
      target.violations.some((violation) => violation.ruleId === "invalid-joint"),
      true
    );
    assert.equal(
      target.violations.some((violation) => violation.ruleId === "invalid-file-name"),
      true
    );

    await fs.promises.rm(workspaceRoot, { recursive: true, force: true });
  });

  it("accepts custom clusters from runtime input", async () => {
    const workspaceRoot = await createTempWorkspace();
    const libRoot = path.join(workspaceRoot, "stylist-svelte", "src", "lib");

    await fs.promises.mkdir(
      path.join(libRoot, "theme", "schema", "state", "palette"),
      { recursive: true }
    );
    await fs.promises.writeFile(
      path.join(libRoot, "theme", "schema", "state", "palette", "index.ts"),
      "export const x = 1;",
      "utf8"
    );

    const service = new StructuralAudit();
    const report = await service.createReport(
      workspaceRoot,
      ["stylist-svelte/src/lib"],
      {
        customClusterList: ["schema"],
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
      }
    );
    const target = report.targets[0];

    assert.equal(
      target.violations.some((violation) => violation.ruleId === "invalid-cluster"),
      false
    );

    await fs.promises.rm(workspaceRoot, { recursive: true, force: true });
  });

  it("accepts custom data extensions from runtime input", async () => {
    const workspaceRoot = await createTempWorkspace();
    const libRoot = path.join(workspaceRoot, "stylist-svelte", "src", "lib");

    await fs.promises.mkdir(
      path.join(libRoot, "theme", "data", "json", "palette"),
      { recursive: true }
    );
    await fs.promises.writeFile(
      path.join(libRoot, "theme", "data", "json", "palette", "shader.glsl"),
      "void main() {}",
      "utf8"
    );

    const service = new StructuralAudit();
    const report = await service.createReport(
      workspaceRoot,
      ["stylist-svelte/src/lib"],
      {
        customClusterList: [],
        customDataExtensionList: [".glsl"],
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
      }
    );
    const target = report.targets[0];

    assert.equal(
      target.violations.some((violation) => violation.ruleId === "invalid-data-file"),
      false
    );

    await fs.promises.rm(workspaceRoot, { recursive: true, force: true });
  });

  it("accepts custom joints from runtime input", async () => {
    const workspaceRoot = await createTempWorkspace();
    const libRoot = path.join(workspaceRoot, "stylist-svelte", "src", "lib");

    await fs.promises.mkdir(
      path.join(libRoot, "theme", "function", "factory", "palette"),
      { recursive: true }
    );
    await fs.promises.writeFile(
      path.join(libRoot, "theme", "function", "factory", "palette", "index.ts"),
      "export function createPalette() { return null; }",
      "utf8"
    );

    const service = new StructuralAudit();
    const report = await service.createReport(
      workspaceRoot,
      ["stylist-svelte/src/lib"],
      {
        customClusterList: [],
        customDataExtensionList: [],
        customJointConstList: [],
        customJointTypeList: [],
        customJointInterfaceList: [],
        customJointClassList: [],
        customJointFunctionList: ["factory"],
        customJointComponentList: [],
        customJointDataList: [],
        customFileNameAllList: [],
        customFileNameOtherList: [],
        customFileNameComponentList: [],
        customFileNameStateList: [],
        customFileNameTestList: []
      }
    );
    const target = report.targets[0];

    assert.equal(
      target.violations.some((violation) => violation.ruleId === "invalid-joint"),
      false
    );

    await fs.promises.rm(workspaceRoot, { recursive: true, force: true });
  });

  it("accepts custom file-name rules from runtime input", async () => {
    const workspaceRoot = await createTempWorkspace();
    const libRoot = path.join(workspaceRoot, "stylist-svelte", "src", "lib");

    await fs.promises.mkdir(
      path.join(libRoot, "theme", "function", "factory", "palette"),
      { recursive: true }
    );
    await fs.promises.writeFile(
      path.join(libRoot, "theme", "function", "factory", "palette", "main.ts"),
      "export function createPalette() { return null; }",
      "utf8"
    );

    const service = new StructuralAudit();
    const invalidFileNameReport = await service.createReport(
      workspaceRoot,
      ["stylist-svelte/src/lib"],
      {
        customClusterList: [],
        customDataExtensionList: [],
        customJointConstList: [],
        customJointTypeList: [],
        customJointInterfaceList: [],
        customJointClassList: [],
        customJointFunctionList: ["factory"],
        customJointComponentList: [],
        customJointDataList: [],
        customFileNameAllList: [],
        customFileNameOtherList: [],
        customFileNameComponentList: [],
        customFileNameStateList: [],
        customFileNameTestList: ["main.ts"]
      }
    );
    const validFileNameReport = await service.createReport(
      workspaceRoot,
      ["stylist-svelte/src/lib"],
      {
        customClusterList: [],
        customDataExtensionList: [],
        customJointConstList: [],
        customJointTypeList: [],
        customJointInterfaceList: [],
        customJointClassList: [],
        customJointFunctionList: ["factory"],
        customJointComponentList: [],
        customJointDataList: [],
        customFileNameAllList: [],
        customFileNameOtherList: ["main.ts"],
        customFileNameComponentList: [],
        customFileNameStateList: [],
        customFileNameTestList: []
      }
    );
    const invalidTarget = invalidFileNameReport.targets[0];
    const validTarget = validFileNameReport.targets[0];

    assert.equal(
      invalidTarget.violations.some((violation) => violation.ruleId === "invalid-file-name"),
      true
    );
    assert.equal(
      validTarget.violations.some((violation) => violation.ruleId === "invalid-file-name"),
      false
    );

    await fs.promises.rm(workspaceRoot, { recursive: true, force: true });
  });

  it("accepts global file-name rules from runtime input", async () => {
    const workspaceRoot = await createTempWorkspace();
    const libRoot = path.join(workspaceRoot, "stylist-svelte", "src", "lib");

    await fs.promises.mkdir(
      path.join(libRoot, "theme", "function", "script", "palette"),
      { recursive: true }
    );
    await fs.promises.writeFile(
      path.join(libRoot, "theme", "function", "script", "palette", "readme.md"),
      "# Palette",
      "utf8"
    );

    const service = new StructuralAudit();
    const report = await service.createReport(
      workspaceRoot,
      ["stylist-svelte/src/lib"],
      {
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
      }
    );
    const target = report.targets[0];

    assert.equal(
      target.violations.some(
        (violation) =>
          violation.ruleId === "invalid-file-name" &&
          violation.relativePath.endsWith("readme.md")
      ),
      false
    );

    await fs.promises.rm(workspaceRoot, { recursive: true, force: true });
  });

  it("reports component shape and content violations", async () => {
    const workspaceRoot = await createTempWorkspace();
    const libRoot = path.join(workspaceRoot, "stylist-svelte", "src", "lib");
    const componentRoot = path.join(
      libRoot,
      "media",
      "component",
      "atom",
      "preview-card"
    );

    await fs.promises.mkdir(componentRoot, { recursive: true });
    await fs.promises.writeFile(
      path.join(componentRoot, "index.svelte"),
      `<script lang="ts">\nconst helper = buildHelper();\nexport { helper };\n</script>\n<div />`,
      "utf8"
    );
    await fs.promises.writeFile(
      path.join(componentRoot, "index.story.svelte"),
      `<div>No Story component</div>`,
      "utf8"
    );

    const service = new StructuralAudit();
    const report = await service.createReport(workspaceRoot, ["stylist-svelte/src/lib"]);
    const target = report.targets[0];

    assert.equal(
      target.violations.some(
        (violation) => violation.ruleId === "missing-component-barrel"
      ),
      true
    );
    assert.equal(
      target.violations.some(
        (violation) => violation.ruleId === "invalid-story-content"
      ),
      true
    );
    assert.equal(
      target.violations.some(
        (violation) => violation.ruleId === "invalid-svelte-reexport"
      ),
      true
    );
    assert.equal(
      target.violations.some(
        (violation) => violation.ruleId === "inline-svelte-const"
      ),
      true
    );
    assert.equal(target.recommendationCount >= 1, true);
    assert.equal(report.recommendationCount >= 1, true);
    assert.equal(Array.isArray(report.violationListBySeverity.error), true);
    assert.equal(Array.isArray(report.violationListBySeverity.warning), true);
    assert.equal(Array.isArray(report.recommendationListBySourcePath["media/component/atom/preview-card/index.svelte"]), true);
    assert.equal(
      report.recommendations.some(
        (recommendation) =>
          recommendation.name === "helper" &&
          recommendation.recommendedRelativePath ===
            "media/const/value/helper/index.ts"
      ),
      true
    );

    await fs.promises.rm(workspaceRoot, { recursive: true, force: true });
  });

  it("reports invalid function/state index.svelte.ts content", async () => {
    const workspaceRoot = await createTempWorkspace();
    const libRoot = path.join(workspaceRoot, "stylist-svelte", "src", "lib");
    const stateRoot = path.join(libRoot, "theme", "function", "state", "palette");

    await fs.promises.mkdir(stateRoot, { recursive: true });
    await fs.promises.writeFile(
      path.join(stateRoot, "index.svelte.ts"),
      [
        "const helper = 1;",
        "export const state = helper;",
        "export { state };"
      ].join("\n"),
      "utf8"
    );

    const service = new StructuralAudit();
    const report = await service.createReport(workspaceRoot, ["stylist-svelte/src/lib"]);
    const target = report.targets[0];

    assert.equal(
      target.violations.some(
        (violation) => violation.ruleId === "invalid-ts-export-kind"
      ),
      true
    );
    assert.equal(
      target.violations.some(
        (violation) => violation.ruleId === "invalid-ts-export-count"
      ),
      true
    );
    assert.equal(
      target.violations.some(
        (violation) => violation.ruleId === "invalid-ts-hidden-declaration"
      ),
      true
    );
    assert.equal(
      target.violations.some(
        (violation) => violation.ruleId === "invalid-ts-reexport"
      ),
      true
    );

    await fs.promises.rm(workspaceRoot, { recursive: true, force: true });
  });

  it("reports missing component state contract when sibling state exists", async () => {
    const workspaceRoot = await createTempWorkspace();
    const libRoot = path.join(workspaceRoot, "stylist-svelte", "src", "lib");
    const componentRoot = path.join(libRoot, "dialog", "component", "atom", "sheet");
    const stateRoot = path.join(libRoot, "dialog", "function", "state", "sheet");

    await fs.promises.mkdir(componentRoot, { recursive: true });
    await fs.promises.mkdir(stateRoot, { recursive: true });

    await fs.promises.writeFile(
      path.join(componentRoot, "index.ts"),
      "export {};",
      "utf8"
    );
    await fs.promises.writeFile(
      path.join(componentRoot, "index.svelte"),
      `<script lang="ts">\nconst helper = buildHelper();\n</script>\n<div />`,
      "utf8"
    );
    await fs.promises.writeFile(
      path.join(stateRoot, "index.svelte.ts"),
      "export default function createSheetState() { return {}; }",
      "utf8"
    );

    const service = new StructuralAudit();
    const report = await service.createReport(workspaceRoot, ["stylist-svelte/src/lib"]);
    const target = report.targets[0];

    assert.equal(
      target.violations.some(
        (violation) => violation.ruleId === "missing-component-state-const"
      ),
      true
    );

    await fs.promises.rm(workspaceRoot, { recursive: true, force: true });
  });
});
