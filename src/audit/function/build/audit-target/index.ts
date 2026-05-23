import { AuditStats } from "../../../type/struct/stats";
import { AuditTarget } from "../../../type/struct/target";
import { countRecommendationByEntityType } from "../../count/recommendation-by-entity-type";
import { countViolationByRuleId } from "../../count/violation-by-rule-id";
import { groupRecommendationBySourcePath } from "../../group/recommendation-by-source-path";
import { groupViolationByRuleId } from "../../group/violation-by-rule-id";

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
    errorCount: stats.violations.length,
    violationCountByRuleId: countViolationByRuleId(stats.violations),
    violationListByRuleId: groupViolationByRuleId(stats.violations),
    recommendationCount: stats.recommendations.length,
    recommendationCountByEntityType: countRecommendationByEntityType(stats.recommendations),
    recommendationListBySourcePath: groupRecommendationBySourcePath(stats.recommendations),
    recommendations: stats.recommendations,
    violations: stats.violations
  };
}
