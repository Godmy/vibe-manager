import { ERROR } from "../../../const/object/error";
import { ERROR_MESSAGE } from "../../../const/object/error-message";
import { AuditStats } from "../../../type/struct/stats";
import { createAuditViolation } from "../../create/audit-violation";
import { formatErrorMessage } from "../../format/error-message";
import { formatAllowedValueList } from "../../format/allowed-value-list";

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
    const allowedClusterList = formatAllowedValueList(clusterSet);

    stats.violations.push(
      await createAuditViolation(
        ERROR.INVALID_CLUSTER,
        formatErrorMessage(ERROR_MESSAGE[ERROR.INVALID_CLUSTER], { cluster }),
        relativeDirectory,
        {
          cluster,
          allowedClusterList
        }
      )
    );
  }
}
