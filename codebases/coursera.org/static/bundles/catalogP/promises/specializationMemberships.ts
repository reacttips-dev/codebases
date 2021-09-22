import _ from 'underscore';
import specializationMembershipsData from 'bundles/catalogP/data/specializationMemberships';
import createLinkedModels from 'bundles/catalogP/lib/createLinkedModels';
import SpecializationMemberships from 'bundles/catalogP/models/specializationMemberships';
import Courses from 'bundles/catalogP/models/courses';

export default function (options: $TSFixMe) {
  // Until we have APIs, use fake data
  return specializationMembershipsData(options || {})
    .then(function (data) {
      // HACK until Brennan updates CatalogP
      // TODO(bryan): Fix this when CatalogP updates
      if (data.linked && data.linked['v1Details.v1']) {
        data.linked['courses.v1'] = _(data.linked['courses.v1']).map(function (element) {
          if (element.courseType === 'v1.session' || element.courseType === 'v1.capstone') {
            element.v1Details = element.id;
            const sessions = _(data.linked['v1Sessions.v1']).reduce(function (sessionIds, session) {
              if (session.courseId === element.id) {
                // @ts-expect-error ts-migrate(2345) FIXME: Argument of type 'any' is not assignable to parame... Remove this comment to see the full error message
                sessionIds.push(session.id.toString());
              }
              return sessionIds;
            }, []);
            element.v1Sessions = sessions;
          }
          return element;
        });
      }

      if (data.linked && data.linked['memberships.v1']) {
        const memberships = _(data.linked['memberships.v1']).groupBy('courseId');

        data.linked['courses.v1'] = _(data.linked['courses.v1']).map(function (element) {
          element.membershipIds = _(memberships[element.id]).pluck('id');
          return element;
        });
      }

      if (data.linked && data.linked['vcMemberships.v1']) {
        const vcMembershipIds = _(data.linked['vcMemberships.v1']).pluck('id');
        data.linked['memberships.v1'] = _(data.linked['memberships.v1']).map(function (element) {
          if (_(vcMembershipIds).contains(element.id)) {
            element.vcMembershipId = element.id;
          }
          return element;
        });
      }

      if (data.linked && data.linked['v1VcDetails.v1']) {
        const vcDetailsIds = _(data.linked['v1VcDetails.v1']).pluck('id');
        data.linked['v1Sessions.v1'] = _(data.linked['v1Sessions.v1']).map(function (element) {
          if (_(vcDetailsIds).contains(element.id)) {
            element.vcDetails = element.id;
          }
          return element;
        });
      }

      if (data.linked && data.linked['signatureTrackProfiles.v1']) {
        _(data.elements).each(function (element) {
          element.signatureTrackProfile = element.userId;
        });
      }

      const specializationMemberships = createLinkedModels(SpecializationMemberships.prototype.resourceName, data);

      specializationMemberships.each((membership: $TSFixMe) => {
        const specialization = membership.get('specialization');

        if (specialization && specialization.has('interchangeableMap')) {
          const interchangeableMap = specialization.get('interchangeableMap');
          const interchangeableCourseMap = {};

          Object.keys(interchangeableMap).forEach((courseId) => {
            const interchangeableCourseIds = interchangeableMap[courseId];
            const courses = [
              new Courses(
                specialization.get('interchangeableCourses').filter((course: $TSFixMe) => {
                  return _(interchangeableCourseIds).includes(course.get('id'));
                })
              ),
            ];
            // @ts-ignore ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
            interchangeableCourseMap[courseId] = courses;
          });

          specialization.set('interchangeableMap', interchangeableCourseMap);
        }
      });

      return specializationMemberships;
    })
    .fail(function () {
      return new SpecializationMemberships();
    });
}
