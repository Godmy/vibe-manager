import * as path from "node:path";
import { AuditReport } from "../../../../audit/type/struct/report";
import { ReportOutputPaths } from "../../../type/struct/report-output-paths";
import { formatReportTimestamp } from "../format-report-timestamp";

export function buildReportOutputPaths(
  configuredOutputFolder: string,
  report: AuditReport
): ReportOutputPaths {
  const reportDirectoryPath = path.join(
    configuredOutputFolder,
    formatReportTimestamp(report.checkedAt)
  );

  return {
    reportDirectoryPath,
    jsonReportPath: path.join(reportDirectoryPath, "samo-analize.json"),
    markdownReportPath: path.join(reportDirectoryPath, "samo-analize.md")
  };
}
