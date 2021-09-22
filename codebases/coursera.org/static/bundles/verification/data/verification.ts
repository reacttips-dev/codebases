import verificationApi from 'bundles/verification/api/verification';
import Q from 'q';

export default function (verifiableId: $TSFixMe, options: $TSFixMe) {
  return Q(verificationApi.put(verifiableId, options));
}
