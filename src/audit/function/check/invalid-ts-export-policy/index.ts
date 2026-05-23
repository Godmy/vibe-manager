import * as fs from "node:fs";
import {
  ERROR
} from "../../../const/object/error";
import { ERROR_MESSAGE } from "../../../const/object/error-message";
import { AuditStats } from "../../../type/struct/stats";
import { countBraceDelta } from "../../count/brace-delta";
import { createAuditViolation } from "../../script/create-audit-violation";
import { formatMessageTemplate } from "../../script/format-message-template";
import { joinRelativePath } from "../../script/join-relative-path";

const EXPORT_KIND_BY_CLUSTER: Record<string, string> = {
  const: "const",
  type: "type",
  interface: "interface",
  class: "class",
  function: "function"
};

export async function checkInvalidTsExportPolicy(
  currentDirectory: string,
  relativeDirectory: string,
  segments: string[],
  entries: fs.Dirent[],
  stats: AuditStats
): Promise<void> {
  const cluster = segments[1];
  const expectedExportKind = EXPORT_KIND_BY_CLUSTER[cluster];

  if (segments.length < 2 || !expectedExportKind) {
    return;
  }

  const fileEntryList = entries.filter(
    (entry) =>
      entry.isFile() &&
      entry.name.endsWith(".ts") &&
      !entry.name.endsWith(".story.svelte")
  );

  for (const fileEntry of fileEntryList) {
    const relativeFilePath = joinRelativePath(relativeDirectory, fileEntry.name);
    const fullContent = await fs.promises.readFile(
      joinRelativePath(currentDirectory, fileEntry.name),
      "utf8"
    );
    const policyResult = inspectTsExportPolicy(fullContent, expectedExportKind);

    if (policyResult.exportCount === 0) {
      stats.violations.push(
        await createAuditViolation(
          ERROR.MISSING_TS_EXPORT,
          formatMessageTemplate(ERROR_MESSAGE[ERROR.MISSING_TS_EXPORT], {
            expectedExportKind,
            fileName: fileEntry.name
          }),
          relativeFilePath,
          "error"
        )
      );
    } else if (policyResult.exportCount > 1) {
      stats.violations.push(
        await createAuditViolation(
          ERROR.INVALID_TS_EXPORT_COUNT,
          formatMessageTemplate(ERROR_MESSAGE[ERROR.INVALID_TS_EXPORT_COUNT], {
            expectedExportKind,
            fileName: fileEntry.name
          }),
          relativeFilePath,
          "error"
        )
      );
    }

    if (policyResult.hasReexport) {
      stats.violations.push(
        await createAuditViolation(
          ERROR.INVALID_TS_REEXPORT,
          formatMessageTemplate(ERROR_MESSAGE[ERROR.INVALID_TS_REEXPORT], {
            fileName: fileEntry.name
          }),
          relativeFilePath,
          "error"
        )
      );
    }

    if (policyResult.hasInvalidExportKind) {
      stats.violations.push(
        await createAuditViolation(
          ERROR.INVALID_TS_EXPORT_KIND,
          formatMessageTemplate(ERROR_MESSAGE[ERROR.INVALID_TS_EXPORT_KIND], {
            expectedExportKind,
            fileName: fileEntry.name
          }),
          relativeFilePath,
          "error"
        )
      );
    }

    for (const declarationName of policyResult.hiddenDeclarationNameList) {
      stats.violations.push(
        await createAuditViolation(
          ERROR.INVALID_TS_HIDDEN_DECLARATION,
          formatMessageTemplate(ERROR_MESSAGE[ERROR.INVALID_TS_HIDDEN_DECLARATION], {
            declarationName,
            fileName: fileEntry.name
          }),
          relativeFilePath,
          "warning"
        )
      );
    }
  }
}

function inspectTsExportPolicy(
  fullContent: string,
  expectedExportKind: string
): {
  exportCount: number;
  hasReexport: boolean;
  hasInvalidExportKind: boolean;
  hiddenDeclarationNameList: string[];
} {
  const lineList = fullContent.split(/\r?\n/);
  const hiddenDeclarationNameList: string[] = [];
  let braceDepth = 0;
  let exportCount = 0;
  let hasReexport = false;
  let hasInvalidExportKind = false;

  for (const line of lineList) {
    const trimmedLine = line.trim();

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
      if (/^export\s+\{/.test(trimmedLine)) {
        exportCount += 1;
        hasReexport = true;
      } else if (isExpectedExportKind(trimmedLine, expectedExportKind)) {
        exportCount += 1;
      } else if (/^export\s+/.test(trimmedLine)) {
        exportCount += 1;
        hasInvalidExportKind = true;
      } else {
        const declarationName = extractTopLevelDeclarationName(trimmedLine);

        if (declarationName) {
          hiddenDeclarationNameList.push(declarationName);
        }
      }
    }

    braceDepth += countBraceDelta(trimmedLine);
    braceDepth = Math.max(0, braceDepth);
  }

  return {
    exportCount,
    hasReexport,
    hasInvalidExportKind,
    hiddenDeclarationNameList
  };
}

function isExpectedExportKind(trimmedLine: string, expectedExportKind: string): boolean {
  if (expectedExportKind === "function") {
    return /^export\s+(async\s+)?function\b/.test(trimmedLine);
  }

  return new RegExp(`^export\\s+${expectedExportKind}\\b`).test(trimmedLine);
}

function extractTopLevelDeclarationName(trimmedLine: string): string | null {
  const constMatch = trimmedLine.match(/^(const|let|var)\s+([A-Za-z_$][\w$]*)\b/);

  if (constMatch) {
    return constMatch[2];
  }

  const typeMatch = trimmedLine.match(/^type\s+([A-Za-z_$][\w$]*)\b/);

  if (typeMatch) {
    return typeMatch[1];
  }

  const interfaceMatch = trimmedLine.match(/^interface\s+([A-Za-z_$][\w$]*)\b/);

  if (interfaceMatch) {
    return interfaceMatch[1];
  }

  const classMatch = trimmedLine.match(/^class\s+([A-Za-z_$][\w$]*)\b/);

  if (classMatch) {
    return classMatch[1];
  }

  const functionMatch = trimmedLine.match(/^(async\s+)?function\s+([A-Za-z_$][\w$]*)\b/);

  if (functionMatch) {
    return functionMatch[2];
  }

  const enumMatch = trimmedLine.match(/^enum\s+([A-Za-z_$][\w$]*)\b/);

  if (enumMatch) {
    return enumMatch[1];
  }

  return null;
}
