# Vibe Manager VS Code Extension

Pure TypeScript scaffold for a VS Code extension without Python runtime dependencies.

## What is included

- one command: `Vibe Manager: Show Workspace Summary`
- extension runtime based only on `node` and `vscode`
- unit tests and integration test scaffold for TDD-oriented development

## Quick start

```powershell
npm install
npm run build
npm test
```

Then open `vibe-manager` in VS Code and press `F5` to launch the Extension Development Host.

## Command

- `Vibe Manager: Show Workspace Summary` shows the current workspace name, folder count, file count, and whether `package.json` exists at the workspace root.

## Tests

```powershell
npm run test:unit
npm run test:integration
```
