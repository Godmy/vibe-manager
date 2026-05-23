import { countBraceDelta } from "../../count/brace-delta";

export function doesSvelteFunctionUseState(
  lineList: string[],
  startIndex: number
): boolean {
  const bodyLineList: string[] = [];
  let hasBodyStarted = false;
  let localBraceDepth = 0;

  for (let index = startIndex; index < lineList.length; index += 1) {
    const line = lineList[index];

    if (!hasBodyStarted) {
      if (!line.includes("{")) {
        continue;
      }

      hasBodyStarted = true;
    }

    bodyLineList.push(line);
    localBraceDepth += countBraceDelta(line);

    if (hasBodyStarted && localBraceDepth <= 0) {
      break;
    }
  }

  if (bodyLineList.length === 0) {
    return false;
  }

  return /\bstate(?:\s*[\.\[])/.test(bodyLineList.join("\n"));
}
