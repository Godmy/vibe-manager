import { CLUSTER } from "../../../const/array/cluster";

export function mergeCluster(
  customClusterList: string[]
): Set<string> {
  return new Set([
    ...CLUSTER,
    ...customClusterList.map((cluster) => cluster.trim()).filter((cluster) => cluster.length > 0)
  ]);
}
