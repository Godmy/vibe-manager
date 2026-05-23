import { AuditViolation } from "../../../type/struct/violation";

export function countViolationByRuleId(
  violationList: AuditViolation[]
): Record<string, number> {
  const violationCountByRuleId: Record<string, number> = {};

  for (const violation of violationList) {
    violationCountByRuleId[violation.ruleId] =
      (violationCountByRuleId[violation.ruleId] ?? 0) + 1;
  }

  return violationCountByRuleId;
}
