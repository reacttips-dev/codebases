export const AssignmentRoles = {
  GRADER: 'grader',
  SUBMITTER: 'submitter',
} as const;

export type AssignmentRole = typeof AssignmentRoles[keyof typeof AssignmentRoles];
