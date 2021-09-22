import SessionStates from 'bundles/authoring/sessions/constants/SessionStates';

/* eslint-disable-next-line import/extensions */
// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
import momentReactValidator from 'js/lib/moment.validator';
import Session from 'bundles/authoring/sessions/models/Session';
import moment from 'moment';

/**
 * getNearestSelectableSession - returns the nearest session
 *
 * @param  {Array} sessions list of sessions for the course
 * @return {Object} most nearest session
 */
export const getNearestSelectableSession = (sessions: Array<Session>) => {
  if (sessions.length === 1) {
    return sessions[0];
  }

  return sessions[0];
};

/**
 * pushSessionIdToUrl - Sets a query param of the provided sessionId
 *
 * @param  {String} a sessionId
 * @param  {Object} the react-router history object
 * @return {Object} most recently created session
 */
// TODO refine router type
export const pushSessionIdToUrl = (sessionId: string, router: any) => {
  const { location, push } = router;
  const currentQuery = location.query;
  delete currentQuery.versionId;
  delete currentQuery.agVersionId;
  const updatedQuery = { ...currentQuery, sessionId };
  const newLocation = {
    ...location,
    query: updatedQuery,
  };
  push(newLocation);
};

/*
  Session sort comparison function that orders sessions status and then startedAt timestamp
  - highest priority status items are sorted to top
  - within each status, items are sorted by timestamp with latest first
*/
const SessionStatePriority = Object.freeze({
  [SessionStates.LIVE]: 3,
  [SessionStates.UPCOMING]: 2,
  [SessionStates.ARCHIVED]: 1,
});

export const sortByStateAndStartedAtFunc = (a: Session, b: Session): number => {
  if (b.status !== a.status) {
    return SessionStatePriority[b.status] - SessionStatePriority[a.status];
  } else {
    return b.startedAt - a.startedAt;
  }
};

/**
 * getSessionStatus - gets the session status state string
 *
 * @param startedAt {moment} the session start date
 * @param endedAt {moment} the session end date
 * @param enrollmentEndedAt {moment} enrollment ended at date
 * @return {String} session status
 */
export const getSessionStatus = ({
  startedAt,
  endedAt,
  enrollmentEndedAt,
}: {
  startedAt: momentReactValidator;
  endedAt: momentReactValidator;
  enrollmentEndedAt: momentReactValidator;
}) => {
  const now = moment();
  if (moment(startedAt).isAfter(now)) {
    return SessionStates.UPCOMING;
  } else if (moment(endedAt).isAfter(now)) {
    return SessionStates.LIVE;
  } else {
    return SessionStates.ARCHIVED;
  }
};
