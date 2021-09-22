export type ResourceType =
  | "prototype"
  | "board"
  | "presentation"
  | "rhombus"
  | "freehand"
  | "spec"
  | "harmony"
  | "space"
  | "project";

export const isOfResourceType = (
  keyInput: string
): keyInput is ResourceType => {
  return [
    "prototype",
    "board",
    "presentation",
    "rhombus",
    "freehand",
    "spec",
    "harmony",
    "space",
    "project",
  ].includes(keyInput);
};
