import * as fs from "node:fs";
import { ERROR } from "../../../const/object/error";
import { ERROR_MESSAGE } from "../../../const/object/error-message";
import { FileNameRule } from "../../../type/struct/file-name-rule";
import { AuditStats } from "../../../type/struct/stats";
import { createAuditViolation } from "../../create/audit-violation";
import { formatErrorMessage } from "../../format/error-message";
import { formatAllowedValueList } from "../../format/allowed-value-list";
import { joinRelativePath } from "../../join/relative-path";

export async function checkInvalidFileName(
  relativeDirectory: string,
  segments: string[],
  entries: fs.Dirent[],
  fileNameRule: FileNameRule,
  stats: AuditStats
): Promise<void> {
  if (segments.length < 4 || segments[1] === "data") {
    return;
  }

  const joint = segments[2];
  const files = entries.filter((entry) => entry.isFile()).map((entry) => entry.name);
  const explicitAllowedFiles = fileNameRule.joint.get(joint);
  const allowedFiles = new Set<string>(fileNameRule.all);

  for (const fileName of explicitAllowedFiles ?? fileNameRule.other) {
    allowedFiles.add(fileName);
  }

  for (const fileName of files) {
    if (!allowedFiles.has(fileName)) {
      const allowedFileNameList = formatAllowedValueList(allowedFiles);

      stats.violations.push(
        await createAuditViolation(
          ERROR.INVALID_FILE_NAME,
          formatErrorMessage(ERROR_MESSAGE[ERROR.INVALID_FILE_NAME], {
            fileName,
            joint
          }),
          joinRelativePath(relativeDirectory, fileName),
          {
            fileName,
            joint,
            allowedFileNameList
          }
        )
      );
    }
  }
}
