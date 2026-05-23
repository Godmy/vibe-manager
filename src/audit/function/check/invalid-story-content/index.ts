import * as fs from "node:fs";
import { ERROR } from "../../../const/object/error";
import { ERROR_MESSAGE } from "../../../const/object/error-message";
import { AuditStats } from "../../../type/struct/stats";
import { createAuditViolation } from "../../script/create-audit-violation";
import { joinRelativePath } from "../../script/join-relative-path";

export async function checkInvalidStoryContent(
  currentDirectory: string,
  relativeDirectory: string,
  segments: string[],
  entries: fs.Dirent[],
  stats: AuditStats
): Promise<void> {
  if (segments.length < 4 || segments[1] !== "component") {
    return;
  }

  const storyEntry = entries.find((entry) => entry.isFile() && entry.name === "index.story.svelte");

  if (!storyEntry) {
    return;
  }

  const storyFilePath = joinRelativePath(currentDirectory, storyEntry.name);
  const fullContent = await fs.promises.readFile(storyFilePath, "utf8");

  if (/<Story[\s/>]/.test(fullContent)) {
    return;
  }

  stats.violations.push(
    await createAuditViolation(
      ERROR.INVALID_STORY_CONTENT,
      ERROR_MESSAGE[ERROR.INVALID_STORY_CONTENT],
      joinRelativePath(relativeDirectory, storyEntry.name),
      "error"
    )
  );
}
