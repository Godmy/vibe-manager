import * as path from "node:path";
import { AuditTarget } from "../../../type/struct/target";
import { FileNameRule } from "../../../type/struct/file-name-rule";
import { auditDirectory } from "../audit-directory";
import { buildAuditTarget } from "../build-audit-target";
import { createAuditStats } from "../create-audit-stats";

export async function auditTarget(
  workspaceRoot: string,
  targetPath: string,
  clusterSet: Set<string>,
  dataExtensionSet: Set<string>,
  clusterJointMap: Map<string, Set<string>>,
  fileNameRule: FileNameRule
): Promise<AuditTarget> {
  const resolvedPath = path.resolve(workspaceRoot, targetPath);
  const stats = createAuditStats();

  await auditDirectory(
    resolvedPath,
    resolvedPath,
    clusterSet,
    dataExtensionSet,
    clusterJointMap,
    fileNameRule,
    stats
  );

  return buildAuditTarget(targetPath, resolvedPath, stats);
}
