export type FileNameRule = {
  all: Set<string>;
  other: Set<string>;
  joint: Map<string, Set<string>>;
};
