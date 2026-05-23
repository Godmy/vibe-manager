import { AuditSeverity } from "../../../type/enum/severity";
import { AuditViolation } from "../../../type/struct/violation";

export function groupViolationBySeverity(
  violationList: AuditViolation[]
): Record<AuditSeverity, AuditViolation[]> {
  return {
    error: violationList.filter((violation) => violation.severity === "error"),
    warning: violationList.filter((violation) => violation.severity === "warning")
  };
}
