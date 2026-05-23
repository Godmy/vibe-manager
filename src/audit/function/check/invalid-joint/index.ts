import { ERROR } from "../../../const/object/error";
import { ERROR_MESSAGE } from "../../../const/object/error-message";
import { AuditStats } from "../../../type/struct/stats";
import { createAuditViolation } from "../../script/create-audit-violation";
import { formatMessageTemplate } from "../../script/format-message-template";

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
    stats.violations.push(
      await createAuditViolation(
        ERROR.INVALID_JOINT,
        formatMessageTemplate(ERROR_MESSAGE[ERROR.INVALID_JOINT], {
          joint,
          cluster
        }),
        relativeDirectory,
        "error"
      )
    );
  }
}
