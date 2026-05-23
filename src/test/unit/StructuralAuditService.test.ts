import * as assert from "node:assert/strict";
import * as fs from "node:fs";
import * as os from "node:os";
import * as path from "node:path";
import { Auditor } from "../../audit/class/manager/auditor";

async function createTempWorkspace(): Promise<string> {
  return fs.promises.mkdtemp(path.join(os.tmpdir(), "vibe-manager-audit-"));
}

describe("Auditor", () => {
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

    const service = new Auditor();
    const report = await service.createReport(workspaceRoot, ["stylist-svelte/src/lib"]);
    const target = report.targets[0];

    assert.equal(target.targetPath, "stylist-svelte/src/lib");
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

    const invalidClusterViolation = target.violations.find(
      (violation) => violation.ruleId === "invalid-cluster"
    );
    const invalidJointViolation = target.violations.find(
      (violation) => violation.ruleId === "invalid-joint"
    );
    const invalidFileNameViolation = target.violations.find(
      (violation) => violation.ruleId === "invalid-file-name"
    );

    assert.equal(
      invalidClusterViolation?.recommendation.includes("'wrong-cluster'"),
      true
    );
    assert.equal(
      invalidJointViolation?.recommendation.includes("for cluster 'class'"),
      true
    );
    assert.equal(
      invalidFileNameViolation?.recommendation.includes("'index.ts'"),
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

    const service = new Auditor();
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

    const service = new Auditor();
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

    const service = new Auditor();
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

    const service = new Auditor();
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

    const service = new Auditor();
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

    const service = new Auditor();
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
      assert.equal(
        target.violations.some(
          (violation) =>
            violation.ruleId === "inline-svelte-const" &&
            violation.recommendation ===
              "Extract const 'helper' into 'media/const/value/helper/index.ts'."
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

    const service = new Auditor();
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

      const invalidExportKindViolation = target.violations.find(
        (violation) => violation.ruleId === "invalid-ts-export-kind"
      );
      const invalidExportCountViolation = target.violations.find(
        (violation) => violation.ruleId === "invalid-ts-export-count"
      );
      const hiddenDeclarationViolation = target.violations.find(
        (violation) => violation.ruleId === "invalid-ts-hidden-declaration"
      );

    assert.equal(
      invalidExportKindViolation?.recommendation,
      "Move the exported const into 'stylist-svelte/src/lib/theme/const/state/palette/index.svelte.ts' or change the declaration so it matches the current cluster contract."
    );
    assert.equal(
      invalidExportCountViolation?.message,
      "File 'index.svelte.ts' must contain exactly one 'export function' declaration; found 'export const' and 're-export'."
    );
      assert.equal(
        invalidExportCountViolation?.recommendation,
        "Keep only one top-level 'export function' declaration in the file; found 'export const' and 're-export'. Split the other exported entities into separate files."
      );
      assert.equal(
        hiddenDeclarationViolation?.recommendation,
        "Move the hidden top-level const 'helper' into 'theme/const/value/helper/index.ts' or inline it inside the exported entity if it is purely local."
      );

    await fs.promises.rm(workspaceRoot, { recursive: true, force: true });
  });

  it("uses type cluster in invalid export-kind recommendation when a type is exported from const", async () => {
    const workspaceRoot = await createTempWorkspace();
    const libRoot = path.join(workspaceRoot, "stylist-svelte", "src", "lib");
    const wrongConstRoot = path.join(libRoot, "audit", "const", "object", "error");

    await fs.promises.mkdir(wrongConstRoot, { recursive: true });
    await fs.promises.writeFile(
      path.join(wrongConstRoot, "index.ts"),
      "export type AuditError = 'A';",
      "utf8"
    );

    const service = new Auditor();
    const report = await service.createReport(workspaceRoot, ["stylist-svelte/src/lib"]);
    const target = report.targets[0];
    const invalidExportKindViolation = target.violations.find(
      (violation) =>
        violation.ruleId === "invalid-ts-export-kind" &&
        violation.relativePath === "audit/const/object/error/index.ts"
    );

    assert.equal(
      invalidExportKindViolation?.recommendation,
      "Move the exported type into 'stylist-svelte/src/lib/audit/type/object/error/index.ts' or change the declaration so it matches the current cluster contract."
    );

    await fs.promises.rm(workspaceRoot, { recursive: true, force: true });
  });

  it("uses the leading camel-case token as function joint for hidden declarations", async () => {
    const workspaceRoot = await createTempWorkspace();
    const libRoot = path.join(workspaceRoot, "stylist-svelte", "src", "lib");
    const scriptRoot = path.join(libRoot, "audit", "function", "script", "naming");

    await fs.promises.mkdir(scriptRoot, { recursive: true });
    await fs.promises.writeFile(
      path.join(scriptRoot, "index.ts"),
      [
        "function createEmptyAuditCustomization() {",
        "  return {};",
        "}",
        "export function run() {",
        "  return createEmptyAuditCustomization();",
        "}"
      ].join("\n"),
      "utf8"
    );

    const service = new Auditor();
    const report = await service.createReport(workspaceRoot, ["stylist-svelte/src/lib"]);
    const target = report.targets[0];
    const hiddenDeclarationViolation = target.violations.find(
      (violation) =>
        violation.ruleId === "invalid-ts-hidden-declaration" &&
        violation.relativePath === "audit/function/script/naming/index.ts"
    );

    assert.equal(
      hiddenDeclarationViolation?.recommendation,
      "Move the hidden top-level function 'createEmptyAuditCustomization' into 'audit/function/create/empty-audit-customization/index.ts' or inline it inside the exported entity if it is purely local."
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
      `<script lang="ts">\nconst state = createSheetState(props);\n</script>\n<div />`,
      "utf8"
    );
    await fs.promises.writeFile(
      path.join(stateRoot, "index.svelte.ts"),
      "export default function createSheetState() { return {}; }",
      "utf8"
    );

    const service = new Auditor();
    const report = await service.createReport(workspaceRoot, ["stylist-svelte/src/lib"]);
    const target = report.targets[0];

    assert.equal(
      target.violations.some(
        (violation) => violation.ruleId === "missing-component-state-import"
      ),
      true
    );
    assert.equal(
      target.violations.some(
        (violation) =>
          violation.ruleId === "missing-component-state-import" &&
          violation.recommendation ===
            "Import the sibling state entry from 'dialog/function/state/sheet' and wire it into the component."
      ),
      true
    );

    await fs.promises.rm(workspaceRoot, { recursive: true, force: true });
  });

  it("adds specific recommendations for data files and missing entries", async () => {
    const workspaceRoot = await createTempWorkspace();
    const libRoot = path.join(workspaceRoot, "stylist-svelte", "src", "lib");
    const dataRoot = path.join(libRoot, "theme", "data", "json", "palette");
    const componentRoot = path.join(libRoot, "media", "component", "atom", "hero");
    const stateRoot = path.join(libRoot, "theme", "function", "state", "badge");
    const testRoot = path.join(libRoot, "theme", "function", "test", "badge");

    await fs.promises.mkdir(dataRoot, { recursive: true });
    await fs.promises.mkdir(componentRoot, { recursive: true });
    await fs.promises.mkdir(stateRoot, { recursive: true });
    await fs.promises.mkdir(testRoot, { recursive: true });

    await fs.promises.writeFile(path.join(dataRoot, "palette.glsl"), "void main() {}", "utf8");

    const service = new Auditor();
    const report = await service.createReport(workspaceRoot, ["stylist-svelte/src/lib"]);
    const target = report.targets[0];
    const invalidDataFileViolation = target.violations.find(
      (violation) => violation.ruleId === "invalid-data-file"
    );
    const missingComponentBarrelViolation = target.violations.find(
      (violation) => violation.ruleId === "missing-component-barrel"
    );
    const missingComponentSvelteViolation = target.violations.find(
      (violation) => violation.ruleId === "missing-component-svelte"
    );
    const missingStateEntryViolation = target.violations.find(
      (violation) => violation.ruleId === "missing-state-entry"
    );
    const missingTestEntryViolation = target.violations.find(
      (violation) => violation.ruleId === "missing-test-entry"
    );

    assert.equal(
      invalidDataFileViolation?.recommendation,
      "Rename or move 'palette.glsl' so it uses one of '.frag', '.json', '.md', '.svg', '.vert', '.yaml'."
    );
    assert.equal(
      missingComponentBarrelViolation?.recommendation,
      "Add the missing component entry file at 'media/component/atom/hero/index.ts'."
    );
    assert.equal(
      missingComponentSvelteViolation?.recommendation,
      "Add the missing component implementation file at 'media/component/atom/hero/index.svelte'."
    );
    assert.equal(
      missingStateEntryViolation?.recommendation,
      "Add a state entry file at 'theme/function/state/badge/index.svelte.ts' or 'theme/function/state/badge/index.ts'."
    );
    assert.equal(
      missingTestEntryViolation?.recommendation,
      "Add a test entry file at 'theme/function/test/badge/index.test.ts' or 'theme/function/test/badge/index.ts'."
    );

    await fs.promises.rm(workspaceRoot, { recursive: true, force: true });
  });
});
