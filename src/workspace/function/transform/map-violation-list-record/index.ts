import { AuditViolation } from "../../../../audit/type/struct/violation";
import { JsonAuditViolation } from "../../../type/alias/json-audit-violation";
import { mapViolation } from "../map-violation";

export function mapViolationListRecord(
  record: Record<string, AuditViolation[]>
): Record<string, JsonAuditViolation[]> {
  const mappedRecord: Record<string, JsonAuditViolation[]> = {};

  for (const [ruleId, violationList] of Object.entries(record)) {
    mappedRecord[ruleId] = violationList.map(mapViolation);
  }

  return mappedRecord;
}
