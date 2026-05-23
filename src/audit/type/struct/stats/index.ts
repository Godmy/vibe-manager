import { AuditRecommendation } from "../recommendation";
import { AuditViolation } from "../violation";

export type AuditStats = {
  directoriesScanned: number;
  filesScanned: number;
  recommendations: AuditRecommendation[];
  violations: AuditViolation[];
};
