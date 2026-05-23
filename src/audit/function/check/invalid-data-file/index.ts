import * as fs from "node:fs";
import * as path from "node:path";
import { ERROR } from "../../../const/object/error";
import { ERROR_MESSAGE } from "../../../const/object/error-message";
import { AuditStats } from "../../../type/struct/stats";
import { createAuditViolation } from "../../script/create-audit-violation";
import { formatMessageTemplate } from "../../script/format-message-template";
import { joinRelativePath } from "../../script/join-relative-path";

export async function checkInvalidDataFile(
  relativeDirectory: string,
  segments: string[],
  entries: fs.Dirent[],
  dataExtensionSet: Set<string>,
  stats: AuditStats
): Promise<void> {
  if (segments.length < 4 || segments[1] !== "data") {
    return;
  }

  const files = entries.filter((entry) => entry.isFile()).map((entry) => entry.name);

  for (const fileName of files) {
    if (!dataExtensionSet.has(path.extname(fileName).toLowerCase())) {
      stats.violations.push(
        await createAuditViolation(
          ERROR.INVALID_DATA_FILE,
          formatMessageTemplate(ERROR_MESSAGE[ERROR.INVALID_DATA_FILE], { fileName }),
          joinRelativePath(relativeDirectory, fileName),
          "error"
        )
      );
    }
  }
}
