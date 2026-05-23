import { ERROR } from "../../../const/object/error";
import { ERROR_MESSAGE } from "../../../const/object/error-message";
import { AuditStats } from "../../../type/struct/stats";
import { createAuditViolation } from "../../create/audit-violation";
import { formatErrorMessage } from "../../format/error-message";

export async function checkInvalidJoint(
  relativeDirectory: string,
  segments: string[],
  clusterJointMap: Map<string, Set<string>>,
  stats: AuditStats
): Promise<void> {
  if (segments.length !== 3) {
    return;
  }

  const cluster = segments[1];
  const joint = segments[2];
  const jointSet = clusterJointMap.get(cluster);

  if (jointSet && !jointSet.has(joint)) {
    const allowedJointList = formatAllowedValueList(jointSet);

    stats.violations.push(
      await createAuditViolation(
        ERROR.INVALID_JOINT,
        formatErrorMessage(ERROR_MESSAGE[ERROR.INVALID_JOINT], {
          joint,
          cluster
        }),
        relativeDirectory,
        {
          joint,
          cluster,
          allowedJointList
        }
      )
    );
  }
}

function formatAllowedValueList(valueSet: Set<string>): string {
  return Array.from(valueSet)
    .sort((left, right) => left.localeCompare(right))
    .map((value) => `'${value}'`)
    .join(", ");
}
