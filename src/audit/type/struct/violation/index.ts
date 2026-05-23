import { AuditError } from "../../alias/audit-error";

export type AuditViolation = {
  error: AuditError;
  ruleId: string;
  message: string;
  relativePath: string;
  recommendation: string;
};
