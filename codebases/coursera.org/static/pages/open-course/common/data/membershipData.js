/**
 * Returns a promise for the enrollment data object from the enrollment API.
 */

import Q from 'q';
import membershipsAPI from 'pages/open-course/common/membershipApi';
import { tupleToStringKey } from 'js/lib/stringKeyTuple';

export default function (userId, courseId) {
  return Q(membershipsAPI.get(tupleToStringKey([userId, courseId])));
}
