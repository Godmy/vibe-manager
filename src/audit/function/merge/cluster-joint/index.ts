import { AuditCustomization } from "../../../type/struct/customization";
import { CLASS_JOINT } from "../../../const/array/joint-class";
import { COMPONENT_JOINT } from "../../../const/array/joint-component";
import { CONST_JOINT } from "../../../const/array/joint-const";
import { DATA_JOINT } from "../../../const/array/joint-data";
import { FUNCTION_JOINT } from "../../../const/array/joint-function";
import { INTERFACE_JOINT } from "../../../const/array/joint-interface";
import { TYPE_JOINT } from "../../../const/array/joint-type";

export function mergeClusterJoint(
  customization: AuditCustomization
): Map<string, Set<string>> {
  const baseClusterJointMap = new Map<string, Set<string>>([
    ["const", new Set(CONST_JOINT)],
    ["type", new Set(TYPE_JOINT)],
    ["interface", new Set(INTERFACE_JOINT)],
    ["class", new Set(CLASS_JOINT)],
    ["function", new Set(FUNCTION_JOINT)],
    ["component", new Set(COMPONENT_JOINT)],
    ["data", new Set(DATA_JOINT)]
  ]);

  const customClusterJointMap: Record<string, string[]> = {
    const: customization.customJointConstList,
    type: customization.customJointTypeList,
    interface: customization.customJointInterfaceList,
    class: customization.customJointClassList,
    function: customization.customJointFunctionList,
    component: customization.customJointComponentList,
    data: customization.customJointDataList
  };

  for (const [cluster, jointList] of Object.entries(customClusterJointMap)) {
    const normalizedCluster = cluster.trim();

    if (normalizedCluster.length === 0) {
      continue;
    }

    const jointSet = baseClusterJointMap.get(normalizedCluster) ?? new Set<string>();

    for (const joint of jointList) {
      const normalizedJoint = joint.trim();

      if (normalizedJoint.length > 0) {
        jointSet.add(normalizedJoint);
      }
    }

    baseClusterJointMap.set(normalizedCluster, jointSet);
  }

  return baseClusterJointMap;
}
