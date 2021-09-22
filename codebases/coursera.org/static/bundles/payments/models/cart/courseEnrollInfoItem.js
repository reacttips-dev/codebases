import AuxiliaryInfoItem from 'bundles/payments/models/cart/auxiliaryInfoItem';

/**
 * This AuxiliaryInfoItem is often supplemented with a Specialization purchase and
 * helps specify which course to link the user to.
 */

/**
 * @typedef {Object} CourseEnrollInfoItem
 * @param {string} options.typeName - should always be 'enrollCourse'
 * @param {Object} options.definition - includes information related to typeName
 * @param {string} options.definition.courseId - used to fetch course link
 */
class CourseEnrollInfoItem extends AuxiliaryInfoItem {
  constructor(options) {
    super(options);
    this.typeName = !this.typeName ? 'enrollCourse' : this.typeName;
    this.providesContinueInfo = true;
  }

  /**
   * Get continue link. Alias for getContinueInfoFromVCItems
   * @param {bundles/payments/models/cart} cart object to use to find information for continue link
   * @throws {Error} - if a CourseEnrollInfoItem exists in a cart without VC's.
   * @return {string} href
   */
  getContinueInfo(cart) {
    if (!cart) {
      throw new Error('CourseEnrollInfoItem requires a cart.');
    }

    // CourseEnrollInfoItem should only exist if there was a VC in the cart.
    const vcItems = cart
      .get('items')
      .toArray()
      .filter((productItem) => productItem.isVC());

    if (vcItems.length === 0) {
      throw new Error(`Invalid CourseEnrollInfoItem no course purchases found as part of cart #${cart.id}`);
    }

    return this.getContinueInfoFromVCItems(vcItems);
  }

  /**
   * @typedef {Object} ContinueInfo
   * @param {string} ContinueInfo.link - link to continue to after payment confirmation
   * @param {string} ContinueInfo.title - title text to display for link
   * @param {string} ContinueInfo.description - description text to display for link
   * @param {courses} catalogP/models/courses
   * @return {Object} ContinueInfo
   */
  getContinueInfoFromVCItems(vcItems) {
    const vcItem = vcItems.find((item) => item.get('productItemId') === this.definition.courseId);
    return {
      link: vcItem.getLink(),
      title: vcItem.getName(),
      description: vcItem.getDescription(),
    };
  }
}

export default CourseEnrollInfoItem;
