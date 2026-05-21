import * as assert from "node:assert/strict";
import * as vscode from "vscode";

describe("extension", () => {
  it("registers the workspace summary command", async () => {
    const commands = await vscode.commands.getCommands(true);

    assert.equal(commands.includes("vibeManager.showWorkspaceSummary"), true);
  });
});
