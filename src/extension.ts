import * as fs from "node:fs";
import * as path from "node:path";
import * as vscode from "vscode";
import { Auditor } from "./audit/class/manager/auditor";
import { AuditCustomization } from "./audit/type/struct/customization";
import { FolderCheckConfigLoader } from "./workspace/class/manager/folder-check-config-loader";
import { FolderCheck } from "./workspace/class/manager/folder-check";
import { buildReportOutputPaths } from "./workspace/function/script/build-report-output-paths";
import { createAuditReportJsonOutput } from "./workspace/function/script/create-audit-report-json-output";
import { createAuditReportMarkdown } from "./workspace/function/script/create-audit-report-markdown";

export function activate(context: vscode.ExtensionContext): void {
  const configLoader = new FolderCheckConfigLoader();
  const folderCheck = new FolderCheck();
  const auditor = new Auditor();

  context.subscriptions.push(
    vscode.commands.registerCommand("vibeManager.showWorkspaceSummary", async () => {
      const workspaceFolder = vscode.workspace.workspaceFolders?.[0];

      if (!workspaceFolder) {
        void vscode.window.showWarningMessage("Open a workspace folder to inspect it.");
        return;
      }

      const workspaceRoot = workspaceFolder.uri.fsPath;
      let selectedFolders: string[] | undefined;
      let outputPath: string | undefined;
      let customization: AuditCustomization = {
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
      };

      try {
        const config = await configLoader.load(workspaceRoot);

        if (config) {
          selectedFolders = config.folders;
          outputPath = path.isAbsolute(config.outputFolder)
            ? config.outputFolder
            : path.join(workspaceRoot, config.outputFolder);
          customization = config;
        }
      } catch (error) {
        void vscode.window.showErrorMessage(
          error instanceof Error ? error.message : "Failed to load vibe-manager.config.json."
        );
        return;
      }

      if (!selectedFolders || !outputPath) {
        const selectableFolders = await folderCheck.listSelectableFolders(workspaceRoot);

        if (selectableFolders.length === 0) {
          void vscode.window.showWarningMessage(
            "No visible folders were found in the workspace root."
          );
          return;
        }

        const folderSelection = await vscode.window.showQuickPick(
          selectableFolders.map((folderPath) => ({
            label: folderPath,
            description: path.join(workspaceRoot, folderPath)
          })),
          {
            canPickMany: true,
            title: "Select folders to inspect",
            placeHolder: "Choose one or more folders from the workspace root"
          }
        );

        if (!folderSelection || folderSelection.length === 0) {
          return;
        }

        const outputFolderSelection = await vscode.window.showOpenDialog({
          defaultUri: vscode.Uri.file(path.join(workspaceRoot, "reports")),
          canSelectFiles: false,
          canSelectFolders: true,
          canSelectMany: false,
          openLabel: "Select report output folder"
        });

        if (!outputFolderSelection || outputFolderSelection.length === 0) {
          return;
        }

        selectedFolders = folderSelection.map((folder) => folder.label);
        outputPath = outputFolderSelection[0].fsPath;
      }

      if (selectedFolders.length === 0) {
        void vscode.window.showErrorMessage(
          "No folders were configured for vibe-manager folder check."
        );
        return;
      }

      const missingFolders = selectedFolders.filter(
        (selectedFolder) => !fs.existsSync(path.join(workspaceRoot, selectedFolder))
      );

      if (missingFolders.length > 0) {
        void vscode.window.showErrorMessage(
          `Configured folders were not found: ${missingFolders.join(", ")}`
        );
        return;
      }

      const report = await auditor.createReport(
        workspaceRoot,
        selectedFolders,
        customization
      );

      const reportOutputPaths = buildReportOutputPaths(outputPath, report);
      const markdownReport = createAuditReportMarkdown(
        report,
        workspaceRoot,
        reportOutputPaths.reportDirectoryPath
      );

      await fs.promises.mkdir(reportOutputPaths.reportDirectoryPath, { recursive: true });
      await fs.promises.writeFile(
        reportOutputPaths.jsonReportPath,
        JSON.stringify(createAuditReportJsonOutput(report), null, 2),
        "utf8"
      );
      await fs.promises.writeFile(
        reportOutputPaths.markdownReportPath,
        markdownReport,
        "utf8"
      );

      void vscode.window.showInformationMessage(
        `Saved structural audit reports to ${reportOutputPaths.reportDirectoryPath}`
      );
    })
  );
}

export function deactivate(): void {}
