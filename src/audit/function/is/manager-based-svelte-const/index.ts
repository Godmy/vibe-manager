import { escapeRegExp } from "../../script/escape-reg-exp";

export function isManagerBasedSvelteConst(
  rightHandSide: string,
  managerImportNameList: string[]
): boolean {
  const normalizedRightHandSide = rightHandSide.trim().replace(/;$/, "");

  if (managerImportNameList.includes(normalizedRightHandSide)) {
    return true;
  }

  return managerImportNameList.some((managerName) => {
    const pattern = new RegExp(`${escapeRegExp(managerName)}(?:\\s*\\.\\s*\\w+|\\s*\\()`);
    return pattern.test(normalizedRightHandSide);
  });
}
