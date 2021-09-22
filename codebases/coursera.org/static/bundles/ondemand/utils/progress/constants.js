/**
 * Guided item progress state Courier opaque key.
 * @readonly
 * @enum {string}
 */
export const GuidedItemProgressState = {
  PassableItemProgressState: 'org.coursera.ondemand.guided.itemprogress.PassableItemProgressState',
  NonPassableItemProgressState: 'org.coursera.ondemand.guided.itemprogress.NonPassableItemProgressState',
};

/**
 * Passable item started state Courier opaque key.
 * @readonly
 * @enum {string}
 */
export const PassableItemStartedStates = {
  PeerStartedState: 'org.coursera.ondemand.guided.itemprogress.PeerStartedState',
  ProgrammingStartedState: 'org.coursera.ondemand.guided.itemprogress.ProgrammingStartedState',
  StaffGradedStartedState: 'org.coursera.ondemand.guided.itemprogress.StaffGradedStartedState',
  DiscussionPromptAssignmentStartedState:
    'org.coursera.ondemand.guided.itemprogress.DiscussionPromptAssignmentStartedState',
};

/**
 * Enum for passable item progress states
 * @readonly
 * @enum {string}
 */
export const GenericPassableItemProgressStates = {
  NotStarted: 'NotStarted',
  Started: 'Started',
  VerifiedPassed: 'VerifiedPassed',
  UnverifiedPassed: 'UnverifiedPassed',
  Failed: 'Failed',
};

/**
 * Enum for non passable item progress states
 * @readonly
 * @enum {string}
 */
export const GenericNonPassableItemProgressStates = {
  NotStarted: 'NotStarted',
  Started: 'Started',
  Completed: 'Completed',
};

/**
 * Enum for peer review started state
 * @readonly
 * @enum {string}
 */
export const PeerStartedStates = {
  NotSubmitted: 'NotSubmitted',
  SubmittedNotReviewedOthers: 'SubmittedNotReviewedOthers',
  WaitingForGrading: 'WaitingForGrading',
};

/**
 * Enum for staff graded assignment started state
 * @readonly
 * @enum {string}
 */
export const StaffGradedStartedStates = {
  NotSubmitted: 'NotSubmitted',
  WaitingForGrading: 'WaitingForGrading',
};

/**
 * Enum for discussion prompt assignment started state
 * @readonly
 * @enum {string}
 */
export const DiscussionPromptAssignmentStartedStates = {
  InProgress: 'InProgress',
  GradingStarted: 'GradingStarted',
};

/**
 * Enum for programming started state
 * @readonly
 * @enum {string}
 */
export const ProgrammingStartedStates = {
  NotSubmitted: 'NotSubmitted',
  WaitingForGrading: 'WaitingForGrading',
};

export const WeekStatus = {
  FAILED: 'FAILED',
  OVERDUE: 'OVERDUE',
  ONTRACK: 'ONTRACK',
  COMPLETED: 'COMPLETED',
};

export const ItemStatus = {
  FAILED: 'FAILED',
  OVERDUE: 'OVERDUE',
  ONTRACK: 'ONTRACK',
  COMPLETED: 'COMPLETED',
};
