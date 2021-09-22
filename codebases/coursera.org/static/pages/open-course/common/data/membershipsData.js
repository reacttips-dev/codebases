/**
 * Returns a promise for the enrollment data object from the enrollment API.
 */

import Q from 'q';

import URI from 'jsuri';
import api from 'pages/open-course/common/membershipApi';

export default function (userId) {
  const membershipUri = new URI().addQueryParam('q', 'findByUser').addQueryParam('userId', userId);

  return Q(api.get(membershipUri.toString()));
}
