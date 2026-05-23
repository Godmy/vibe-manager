import {
  ERROR,
  AuditError,
} from "../error";

export const ERROR_RECOMMENDATION: Record<AuditError, string> = {
  [ERROR.INVALID_CLUSTER]: "Rename the cluster directory to an allowed cluster name or explicitly extend the cluster configuration.",
  [ERROR.INVALID_JOINT]: "Rename the joint directory to an allowed joint for its cluster or extend the joint configuration explicitly.",
  [ERROR.INVALID_DATA_FILE]: "Move the file to a supported data format or extend the allowed data-extension list intentionally.",
  [ERROR.INVALID_FILE_NAME]: "Rename the file to an allowed name for this joint or extend the file-name configuration intentionally.",
  [ERROR.MISSING_COMPONENT_BARREL]: "Add an 'index.ts' component entry file for this component family.",
  [ERROR.MISSING_COMPONENT_SVELTE]: "Add an 'index.svelte' component implementation file for this component family.",
  [ERROR.MISSING_STATE_ENTRY]: "Add a state entry file named 'index.svelte.ts' or 'index.ts'.",
  [ERROR.MISSING_TEST_ENTRY]: "Add a test entry file named 'index.test.ts' or 'index.ts'.",
  [ERROR.INVALID_STORY_CONTENT]: "Add a valid '<Story>' block to the story file so the component story is renderable and explicit.",
  [ERROR.INVALID_SVELTE_SCRIPT]: "Add a valid '<script>...</script>' block to the Svelte component file.",
  [ERROR.INVALID_SVELTE_REEXPORT]: "Remove re-exports from the component script and keep the component file focused on local component logic.",
  [ERROR.MISSING_TS_EXPORT]: "Export exactly one top-level entity from the file using the cluster-appropriate export kind.",
  [ERROR.INVALID_TS_EXPORT_COUNT]: "Keep exactly one top-level export in the file and split extra exported entities into separate files.",
  [ERROR.INVALID_TS_REEXPORT]: "Remove the re-export and keep the file responsible only for its own exported entity.",
  [ERROR.INVALID_TS_EXPORT_KIND]: "Change the export kind so it matches the cluster contract for this directory.",
  [ERROR.INVALID_TS_HIDDEN_DECLARATION]: "Move the hidden top-level declaration into its own exported file or inline it inside the exported entity if it is purely local.",
  [ERROR.MISSING_COMPONENT_STATE_CONST]: "Define 'const state = stateFn(props)' in the component when a sibling function/state entry exists.",
  [ERROR.MISSING_COMPONENT_STATE_IMPORT]: "Import the sibling state function from the function/state cluster and wire it into the component.",
  [ERROR.INLINE_SVELTE_CONST]: "Extract the inline const into the const cluster.",
  [ERROR.INLINE_SVELTE_TYPE]: "Extract the inline type into the type or interface cluster.",
  [ERROR.INLINE_SVELTE_INTERFACE]: "Extract the inline interface into the interface cluster.",
  [ERROR.INLINE_SVELTE_FUNCTION]: "Extract the inline function into the function cluster."
};
