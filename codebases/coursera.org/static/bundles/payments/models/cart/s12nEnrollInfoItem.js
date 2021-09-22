import AuxiliaryInfoItem from 'bundles/payments/models/cart/auxiliaryInfoItem';

/**
 * This AuxiliaryInfoItem is often supplemented with a Catalog Subscription purchase and
 * helps specify which specialization to link the user to.
 */

/**
 * @typedef {Object} S12nEnrollInfoItem
 * @param {string} options.typeName - should always be 'enrollS12n'
 * @param {Object} options.definition - includes information related to typeName
 * @param {string} options.definition.s12nId - used to fetch s12n link
 */
class S12nEnrollInfoItem extends AuxiliaryInfoItem {
  constructor(options) {
    super(options);
    this.typeName = !this.typeName ? 'enrollS12n' : this.typeName;
  }
}

export default S12nEnrollInfoItem;
