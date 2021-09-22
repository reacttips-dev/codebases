import user from 'js/lib/user';
import { tupleToStringKey } from 'js/lib/stringKeyTuple';
import productOwnershipsData from 'bundles/product/data/productOwnerships';
import CourseOwnerships from 'bundles/product/models/courseOwnerships';
import S12nOwnership from 'bundles/s12n-common/service/models/s12nOwnership';

export default (s12nId: $TSFixMe, rawData: $TSFixMe) => {
  const userId = user.get().id;
  const userProductItem = tupleToStringKey([userId, 'Specialization', s12nId]);

  const promise = productOwnershipsData(userProductItem, {
    productType: 'Specialization',
  })
    .then((data: $TSFixMe) => {
      // TODO(grace): Once courseOwnerships are returned as a linked field instead of an attribute,
      // inflate s12nCourseOwnerships using createLinkedModels instead.
      let s12nData = data.elements[0];
      const s12nCourseOwnerships = s12nData.s12nCourseOwnerships;

      if (rawData) {
        s12nData = Object.assign({}, s12nData, {
          s12nCourseOwnerships: s12nCourseOwnerships || [],
        });

        return s12nData;
      }

      s12nData = Object.assign({}, s12nData, {
        s12nCourseOwnerships: new CourseOwnerships(s12nCourseOwnerships || []),
      });

      return new S12nOwnership(s12nData);
    })
    .fail(() => {
      if (rawData) {
        return {
          id: tupleToStringKey([userId, s12nId]),
          userId,
          productId: s12nId,
          s12nCourseOwnerships: {},
        };
      }

      return new S12nOwnership({
        id: tupleToStringKey([userId, s12nId]),
        userId,
        productId: s12nId,
        s12nCourseOwnerships: new CourseOwnerships(),
      });
    });

  promise.done();
  return promise;
};
