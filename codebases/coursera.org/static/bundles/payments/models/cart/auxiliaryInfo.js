import AuxiliaryInfoItemFactory from 'bundles/payments/models/cart/auxiliaryInfoItemFactory';

class AuxiliaryInfo {
  constructor(objects) {
    this.items = objects.map((object) => AuxiliaryInfoItemFactory.construct(object));
  }

  getItems() {
    return this.items;
  }

  /**
   * Get a continue info that should be used after the payment confirmation. Note that
   * using reduce means that it'll get the first eligible continue link.
   *
   * @returns {string|null} a continueLink if one can be computed from the items in the cartInfo.
   *                          and null if a continueLink cannot be computed
   */
  getContinueInfo(cart) {
    return this.computeContinueInfo(this.items, cart);
  }

  /**
   * computeContinueInfo defines the strategy for computing the info for the continue link display
   * from the items.
   * @param {Array.<AuxiliaryInfoItem} items that are used to compute the link
   * @param {bundles/catalogP/models/cart} cart that provides metadata
   * @return {bundles/payments/models/cart/courseEnrollInfoItem.ContinueInfo} continueInfo
   */
  computeContinueInfo(items, cart) {
    return items.reduce(function (memo, item) {
      return memo || (item.providesContinueInfo && item.getContinueInfo(cart));
    }, null);
  }

  /**
   * Serialize to JSON to send to server
   */
  toJSON() {
    return this.items.map((item) => item.toJSON());
  }
}

export default AuxiliaryInfo;
