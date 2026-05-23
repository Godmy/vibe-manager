export type AuditRecommendation = {
  entityType: "const" | "type" | "interface" | "function";
  name: string;
  line: number;
  sourceRelativePath: string;
  recommendedRelativePath: string;
  reason: string;
};
