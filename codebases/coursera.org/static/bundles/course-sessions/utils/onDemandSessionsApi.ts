import Q from 'q';
import _ from 'lodash';
import URI from 'jsuri';
/* @ts-ignore ts-migrate(7016) FIXME: Untyped import */
import constants from 'bundles/ondemand/constants/Constants';
import { Sessions } from 'bundles/course-sessions/models/Sessions';
import API from 'bundles/phoenix/lib/apiWrapper';
import user from 'js/lib/user';
/* @ts-ignore ts-migrate(7016) FIXME: Untyped import */
import coursePromise from 'pages/open-course/common/promises/course';
import { getFirstElement, getFirstLinkedElement } from 'bundles/naptime/extractElements';

const sessionsApi = API(constants.onDemandSessionsApi);
const sessionMembershipsApi = API(constants.onDemandSessionMembershipsApi, {
  type: 'rest',
});
const learnerCourseSchedulesAPI = API('/api/learnerCourseSchedules.v1/', { type: 'rest' });

const SESSION_RESOURCE = 'onDemandSessions.v1';
const MEMBERSHIP_RESOURCE = 'onDemandSessionMemberships.v1';

/**
 * Enroll the current user in the given session.
 */
export const enroll = function (sessionId: $TSFixMe) {
  const options = {
    data: {
      // @ts-expect-error ts-migrate(2345) FIXME: Argument of type 'number' is not assignable to par... Remove this comment to see the full error message
      userId: parseInt(user.get().id, 10),
      sessionId,
    },
  };

  return Q(sessionMembershipsApi.post('', options));
};

export const getSessionByUserAndCourse = function (courseId: $TSFixMe) {
  const uri = new URI()
    .addQueryParam('q', 'byUserAndCourse')
    .addQueryParam('courseId', courseId)
    .addQueryParam('userId', user.get().id)
    .toString();
  return Q(sessionMembershipsApi.get(uri)).then((response) => {
    return response.elements;
  });
};

/**
 * Enroll the current user in the given session, regrardless of enrollment period.
 */
export const forceEnroll = function (sessionId: $TSFixMe) {
  const options = {
    data: {
      // @ts-expect-error ts-migrate(2345) FIXME: Argument of type 'number' is not assignable to par... Remove this comment to see the full error message
      userId: parseInt(user.get().id, 10),
      sessionId,
    },
  };

  return Q(sessionMembershipsApi.post('', options));
};

/**
 * Unenroll the current user from the given session.
 */
export const unenroll = function (sessionId: $TSFixMe) {
  const membershipId = `${user.get().id}~${sessionId}`;

  return Q(sessionMembershipsApi.delete(membershipId));
};

export const switchSession = function (sourceSessionId: $TSFixMe, destSessionId: $TSFixMe) {
  const uri = new URI().addQueryParam('action', 'switch').toString();
  const sessionSwitchRequest = {
    data: {
      userId: user.get().id,
      sourceSessionId,
      destinationSessionId: destSessionId,
    },
  };

  return Q(sessionMembershipsApi.post(uri, sessionSwitchRequest));
};

/**
 * Gets all sessions associated with a particular course.
 * Fetches private courses also if the `fetchPrivate` flag is passed.
 */
export const getAllSessions = function (courseId: $TSFixMe, fetchPrivate: $TSFixMe) {
  const finder = fetchPrivate ? 'allByCourse' : 'byCourse';
  const uri = new URI()
    .addQueryParam('q', finder)
    .addQueryParam('courseId', courseId)
    .addQueryParam('fields', 'isPrivate')
    .toString();

  return Q(sessionsApi.get(uri)).then((response) => {
    return response.elements;
  });
};

/**
 * Gets a session by ID.
 */
export const getSession = function (sessionId: $TSFixMe) {
  const uri = new URI(sessionId).toString();

  return Q(sessionsApi.get(uri)).then((response) => {
    return response.elements[0];
  });
};

/**
 * @return {Session} The session currently available for enrollment. This may be a running session
 *                   for which the enrollment period has not yet ended. If the user is enrolled, returns the
 *                   membership as an attribute of the session.
 *                   If there is no open session, returns undefined.
 */
export const getOpenSession = function (courseId: $TSFixMe) {
  const uri = new URI()
    .addQueryParam('q', 'currentOpenByCourse')
    .addQueryParam('courseId', courseId)
    .addQueryParam('includes', 'memberships')
    .addQueryParam(
      'fields',
      'moduleDeadlines, itemDeadlines, discussionSessionId, branchId, isPrivate, sessionTypeMetadata'
    )
    .toString();

  return Q(sessionsApi.get(uri)).then((response) => {
    const session = getFirstElement(response);
    const membership = getFirstLinkedElement(response, MEMBERSHIP_RESOURCE);
    if (membership) {
      session.membership = membership;
    }
    return session;
  });
};

/**
 * @return {Session} If the user is enrolled in an active (currently running) session, returns that session
 *                   with the associated SessionMembership as a property.
 *                   Otherwise, returns undefined.
 */
export const getActiveSession = function (courseId: $TSFixMe) {
  const uri = new URI()
    .addQueryParam('q', 'activeByUserAndCourse')
    .addQueryParam('userId', user.get().id)
    .addQueryParam('courseId', courseId)
    .addQueryParam('includes', 'sessions')
    .addQueryParam(
      'fields',
      'onDemandSessions.v1(moduleDeadlines, itemDeadlines, discussionSessionId, branchId, isPrivate, sessionTypeMetadata)'
    )
    .toString();

  return Q(sessionMembershipsApi.get(uri)).then((response) => {
    const sessionMembership = getFirstElement(response);
    const session = sessionMembership && getFirstLinkedElement(response, SESSION_RESOURCE);

    return session;
  });
};

/**
 * @return {Session} If the user is enrolled in an active (currently running) session, returns that session
 *                   with the associated SessionMembership as a property.
 *                   Otherwise, returns undefined.
 */
export const getActiveSessionWithLearnerCourseSchedule = function (courseId: $TSFixMe) {
  const uri = new URI()
    .addQueryParam('q', 'activeByUserAndCourse')
    .addQueryParam('userId', user.get().id)
    .addQueryParam('courseId', courseId)
    .addQueryParam('includes', 'sessions')
    .addQueryParam(
      'fields',
      'onDemandSessions.v1(moduleDeadlines, itemDeadlines, discussionSessionId, branchId, isPrivate, sessionTypeMetadata)'
    )
    .toString();

  const id = `${user.get().id}~${courseId}`;

  const scheduleUri = new URI(id).addQueryParam('fields', 'computationMetadata').toString();

  return Q.allSettled([sessionMembershipsApi.get(uri), learnerCourseSchedulesAPI.get(scheduleUri)]).spread(
    (sessionMembershipsResult, learnerCourseSchedulesResult) => {
      const sessionMembership = sessionMembershipsResult.value;
      const learnerCourseSchedules = learnerCourseSchedulesResult.value;

      const membership = getFirstElement(sessionMembership);

      if (learnerCourseSchedules) {
        const schedule = learnerCourseSchedules.elements[0];

        const { startsAt: startedAt, endsAt: endedAt, itemDeadlines } = schedule;
        const {
          branchId,
          enrollmentEndsAt,
          isPreview,
          isPrivate,
          sessionId,
          sessionTypeMetadata,
          versionedBranchId,
        } = schedule.computationMetadata;
        // transform module deadlines to sessions format.
        const scheduleDeadlines = _.map(schedule.moduleDeadlines, (value, key) => {
          const deadline = value;
          deadline.moduleId = key;
          return deadline;
        });
        const moduleDeadlines = _.sortBy(scheduleDeadlines, 'deadline');

        const session = {
          membership,
          branchId,
          courseId,
          enrollmentEndsAt,
          isPreview,
          isPrivate,
          id: sessionId,
          sessionTypeMetadata,
          versionedBranchId,
          startedAt,
          endedAt,
          moduleDeadlines,
          itemDeadlines,
        };

        return session;
      }

      if (learnerCourseSchedulesResult.state !== 'fulfilled') {
        const session = getFirstLinkedElement(sessionMembership, SESSION_RESOURCE);

        if (session && Object.keys(session).length > 0) {
          session.membership = getFirstElement(sessionMembership);
          return session;
        }

        return {};
      }
    }
  );
};

/**
 * Fetches the session the user sees for the current course and its associated session membership if the
 * user is enrolled, then updates the SessionStore with those values.
 * The session may or may not have already started.
 * If the user is enrolled in the course, the session will have a SessionMembership as a property.
 */
export const getCurrentSession = function (courseSlug: $TSFixMe) {
  return coursePromise
    .fromSlug(courseSlug)
    .then((course: $TSFixMe) => {
      if (user.isAuthenticatedUser()) {
        return [course.get('id'), getActiveSessionWithLearnerCourseSchedule(course.get('id'))];
      } else {
        return [course.get('id')];
      }
    })
    .spread((courseId: $TSFixMe, activeSession: $TSFixMe) => {
      return activeSession || getOpenSession(courseId);
    });
};

/**
 * @return {Session} The next available session after the currently enrollable session's
 *                   enrollment period ends. Returns undefined if none is available.
 */
export const getFollowingSession = function (courseId: $TSFixMe, currentSessionId: $TSFixMe) {
  // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
  return getAllSessions(courseId).then((data) => {
    return new Sessions(data);
  });
};

export const getSessionMembershipsForCourse = function (courseId: $TSFixMe) {
  const uri = new URI()
    .addQueryParam('q', 'byUserAndCourse')
    .addQueryParam('userId', user.get().id)
    .addQueryParam('courseId', courseId)
    .toString();

  return Q(sessionMembershipsApi.get(uri)).then((response) => response.elements);
};
