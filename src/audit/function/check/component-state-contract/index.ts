import * as fs from "node:fs";
import {
  ERROR
} from "../../../const/object/error";
import { ERROR_MESSAGE } from "../../../const/object/error-message";
import { AuditStats } from "../../../type/struct/stats";
import { createAuditViolation } from "../../script/create-audit-violation";
import { hasSvelteStateConst } from "../../script/has-svelte-state-const";
import { hasSvelteStateImport } from "../../script/has-svelte-state-import";
import { joinRelativePath } from "../../script/join-relative-path";
import { readSvelteScriptContent } from "../../script/read-svelte-script-content";
import { resolveSiblingStateDirectory } from "../../script/resolve-sibling-state-directory";

export async function checkComponentStateContract(
  currentDirectory: string,
  relativeDirectory: string,
  segments: string[],
  entries: fs.Dirent[],
  stats: AuditStats
): Promise<void> {
  if (segments.length < 4 || segments[1] !== "component") {
    return;
  }

  const siblingStateDirectory = resolveSiblingStateDirectory(currentDirectory, segments);

  if (!(await hasSiblingStateEntry(siblingStateDirectory))) {
    return;
  }

  const svelteEntry = entries.find((entry) => entry.isFile() && entry.name === "index.svelte");

  if (!svelteEntry) {
    return;
  }

  const svelteFilePath = joinRelativePath(currentDirectory, svelteEntry.name);
  const fullContent = await fs.promises.readFile(svelteFilePath, "utf8");
  const scriptContent = readSvelteScriptContent(fullContent);
  const relativeFilePath = joinRelativePath(relativeDirectory, svelteEntry.name);

  if (!scriptContent) {
    return;
  }

  if (!hasSvelteStateConst(scriptContent)) {
    stats.violations.push(
      await createAuditViolation(
        ERROR.MISSING_COMPONENT_STATE_CONST,
        ERROR_MESSAGE[ERROR.MISSING_COMPONENT_STATE_CONST],
        relativeFilePath,
        "error"
      )
    );
    return;
  }

  if (!hasSvelteStateImport(scriptContent)) {
    stats.violations.push(
      await createAuditViolation(
        ERROR.MISSING_COMPONENT_STATE_IMPORT,
        ERROR_MESSAGE[ERROR.MISSING_COMPONENT_STATE_IMPORT],
        relativeFilePath,
        "error"
      )
    );
  }
}

async function hasSiblingStateEntry(siblingStateDirectory: string): Promise<boolean> {
  try {
    const stat = await fs.promises.stat(siblingStateDirectory);

    if (!stat.isDirectory()) {
      return false;
    }
  } catch {
    return false;
  }

  return (
    fs.existsSync(joinRelativePath(siblingStateDirectory, "index.svelte.ts")) ||
    fs.existsSync(joinRelativePath(siblingStateDirectory, "index.ts"))
  );
}
