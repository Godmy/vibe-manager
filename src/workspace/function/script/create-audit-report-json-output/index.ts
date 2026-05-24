import { AuditReport } from "../../../../audit/type/struct/report";
import { JsonAuditReport } from "../../../type/alias/json-audit-report";
import { cloneRecommendation } from "../clone-recommendation";
import { mapTarget } from "../../transform/map-target";
import { mapViolationListRecord } from "../../transform/map-violation-list-record";

export function createAuditReportJsonOutput(report: AuditReport): JsonAuditReport {
  return {
    workspaceName: report.workspaceName,
    checkedAt: report.checkedAt,
    errorCount: report.errorCount,
    violationCountByRuleId: report.violationCountByRuleId,
    violationListByRuleId: mapViolationListRecord(report.violationListByRuleId),
    recommendationCount: report.recommendationCount,
    recommendationCountByEntityType: report.recommendationCountByEntityType,
    recommendationListBySourcePath: report.recommendationListBySourcePath,
    recommendations: report.recommendations.map(cloneRecommendation),
    targets: report.targets.map(mapTarget)
  };
}
