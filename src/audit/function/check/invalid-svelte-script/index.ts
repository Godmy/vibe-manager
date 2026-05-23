import * as fs from "node:fs";
import {
  ERROR
} from "../../../const/object/error";
import { ERROR_MESSAGE } from "../../../const/object/error-message";
import { AuditStats } from "../../../type/struct/stats";
import { createAuditViolation } from "../../create/audit-violation";
import { joinRelativePath } from "../../join/relative-path";
import { readSvelteScriptContent } from "../../read/svelte-script-content";

export async function checkInvalidSvelteScript(
  currentDirectory: string,
  relativeDirectory: string,
  segments: string[],
  entries: fs.Dirent[],
  stats: AuditStats
): Promise<void> {
  if (segments.length < 4 || segments[1] !== "component") {
    return;
  }

  const svelteEntry = entries.find((entry) => entry.isFile() && entry.name === "index.svelte");

  if (!svelteEntry) {
    return;
  }

  const svelteFilePath = joinRelativePath(currentDirectory, svelteEntry.name);
  const fullContent = await fs.promises.readFile(svelteFilePath, "utf8");
  const relativeFilePath = joinRelativePath(relativeDirectory, svelteEntry.name);

  if (!fullContent.includes("<script") || !fullContent.includes("</script>")) {
    stats.violations.push(
      await createAuditViolation(
        ERROR.INVALID_SVELTE_SCRIPT,
        ERROR_MESSAGE[ERROR.INVALID_SVELTE_SCRIPT],
        relativeFilePath
      )
    );
    return;
  }

  const scriptContent = readSvelteScriptContent(fullContent);

  if (!scriptContent) {
    stats.violations.push(
      await createAuditViolation(
        ERROR.INVALID_SVELTE_SCRIPT,
        ERROR_MESSAGE[ERROR.INVALID_SVELTE_SCRIPT],
        relativeFilePath
      )
    );
    return;
  }

  if (scriptContent.includes("export {") || scriptContent.includes("export{")) {
    stats.violations.push(
      await createAuditViolation(
        ERROR.INVALID_SVELTE_REEXPORT,
        ERROR_MESSAGE[ERROR.INVALID_SVELTE_REEXPORT],
        relativeFilePath
      )
    );
  }
}
