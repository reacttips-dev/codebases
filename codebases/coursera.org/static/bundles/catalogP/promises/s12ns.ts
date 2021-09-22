import user from 'js/lib/user';
import _ from 'underscore';
import s12nData from 'bundles/catalogP/data/s12ns';
import createLinkedS12nModels from 'bundles/catalogP/utils/createLinkedS12nModels';

export default function (options: $TSFixMe, rawData?: $TSFixMe) {
  return s12nData(options).then(function (data) {
    if (data.linked && data.linked['v2Details.v1'] && data.linked['onDemandSessions.v1']) {
      data.linked['v2Details.v1'].map((element: $TSFixMe) => {
        element.onDemandSessions = data.linked['onDemandSessions.v1']
          .filter(({ courseId }: $TSFixMe) => courseId === element.id)
          .map((session: $TSFixMe) => session.id);
      });
    }

    if (data.linked && data.linked['onDemandCoursesProgress.v1'] && data.linked['courses.v1']) {
      data.linked['courses.v1'] = _(data.linked['courses.v1']).map(function (element) {
        element.courseProgress = user.get().id + '~' + element.id;
        element.v2Details = element.id;
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

    if (data.linked && data.linked['memberships.v1'] && data.linked['courses.v1']) {
      const memberships = _(data.linked['memberships.v1']).groupBy('courseId');

      data.linked['courses.v1'] = _(data.linked['courses.v1']).map(function (element) {
        element.membershipIds = _(memberships[element.id]).pluck('id');
        element.memberships = memberships[element.id];

        return element;
      });
    }

    if (data.linked && data.linked['v2Details.v1']) {
      data.linked['courses.v1'] = _(data.linked['courses.v1']).map(function (element) {
        if (element.courseType === 'v2.ondemand') {
          element.v2Details = _(data.linked['v2Details.v1']).findWhere({
            id: element.id,
          });
        }

        return element;
      });
    }

    if (
      data.linked &&
      data.linked['onDemandSpecializationProgress.v1'] &&
      data.linked['onDemandSpecializationMemberships.v1']
    ) {
      _(data.linked['onDemandSpecializationMemberships.v1']).each(function (membership) {
        membership.progress = membership.id;
      });
    }

    if (data.linked && data.linked['onDemandSpecializationMemberships.v1']) {
      data.elements = _(data.elements).map(function (element) {
        const s12nMembership = _(data.linked['onDemandSpecializationMemberships.v1']).findWhere({ s12nId: element.id });
        if (s12nMembership) {
          element.memberships = s12nMembership.id;
        }
        return element;
      });
    }

    // Flatten intechangeableCourseIds so we can properly link models.
    data.elements = _(data.elements).map(function (element) {
      element.interchangeableMap = Object.assign({}, element.interchangeableCourseIds);

      element.interchangeableCourseIds = _(element.interchangeableCourseIds).chain().values().flatten().uniq().value();

      return element;
    });

    if (rawData) {
      return data;
    }

    return createLinkedS12nModels(data);
  });
}
