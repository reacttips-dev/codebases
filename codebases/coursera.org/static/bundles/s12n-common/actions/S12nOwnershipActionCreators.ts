import Q from 'q';
import s12nOwnershipPromiseFactory from 'bundles/s12n-common/service/promises/s12nOwnershipPromiseFactory';
// @ts-ignore ts-migrate(7016) FIXME: Could not find a declaration file for module 'page... Remove this comment to see the full error message
import specializationMembershipPromiseFactory from 'pages/hut/course/promises/specializationMemberships';
import specializationPromiseFactory from 'bundles/s12n-common/service/promises/specializationPromiseFactory';
import specializationMembershipToS12nOwnershipTransform from 'bundles/s12n-common/lib/specializationMembershipToS12nOwnershipTransform';

export const loadS12nOwnership = function (actionContext: $TSFixMe, { s12nId }: $TSFixMe, done: $TSFixMe) {
  // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
  return s12nOwnershipPromiseFactory(s12nId)
    .then((s12nOwnership: $TSFixMe) => {
      actionContext.dispatch('RECEIVED_S12N_OWNERSHIP', {
        s12nId,
        s12nOwnership,
      });
    })
    .done(done);
};

// Spark doesn't have a concept of Specialization Ownerships but we can build
// that up from Specialization Memberships
export const loadAndBuildSpecializationOwnership = function (
  actionContext: $TSFixMe,
  { specializationId }: $TSFixMe,
  done: $TSFixMe
) {
  // TODO: Don't do multiget and do get.

  return Q.all([
    specializationMembershipPromiseFactory(specializationId),
    specializationPromiseFactory(specializationId),
  ])
    .spread((specializationMembership, specialization) => {
      actionContext.dispatch('RECEIVED_S12N_OWNERSHIP', {
        s12nId: specializationId.toString(),
        s12nOwnership: specializationMembershipToS12nOwnershipTransform({
          specialization,
          specializationMembership,
        }),
      });
    })
    .done(done);
};
