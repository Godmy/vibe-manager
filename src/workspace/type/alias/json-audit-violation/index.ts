import { AuditViolation } from "../../../../audit/type/struct/violation";

export type JsonAuditViolation = Omit<AuditViolation, "ruleId">;
