import { AuditTarget } from "../../../../audit/type/struct/target";
import { JsonAuditTarget } from "../../../type/alias/json-audit-target";
import { cloneRecommendation } from "../../script/clone-recommendation";
import { mapViolation } from "../map-violation";
import { mapViolationListRecord } from "../map-violation-list-record";

export function mapTarget(target: AuditTarget): JsonAuditTarget {
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
