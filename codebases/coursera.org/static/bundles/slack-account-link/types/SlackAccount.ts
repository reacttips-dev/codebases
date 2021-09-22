export type SlackAccountStatus = 'UNLINKED' | 'EMAIL_VERIFIED';

export type SlackAccount = {
  id: string;
  degreeId: string;
  status: SlackAccountStatus;
  email?: string;
  slackUserId?: string;
  slackTeamId?: string;
};

export const NetworkOperationStates = {
  IN_PROGRESS: 'IN_PROGRESS',
  SUCCESS: 'SUCCESS',
  FAILED: 'FAILED',
} as const;

export type NetworkOperationState = keyof typeof NetworkOperationStates;
