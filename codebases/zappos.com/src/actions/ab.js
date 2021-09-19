import ab from 'react-redux-hydra';
import { getAssignment } from 'react-redux-hydra/lib/abState';
import ExecutionEnvironment from 'exenv';

import { IS_DEV } from 'constants/appConstants';
import { DevLoggerGroupDebounced } from 'middleware/logger';
import marketplace from 'cfg/marketplace.json';
import { serverTrack, track } from 'apis/amethyst';
import { evABTestEnrollment } from 'events/ab';

const TriggerAssignmentDevLogger = new DevLoggerGroupDebounced({
  groupName: '[ASSIGNMENTS]',
  debounceTime: 600
});

export const triggerAssignment = (testName, fetchAssignment = getAssignment, trackEvent = ExecutionEnvironment.canUseDOM ? track : serverTrack) => (dispatch, getState) => {
  if (typeof dispatch === 'function') {
    TriggerAssignmentDevLogger.addLog(`triggerAssignment action dispatched for test: ${testName}`);
  }
  const previousAssignment = fetchAssignment(testName, getState());
  const assignment = dispatch(ab.actions.triggerAssignmentFactory({ domain: marketplace.cookieDomain })(testName));

  const { phase, index } = assignment || {};

  if (phase && phase !== previousAssignment?.phase) {
    // this is a new assignment
    const event = () => [evABTestEnrollment, { test: testName, phase, group: index }];
    ExecutionEnvironment.canUseDOM ? trackEvent(event) : dispatch(trackEvent(event));
  }

  return assignment;
};

export const { isAssigned } = ab;

// Set rrh cookiename
ab.config.setConfig('cookieName', IS_DEV ? 'zfc-dev' : 'zfc');

export function isInAssignment(assignment) {
  return assignment && assignment.index !== 0;
}

export function getAssignmentGroup(name, state) {
  return state ? ab.assignmentGroup(name, state) : 0;
}
