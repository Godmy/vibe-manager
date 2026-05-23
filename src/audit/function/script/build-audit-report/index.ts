import * as path from "node:path";
import { AuditReport } from "../../../type/struct/report";
import { AuditRecommendation } from "../../../type/struct/recommendation";
import { AuditTarget } from "../../../type/struct/target";
import { AuditViolation } from "../../../type/struct/violation";

export function buildAuditReport(
  workspaceRoot: string,
  targets: AuditTarget[]
): AuditReport {
  const violationCountByRuleId: Record<string, number> = {};
  const violationListByRuleId: Record<string, AuditViolation[]> = {};
  const recommendationCountByEntityType: Record<string, number> = {};
  const recommendationListBySourcePath: Record<string, AuditRecommendation[]> = {};
  const recommendations: AuditRecommendation[] = [];
  const violationListBySeverity: Record<"error" | "warning", AuditViolation[]> = {
    error: [],
    warning: []
  };

  for (const target of targets) {
    for (const [ruleId, violationCount] of Object.entries(target.violationCountByRuleId)) {
      violationCountByRuleId[ruleId] = (violationCountByRuleId[ruleId] ?? 0) + violationCount;
    }

    for (const [ruleId, violationList] of Object.entries(target.violationListByRuleId)) {
      violationListByRuleId[ruleId] ??= [];
      violationListByRuleId[ruleId].push(...violationList);
    }

    for (const [entityType, recommendationCount] of Object.entries(
      target.recommendationCountByEntityType
    )) {
      recommendationCountByEntityType[entityType] =
        (recommendationCountByEntityType[entityType] ?? 0) + recommendationCount;
    }

    for (const [sourceRelativePath, recommendationList] of Object.entries(
      target.recommendationListBySourcePath
    )) {
      recommendationListBySourcePath[sourceRelativePath] ??= [];
      recommendationListBySourcePath[sourceRelativePath].push(...recommendationList);
    }

    recommendations.push(...target.recommendations);
    violationListBySeverity.error.push(...target.violationListBySeverity.error);
    violationListBySeverity.warning.push(...target.violationListBySeverity.warning);
  }

  return {
    workspaceName: path.basename(workspaceRoot),
    checkedAt: new Date().toISOString(),
    violationCount: targets.reduce((total, target) => total + target.violationCount, 0),
    errorCount: targets.reduce((total, target) => total + target.errorCount, 0),
    warningCount: targets.reduce((total, target) => total + target.warningCount, 0),
    violationCountByRuleId,
    violationListByRuleId,
    violationListBySeverity,
    recommendationCount: recommendations.length,
    recommendationCountByEntityType,
    recommendationListBySourcePath,
    recommendations,
    targets
  };
}
