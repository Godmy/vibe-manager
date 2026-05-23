import * as fs from "node:fs";
import * as path from "node:path";
import { FolderCheckConfig } from "../../../type/struct/folder-check-config";

export class FolderCheckConfigLoader {
  public async load(workspaceRoot: string): Promise<FolderCheckConfig | null> {
    const configPath = path.join(workspaceRoot, "vibe-manager.config.json");

    if (!fs.existsSync(configPath)) {
      return null;
    }

    const content = await fs.promises.readFile(configPath, "utf8");
    const parsed = JSON.parse(content) as Partial<FolderCheckConfig>;

    if (
      !Array.isArray(parsed.folders) ||
      parsed.folders.some((folder) => typeof folder !== "string")
    ) {
      throw new Error("vibe-manager.config.json must contain a string[] field named 'folders'.");
    }

    if (typeof parsed.outputFolder !== "string" || parsed.outputFolder.trim() === "") {
      throw new Error("vibe-manager.config.json must contain a string field named 'outputFolder'.");
    }

    if (
      parsed.customClusterList !== undefined &&
      (
        !Array.isArray(parsed.customClusterList) ||
        parsed.customClusterList.some((cluster) => typeof cluster !== "string")
      )
    ) {
      throw new Error(
        "vibe-manager.config.json field 'customClusterList' must be a string[] when provided."
      );
    }

    if (
      parsed.customDataExtensionList !== undefined &&
      (
        !Array.isArray(parsed.customDataExtensionList) ||
        parsed.customDataExtensionList.some((dataExtension) => typeof dataExtension !== "string")
      )
    ) {
      throw new Error(
        "vibe-manager.config.json field 'customDataExtensionList' must be a string[] when provided."
      );
    }

    if (
      parsed.customJointConstList !== undefined &&
      (
        !Array.isArray(parsed.customJointConstList) ||
        parsed.customJointConstList.some((joint) => typeof joint !== "string")
      )
    ) {
      throw new Error(
        "vibe-manager.config.json field 'customJointConstList' must be a string[] when provided."
      );
    }

    if (
      parsed.customJointTypeList !== undefined &&
      (
        !Array.isArray(parsed.customJointTypeList) ||
        parsed.customJointTypeList.some((joint) => typeof joint !== "string")
      )
    ) {
      throw new Error(
        "vibe-manager.config.json field 'customJointTypeList' must be a string[] when provided."
      );
    }

    if (
      parsed.customJointInterfaceList !== undefined &&
      (
        !Array.isArray(parsed.customJointInterfaceList) ||
        parsed.customJointInterfaceList.some((joint) => typeof joint !== "string")
      )
    ) {
      throw new Error(
        "vibe-manager.config.json field 'customJointInterfaceList' must be a string[] when provided."
      );
    }

    if (
      parsed.customJointClassList !== undefined &&
      (
        !Array.isArray(parsed.customJointClassList) ||
        parsed.customJointClassList.some((joint) => typeof joint !== "string")
      )
    ) {
      throw new Error(
        "vibe-manager.config.json field 'customJointClassList' must be a string[] when provided."
      );
    }

    if (
      parsed.customJointFunctionList !== undefined &&
      (
        !Array.isArray(parsed.customJointFunctionList) ||
        parsed.customJointFunctionList.some((joint) => typeof joint !== "string")
      )
    ) {
      throw new Error(
        "vibe-manager.config.json field 'customJointFunctionList' must be a string[] when provided."
      );
    }

    if (
      parsed.customJointComponentList !== undefined &&
      (
        !Array.isArray(parsed.customJointComponentList) ||
        parsed.customJointComponentList.some((joint) => typeof joint !== "string")
      )
    ) {
      throw new Error(
        "vibe-manager.config.json field 'customJointComponentList' must be a string[] when provided."
      );
    }

    if (
      parsed.customJointDataList !== undefined &&
      (
        !Array.isArray(parsed.customJointDataList) ||
        parsed.customJointDataList.some((joint) => typeof joint !== "string")
      )
    ) {
      throw new Error(
        "vibe-manager.config.json field 'customJointDataList' must be a string[] when provided."
      );
    }

    if (
      parsed.customFileNameAllList !== undefined &&
      (
        !Array.isArray(parsed.customFileNameAllList) ||
        parsed.customFileNameAllList.some((fileName) => typeof fileName !== "string")
      )
    ) {
      throw new Error(
        "vibe-manager.config.json field 'customFileNameAllList' must be a string[] when provided."
      );
    }

    if (
      parsed.customFileNameOtherList !== undefined &&
      (
        !Array.isArray(parsed.customFileNameOtherList) ||
        parsed.customFileNameOtherList.some((fileName) => typeof fileName !== "string")
      )
    ) {
      throw new Error(
        "vibe-manager.config.json field 'customFileNameOtherList' must be a string[] when provided."
      );
    }

    if (
      parsed.customFileNameComponentList !== undefined &&
      (
        !Array.isArray(parsed.customFileNameComponentList) ||
        parsed.customFileNameComponentList.some((fileName) => typeof fileName !== "string")
      )
    ) {
      throw new Error(
        "vibe-manager.config.json field 'customFileNameComponentList' must be a string[] when provided."
      );
    }

    if (
      parsed.customFileNameStateList !== undefined &&
      (
        !Array.isArray(parsed.customFileNameStateList) ||
        parsed.customFileNameStateList.some((fileName) => typeof fileName !== "string")
      )
    ) {
      throw new Error(
        "vibe-manager.config.json field 'customFileNameStateList' must be a string[] when provided."
      );
    }

    if (
      parsed.customFileNameTestList !== undefined &&
      (
        !Array.isArray(parsed.customFileNameTestList) ||
        parsed.customFileNameTestList.some((fileName) => typeof fileName !== "string")
      )
    ) {
      throw new Error(
        "vibe-manager.config.json field 'customFileNameTestList' must be a string[] when provided."
      );
    }

    return {
      folders: parsed.folders,
      outputFolder: parsed.outputFolder,
      customClusterList: parsed.customClusterList ?? [],
      customDataExtensionList: parsed.customDataExtensionList ?? [],
      customJointConstList: parsed.customJointConstList ?? [],
      customJointTypeList: parsed.customJointTypeList ?? [],
      customJointInterfaceList: parsed.customJointInterfaceList ?? [],
      customJointClassList: parsed.customJointClassList ?? [],
      customJointFunctionList: parsed.customJointFunctionList ?? [],
      customJointComponentList: parsed.customJointComponentList ?? [],
      customJointDataList: parsed.customJointDataList ?? [],
      customFileNameAllList: parsed.customFileNameAllList ?? [],
      customFileNameOtherList: parsed.customFileNameOtherList ?? [],
      customFileNameComponentList: parsed.customFileNameComponentList ?? [],
      customFileNameStateList: parsed.customFileNameStateList ?? [],
      customFileNameTestList: parsed.customFileNameTestList ?? []
    };
  }
}
