import { AuditSeverity } from "../../../type/enum/severity";
import { AuditViolation } from "../../../type/struct/violation";

export function countViolationBySeverity(
  violationList: AuditViolation[],
  severity: AuditSeverity
): number {
  return violationList.filter((violation) => violation.severity === severity).length;
}
