import { AuditError } from "../../../const/object/error";

export type AuditViolation = {
  error: AuditError;
  ruleId: string;
  message: string;
  relativePath: string;
  recommendation: string;
};
