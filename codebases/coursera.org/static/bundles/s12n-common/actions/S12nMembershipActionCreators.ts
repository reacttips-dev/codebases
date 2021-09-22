import s12nMembershipPromiseFactory from 'bundles/s12n-common/service/promises/s12nMemberships';
// @ts-ignore ts-migrate(7016) FIXME: Could not find a declaration file for module 'page... Remove this comment to see the full error message
import specializationMembershipPromiseFactory from 'pages/hut/course/promises/specializationMemberships';
import S12nMembership from 'bundles/catalogP/models/s12nMembership';
import SpecializationMembership from 'bundles/catalogP/models/specializationMembership';
// @ts-ignore ts-migrate(7016) FIXME: Could not find a declaration file for module 'bund... Remove this comment to see the full error message
import userIdentity from 'bundles/phoenix/template/models/userIdentity';
import { tupleToStringKey } from 'js/lib/stringKeyTuple';

export const loadS12nMembership = function (
  actionContext: $TSFixMe,
  { s12nId, userId = userIdentity.get('id') }: $TSFixMe,
  done: $TSFixMe
) {
  return s12nMembershipPromiseFactory(userId, s12nId)
    .then((s12nMembership: $TSFixMe) => {
      actionContext.dispatch('RECEIVED_S12N_MEMBERSHIP', {
        s12nId,
        s12nMembership,
      });
    })
    .catch((error: $TSFixMe) => {
      actionContext.dispatch('RECEIVED_S12N_MEMBERSHIP', {
        s12nId,
        s12nMembership: new S12nMembership({
          id: tupleToStringKey([userId, s12nId]),
          userId,
          s12nId,
          role: 'NOT_ENROLLED',
        }),
      });
    })
    .done(done);
};

// Load spark specialization membership
export const loadSpecializationMembership = function (
  actionContext: $TSFixMe,
  { specializationId }: $TSFixMe,
  done: $TSFixMe
) {
  return specializationMembershipPromiseFactory(specializationId.toString())
    .then((specializationMembership: $TSFixMe) => {
      // NOTE: SpecializationMembership and S12nMembership should expose
      // the same interface, which is why it's okay to treat them the same here.
      actionContext.dispatch('RECEIVED_S12N_MEMBERSHIP', {
        s12nId: specializationId.toString(),
        s12nMembership: specializationMembership || new SpecializationMembership(),
      });
    })
    .done(done);
};
