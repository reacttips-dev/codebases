import S12nMembership from 'bundles/catalogP/models/s12nMembership';
import s12nMembershipPromise from 'bundles/catalogP/promises/s12nMemberships';
import { tupleToStringKey } from 'js/lib/stringKeyTuple';
import memoize from 'js/lib/memoize';

export default memoize(function (userId: $TSFixMe, s12nId: $TSFixMe) {
  const s12nMembershipId = tupleToStringKey([userId, s12nId]);
  return s12nMembershipPromise({
    id: s12nMembershipId,
    includes: {
      specialization: {
        fields: ['interchangeableCourseIds'],
        includes: {
          progress: {},
          partners: {},
          courses: {
            includes: {
              courseProgress: {},
              memberships: {
                fields: ['grade'],
              },
              vcMemberships: {
                fields: ['certificateCode'],
              },
            },
          },
        },
      },
    },
  })
    .invoke('at', 0)
    .fail(function () {
      return new S12nMembership({
        id: s12nMembershipId,
        userId,
        s12nId,
        role: 'NOT_ENROLLED',
      });
    });
});
