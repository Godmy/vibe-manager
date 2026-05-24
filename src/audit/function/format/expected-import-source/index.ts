export function formatExpectedImportSource(relativeDirectory: string): string {
  const segmentList = relativeDirectory.split("/");
  const domain = segmentList[0] ?? "unknown";
  const familySegmentList = segmentList.slice(3);

  return `'${[domain, "function", "state", ...familySegmentList].join("/")}'`;
}
