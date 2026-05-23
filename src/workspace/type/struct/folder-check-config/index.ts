import { AuditCustomization } from "../../../../audit/type/struct/customization";

export type FolderCheckConfig = {
  folders: string[];
  outputFile: string;
} & AuditCustomization;
