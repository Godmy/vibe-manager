import { AuditRecommendation } from "../../../../audit/type/struct/recommendation";
import { AuditReport } from "../../../../audit/type/struct/report";
import { AuditTarget } from "../../../../audit/type/struct/target";
import { AuditViolation } from "../../../../audit/type/struct/violation";

type JsonAuditViolation = Omit<AuditViolation, "ruleId">;

type JsonAuditTarget = Omit<
  AuditTarget,
  "violationListByRuleId" | "violations"
> & {
  violationListByRuleId: Record<string, JsonAuditViolation[]>;
  violations: JsonAuditViolation[];
};

type JsonAuditReport = Omit<
  AuditReport,
  "violationListByRuleId" | "targets"
> & {
  violationListByRuleId: Record<string, JsonAuditViolation[]>;
  targets: JsonAuditTarget[];
};

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

function mapTarget(target: AuditTarget): JsonAuditTarget {
  return {
    targetPath: target.targetPath,
    resolvedPath: target.resolvedPath,
    directoriesScanned: target.directoriesScanned,
    filesScanned: target.filesScanned,
    errorCount: target.errorCount,
    violationCountByRuleId: target.violationCountByRuleId,
    violationListByRuleId: mapViolationListRecord(target.violationListByRuleId),
    recommendationCount: target.recommendationCount,
    recommendationCountByEntityType: target.recommendationCountByEntityType,
    recommendationListBySourcePath: target.recommendationListBySourcePath,
    recommendations: target.recommendations.map(cloneRecommendation),
    violations: target.violations.map(mapViolation)
  };
}

function mapViolationListRecord(
  record: Record<string, AuditViolation[]>
): Record<string, JsonAuditViolation[]> {
  const mappedRecord: Record<string, JsonAuditViolation[]> = {};

  for (const [ruleId, violationList] of Object.entries(record)) {
    mappedRecord[ruleId] = violationList.map(mapViolation);
  }

  return mappedRecord;
}

function mapViolation(violation: AuditViolation): JsonAuditViolation {
  return {
    error: violation.error,
    message: violation.message,
    relativePath: violation.relativePath,
    recommendation: violation.recommendation
  };
}

function cloneRecommendation(recommendation: AuditRecommendation): AuditRecommendation {
  return {
    entityType: recommendation.entityType,
    name: recommendation.name,
    line: recommendation.line,
    sourceRelativePath: recommendation.sourceRelativePath,
    recommendedRelativePath: recommendation.recommendedRelativePath,
    reason: recommendation.reason
  };
}
