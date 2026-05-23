import { AuditViolation } from "../../../type/struct/violation";

export function groupViolationByRuleId(
  violationList: AuditViolation[]
): Record<string, AuditViolation[]> {
  const violationListByRuleId: Record<string, AuditViolation[]> = {};

  for (const violation of violationList) {
    violationListByRuleId[violation.ruleId] ??= [];
    violationListByRuleId[violation.ruleId].push(violation);
  }

  return violationListByRuleId;
}
