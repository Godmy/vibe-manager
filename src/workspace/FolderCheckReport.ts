import { FolderCheckEntry } from "./FolderCheckEntry";

export type FolderCheckReport = {
  workspaceName: string;
  checkedAt: string;
  folders: FolderCheckEntry[];
};
