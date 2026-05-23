import { AuditViolation } from "../../../type/struct/violation";
import { AuditError } from "../../../const/object/error";
import { ERROR_RECOMMENDATION } from "../../../const/object/error-recommendation";
import { formatErrorMessage } from "../../format/error-message";
import { toKebabCase } from "../../to/kebab-case";

export function createAuditViolation(
  ruleId: AuditError,
  message: string,
  relativePath: string,
  recommendationValueByToken?: Record<string, string>
): AuditViolation {
  return {
    error: ruleId,
    ruleId: toKebabCase(ruleId),
    message,
    relativePath,
    recommendation: formatErrorMessage(
      ERROR_RECOMMENDATION[ruleId],
      recommendationValueByToken ?? {}
    )
  };
}
