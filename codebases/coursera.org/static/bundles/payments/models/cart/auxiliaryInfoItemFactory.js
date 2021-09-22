import CourseEnrollInfoItem from 'bundles/payments/models/cart/courseEnrollInfoItem';
import S12nEnrollInfoItem from 'bundles/payments/models/cart/s12nEnrollInfoItem';

const AuxiliaryInfoItemFactory = {
  construct(item) {
    switch (item.typeName) {
      case 'enrollCourse':
        return new CourseEnrollInfoItem(item);
      case 'enrollS12n':
        return new S12nEnrollInfoItem(item);
      default:
        throw new Error(`${item.typeName} is an invalid typename`);
    }
  },
};

export default AuxiliaryInfoItemFactory;

export const { construct } = AuxiliaryInfoItemFactory;
