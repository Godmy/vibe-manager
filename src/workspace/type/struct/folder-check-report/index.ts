import { FolderCheckEntry } from "../folder-check-entry";

export type FolderCheckReport = {
  workspaceName: string;
  checkedAt: string;
  folders: FolderCheckEntry[];
};
