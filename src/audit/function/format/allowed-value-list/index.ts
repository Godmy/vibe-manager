export function formatAllowedValueList(valueSet: Set<string>): string {
  return Array.from(valueSet)
    .sort((left, right) => left.localeCompare(right))
    .map((value) => `'${value}'`)
    .join(", ");
}
