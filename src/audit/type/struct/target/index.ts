import { AuditRecommendation } from "../recommendation";
import { AuditViolation } from "../violation";

export type AuditTarget = {
  targetPath: string;
  resolvedPath: string;
  directoriesScanned: number;
  filesScanned: number;
  violationCount: number;
  errorCount: number;
  warningCount: number;
  violationCountByRuleId: Record<string, number>;
  violationListByRuleId: Record<string, AuditViolation[]>;
  violationListBySeverity: Record<"error" | "warning", AuditViolation[]>;
  recommendationCount: number;
  recommendationCountByEntityType: Record<string, number>;
  recommendationListBySourcePath: Record<string, AuditRecommendation[]>;
  recommendations: AuditRecommendation[];
  violations: AuditViolation[];
};
