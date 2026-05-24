import { AuditTarget } from "../../../../audit/type/struct/target";
import { JsonAuditViolation } from "../json-audit-violation";

export type JsonAuditTarget = Omit<
  AuditTarget,
  "violationListByRuleId" | "violations"
> & {
  violationListByRuleId: Record<string, JsonAuditViolation[]>;
  violations: JsonAuditViolation[];
};
