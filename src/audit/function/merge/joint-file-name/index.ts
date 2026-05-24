import { AuditCustomization } from "../../../type/struct/customization";
import { FileNameRule } from "../../../type/struct/file-name-rule";
import { ALL_FILE_NAME } from "../../../const/array/file-name-all";
import { COMPONENT_FILE_NAME } from "../../../const/array/file-name-component";
import { OTHER_FILE_NAME } from "../../../const/array/file-name-other";
import { STATE_FILE_NAME } from "../../../const/array/file-name-state";
import { TEST_FILE_NAME } from "../../../const/array/file-name-test";
import { mergeFileNameList } from "../file-name-list";

export function mergeJointFileName(
  customization: AuditCustomization
): FileNameRule {
  const jointFileNameMap = new Map<string, Set<string>>([
    ["atom", new Set(COMPONENT_FILE_NAME)],
    ["molecule", new Set(COMPONENT_FILE_NAME)],
    ["organism", new Set(COMPONENT_FILE_NAME)],
    ["state", new Set(STATE_FILE_NAME)],
    ["test", new Set(TEST_FILE_NAME)]
  ]);
  const customJointFileNameMap: Record<string, string[]> = {
    atom: customization.customFileNameComponentList,
    molecule: customization.customFileNameComponentList,
    organism: customization.customFileNameComponentList,
    state: customization.customFileNameStateList,
    test: customization.customFileNameTestList
  };
  const all = mergeFileNameList(ALL_FILE_NAME, customization.customFileNameAllList);
  const other = mergeFileNameList(OTHER_FILE_NAME, customization.customFileNameOtherList);

  for (const [directoryName, fileNameList] of Object.entries(customJointFileNameMap)) {
    const normalizedDirectoryName = directoryName.trim();

    if (normalizedDirectoryName.length === 0) {
      continue;
    }

    const fileNameSet = jointFileNameMap.get(normalizedDirectoryName) ?? new Set<string>();

    for (const fileName of fileNameList) {
      const normalizedFileName = fileName.trim();

      if (normalizedFileName.length > 0) {
        fileNameSet.add(normalizedFileName);
      }
    }

    jointFileNameMap.set(normalizedDirectoryName, fileNameSet);
  }

  return {
    all,
    other,
    joint: jointFileNameMap
  };
}
