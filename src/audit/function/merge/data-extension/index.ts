import { DATA_EXTENSION } from "../../../const/array/data-extension";

export function mergeDataExtension(
  customDataExtensionList: string[]
): Set<string> {
  return new Set([
    ...DATA_EXTENSION,
    ...customDataExtensionList
      .map((dataExtension) => dataExtension.trim().toLowerCase())
      .filter((dataExtension) => dataExtension.length > 0)
      .map((dataExtension) => (dataExtension.startsWith(".") ? dataExtension : `.${dataExtension}`))
  ]);
}
