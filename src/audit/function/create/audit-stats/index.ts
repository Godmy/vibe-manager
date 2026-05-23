import { AuditStats } from "../../../type/struct/stats";

export function createAuditStats(): AuditStats {
  return {
    directoriesScanned: 0,
    filesScanned: 0,
    recommendations: [],
    violations: []
  };
}
