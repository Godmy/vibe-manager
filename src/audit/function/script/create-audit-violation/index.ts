import { AuditSeverity } from "../../../type/enum/severity";
import { AuditViolation } from "../../../type/struct/violation";
import { AuditError } from "../../../const/object/error";
import { ERROR_RECOMMENDATION } from "../../../const/object/error-recommendation";
import { toKebabCase } from "../to-kebab-case";

export function createAuditViolation(
  ruleId: AuditError,
  message: string,
  relativePath: string,
  severity: AuditSeverity
): AuditViolation {
  return {
    ruleId: toKebabCase(ruleId),
    message,
    relativePath,
    severity,
    recommendation: ERROR_RECOMMENDATION[ruleId]
  };
}
