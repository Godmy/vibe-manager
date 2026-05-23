# Vibe Manager VS Code Extension

Early preview of a structural audit extension for TypeScript, Svelte, and SAMO-style folder rules.

## What it does today

`Vibe Manager: Run Folder Check` generates a JSON audit report for one or more configured folders.

Current checks include:

- allowed `cluster` names
- allowed `joint` names by cluster
- allowed file names for `component`, `state`, `test`, and generic folders
- allowed data extensions
- TypeScript export policy
- basic `index.svelte` checks around state delegation
- inline Svelte declaration detection with relocation recommendations

The extension runs only on `node` and the VS Code API. No local Python runtime is required.

## Quick start

```powershell
npm install
npm run build
npm test
```

Then open `vibe-manager` in VS Code and press `F5` to launch the Extension Development Host.

## Command

`Vibe Manager: Run Folder Check` reads `vibe-manager.config.json` from the workspace root when it exists.

- If the config file exists, the command uses its folder list, output path, and audit customization.
- If the config file does not exist, the command falls back to interactive folder and output selection.

## Config file

Create `vibe-manager.config.json` in the workspace root:

```json
{
  "folders": ["../stylist-svelte/src/lib"],
  "outputFile": "reports/structural-audit-report.json",
  "customClusterList": [],
  "customDataExtensionList": [],
  "customJointConstList": [],
  "customJointTypeList": [],
  "customJointInterfaceList": [],
  "customJointClassList": [],
  "customJointFunctionList": [],
  "customJointComponentList": [],
  "customJointDataList": [],
  "customFileNameAllList": [],
  "customFileNameOtherList": [],
  "customFileNameComponentList": [],
  "customFileNameStateList": [],
  "customFileNameTestList": []
}
```

Field overview:

- `folders`: folders to inspect, relative to the workspace root or absolute
- `outputFile`: target JSON report path, relative to the workspace root or absolute
- `customClusterList`: extra cluster folder names
- `customDataExtensionList`: extra allowed data file extensions
- `customJoint*List`: extra joint names per cluster
- `customFileName*List`: extra allowed file names for the matching rule bucket

The customization fields are opt-in escape hatches. They let a user extend the audit model locally at their own risk.

## Report shape

The generated JSON report contains:

- per-target audit entries
- violations with `ruleId`, `message`, `severity`, and `recommendation`
- grouped counts by severity and rule id
- grouped relocation recommendations by source path

## Rule registry direction

The current code already centralizes error ids, report messages, and recommendations.

The next step is a single rule registry object that also stores:

- severity
- ADR references
- rule taxonomy metadata

See [docs/rule-registry.md](docs/rule-registry.md).

## Current limits

This release does not yet cover the full ADR surface of `stylist-svelte`.

Notable gaps still include:

- family depth validation
- legacy joint migration rules such as `interface/role`
- `interface/recipe` semantic checks
- deeper `const/*` shape validation
- richer Svelte 5 syntax and accessibility checks

## Tests

```powershell
npm run test:unit
npm run test:integration
```
