import {
  ERROR,
  AuditError,
} from "../error";

export const ERROR_MESSAGE: Record<AuditError, string> = {
  [ERROR.INVALID_CLUSTER]: "Unknown cluster '{cluster}'.",
  [ERROR.INVALID_JOINT]: "Joint '{joint}' is not allowed for cluster '{cluster}'.",
  [ERROR.INVALID_DATA_FILE]: "Data file '{fileName}' has a forbidden extension.",
  [ERROR.INVALID_FILE_NAME]: "File '{fileName}' is not allowed in '{joint}'.",
  [ERROR.MISSING_COMPONENT_BARREL]: "Component '{joint}' folder must contain 'index.ts'.",
  [ERROR.MISSING_COMPONENT_SVELTE]: "Component '{joint}' folder must contain 'index.svelte'.",
  [ERROR.MISSING_STATE_ENTRY]: "State folder must contain 'index.svelte.ts' or 'index.ts'.",
  [ERROR.MISSING_TEST_ENTRY]: "Test folder must contain 'index.test.ts' or 'index.ts'.",
  [ERROR.INVALID_STORY_CONTENT]: "Story file must contain a '<Story' section.",
  [ERROR.INVALID_SVELTE_SCRIPT]: "Component 'index.svelte' must contain a valid '<script>...</script>' block.",
  [ERROR.INVALID_SVELTE_REEXPORT]: "Re-export is forbidden inside the component '<script>' block.",
  [ERROR.MISSING_TS_EXPORT]: "File '{fileName}' must contain exactly one 'export {expectedExportKind}' declaration.",
  [ERROR.INVALID_TS_EXPORT_COUNT]: "File '{fileName}' must contain exactly one 'export {expectedExportKind}' declaration; found {foundExportDeclarationList}.",
  [ERROR.INVALID_TS_REEXPORT]: "Re-export is forbidden inside '{fileName}'.",
  [ERROR.INVALID_TS_EXPORT_KIND]: "File '{fileName}' must use only 'export {expectedExportKind}' declarations.",
  [ERROR.INVALID_TS_HIDDEN_DECLARATION]: "Top-level non-export declaration '{declarationName}' is forbidden inside '{fileName}'.",
  [ERROR.MISSING_COMPONENT_STATE_CONST]: "Component with sibling function/state entry must define 'const state = stateFn(props)'.",
  [ERROR.MISSING_COMPONENT_STATE_IMPORT]: "Component with sibling function/state entry must import its state function from the function/state cluster.",
  [ERROR.INLINE_SVELTE_CONST]: "Const '{name}' should be extracted from 'index.svelte' into the const cluster.",
  [ERROR.INLINE_SVELTE_TYPE]: "Type '{name}' should be extracted from 'index.svelte' into the type cluster.",
  [ERROR.INLINE_SVELTE_INTERFACE]: "Interface '{name}' should be extracted from 'index.svelte' into the interface cluster.",
  [ERROR.INLINE_SVELTE_FUNCTION]: "Function '{name}' should be extracted from 'index.svelte' into the function cluster."
};
