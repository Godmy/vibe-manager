import * as path from "node:path";
import { AuditRecommendation } from "../../../../audit/type/struct/recommendation";
import { AuditReport } from "../../../../audit/type/struct/report";
import { AuditViolation } from "../../../../audit/type/struct/violation";

export function createAuditReportMarkdown(
  report: AuditReport,
  workspaceRoot: string,
  reportDirectoryPath: string
): string {
  const lineList: string[] = [
    "# Structural Audit Report",
    "",
    `- Workspace: \`${report.workspaceName}\``,
    `- Checked at: \`${report.checkedAt}\``,
    `- Targets: ${report.targets.length}`,
    `- Errors: ${report.errorCount}`,
    ""
  ];

  for (const target of report.targets) {
    lineList.push(`## Target: \`${target.targetPath}\``);
    lineList.push("");
    lineList.push(`- Resolved path: \`${target.resolvedPath}\``);
    lineList.push(`- Directories scanned: ${target.directoriesScanned}`);
    lineList.push(`- Files scanned: ${target.filesScanned}`);
    lineList.push(`- Errors: ${target.errorCount}`);
    lineList.push("");

    if (target.violations.length > 0) {
      lineList.push("### Errors");
      lineList.push("");

      for (const violation of target.violations) {
        lineList.push(
          formatViolation(
            violation,
            target.targetPath,
            workspaceRoot,
            reportDirectoryPath
          )
        );
      }

      lineList.push("");
    }

    if (target.recommendations.length > 0) {
      lineList.push("### Recommendations");
      lineList.push("");

      for (const recommendation of target.recommendations) {
        lineList.push(formatRecommendation(recommendation, workspaceRoot, reportDirectoryPath));
      }

      lineList.push("");
    }
  }

  return `${lineList.join("\n").trimEnd()}\n`;
}

function formatViolation(
  violation: AuditViolation,
  targetPath: string,
  workspaceRoot: string,
  reportDirectoryPath: string
): string {
  const workspaceRelativePath = toWorkspaceRelativePath(targetPath, violation.relativePath);
  const sourceLink = createWorkspaceFileLink(
    workspaceRelativePath,
    workspaceRoot,
    reportDirectoryPath
  );

  return [
    `- [${toMarkdownRuleLabel(violation.ruleId)}] in [\`${workspaceRelativePath}\`](${sourceLink})`,
    `  - Message: ${violation.message}`,
    `  - Recommendation: ${violation.recommendation}`
  ].join("\n");
}

function formatRecommendation(
  recommendation: AuditRecommendation,
  workspaceRoot: string,
  reportDirectoryPath: string
): string {
  const sourceLink = createWorkspaceFileLink(
    recommendation.sourceRelativePath,
    workspaceRoot,
    reportDirectoryPath,
    recommendation.line
  );
  const recommendedLink = createWorkspaceFileLink(
    recommendation.recommendedRelativePath,
    workspaceRoot,
    reportDirectoryPath
  );

  return [
    `- Move \`${recommendation.name}\` (${recommendation.entityType}) from [\`${recommendation.sourceRelativePath}:${recommendation.line}\`](${sourceLink})`,
    `  - Recommended path: [\`${recommendation.recommendedRelativePath}\`](${recommendedLink})`,
    `  - Reason: ${recommendation.reason}`
  ].join("\n");
}

function createWorkspaceFileLink(
  relativePath: string,
  workspaceRoot: string,
  reportDirectoryPath: string,
  line?: number
): string {
  const absoluteTargetPath = path.join(workspaceRoot, ...relativePath.split("/"));
  const relativeLinkPath = path.relative(reportDirectoryPath, absoluteTargetPath);
  const normalizedLinkPath = relativeLinkPath.split(path.sep).join("/");

  if (line === undefined) {
    return encodeURI(normalizedLinkPath);
  }

  return `${encodeURI(normalizedLinkPath)}#L${line}`;
}

function toWorkspaceRelativePath(targetPath: string, itemRelativePath: string): string {
  if (itemRelativePath === ".") {
    return targetPath;
  }

  return path.posix.join(targetPath.split(path.sep).join("/"), itemRelativePath);
}

function toMarkdownRuleLabel(ruleId: string): string {
  return ruleId.replace(/-/g, "_").toUpperCase();
}
