import * as assert from "node:assert/strict";
import { buildReportOutputPaths } from "../../workspace/function/script/build-report-output-paths";
import { createAuditReportJsonOutput } from "../../workspace/function/script/create-audit-report-json-output";
import { createAuditReportMarkdown } from "../../workspace/function/script/create-audit-report-markdown";
import { AuditReport } from "../../audit/type/struct/report";

function createReport(): AuditReport {
  return {
    workspaceName: "demo-workspace",
    checkedAt: "2026-05-23T12:34:56.000Z",
    errorCount: 1,
    violationCountByRuleId: {
      "invalid-cluster": 1
    },
    violationListByRuleId: {
      "invalid-cluster": [
        {
          error: "INVALID_CLUSTER",
          ruleId: "invalid-cluster",
          message: "Unknown cluster name.",
          relativePath: "theme/wrong-cluster/state/mode/index.ts",
          recommendation: "Rename the cluster."
        }
      ]
    },
    recommendationCount: 1,
    recommendationCountByEntityType: {
      function: 1
    },
    recommendationListBySourcePath: {
      "src/component/card/index.svelte": [
        {
          entityType: "function",
          name: "buildHelper",
          line: 2,
          sourceRelativePath: "src/component/card/index.svelte",
          recommendedRelativePath: "src/function/build/helper/index.ts",
          reason: "Inline declaration should be extracted."
        }
      ]
    },
    recommendations: [
      {
        entityType: "function",
        name: "buildHelper",
        line: 2,
        sourceRelativePath: "src/component/card/index.svelte",
        recommendedRelativePath: "src/function/build/helper/index.ts",
        reason: "Inline declaration should be extracted."
      }
    ],
    targets: [
      {
        targetPath: "src",
        resolvedPath: "D:/workspace/src",
        directoriesScanned: 3,
        filesScanned: 4,
        errorCount: 1,
        violationCountByRuleId: {
          "invalid-cluster": 1
        },
        violationListByRuleId: {
          "invalid-cluster": [
            {
              error: "INVALID_CLUSTER",
              ruleId: "invalid-cluster",
              message: "Unknown cluster name.",
              relativePath: "theme/wrong-cluster/state/mode/index.ts",
              recommendation: "Rename the cluster."
            }
          ]
        },
        recommendationCount: 1,
        recommendationCountByEntityType: {
          function: 1
        },
        recommendationListBySourcePath: {
          "src/component/card/index.svelte": [
            {
              entityType: "function",
              name: "buildHelper",
              line: 2,
              sourceRelativePath: "src/component/card/index.svelte",
              recommendedRelativePath: "src/function/build/helper/index.ts",
              reason: "Inline declaration should be extracted."
            }
          ]
        },
        recommendations: [
          {
            entityType: "function",
            name: "buildHelper",
            line: 2,
            sourceRelativePath: "src/component/card/index.svelte",
            recommendedRelativePath: "src/function/build/helper/index.ts",
            reason: "Inline declaration should be extracted."
          }
        ],
        violations: [
          {
            error: "INVALID_CLUSTER",
            ruleId: "invalid-cluster",
            message: "Unknown cluster name.",
            relativePath: "theme/wrong-cluster/state/mode/index.ts",
            recommendation: "Rename the cluster."
          }
        ]
      }
    ]
  };
}

describe("ReportOutput", () => {
  it("builds timestamped sibling paths for reports", () => {
    const report = createReport();
    const expectedTimestamp = "20260523-1534";

    const outputPaths = buildReportOutputPaths(
      "D:/workspace/reports",
      report
    );

    assert.equal(outputPaths.reportDirectoryPath, `D:\\workspace\\reports\\${expectedTimestamp}`);
    assert.equal(
      outputPaths.jsonReportPath,
      `D:\\workspace\\reports\\${expectedTimestamp}\\samo-analize.json`
    );
    assert.equal(
      outputPaths.markdownReportPath,
      `D:\\workspace\\reports\\${expectedTimestamp}\\samo-analize.md`
    );
  });

  it("creates readable markdown next to json output", () => {
    const markdown = createAuditReportMarkdown(
      createReport(),
      "D:/workspace",
      "D:/workspace/reports/20260523-1534"
    );

    assert.match(markdown, /# Structural Audit Report/);
    assert.match(markdown, /Workspace: `demo-workspace`/);
    assert.match(markdown, /## Target: `src`/);
    assert.match(markdown, /- Errors: 1/);
    assert.match(markdown, /\[INVALID_CLUSTER\]/);
    assert.doesNotMatch(markdown, /Violations/);
    assert.doesNotMatch(markdown, /Recommendations: 1/);
    assert.match(
      markdown,
      /\[`src\/theme\/wrong-cluster\/state\/mode\/index\.ts`\]\(\.\.\/\.\.\/src\/theme\/wrong-cluster\/state\/mode\/index\.ts\)/
    );
    assert.match(
      markdown,
      /Recommended path: \[`src\/function\/build\/helper\/index\.ts`\]\(\.\.\/\.\.\/src\/function\/build\/helper\/index\.ts\)/
    );
    assert.match(
      markdown,
      /\[`src\/component\/card\/index\.svelte:2`\]\(\.\.\/\.\.\/src\/component\/card\/index\.svelte#L2\)/
    );
  });

  it("creates json output with canonical error and without ruleId", () => {
    const jsonOutput = createAuditReportJsonOutput(createReport());
    const violation = jsonOutput.targets[0]?.violations[0];

    assert.equal(violation?.error, "INVALID_CLUSTER");
    assert.equal("ruleId" in (violation ?? {}), false);
    assert.equal("severity" in (violation ?? {}), false);
  });
});
