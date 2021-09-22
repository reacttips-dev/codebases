import Membership from 'pages/open-course/common/models/membership';
import membershipDataPromise from 'pages/open-course/common/data/membershipData';

export default function (userId, courseId, rawData) {
  const promise = membershipDataPromise(userId, courseId)
    .then((membership) => {
      if (membership.elements.length > 0) {
        if (rawData) {
          return membership.elements[0];
        }

        return new Membership(membership.elements[0]);
      }
    })
    .fail(() => {
      const courseRole = Membership.BROWSER;

      if (rawData) {
        return { userId, courseId, courseRole };
      }

      return new Membership({ userId, courseId, courseRole });
    });

  promise.done();
  return promise;
}
