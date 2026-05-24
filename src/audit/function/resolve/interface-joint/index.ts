export function resolveInterfaceJoint(name: string): string {
  if (/Behavior$/.test(name)) {
    return "behavior";
  }

  if (/Slot$/.test(name)) {
    return "slot";
  }

  if (/Contract$/.test(name)) {
    return "contract";
  }

  return "recipe";
}
