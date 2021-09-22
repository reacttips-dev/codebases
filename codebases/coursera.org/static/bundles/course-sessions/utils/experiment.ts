import Q from 'q';
import { getSessionMembershipsForCourse } from 'bundles/course-sessions/utils/onDemandSessionsApi';
import user from 'js/lib/user';
/* @ts-ignore ts-migrate(7016) FIXME: Untyped import */
import coursePromiseFactories from 'pages/open-course/common/promises/course';
/* @ts-ignore ts-migrate(7016) FIXME: Untyped import */
import courseMembershipPromise from 'pages/open-course/common/promises/membership';
/* @ts-ignore ts-migrate(7016) FIXME: Untyped import */
import { getCourseModeOverride, courseModes } from 'bundles/ondemand/utils/courseModeOverrideUtils';
import { isOutsourcing } from 'bundles/outsourcing/utils';

/**
 * Determines whether the given course has sessions (note that this is different from whether the current
 * user sees sessions; use isSessionsEnabled for that case.)
 * @returns {promise} Fulfills to true if the course has sessions enabled, and false otherwise.
 */
export const isEnabledInCourse = (courseId: $TSFixMe) => {
  return coursePromiseFactories.fromId(courseId).then((course: $TSFixMe) => {
    return course.hasSessions();
  });
};

export const isSessionsEnabled = (userId: $TSFixMe, courseId: $TSFixMe, courseSlug: $TSFixMe) => {
  // Logged-out users always see sessions in courses with sessions enabled.
  if (!user.isAuthenticatedUser()) {
    return isEnabledInCourse(courseId);
  }

  return Q([
    courseMembershipPromise(userId, courseId),
    getSessionMembershipsForCourse(courseId),
    isEnabledInCourse(courseId),
  ]).spread((courseMembership, sessionMemberships, isEnabledInCourse) => {
    const isAdmin = user.isSuperuser() || courseMembership.hasTeachingRole() || isOutsourcing(user);

    const courseModeOverride = getCourseModeOverride();

    if (isAdmin && courseModeOverride) {
      if (courseModeOverride === courseModes.SESSIONS) {
        return true;
      } else if (courseModeOverride === courseModes.ON_DEMAND) {
        return false;
      }
    }

    // Learners with a course membership but no session memberships see On-Demand.
    // Learners with a session membership or no course membership see Sessions.
    const hasSessionMembership = sessionMemberships.length > 0;
    const hasCourseMembership = courseMembership.hasEnrolledRole();
    if (isEnabledInCourse) {
      if (hasSessionMembership || !hasCourseMembership) {
        return true;
      }
    }
    return false;
  });
};
