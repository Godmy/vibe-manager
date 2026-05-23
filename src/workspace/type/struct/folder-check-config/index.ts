import { AuditCustomization } from "../../../../audit/type/struct/customization";

export type FolderCheckConfig = {
  folders: string[];
  outputFolder: string;
} & AuditCustomization;
