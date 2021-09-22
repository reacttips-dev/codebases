import verifiableIdApi from 'bundles/verification/api/verifiableId';
import Q from 'q';

export default function (data: object) {
  return Q(verifiableIdApi.post('', data ? { data } : {}));
}
