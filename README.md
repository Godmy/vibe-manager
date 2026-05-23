# Vibe Manager VS Code Extension

Structural audit extension for TypeScript, Svelte, and SAMO-style folder rules.

## Design model

The audit enforces a folder address model of the form:

```
{domain}/{cluster}/{joint}/{family}/index.ts
```

Each segment is constrained by a set of concepts:

**Domain Driven Design** — the leading path segment is the domain boundary. Every cluster, joint, and family belongs to exactly one domain. Cross-domain state access is mediated through explicit imports, not shared folders.

**Morphological box** — a morphological analysis of TypeScript identified a finite set of top-level language constructs: `const`, `type`, `interface`, `class`, `function`, `component`, `data`. These became the clusters — the root of the path word. Each construct has a finite set of semantic roles that became the joints — the suffix. The result is a path formula that mirrors natural-language word morphology:

```
{domain}  /  {cluster}  /  {joint}  /  {family}  /  {file}
 prefix       root          suffix      ending
```

A folder that falls outside the `cluster × joint` grid is a structural violation.

**Atomic Design** — the `component` cluster limits joint names to `atom`, `molecule`, and `organism`. The audit enforces that each component family lives at the correct composition level.

**SOLID** — the TypeScript export policy enforces Single Responsibility at the file level: one export per file, one kind per cluster. The `interface` cluster joints (`behavior`, `slot`, `contract`, `recipe`) promote Interface Segregation. Custom lists (`customClusterList`, `customJoint*List`) let teams extend the model without touching the core rules, following the Open/Closed Principle. The component-state contract (Dependency Inversion) enforces that a Svelte component imports its state from `{domain}/function/state/` rather than computing it inline.

**Orchestration** — the `class/manager` joint is the designated location for orchestrating classes (`manager`, `object-manager`, `style-manager`). Components delegate all state logic to `function/state` entries; the audit flags any component that bypasses this boundary.

## What it does today

`Vibe Manager: Run Folder Check` scans one or more configured folders, enforces structural rules, and writes a JSON report and a human-readable Markdown report.

### Folder structure rules

| Rule ID | Severity | Description |
|---|---|---|
| `invalid-cluster` | error | Cluster folder name is not in the allowed list |
| `invalid-joint` | error | Joint name is not allowed for that cluster |

### File presence rules

| Rule ID | Severity | Description |
|---|---|---|
| `missing-component-barrel` | error | Component folder is missing `index.ts` |
| `missing-component-svelte` | error | Component folder is missing `index.svelte` |
| `missing-state-entry` | error | State folder is missing `index.svelte.ts` or `index.ts` |
| `missing-test-entry` | error | Test folder is missing `index.test.ts` or `index.ts` |

### File naming rules

| Rule ID | Severity | Description |
|---|---|---|
| `invalid-file-name` | error | File name is not in the allowed list for its joint type |
| `invalid-data-file` | error | Data file has a forbidden extension |

### TypeScript export policy

Each file inside a typed cluster (`const`, `type`, `interface`, `class`, `function`) must export exactly one top-level declaration of the matching kind and nothing else.

| Rule ID | Severity | Description |
|---|---|---|
| `missing-ts-export` | error | File contains no export declaration |
| `invalid-ts-export-count` | error | File contains more than one export declaration |
| `invalid-ts-reexport` | error | Re-export (`export { … }`) is forbidden |
| `invalid-ts-export-kind` | error | Exported declaration kind does not match the cluster (e.g. `export type` inside a `const` cluster) |
| `invalid-ts-hidden-declaration` | warning | Top-level non-export declaration is present alongside an export |

When `invalid-ts-export-kind` fires, the violation includes a `recommendedLocation` pointing to where the file should be moved.

### Svelte component rules

| Rule ID | Severity | Description |
|---|---|---|
| `invalid-svelte-script` | error | Component `index.svelte` is missing a valid `<script>…</script>` block |
| `invalid-svelte-reexport` | error | Re-export inside the component `<script>` block is forbidden |
| `missing-component-state-const` | error | Component with a sibling `function/state` entry must define `const state = stateFn(props)` |
| `missing-component-state-import` | error | Component with a sibling `function/state` entry must import the state function from the function/state cluster |
| `inline-svelte-const` | warning | `const` declaration should be extracted into the `const` cluster |
| `inline-svelte-type` | warning | `type` declaration should be extracted into the `type` or `interface` cluster |
| `inline-svelte-interface` | warning | `interface` declaration should be extracted into the `interface` cluster |
| `inline-svelte-function` | warning | `function` declaration should be extracted into the `function` cluster |

### Story rules

| Rule ID | Severity | Description |
|---|---|---|
| `invalid-story-content` | error | Story file does not contain a `<Story` section |

## Quick start (development)

```powershell
npm install
npm run build
npm test
```

Then open `vibe-manager` in VS Code and press `F5` to launch the Extension Development Host.

## Setup in your project

`vibe-manager.config.json` is workspace-specific and is not bundled with the extension. To configure it:

1. Copy `vibe-manager.config.json.example` from the extension installation folder into your workspace root.
2. Rename the copy to `vibe-manager.config.json`.
3. Set `folders` to the source directories you want to audit and `outputFolder` to where reports should be written.

```json
{
  "folders": ["../your-project/src/lib"],
  "outputFolder": "../your-project/reports"
}
```

All `custom*List` fields can be left as empty arrays until you need to extend the defaults.

## Command

`Vibe Manager: Run Folder Check` reads `vibe-manager.config.json` from the workspace root when it exists.

- If the config file exists, the command uses its folder list, output folder, and audit customization.
- If the config file does not exist, the command falls back to interactive folder and output-folder selection.
- Reports are written to `.../YYYYMMDD-HHMM/samo-analize.json` and `.../YYYYMMDD-HHMM/samo-analize.md`.

## Config file reference

```json
{
  "folders": ["../your-project/src/lib"],
  "outputFolder": "../your-project/reports",
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
- `outputFolder`: report directory, relative to the workspace root or absolute
- `customClusterList`: extra cluster folder names
- `customDataExtensionList`: extra allowed data file extensions
- `customJoint*List`: extra joint names per cluster
- `customFileName*List`: extra allowed file names for the matching rule bucket

The customization fields are opt-in escape hatches. They let a user extend the audit model locally at their own risk.

## Report shape

The generated output contains:

- `samo-analize.json` — per-target audit entries, violation counts by severity and rule ID, grouped relocation recommendations by source path
- `samo-analize.md` — readable summary, target sections, violations, and recommendations

Each violation carries:

- `ruleId` — kebab-case rule identifier (see tables above)
- `message` — human-readable description with concrete values filled in
- `severity` — `"error"` or `"warning"`
- `relativePath` — path relative to the scanned target
- `recommendation` — actionable fix description; for `invalid-ts-export-kind` and inline Svelte rules this includes the recommended destination path

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
