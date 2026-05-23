export function countBraceDelta(line: string): number {
  return line.split("{").length - line.split("}").length;
}
