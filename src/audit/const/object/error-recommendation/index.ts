import { ERROR } from "../error";
import { AuditError } from "../../../type/alias/audit-error";

export const ERROR_RECOMMENDATION: Record<AuditError, string> = {
  [ERROR.INVALID_CLUSTER]: "Rename the cluster directory from '{cluster}' to one of {allowedClusterList} or explicitly extend the cluster configuration.",
  [ERROR.INVALID_JOINT]: "Rename the joint directory from '{joint}' to one of {allowedJointList} for cluster '{cluster}' or extend the joint configuration explicitly.",
  [ERROR.INVALID_DATA_FILE]: "Rename or move '{fileName}' so it uses one of {allowedDataExtensionList}.",
  [ERROR.INVALID_FILE_NAME]: "Rename '{fileName}' to one of {allowedFileNameList} for joint '{joint}' or extend the file-name configuration intentionally.",
  [ERROR.MISSING_COMPONENT_BARREL]: "Add the missing component entry file at '{expectedFilePath}'.",
  [ERROR.MISSING_COMPONENT_SVELTE]: "Add the missing component implementation file at '{expectedFilePath}'.",
  [ERROR.MISSING_STATE_ENTRY]: "Add a state entry file at '{primaryExpectedFilePath}' or '{secondaryExpectedFilePath}'.",
  [ERROR.MISSING_TEST_ENTRY]: "Add a test entry file at '{primaryExpectedFilePath}' or '{secondaryExpectedFilePath}'.",
  [ERROR.INVALID_STORY_CONTENT]: "Add a valid '<Story>' block to the story file so the component story is renderable and explicit.",
  [ERROR.INVALID_SVELTE_SCRIPT]: "Add a valid '<script>...</script>' block to the Svelte component file.",
  [ERROR.INVALID_SVELTE_REEXPORT]: "Remove re-exports from the component script and keep the component file focused on local component logic.",
  [ERROR.MISSING_TS_EXPORT]: "Export exactly one top-level entity from the file using the cluster-appropriate export kind.",
  [ERROR.INVALID_TS_EXPORT_COUNT]: "Keep only one top-level 'export {expectedExportKind}' declaration in the file; found {foundExportDeclarationList}. Split the other exported entities into separate files.",
  [ERROR.INVALID_TS_REEXPORT]: "Remove the re-export and keep the file responsible only for its own exported entity.",
  [ERROR.INVALID_TS_EXPORT_KIND]: "Move the exported {actualExportKind} into {recommendedLocation} or change the declaration so it matches the current cluster contract.",
  [ERROR.INVALID_TS_HIDDEN_DECLARATION]: "Move the hidden top-level {declarationKind} '{declarationName}' into '{recommendedRelativePath}' or inline it inside the exported entity if it is purely local.",
  [ERROR.MISSING_COMPONENT_STATE_CONST]: "Define 'const state = stateFn(props)' in the component when a sibling function/state entry exists.",
  [ERROR.MISSING_COMPONENT_STATE_IMPORT]: "Import the sibling state entry from {expectedImportSource} and wire it into the component.",
  [ERROR.INLINE_SVELTE_CONST]: "Extract const '{name}' into '{recommendedRelativePath}'.",
  [ERROR.INLINE_SVELTE_TYPE]: "Extract type '{name}' into '{recommendedRelativePath}'.",
  [ERROR.INLINE_SVELTE_INTERFACE]: "Extract interface '{name}' into '{recommendedRelativePath}'.",
  [ERROR.INLINE_SVELTE_FUNCTION]: "Extract function '{name}' into '{recommendedRelativePath}'."
};
