import { ERROR } from "../../../const/object/error";
import { ERROR_MESSAGE } from "../../../const/object/error-message";
import { AuditStats } from "../../../type/struct/stats";
import { createAuditViolation } from "../../script/create-audit-violation";
import { formatMessageTemplate } from "../../script/format-message-template";

export async function checkInvalidCluster(
  relativeDirectory: string,
  segments: string[],
  clusterSet: Set<string>,
  stats: AuditStats
): Promise<void> {
  if (segments.length !== 2) {
    return;
  }

  const cluster = segments[1];

  if (!clusterSet.has(cluster)) {
    stats.violations.push(
      await createAuditViolation(
        ERROR.INVALID_CLUSTER,
        formatMessageTemplate(ERROR_MESSAGE[ERROR.INVALID_CLUSTER], { cluster }),
        relativeDirectory,
        "error"
      )
    );
  }
}
