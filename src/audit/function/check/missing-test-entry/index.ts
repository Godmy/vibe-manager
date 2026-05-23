import * as fs from "node:fs";
import { ERROR } from "../../../const/object/error";
import { ERROR_MESSAGE } from "../../../const/object/error-message";
import { AuditStats } from "../../../type/struct/stats";
import { createAuditViolation } from "../../create/audit-violation";
import { joinRelativePath } from "../../join/relative-path";

export async function checkMissingTestEntry(
  relativeDirectory: string,
  segments: string[],
  entries: fs.Dirent[],
  stats: AuditStats
): Promise<void> {
  if (segments.length < 4 || segments[1] !== "function" || segments[2] !== "test") {
    return;
  }

  const fileNameList = entries.filter((entry) => entry.isFile()).map((entry) => entry.name);

  if (fileNameList.includes("index.test.ts") || fileNameList.includes("index.ts")) {
    return;
  }

  stats.violations.push(
    await createAuditViolation(
      ERROR.MISSING_TEST_ENTRY,
      ERROR_MESSAGE[ERROR.MISSING_TEST_ENTRY],
      relativeDirectory,
      {
        primaryExpectedFilePath: joinRelativePath(relativeDirectory, "index.test.ts"),
        secondaryExpectedFilePath: joinRelativePath(relativeDirectory, "index.ts")
      }
    )
  );
}
