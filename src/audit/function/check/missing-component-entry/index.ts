import * as fs from "node:fs";
import { ERROR } from "../../../const/object/error";
import { ERROR_MESSAGE } from "../../../const/object/error-message";
import { AuditStats } from "../../../type/struct/stats";
import { createAuditViolation } from "../../create/audit-violation";
import { formatErrorMessage } from "../../format/error-message";

export async function checkMissingComponentEntry(
  relativeDirectory: string,
  segments: string[],
  entries: fs.Dirent[],
  stats: AuditStats
): Promise<void> {
  if (segments.length < 4 || segments[1] !== "component") {
    return;
  }

  const joint = segments[2];
  const fileNameList = entries.filter((entry) => entry.isFile()).map((entry) => entry.name);

  if (!fileNameList.includes("index.ts")) {
    const expectedFilePath = `${relativeDirectory}/index.ts`;

    stats.violations.push(
      await createAuditViolation(
        ERROR.MISSING_COMPONENT_BARREL,
        formatErrorMessage(ERROR_MESSAGE[ERROR.MISSING_COMPONENT_BARREL], { joint }),
        relativeDirectory,
        {
          expectedFilePath
        }
      )
    );
  }

  if (!fileNameList.includes("index.svelte")) {
    const expectedFilePath = `${relativeDirectory}/index.svelte`;

    stats.violations.push(
      await createAuditViolation(
        ERROR.MISSING_COMPONENT_SVELTE,
        formatErrorMessage(ERROR_MESSAGE[ERROR.MISSING_COMPONENT_SVELTE], { joint }),
        relativeDirectory,
        {
          expectedFilePath
        }
      )
    );
  }
}
