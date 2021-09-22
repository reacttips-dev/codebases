import verifiableIdData from 'bundles/verification/data/verifiableId';
import VerificationProgresses from 'bundles/verification/models/verificationProgresses';

export default function (data: object): Q.Promise<typeof VerificationProgresses> {
  const promise = verifiableIdData(data).then(function (response) {
    return new VerificationProgresses(response.elements[0]);
  });
  promise.done();
  return promise;
}
