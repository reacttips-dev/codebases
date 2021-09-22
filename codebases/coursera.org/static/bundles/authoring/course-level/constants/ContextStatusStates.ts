type $Values<O extends object> = O[keyof O];

export const ContextStatusStates = Object.freeze({
  LIVE: 'live',
  NEW: 'new',
  UPCOMING: 'upcoming',
  ARCHIVED: 'archived',
  CREATING: 'creating',
  FAILED: 'failed',
  // todo: see if BE can map the below values to one of the above
  RUNNING: 'running',
  ENDED: 'ended',
  PENDING: 'pending',
  OPEN: 'open',
} as const);

export type ContextStatusState = $Values<typeof ContextStatusStates>;

export default ContextStatusStates;

// This is a mapping of [actual status]: rendered status
// for example, ContextStatusStates.PENDING is shown as "Upcoming" in the course-level overview page
export const ContextStatusStatesStringMap = {
  [ContextStatusStates.NEW]: ContextStatusStates.NEW,
  [ContextStatusStates.FAILED]: ContextStatusStates.FAILED,
  [ContextStatusStates.UPCOMING]: ContextStatusStates.UPCOMING,
  [ContextStatusStates.LIVE]: ContextStatusStates.LIVE,
  [ContextStatusStates.ARCHIVED]: ContextStatusStates.ARCHIVED,
  [ContextStatusStates.RUNNING]: ContextStatusStates.LIVE,
  [ContextStatusStates.ENDED]: ContextStatusStates.ARCHIVED,
  [ContextStatusStates.PENDING]: ContextStatusStates.UPCOMING,
  [ContextStatusStates.OPEN]: ContextStatusStates.LIVE,
  [ContextStatusStates.CREATING]: ContextStatusStates.CREATING,
} as const;
