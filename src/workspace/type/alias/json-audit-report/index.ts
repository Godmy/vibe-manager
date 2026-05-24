import { AuditReport } from "../../../../audit/type/struct/report";
import { JsonAuditViolation } from "../json-audit-violation";
import { JsonAuditTarget } from "../json-audit-target";

export type JsonAuditReport = Omit<
  AuditReport,
  "violationListByRuleId" | "targets"
> & {
  violationListByRuleId: Record<string, JsonAuditViolation[]>;
  targets: JsonAuditTarget[];
};
