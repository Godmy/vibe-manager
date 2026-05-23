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
  }

  return {
    workspaceName: path.basename(workspaceRoot),
    checkedAt: new Date().toISOString(),
    errorCount: targets.reduce((total, target) => total + target.errorCount, 0),
    violationCountByRuleId,
    violationListByRuleId,
    recommendationCount: recommendations.length,
    recommendationCountByEntityType,
    recommendationListBySourcePath,
    recommendations,
    targets
  };
}
