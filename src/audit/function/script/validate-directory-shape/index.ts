import * as fs from "node:fs";
import { AuditStats } from "../../../type/struct/stats";
import { checkInlineSvelteDeclaration } from "../../check/inline-svelte-declaration";
import { checkComponentStateContract } from "../../check/component-state-contract";
import { checkInvalidCluster } from "../../check/invalid-cluster";
import { checkInvalidDataFile } from "../../check/invalid-data-file";
import { checkInvalidFileName } from "../../check/invalid-file-name";
import { checkInvalidJoint } from "../../check/invalid-joint";
import { checkInvalidTsExportPolicy } from "../../check/invalid-ts-export-policy";
import { checkInvalidStoryContent } from "../../check/invalid-story-content";
import { checkInvalidSvelteScript } from "../../check/invalid-svelte-script";
import { checkMissingComponentEntry } from "../../check/missing-component-entry";
import { checkMissingStateEntry } from "../../check/missing-state-entry";
import { checkMissingTestEntry } from "../../check/missing-test-entry";
import { FileNameRule } from "../../../type/struct/file-name-rule";

export async function validateDirectoryShape(
  currentDirectory: string,
  relativeDirectory: string,
  segments: string[],
  entries: fs.Dirent<string>[],
  clusterSet: Set<string>,
  dataExtensionSet: Set<string>,
  clusterJointMap: Map<string, Set<string>>,
  fileNameRule: FileNameRule,
  stats: AuditStats
): Promise<void> {
  await checkInvalidCluster(relativeDirectory, segments, clusterSet, stats);
  await checkInvalidJoint(relativeDirectory, segments, clusterJointMap, stats);
  await checkInvalidDataFile(relativeDirectory, segments, entries, dataExtensionSet, stats);
  await checkInvalidFileName(relativeDirectory, segments, entries, fileNameRule, stats);
  await checkInvalidTsExportPolicy(currentDirectory, relativeDirectory, segments, entries, stats);
  await checkMissingComponentEntry(relativeDirectory, segments, entries, stats);
  await checkMissingStateEntry(relativeDirectory, segments, entries, stats);
  await checkMissingTestEntry(relativeDirectory, segments, entries, stats);
  await checkComponentStateContract(currentDirectory, relativeDirectory, segments, entries, stats);
  await checkInvalidStoryContent(currentDirectory, relativeDirectory, segments, entries, stats);
  await checkInvalidSvelteScript(currentDirectory, relativeDirectory, segments, entries, stats);
  await checkInlineSvelteDeclaration(currentDirectory, relativeDirectory, segments, entries, stats);
}
