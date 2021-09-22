import URI from 'jsuri';
import Q from 'q';

import API from 'bundles/phoenix/lib/apiWrapper';

import user from 'js/lib/user';

const courseraPlusEnrollmentsApi = API('/api/courseraPlusEnrollments.v1', { type: 'rest' });

// TODO (htran) switch from Q.Promise to Promise once all of enrollmentChoiceUtils is converted over
/* eslint-disable import/prefer-default-export */
export const enrollProduct = (
  productId: string,
  courseIdToGrantMembership?: string
): Q.Promise<Record<string, string>> => {
  const uri = new URI();
  uri.addQueryParam('action', 'enrollProduct');
  uri.addQueryParam('userId', user.get().id);
  uri.addQueryParam('productId', productId);

  if (courseIdToGrantMembership) {
    uri.addQueryParam('courseIdToGrantMembership', courseIdToGrantMembership);
  }

  return Q(courseraPlusEnrollmentsApi.post(uri.toString()));
};
