import Memberships from 'pages/open-course/common/models/memberships';
import membershipsDataPromise from 'pages/open-course/common/data/membershipsData';

export default function (userId, membershipType) {
  const promise = membershipsDataPromise(userId).then(function (memberships) {
    return new Memberships(memberships.elements);
  });
  promise.done();
  return promise;
}
