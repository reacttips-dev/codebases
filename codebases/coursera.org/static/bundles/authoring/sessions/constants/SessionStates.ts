type $Values<O extends object> = O[keyof O];

export const SessionStates = Object.freeze({
  LIVE: 'live',
  UPCOMING: 'upcoming',
  ARCHIVED: 'archived',
} as const);

export type SessionState = $Values<typeof SessionStates>;

export default SessionStates;
