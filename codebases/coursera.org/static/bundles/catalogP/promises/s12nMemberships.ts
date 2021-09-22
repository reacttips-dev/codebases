import _ from 'underscore';
import { memoizedS12nMembershipData } from 'bundles/catalogP/data/s12nMemberships';
import createLinkedModels from 'bundles/catalogP/lib/createLinkedModels';
import Courses from 'bundles/catalogP/models/courses';
import S12nMembership from 'bundles/catalogP/models/s12nMembership';
// @ts-ignore ts-migrate(7016) FIXME: Could not find a declaration file for module 'bund... Remove this comment to see the full error message
import userIdentity from 'bundles/phoenix/template/models/userIdentity';
import SessionMemberships from 'bundles/catalogP/models/onDemandSessionMemberships';
import memoize from 'js/lib/memoize';

const s12nMembershipPromise = function (options: $TSFixMe) {
  return memoizedS12nMembershipData(options).then(function (data) {
    if (data.linked && data.linked['courses.v1']) {
      data.linked['courses.v1'].map((element: $TSFixMe) => {
        element.v2Details = element.id;
      });
    }

    if (data.linked && data.linked['v2Details.v1'] && data.linked['onDemandSessions.v1']) {
      data.linked['v2Details.v1'].map((element: $TSFixMe) => {
        element.onDemandSessions = data.linked['onDemandSessions.v1']
          .filter(({ courseId }: $TSFixMe) => courseId === element.id)
          .map((session: $TSFixMe) => session.id);
      });
    }

    if (data.linked && data.linked['onDemandCoursesProgress.v1'] && data.linked['courses.v1']) {
      data.linked['courses.v1'] = _(data.linked['courses.v1']).map(function (element) {
        element.courseProgress = userIdentity.get('id') + '~' + element.id;
        return element;
      });
    }

    // The backend doesn't return progressIds, so we construct them on the frontend.
    if (data.linked && data.linked['onDemandSpecializationProgress.v1']) {
      _(data.elements).each(function (membership) {
        membership.progress = membership.id;
      });
    }

    if (data.linked && data.linked['memberships.v1']) {
      const memberships = _(data.linked['memberships.v1']).groupBy('courseId');

      data.linked['courses.v1'] = _(data.linked['courses.v1']).map(function (element) {
        element.membershipIds = _(memberships[element.id]).pluck('id');
        return element;
      });
    }

    if (data.linked && data.linked['memberships.v1'] && data.linked['vcMemberships.v1']) {
      data.linked['memberships.v1'] = _(data.linked['memberships.v1']).map(function (membershipData) {
        const vcMembership = _(data.linked['vcMemberships.v1']).find(function (vcMembershipData) {
          return vcMembershipData.id === membershipData.id;
        });

        if (vcMembership) {
          membershipData.vcMembershipId = membershipData.id;
        }

        return membershipData;
      });
    }

    if (data.linked && data.linked['v1Sessions.v1']) {
      const v1Sessions = _(data.linked['v1Sessions.v1']).groupBy('courseId');

      data.linked['courses.v1'] = _(data.linked['courses.v1']).map(function (element) {
        element.v1SessionIds = _(v1Sessions[element.id]).pluck('id');
        return element;
      });
    }

    if (data.linked && data.linked['signatureTrackProfiles.v1']) {
      _(data.elements).each(function (element) {
        element.signatureTrackProfile = element.userId;
      });
    }

    if (data.linked && data.linked['onDemandSpecializations.v1']) {
      _(data.linked['onDemandSpecializations.v1']).map(function (element) {
        element.interchangeableMap = Object.assign({}, element.interchangeableCourseIds);

        element.interchangeableCourseIds = _(element.interchangeableCourseIds)
          .chain()
          .values()
          .flatten()
          .uniq()
          .value();

        return element;
      });
    }

    const s12nMemberships = createLinkedModels(S12nMembership.prototype.resourceName, data);

    s12nMemberships.each(function (s12nMembership: $TSFixMe) {
      const s12n = s12nMembership.get('specialization');
      if (s12n && s12n.has('interchangeableMap')) {
        /**
         * Take
         * interchangeableCourseIds: {
         *   'PRIMARY_COURSE_ID': [
         *      [SPARK_COURSE_1_ID, SPARK_COURSE_2_ID],
         *      [ONDEMAND_COURSE_1_ID]
         *   ]
         * }
         *
         * and set it as:
         * interchangeableMap: {
         *   'PRIMARY_COURSE_ID': [
         *   		CoursesCollection([SPARK_COURSE_1, SPARK_COURSE_2]),
         *   		CoursesCollection([ONDEMAND_COURSE_1])
         *   	]
         * }
         */
        const interchangeableCourses = s12n.get('interchangeableCourses');
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'mapObject' does not exist on type 'Under... Remove this comment to see the full error message
        const interchangeableMap = _(s12n.get('interchangeableMap')).mapObject(function (courseCombinations) {
          return courseCombinations.map(function (courseIdArray: $TSFixMe) {
            return new Courses(
              _(courseIdArray).map(function (courseId) {
                return interchangeableCourses.get(courseId);
              })
            );
          });
        });

        s12n.set('interchangeableMap', interchangeableMap);
      }
    });

    // This links session membership data with each session. This was done manually because Session
    // and SessionMemberships are not CatalogP models (or Backbone Models)
    if (data.linked && data.linked['onDemandSessions.v1'] && data.linked['onDemandSessionMemberships.v1']) {
      s12nMemberships.each((s12nMembership: $TSFixMe) => {
        const s12n = s12nMembership.get('specialization');
        if (!s12n || !s12n.get('courses')) return;
        s12n.get('courses').each((course: $TSFixMe) => {
          const sessions = course.get('v2Details.sessions');
          if (!sessions) return;
          sessions.each((session: $TSFixMe) => {
            const sessionMemberships =
              data.linked['onDemandSessionMemberships.v1'].filter(
                (sessionMembership: $TSFixMe) => sessionMembership.sessionId === session.id
              ) || [];
            session.memberships = new SessionMemberships(sessionMemberships);
          });
        });
      });
    }

    if (options.withPaging) {
      return {
        elements: s12nMemberships,
        paging: data.paging,
      };
    }

    return s12nMemberships;
  });
};

export default s12nMembershipPromise;
export const memoizedS12nMembershipPromise = memoize(s12nMembershipPromise);
