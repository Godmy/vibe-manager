import { AuditViolation } from "../../../../audit/type/struct/violation";
import { JsonAuditViolation } from "../../../type/alias/json-audit-violation";

export function mapViolation(violation: AuditViolation): JsonAuditViolation {
  return {
    error: violation.error,
    message: violation.message,
    relativePath: violation.relativePath,
    recommendation: violation.recommendation
  };
}
