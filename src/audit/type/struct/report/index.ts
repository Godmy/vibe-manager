import { AuditRecommendation } from "../recommendation";
import { AuditViolation } from "../violation";
import { AuditTarget } from "../target";

export type AuditReport = {
  workspaceName: string;
  checkedAt: string;
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
  targets: AuditTarget[];
};
