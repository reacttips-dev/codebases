import verificationData from 'bundles/verification/data/verification';
import VerificationProgresses from 'bundles/verification/models/verificationProgresses';

export default function (verifiableId: $TSFixMe, options: $TSFixMe) {
  const promise = verificationData(verifiableId, options).then(function (data) {
    return new VerificationProgresses(data.elements[0]);
  });
  promise.done();
  return promise;
}
