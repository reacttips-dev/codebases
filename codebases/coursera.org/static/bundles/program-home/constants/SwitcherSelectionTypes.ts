const exported = {
  NOT_SELECTED: 'NOT_SELECTED' as const,
  PROGRAM: 'PROGRAM' as const,
  COURSERA: 'COURSERA' as const,
  DEGREE: 'DEGREE' as const,
};

export default exported;
export type SwitcherSelectionType = typeof exported[keyof typeof exported];
export const { NOT_SELECTED, PROGRAM, COURSERA, DEGREE } = exported;
