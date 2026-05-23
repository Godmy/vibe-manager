import * as fs from "node:fs";
import * as path from "node:path";
import { AuditStats } from "../../../type/struct/stats";
import { FileNameRule } from "../../../type/struct/file-name-rule";
import { toRelativeDirectory } from "../../to/relative-directory";
import { toRelativeSegmentList } from "../../to/relative-segment-list";
import { validateDirectoryShape } from "../validate-directory-shape";

export async function auditDirectory(
  targetRoot: string,
  targetPath: string,
  currentDirectory: string,
  clusterSet: Set<string>,
  dataExtensionSet: Set<string>,
  clusterJointMap: Map<string, Set<string>>,
  fileNameRule: FileNameRule,
  stats: AuditStats
): Promise<void> {
  stats.directoriesScanned += 1;

  const entries = await fs.promises.readdir(currentDirectory, { withFileTypes: true });
  const relativeDirectory = toRelativeDirectory(targetRoot, currentDirectory);
  const segments = toRelativeSegmentList(relativeDirectory);

  await validateDirectoryShape(
    targetPath,
    currentDirectory,
    relativeDirectory,
    segments,
    entries,
    clusterSet,
    dataExtensionSet,
    clusterJointMap,
    fileNameRule,
    stats
  );

  for (const entry of entries) {
    const entryPath = path.join(currentDirectory, entry.name);

    if (entry.isDirectory()) {
      await auditDirectory(
        targetRoot,
        targetPath,
        entryPath,
        clusterSet,
        dataExtensionSet,
        clusterJointMap,
        fileNameRule,
        stats
      );
      continue;
    }

    if (entry.isFile()) {
      stats.filesScanned += 1;
    }
  }
}
