import * as fs from "node:fs";
import * as path from "node:path";
import * as vscode from "vscode";
import { FolderCheckConfigLoader } from "./workspace/FolderCheckConfigLoader";
import { FolderCheckService } from "./workspace/FolderCheckService";

export function activate(context: vscode.ExtensionContext): void {
  const configLoader = new FolderCheckConfigLoader();
  const service = new FolderCheckService();

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

      try {
        const config = await configLoader.load(workspaceRoot);

        if (config) {
          selectedFolders = config.folders;
          outputPath = path.isAbsolute(config.outputFile)
            ? config.outputFile
            : path.join(workspaceRoot, config.outputFile);
        }
      } catch (error) {
        void vscode.window.showErrorMessage(
          error instanceof Error ? error.message : "Failed to load vibe-manager.config.json."
        );
        return;
      }

      if (!selectedFolders || !outputPath) {
        const selectableFolders = await service.listSelectableFolders(workspaceRoot);

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

        const saveUri = await vscode.window.showSaveDialog({
          defaultUri: vscode.Uri.file(path.join(workspaceRoot, "vibe-manager-report.json")),
          filters: {
            JSON: ["json"]
          },
          saveLabel: "Save folder check report"
        });

        if (!saveUri) {
          return;
        }

        selectedFolders = folderSelection.map((folder) => folder.label);
        outputPath = saveUri.fsPath;
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

      const report = await service.createReport(workspaceRoot, selectedFolders);

      await fs.promises.mkdir(path.dirname(outputPath), { recursive: true });
      await fs.promises.writeFile(outputPath, JSON.stringify(report, null, 2), "utf8");

      void vscode.window.showInformationMessage(`Saved folder check report to ${outputPath}`);
    })
  );
}

export function deactivate(): void {}
