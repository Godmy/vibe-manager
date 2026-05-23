import { AuditReport } from "../../../type/struct/report";
import { AuditCustomization } from "../../../type/struct/customization";
import { auditTarget } from "../../../function/script/audit-target";
import { buildAuditReport } from "../../../function/script/build-audit-report";
import { mergeCluster } from "../../../function/merge/cluster";
import { mergeDataExtension } from "../../../function/merge/data-extension";
import { mergeClusterJoint } from "../../../function/merge/cluster-joint";
import { mergeJointFileName } from "../../../function/merge/joint-file-name";

export class StructuralAudit {
  public async createReport(
    workspaceRoot: string,
    selectedFolders: string[],
    customization: AuditCustomization = createEmptyAuditCustomization()
  ): Promise<AuditReport> {
    const clusterSet = mergeCluster(customization.customClusterList);
    const dataExtensionSet = mergeDataExtension(customization.customDataExtensionList);
    const clusterJointMap = mergeClusterJoint(customization);
    const fileNameRule = mergeJointFileName(customization);
    const targets = await Promise.all(
      selectedFolders.map(async (selectedFolder) =>
        auditTarget(
          workspaceRoot,
          selectedFolder,
          clusterSet,
          dataExtensionSet,
          clusterJointMap,
          fileNameRule
        )
      )
    );

    return buildAuditReport(workspaceRoot, targets);
  }
}

function createEmptyAuditCustomization(): AuditCustomization {
  return {
    customClusterList: [],
    customDataExtensionList: [],
    customJointConstList: [],
    customJointTypeList: [],
    customJointInterfaceList: [],
    customJointClassList: [],
    customJointFunctionList: [],
    customJointComponentList: [],
    customJointDataList: [],
    customFileNameAllList: [],
    customFileNameOtherList: [],
    customFileNameComponentList: [],
    customFileNameStateList: [],
    customFileNameTestList: []
  };
}
