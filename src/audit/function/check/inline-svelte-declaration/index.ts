import * as fs from "node:fs";
import {
  ERROR
} from "../../../const/object/error";
import { ERROR_MESSAGE } from "../../../const/object/error-message";
import { AuditStats } from "../../../type/struct/stats";
import { createAuditViolation } from "../../create/audit-violation";
import { countBraceDelta } from "../../count/brace-delta";
import { hasSvelteStateFunction } from "../../has/svelte-function-use-state";
import { extractSvelteManagerImportNameList } from "../../extract/svelte-manager-import-name-list";
import { formatErrorMessage } from "../../format/error-message";
import { hasSvelteImport } from "../../has/svelte-import";
import { isHardcodedSvelteValue } from "../../is/hardcoded-svelte-value";
import { isManagerBasedSvelteConst } from "../../is/manager-based-svelte-const";
import { isSvelteContextConst } from "../../is/svelte-context-const";
import { isSvelteDispatchConst } from "../../is/svelte-dispatch-const";
import { joinRelativePath } from "../../join/relative-path";
import { readSvelteScriptContent } from "../../read/svelte-script-content";
import { toAuditRecommendation } from "../../to/audit-recommendation";

const SVELTE_RUNE_PREFIX_LIST = [
  "$props",
  "$derived",
  "$state",
  "$effect",
  "$bindable",
  "$inspect",
  "$host"
];

export async function checkInlineSvelteDeclaration(
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
  const scriptContent = readSvelteScriptContent(fullContent);

  if (!scriptContent) {
    return;
  }

  const relativeFilePath = joinRelativePath(relativeDirectory, svelteEntry.name);
  const lineList = scriptContent.split(/\r?\n/);
  const hasGetContextImport = hasSvelteImport(scriptContent, "getContext");
  const hasCreateEventDispatcherImport = hasSvelteImport(
    scriptContent,
    "createEventDispatcher"
  );
  const managerImportNameList = extractSvelteManagerImportNameList(scriptContent);
  let braceDepth = 0;

  for (const [index, line] of lineList.entries()) {
    const trimmedLine = line.trim();
    const lineNumber = index + 1;

    if (
      !trimmedLine ||
      trimmedLine.startsWith("//") ||
      trimmedLine.startsWith("/*") ||
      trimmedLine.startsWith("*") ||
      trimmedLine.startsWith("import ")
    ) {
      braceDepth += countBraceDelta(trimmedLine);
      braceDepth = Math.max(0, braceDepth);
      continue;
    }

    if (braceDepth === 0) {
      if (trimmedLine.startsWith("const ") && trimmedLine.includes("=")) {
        const rest = trimmedLine.slice("const ".length);
        const constName = rest.split("=")[0]?.split(":")[0]?.trim() ?? "";
        const rightHandSide = rest.split("=").slice(1).join("=").trim();
        const isDestructured = rest.startsWith("{") || rest.startsWith("[");
        const isStateConst = constName === "state";
        const isRuneBased = SVELTE_RUNE_PREFIX_LIST.some((prefix) => rightHandSide.startsWith(prefix));
        const isHardcodedValue = isHardcodedSvelteValue(rightHandSide);
        const isContextConst = isSvelteContextConst(rightHandSide, hasGetContextImport);
        const isDispatchConst = isSvelteDispatchConst(
          rightHandSide,
          hasCreateEventDispatcherImport
        );
        const isManagerBasedConst = isManagerBasedSvelteConst(
          rightHandSide,
          managerImportNameList
        );

        if (
          !isDestructured &&
          !isStateConst &&
          !isRuneBased &&
          !isHardcodedValue &&
          !isContextConst &&
          !isDispatchConst &&
          !isManagerBasedConst &&
          constName
        ) {
          stats.recommendations.push(
            toAuditRecommendation(segments, relativeFilePath, "const", constName, lineNumber)
          );
          stats.violations.push(
            await createAuditViolation(
              ERROR.INLINE_SVELTE_CONST,
              formatErrorMessage(ERROR_MESSAGE[ERROR.INLINE_SVELTE_CONST], {
                name: constName
              }),
              relativeFilePath,
              {
                name: constName,
                recommendedRelativePath:
                  stats.recommendations[stats.recommendations.length - 1]?.recommendedRelativePath ?? ""
              }
            )
          );
        }
      } else if (trimmedLine.startsWith("type ") && trimmedLine.includes("=")) {
        const typeName = trimmedLine.slice("type ".length).split("=")[0]?.trim() ?? "";

        if (typeName) {
          stats.recommendations.push(
            toAuditRecommendation(segments, relativeFilePath, "type", typeName, lineNumber)
          );
          stats.violations.push(
            await createAuditViolation(
              ERROR.INLINE_SVELTE_TYPE,
              formatErrorMessage(ERROR_MESSAGE[ERROR.INLINE_SVELTE_TYPE], { name: typeName }),
              relativeFilePath,
              {
                name: typeName,
                recommendedRelativePath:
                  stats.recommendations[stats.recommendations.length - 1]?.recommendedRelativePath ?? ""
              }
            )
          );
        }
      } else if (trimmedLine.startsWith("interface ") && trimmedLine.includes("{")) {
        const interfaceName =
          trimmedLine.slice("interface ".length).split("{")[0]?.split("extends")[0]?.trim() ?? "";

        if (interfaceName) {
          stats.recommendations.push(
            toAuditRecommendation(
              segments,
              relativeFilePath,
              "interface",
              interfaceName,
              lineNumber
            )
          );
          stats.violations.push(
            await createAuditViolation(
              ERROR.INLINE_SVELTE_INTERFACE,
              formatErrorMessage(ERROR_MESSAGE[ERROR.INLINE_SVELTE_INTERFACE], {
                name: interfaceName
              }),
              relativeFilePath,
              {
                name: interfaceName,
                recommendedRelativePath:
                  stats.recommendations[stats.recommendations.length - 1]?.recommendedRelativePath ?? ""
              }
            )
          );
        }
      } else if (
        trimmedLine.startsWith("function ") ||
        trimmedLine.startsWith("async function ")
      ) {
        const functionName = trimmedLine
          .replace("async ", "")
          .slice("function ".length)
          .split("(")[0]
          ?.split("<")[0]
          ?.trim() ?? "";

        if (functionName && !hasSvelteStateFunction(lineList, index)) {
          stats.recommendations.push(
            toAuditRecommendation(
              segments,
              relativeFilePath,
              "function",
              functionName,
              lineNumber
            )
          );
          stats.violations.push(
            await createAuditViolation(
              ERROR.INLINE_SVELTE_FUNCTION,
              formatErrorMessage(ERROR_MESSAGE[ERROR.INLINE_SVELTE_FUNCTION], {
                name: functionName
              }),
              relativeFilePath,
              {
                name: functionName,
                recommendedRelativePath:
                  stats.recommendations[stats.recommendations.length - 1]?.recommendedRelativePath ?? ""
              }
            )
          );
        }
      }
    }

    braceDepth += countBraceDelta(trimmedLine);
    braceDepth = Math.max(0, braceDepth);
  }
}
