# Vibe Manager VS Code Extension

Early preview release.

TypeScript indexing and SAMO-based audit workflows are coming soon.

## What is included

- one command: `Vibe Manager: Run Folder Check`
- user can configure which workspace-root folders to inspect in a file
- user can configure where the generated JSON report should be saved
- if no config file exists, the extension falls back to interactive folder and file selection
- extension runtime based only on `node` and `vscode`
- unit tests and integration test scaffold for TDD-oriented development

## Quick start

```powershell
npm install
npm run build
npm test
```

Then open `vibe-manager` in VS Code and press `F5` to launch the Extension Development Host.

## Coming soon

- TypeScript project indexation
- SAMO-oriented audit flows
- richer report formats
- persistent workspace analysis workflows

## Command

- `Vibe Manager: Run Folder Check` reads `vibe-manager.config.json` from the workspace root when it exists. The config defines which folders to inspect and where to save the JSON report. Without the config file, the extension asks for folder selection and output path interactively.

## Config file

Create `vibe-manager.config.json` in the workspace root:

```json
{
  "folders": ["src", "docs"],
  "outputFile": "reports/vibe-manager-report.json"
}
```

- `folders`: list of workspace-root folders to inspect
- `outputFile`: output path for the generated JSON report, relative to the workspace root or absolute

## Tests

```powershell
npm run test:unit
npm run test:integration
```
