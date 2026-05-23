import { AuditError } from "../../../const/object/error";

export type AuditViolation = {
  ruleId: string;
  message: string;
  relativePath: string;
  severity: "error" | "warning";
  recommendation: string;
};
