import * as path from "node:path";
import { AuditReport } from "../../../../audit/type/struct/report";
import { formatReportTimestamp } from "../format-report-timestamp";

export type ReportOutputPaths = {
  reportDirectoryPath: string;
  jsonReportPath: string;
  markdownReportPath: string;
};

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
