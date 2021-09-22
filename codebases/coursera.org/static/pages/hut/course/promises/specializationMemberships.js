import membershipsPromise from 'bundles/catalogP/promises/specializationMemberships';

export default function (specializationId) {
  return membershipsPromise({
    q: 'me',
    fields: ['specializationId', 'bulkVoucherId', 'eligibleForCapstone'],
  }).then(function (specializationMemberships) {
    return specializationMemberships.findWhere({
      specializationId,
    });
  });
}
