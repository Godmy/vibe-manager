import * as vscode from "vscode";
import { WorkspaceSummaryService } from "./workspace/WorkspaceSummaryService";

export function activate(context: vscode.ExtensionContext): void {
  const service = new WorkspaceSummaryService();

  context.subscriptions.push(
    vscode.commands.registerCommand("vibeManager.showWorkspaceSummary", async () => {
      const workspaceFolder = vscode.workspace.workspaceFolders?.[0];

      if (!workspaceFolder) {
        void vscode.window.showWarningMessage("Open a workspace folder to inspect it.");
        return;
      }

      const summary = await service.read(workspaceFolder.uri.fsPath);
      const message = [
        `Workspace: ${summary.workspaceName}`,
        `Folders: ${summary.folderCount}`,
        `Files: ${summary.fileCount}`,
        `package.json: ${summary.hasPackageJson ? "yes" : "no"}`
      ].join(" | ");

      void vscode.window.showInformationMessage(message);
    })
  );
}

export function deactivate(): void {}
