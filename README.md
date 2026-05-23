# Vibe Manager

> SAMO is the best practice for VIBE-coding

Structural audit extension for TypeScript and Svelte projects. Enforces the SAMO architecture through automated self-analysis of the folder tree and source files.

Applying SAMO demonstrably improves maintainability in AI-only and AI-first codebases and reduces token consumption: a predictable, morphologically consistent folder structure lets AI agents navigate and reason about the codebase with minimal context.

## SAMO

**SAMO — SOLID · Atomic · Morphological · Orchestration**

A methodology built for AI-assisted development (VIBE-coding). It combines four architectural pillars into a single coherent model:

**SOLID** — every file exports exactly one entity of the kind its cluster requires (SRP). Interfaces are split by contract type: `behavior`, `slot`, `contract`, `recipe` (ISP). Components depend on state abstractions in `function/state`, not on inline logic (DIP). Custom lists extend the model without modifying core rules (OCP).

**Atomic Design** — the `component` cluster is structured into three composition levels: `atom`, `molecule`, `organism`. Each family must live at the correct level.

**Morphological box** — a morphological analysis of TypeScript identified a finite set of top-level language constructs. These became the clusters (roots). Each construct has a finite set of semantic roles that became the joints (suffixes). The resulting path formula mirrors natural-language word morphology:

```
{domain}  /  {cluster}  /  {joint}  /  {family}  /  {file}
 prefix       root          suffix      ending
```

Allowed clusters: `const` · `type` · `interface` · `class` · `function` · `component` · `data`

A folder that falls outside the `cluster × joint` grid is a structural violation.

**Orchestration** — coordinating classes live exclusively in `class/manager`. Components delegate all state logic to `function/state`; any component that computes state inline violates the boundary.

---

## Audit rules

`Vibe Manager: Run Folder Check` scans configured folders and enforces the rules below.

### Folder structure

| Rule ID | Description |
|---|---|
| `invalid-cluster` | Cluster folder name is not in the allowed list |
| `invalid-joint` | Joint name is not allowed for that cluster |

### File presence

| Rule ID | Description |
|---|---|
| `missing-component-barrel` | Component folder is missing `index.ts` |
| `missing-component-svelte` | Component folder is missing `index.svelte` |
| `missing-state-entry` | State folder is missing `index.svelte.ts` or `index.ts` |
| `missing-test-entry` | Test folder is missing `index.test.ts` or `index.ts` |

### File naming

| Rule ID | Description |
|---|---|
| `invalid-file-name` | File name is not in the allowed list for its joint type |
| `invalid-data-file` | Data file has a forbidden extension |

### TypeScript export policy

Each file inside a typed cluster (`const`, `type`, `interface`, `class`, `function`) must export exactly one top-level declaration of the matching kind and nothing else.

| Rule ID | Description |
|---|---|
| `missing-ts-export` | File contains no export declaration |
| `invalid-ts-export-count` | File contains more than one export declaration |
| `invalid-ts-reexport` | Re-export (`export { … }`) is forbidden |
| `invalid-ts-export-kind` | Exported kind does not match the cluster; violation includes a `recommendedLocation` |
| `invalid-ts-hidden-declaration` | Top-level non-export declaration is present alongside an export |

### Svelte component rules

| Rule ID | Description |
|---|---|
| `invalid-svelte-script` | `index.svelte` is missing a valid `<script>…</script>` block |
| `invalid-svelte-reexport` | Re-export inside the `<script>` block is forbidden |
| `missing-component-state-const` | Component with a sibling `function/state` entry must define `const state = stateFn(props)` |
| `missing-component-state-import` | Component must import its state function from `{domain}/function/state/` |
| `inline-svelte-const` | Inline `const` should be extracted into the `const` cluster |
| `inline-svelte-type` | Inline `type` should be extracted into the `type` or `interface` cluster |
| `inline-svelte-interface` | Inline `interface` should be extracted into the `interface` cluster |
| `inline-svelte-function` | Inline `function` should be extracted into the `function` cluster |

Inline-extraction violations include a `recommendedRelativePath` pointing to the canonical destination.

### Story rules

| Rule ID | Description |
|---|---|
| `invalid-story-content` | Story file does not contain a `<Story` section |

---

## Setup in your project

`vibe-manager.config.json` is workspace-specific and is not bundled with the extension. To configure it:

1. Copy `vibe-manager.config.json.example` from the extension installation folder into your workspace root.
2. Rename the copy to `vibe-manager.config.json`.
3. Fill in `folders` and `outputFolder`.

```json
{
  "folders": ["../your-project/src/lib"],
  "outputFolder": "../your-project/reports"
}
```

All `custom*List` fields can stay as empty arrays until you need to extend the defaults.

## Command

`Vibe Manager: Run Folder Check` reads `vibe-manager.config.json` from the workspace root.

- Config present → uses its folder list, output folder, and customization.
- Config absent → falls back to interactive folder and output-folder selection.
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

- `folders` — directories to inspect, relative to the workspace root or absolute
- `outputFolder` — report directory, relative to the workspace root or absolute
- `customClusterList` — extra cluster folder names
- `customDataExtensionList` — extra allowed data file extensions
- `customJoint*List` — extra joint names per cluster
- `customFileName*List` — extra allowed file names for the matching rule bucket

Custom lists are opt-in escape hatches. They extend the model locally, at the team's own risk.

## Report shape

```
reports/
└── YYYYMMDD-HHMM/
    ├── samo-analize.json
    └── samo-analize.md
```

Each violation contains:

- `ruleId` — kebab-case rule identifier
- `message` — description with concrete values filled in
- `relativePath` — path relative to the scanned target
- `recommendation` — actionable fix; includes `recommendedLocation` or `recommendedRelativePath` where applicable

The JSON report also includes per-target counts grouped by rule ID, and relocation recommendations grouped by source path.

---

## Roadmap

The next release covers **TypeScript barrel file indexing** — automated validation and generation of `index.ts` re-export files across the folder tree.

Gaps that remain after that:

- family depth validation
- legacy joint migration rules such as `interface/role`
- `interface/recipe` semantic checks
- deeper `const/*` shape validation
- richer Svelte 5 syntax and accessibility checks

---

## Quick start (development)

```powershell
npm install
npm run build
npm test
```

Open `vibe-manager` in VS Code and press `F5` to launch the Extension Development Host.

## Tests

```powershell
npm run test:unit
npm run test:integration
```
