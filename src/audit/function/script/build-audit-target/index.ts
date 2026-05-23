import { AuditStats } from "../../../type/struct/stats";
import { AuditTarget } from "../../../type/struct/target";
import { countRecommendationByEntityType } from "../../count/recommendation-by-entity-type";
import { countViolationByRuleId } from "../../count/violation-by-rule-id";
import { countViolationBySeverity } from "../../count/violation-by-severity";
import { groupRecommendationBySourcePath } from "../group-recommendation-by-source-path";
import { groupViolationByRuleId } from "../group-violation-by-rule-id";
import { groupViolationBySeverity } from "../group-violation-by-severity";

export function buildAuditTarget(
  targetPath: string,
  resolvedPath: string,
  stats: AuditStats
): AuditTarget {
  return {
    targetPath,
    resolvedPath,
    directoriesScanned: stats.directoriesScanned,
    filesScanned: stats.filesScanned,
    violationCount: stats.violations.length,
    errorCount: countViolationBySeverity(stats.violations, "error"),
    warningCount: countViolationBySeverity(stats.violations, "warning"),
    violationCountByRuleId: countViolationByRuleId(stats.violations),
    violationListByRuleId: groupViolationByRuleId(stats.violations),
    violationListBySeverity: groupViolationBySeverity(stats.violations),
    recommendationCount: stats.recommendations.length,
    recommendationCountByEntityType: countRecommendationByEntityType(stats.recommendations),
    recommendationListBySourcePath: groupRecommendationBySourcePath(stats.recommendations),
    recommendations: stats.recommendations,
    violations: stats.violations
  };
}
